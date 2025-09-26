"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema, type OnboardingFormData } from "@/lib/validations/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CountryCombobox } from "@smm/ui-core";
import { PhoneInput } from "@/components/ui/phone-input";
import { Building2, User } from "lucide-react";
import type { Country } from "react-phone-number-input";
import { completeOnboarding } from "@/app/actions/onboarding";
import { setActiveBranchCookie } from "@/utils/cookies";

interface OnboardingFormProps {
  initialFullName?: string;
}

export function OnboardingForm({ initialFullName = "" }: OnboardingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    mode: "onChange",
    defaultValues: {
      fullName: initialFullName
    }
  });

  const onSubmit = async (data: OnboardingFormData) => {
    console.log('📝 Onboarding Form - Submitting data:', data);
    setIsSubmitting(true);
    setError(null);

    try {
      console.log('📝 Onboarding Form - Calling completeOnboarding...');
      const result = await completeOnboarding(data);
      console.log('📝 Onboarding Form - Result:', result);
      
      if (result.success) {
        console.log('✅ Onboarding Form - Success, setting active branch and redirecting...');
        
        // Set the newly created branch as the active branch
        if (result.branchId) {
          setActiveBranchCookie(result.branchId);
          localStorage.setItem('activeBranchId', result.branchId);
        }
        
        // Redirect to dashboard with onboarding completion flag
        window.location.href = '/dashboard?onboarding=complete';
      } else {
        console.error('❌ Onboarding Form - Failed:', result.error);
        setError(result.error || "Failed to complete setup");
      }
    } catch (error) {
      console.error('❌ Onboarding Form - Unexpected error:', error);
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="px-4 py-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Organization Setup */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Organization Setup</h3>
            </div>
            
            <div className="grid gap-3">
              <div className="space-y-2">
                <Label htmlFor="organizationName">Organization Name</Label>
                <Input
                  id="organizationName"
                  {...register("organizationName")}
                  placeholder="e.g., Standard Microgrid"
                  className={errors.organizationName ? "border-red-500" : ""}
                />
                {errors.organizationName && (
                  <p className="text-sm text-red-500">{errors.organizationName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="headquartersCity">City</Label>
                  <Input
                    id="headquartersCity"
                    {...register("headquartersCity")}
                    placeholder="e.g., Lusaka"
                    className={errors.headquartersCity ? "border-red-500" : ""}
                  />
                  {errors.headquartersCity && (
                    <p className="text-sm text-red-500">{errors.headquartersCity.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headquartersCountry">Country</Label>
                  <CountryCombobox
                    value={watch("headquartersCountry") || ""}
                    onChange={(value) => {
                      setValue("headquartersCountry", value, { shouldValidate: true });
                    }}
                    placeholder="Select a country"
                    error={errors.headquartersCountry?.message}
                    className={errors.headquartersCountry ? "border-red-500" : ""}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizationWhatsApp">WhatsApp Phone Number</Label>
                <PhoneInput
                  value={watch("organizationWhatsApp") || ""}
                  onChange={(value) => {
                    setValue("organizationWhatsApp", value, { shouldValidate: true });
                  }}
                  defaultCountry={watch("headquartersCountry") as Country}
                  international
                  placeholder="Enter phone number"
                  className={errors.organizationWhatsApp ? "border-red-500" : ""}
                />
                {errors.organizationWhatsApp && (
                  <p className="text-sm text-red-500">{errors.organizationWhatsApp.message}</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* User Profile */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Your Profile</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                {...register("fullName")}
                placeholder="e.g., John Smith"
                className={errors.fullName ? "border-red-500" : ""}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName.message}</p>
              )}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex justify-center pt-2">
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? "Setting up..." : "Complete Setup"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
