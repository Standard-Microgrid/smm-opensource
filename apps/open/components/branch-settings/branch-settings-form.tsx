"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { branchSettingsSchema, type BranchSettingsFormData } from "@/lib/validations/branch-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CountryCombobox, CurrencyCombobox, TimezoneCombobox, DangerZone } from "@smm/ui-core";
import { PhoneInput } from "@/components/ui/phone-input";
import { Building2, Phone, Globe, Save } from "lucide-react";
import { updateBranchSettings, addBranch } from "@/app/actions/branch-settings";
import { BranchSettingsLoading } from "./branch-settings-loading";
import { DeleteBranchDialog } from "./delete-branch-dialog";
import { getCountryMapping } from "@smm/shared/src/country-mappings";

interface BranchSettingsFormProps {
  initialData?: Partial<BranchSettingsFormData> & { id?: string };
  mode?: 'add' | 'edit';
}

export function BranchSettingsForm({ initialData, mode = 'edit' }: BranchSettingsFormProps) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue
  } = useForm<BranchSettingsFormData>({
    resolver: zodResolver(branchSettingsSchema),
    mode: "onBlur",
    defaultValues: {
      name: initialData?.name || "",
      city: initialData?.city || "",
      country: initialData?.country || "",
      phoneNumber: initialData?.phoneNumber || "",
      currency: initialData?.currency || "",
      timezone: initialData?.timezone || "",
    }
  });

  // Track if form has been modified from initial values
  const [isDirty, setIsDirty] = useState(false);

  // Set client-side flag to prevent hydration mismatches
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Watch all form values to detect changes
  const watchedValues = watch();
  
  // Check if form is dirty (values have changed from initial)
  useEffect(() => {
    if (!isClient) return;
    
    const initialValues = {
      name: initialData?.name || "",
      city: initialData?.city || "",
      country: initialData?.country || "",
      phoneNumber: initialData?.phoneNumber || "",
      currency: initialData?.currency || "",
      timezone: initialData?.timezone || "",
    };
    
    const hasChanges = Object.keys(watchedValues).some(
      key => watchedValues[key as keyof BranchSettingsFormData] !== initialValues[key as keyof typeof initialValues]
    );
    
    setIsDirty(hasChanges);
  }, [watchedValues, initialData, isClient]);

  // Auto-populate fields based on country selection
  const selectedCountry = watch("country");
  const selectedCurrency = watch("currency");
  const selectedTimezone = watch("timezone");
  const currentPhone = watch("phoneNumber");
  
  useEffect(() => {
    if (selectedCountry && mode === 'add') {
      // Only auto-populate in add mode to avoid overwriting existing data
      const mapping = getCountryMapping(selectedCountry);
      
      // Auto-populate currency
      if (mapping.currency && !selectedCurrency) {
        setValue("currency", mapping.currency, { shouldValidate: true });
      }
      
      // Auto-populate timezone
      if (mapping.timezone && !selectedTimezone) {
        setValue("timezone", mapping.timezone, { shouldValidate: true });
      }
      
      // Auto-populate phone prefix (only if phone number is empty or just has a different prefix)
      if (mapping.phonePrefix && (!currentPhone || !currentPhone.startsWith(mapping.phonePrefix))) {
        setValue("phoneNumber", mapping.phonePrefix, { shouldValidate: true });
      }
    }
  }, [selectedCountry, selectedCurrency, selectedTimezone, currentPhone, mode, setValue]);

  const onSubmit = async (data: BranchSettingsFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      let result;
      if (mode === 'add') {
        result = await addBranch(data);
      } else {
        const branchId = initialData?.id;
        result = await updateBranchSettings(data, branchId);
      }
      
      if (result.success) {
        // Redirect to dashboard immediately
        const queryParam = mode === 'add' ? 'created=true' : 'updated=true';
        router.push(`/dashboard?${queryParam}`);
      } else {
        setError(result.error || "Failed to update branch settings");
        toast.error(result.error || "Failed to update branch settings");
      }
    } catch {
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return <BranchSettingsLoading />;
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Error Messages */}
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          {/* Basic Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">Basic Information</h3>
            </div>
            
            <div className="space-y-2 max-w-md">
              <Label htmlFor="name">Branch Name</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="e.g., Lusaka Main Branch"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  {...register("city")}
                  placeholder="e.g., Lusaka"
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && (
                  <p className="text-sm text-red-500">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <CountryCombobox
                  value={watch("country") || ""}
                  onChange={(value) => {
                    setValue("country", value, { shouldValidate: true });
                  }}
                  placeholder="Select a country"
                  error={errors.country?.message}
                  className={errors.country ? "border-red-500" : ""}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">Contact Information</h3>
            </div>
            
            <div className="space-y-2 max-w-md">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <PhoneInput
                value={watch("phoneNumber") || ""}
                onChange={(value) => {
                  setValue("phoneNumber", value, { shouldValidate: true });
                }}
                placeholder="Enter phone number"
                className={errors.phoneNumber ? "border-red-500" : ""}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500 mt-1">{errors.phoneNumber.message}</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Location Settings Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">Location Settings</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-2xl">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="currency">Currency</Label>
                <CurrencyCombobox
                  value={watch("currency") || ""}
                  onChange={(value) => {
                    setValue("currency", value, { shouldValidate: true });
                  }}
                  placeholder="Select a currency"
                  error={errors.currency?.message}
                  className={errors.currency ? "border-red-500" : ""}
                />
              </div>

              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="timezone">Timezone</Label>
                <TimezoneCombobox
                  value={watch("timezone") || ""}
                  onChange={(value) => {
                    setValue("timezone", value, { shouldValidate: true });
                  }}
                  placeholder="Select a timezone"
                  error={errors.timezone?.message}
                  className={errors.timezone ? "border-red-500" : ""}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!isValid || isSubmitting || (mode === 'edit' && !isDirty)}
              className="gap-2"
            >
              {isSubmitting 
                ? (mode === 'add' ? "Creating..." : "Updating...") 
                : (mode === 'add' ? "Create Branch" : (
                  <>
                    <Save className="h-4 w-4" />
                    Update Branch
                  </>
                ))
              }
            </Button>
          </div>

        </form>

        {/* Delete Branch Section - Only show in edit mode - MOVED OUTSIDE FORM */}
        {mode === 'edit' && initialData?.id && initialData?.name && (
          <>
            <Separator />
            <DangerZone
              title="Danger Zone"
              description="Once you delete a branch, there is no going back. Please be certain."
              actionTitle="Delete Branch"
              actionDescription={`Permanently delete the branch "${initialData.name}". This action cannot be undone.`}
            >
              <DeleteBranchDialog 
                branchId={initialData.id} 
                branchName={initialData.name} 
              />
            </DangerZone>
          </>
        )}
    </div>
  );
}
