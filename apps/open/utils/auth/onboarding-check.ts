import { createSupabaseClient } from "@/lib/supabase-server";

export interface OnboardingStatus {
  isComplete: boolean;
  missingFields: string[];
  userProfile?: {
    id: string;
    full_name: string | null;
    phone_number: string | null;
    organization_id: string | null;
    role_id: string | null;
    roles?: {
      name: string;
    };
  };
  organization?: {
    id: string;
    name: string;
  };
  branch?: {
    id: string;
    name: string;
    city: string | null;
    country: string | null;
  };
}

export async function checkOnboardingStatus(userId: string): Promise<OnboardingStatus> {
  console.log('🔍 Onboarding Check - Starting for user:', userId);
  
  const supabase = await createSupabaseClient();
  
  // Get user profile
  const { data: userProfile, error: profileError } = await supabase
    .schema('core')
    .from('user_profiles')
    .select(`
      id,
      full_name,
      phone_number,
      organization_id,
      branch_id,
      role_id,
      roles!fk_user_profiles_roles(name)
    `)
    .eq('id', userId)
    .is('deleted_at', null)
    .single();

  // Debug logging
  console.log('🔍 Onboarding Check - Profile query:', {
    userId,
    profileError: profileError ? {
      message: profileError.message,
      details: profileError.details,
      hint: profileError.hint,
      code: profileError.code
    } : null,
    userProfile,
    hasOrganizationId: !!userProfile?.organization_id,
    organizationId: userProfile?.organization_id
  });

  if (profileError || !userProfile) {
    console.log('Profile error or missing:', { 
      profileError: profileError ? {
        message: profileError.message,
        details: profileError.details,
        hint: profileError.hint,
        code: profileError.code
      } : null, 
      userProfile 
    });
    return {
      isComplete: false,
      missingFields: ['user_profile']
    };
  }

  const missingFields: string[] = [];

  // Check required user profile fields
  if (!userProfile.full_name) missingFields.push('full_name');
  // Note: phone_number is now stored on the branch, not the user profile
  if (!userProfile.role_id) missingFields.push('role');

  // Check if user has organization
  if (!userProfile.organization_id) {
    console.log('Missing organization_id:', { userProfile });
    missingFields.push('organization');
    return {
      isComplete: false,
      missingFields,
      userProfile: {
        ...userProfile,
        roles: Array.isArray(userProfile.roles) ? userProfile.roles[0] : userProfile.roles
      }
    };
  }

  // Get organization details
  const { data: organization, error: orgError } = await supabase
    .schema('core')
    .from('organizations')
    .select(`
      id,
      name
    `)
    .eq('id', userProfile.organization_id)
    .single();

  if (orgError || !organization) {
    missingFields.push('organization');
    return {
      isComplete: false,
      missingFields,
      userProfile: {
        ...userProfile,
        roles: Array.isArray(userProfile.roles) ? userProfile.roles[0] : userProfile.roles
      }
    };
  }

  // Check required organization fields
  if (!organization.name) missingFields.push('organization_name');

  // Check if user has branch (required for all users)
  // For now, we'll assume everyone needs a branch
  console.log('Checking branch for user:', {
    userId,
    organizationId: userProfile.organization_id, 
    branchId: userProfile.branch_id,
    role: Array.isArray(userProfile.roles) ? (userProfile.roles as { name: string }[])[0]?.name : (userProfile.roles as { name: string })?.name,
    userProfileKeys: Object.keys(userProfile)
  });

  // Check if user has a branch_id, if not, they need to complete onboarding
  if (!userProfile.branch_id) {
    console.log('User missing branch_id:', { userProfile });
    missingFields.push('branch');
    return {
      isComplete: false,
      missingFields,
      userProfile: {
        ...userProfile,
        roles: Array.isArray(userProfile.roles) ? userProfile.roles[0] : userProfile.roles
      },
      organization
    };
  }

  const { data: branch, error: branchError } = await supabase
    .schema('core')
    .from('branches')
    .select(`
      id,
      name,
      city,
      country
    `)
    .eq('organization_id', userProfile.organization_id)
    .eq('id', userProfile.branch_id)
    .single();

  console.log('Branch query result:', { branchError, branch });

  if (branchError || !branch) {
    console.log('Branch error or missing:', { branchError, branch });
    missingFields.push('branch');
    return {
      isComplete: false,
      missingFields,
      userProfile: {
        ...userProfile,
        roles: Array.isArray(userProfile.roles) ? userProfile.roles[0] : userProfile.roles
      },
      organization
    };
  }

  // Check required branch fields
  if (!branch.name) missingFields.push('branch_name');
  if (!branch.city) missingFields.push('branch_city');
  if (!branch.country) missingFields.push('branch_country');

  console.log('🔍 Onboarding Check - Final result:', { 
    isComplete: missingFields.length === 0, 
    missingFields,
    userProfile: {
      id: userProfile?.id,
      organization_id: userProfile?.organization_id,
      branch_id: userProfile?.branch_id,
      role_id: userProfile?.role_id
    },
    organization: organization ? { id: organization.id, name: organization.name } : null,
    branch: branch ? { id: branch.id, name: branch.name } : null
  });

  return {
    isComplete: missingFields.length === 0,
    missingFields,
    userProfile: {
      ...userProfile,
      roles: Array.isArray(userProfile.roles) ? userProfile.roles[0] : userProfile.roles
    },
    organization,
    branch
  };
}

