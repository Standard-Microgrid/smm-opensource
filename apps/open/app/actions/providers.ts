"use server"

import { createSupabaseClient } from "@smm/shared/supabase/server"

export interface PsProvider {
  id: string
  provider_name: string
}

export interface MeterProvider {
  id: string
  name: string
}

export interface MomoProvider {
  id: string
  name: string
}

export async function getProviders() {
  try {
    console.log('🔍 getProviders - Starting server action...')
    const supabase = await createSupabaseClient()
    console.log('🔍 getProviders - Supabase client created')
    
    // Debug: Check if we have a user session
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    console.log('🔍 getProviders - Auth Debug:', {
      hasUser: !!user,
      userEmail: user?.email,
      userError: userError?.message,
      userId: user?.id
    })
    
    if (userError || !user) {
      console.error('❌ getProviders - No authenticated user found')
      return {
        success: false,
        error: `Authentication required: ${userError?.message || 'No user found'}`,
        psProviders: [],
        meterProviders: [],
        momoProviders: []
      }
    }
    
    console.log('🔍 getProviders - User authenticated, proceeding with queries...')
    
    // Fetch PS providers from platforms schema
    const { data: psData, error: psError } = await supabase
      .schema('platforms')
      .from('ps_providers')
      .select('id, provider_name')
    
    if (psError) {
      return {
        success: false,
        error: `Failed to fetch ps_providers: ${psError.message}`,
        psProviders: [],
        meterProviders: [],
        momoProviders: []
      }
    }

    // Fetch meter providers from platforms schema
    const { data: meterData, error: meterError } = await supabase
      .schema('platforms')
      .from('meter_providers')
      .select('id, name')
    
    if (meterError) {
      return {
        success: false,
        error: `Failed to fetch meter_providers: ${meterError.message}`,
        psProviders: psData || [],
        meterProviders: [],
        momoProviders: []
      }
    }

    // Fetch mobile money providers from platforms schema
    const { data: momoData, error: momoError } = await supabase
      .schema('platforms')
      .from('momo_providers')
      .select('id, name')
    
    if (momoError) {
      return {
        success: false,
        error: `Failed to fetch momo_providers: ${momoError.message}`,
        psProviders: psData || [],
        meterProviders: meterData || [],
        momoProviders: []
      }
    }
    
    return {
      success: true,
      psProviders: psData || [],
      meterProviders: meterData || [],
      momoProviders: momoData || []
    }
  } catch (error) {
    return {
      success: false,
      error: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
      psProviders: [],
      meterProviders: [],
      momoProviders: []
    }
  }
}