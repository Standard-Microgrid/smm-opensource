"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { userSettingsSchema, type UserSettingsFormData } from "@/lib/validations/user-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Phone, Save } from "lucide-react";
import { updateUserSettings } from "@/app/actions/user-settings";
import { EmailChangeNotification } from "./email-change-notification";

interface UserSettingsFormProps {
  initialData?: {
    email: string;
    fullName: string;
    phoneNumber: string;
  };
}

export function UserSettingsForm({ initialData }: UserSettingsFormProps) {
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [currentEmail] = useState(initialData?.email || "");

  const handleDismissEmailNotification = () => {
    setPendingEmail(null);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    setValue
  } = useForm<UserSettingsFormData>({
    resolver: zodResolver(userSettingsSchema),
    mode: "onBlur",
    defaultValues: {
      email: initialData?.email || "",
      fullName: initialData?.fullName || "",
      phoneNumber: initialData?.phoneNumber || "",
    }
  });

  // Set client-side flag to prevent hydration mismatches
  useEffect(() => {
    setIsClient(true);
  }, []);

  const onSubmit = async (data: UserSettingsFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await updateUserSettings(data);
      
      if (result.success) {
        const { data: responseData } = result;
        
        // Check if this was an email change using the server response
        if (responseData.emailChanged) {
          setPendingEmail(data.email); // The new email from the form
          // currentEmail stays the same (original email)
          toast.success("Profile updated! Please check both your current and new email inboxes to confirm the email change.");
        } else {
          toast.success("User settings updated successfully!");
        }
        
        // Reset form state to reflect the saved changes
        // Use the email from the server response (which will be the current email if change is pending)
        setValue("email", responseData.email, { shouldDirty: false });
        setValue("fullName", responseData.full_name, { shouldDirty: false });
        setValue("phoneNumber", responseData.phone_number || "", { shouldDirty: false });
      } else {
        setError(result.error || "Failed to update user settings");
        toast.error(result.error || "Failed to update user settings");
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
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="space-y-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Email Change Notification */}
      {pendingEmail && (
        <EmailChangeNotification 
          currentEmail={currentEmail}
          pendingEmail={pendingEmail}
          onDismiss={handleDismissEmailNotification}
        />
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-medium">Personal Information</h3>
          </div>
          
          <div className="grid gap-4 max-w-md">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                {...register("fullName")}
                className={errors.fullName ? "border-red-500" : ""}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName.message}</p>
              )}
            </div>

            {/* Phone Number Field */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <PhoneInput
                id="phoneNumber"
                placeholder="Enter your phone number"
                value={watch("phoneNumber")}
                onChange={(value) => setValue("phoneNumber", value, { shouldValidate: true, shouldDirty: true })}
                className={errors.phoneNumber ? "border-red-500" : ""}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!isValid || !isDirty || isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? "Updating..." : (
              <>
                <Save className="h-4 w-4" />
                Update Profile
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
