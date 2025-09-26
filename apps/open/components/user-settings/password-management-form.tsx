"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { passwordChangeSchema, passwordResetSchema, type PasswordChangeFormData, type PasswordResetFormData } from "@/lib/validations/password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@smm/ui-core";
import { Lock, Key, Mail, Eye, EyeOff, Save } from "lucide-react";
import { changePassword, sendPasswordResetEmail } from "@/app/actions/password";

interface PasswordManagementFormProps {
  userEmail: string;
}

export function PasswordManagementForm({ userEmail }: PasswordManagementFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("change");

  const changePasswordForm = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    mode: "onBlur",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }
  });

  const resetPasswordForm = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
    mode: "onBlur",
    defaultValues: {
      email: userEmail,
    }
  });

  const onPasswordChangeSubmit = async (data: PasswordChangeFormData) => {
    setIsSubmitting(true);

    try {
      const result = await changePassword(data);
      
      if (result.success) {
        toast.success(result.message || "Password updated successfully!");
        changePasswordForm.reset();
      } else {
        toast.error(result.error || "Failed to update password");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onPasswordResetSubmit = async (data: PasswordResetFormData) => {
    setIsSubmitting(true);

    try {
      const result = await sendPasswordResetEmail(data);
      
      if (result.success) {
        toast.success(result.message || "Password reset email sent!");
        resetPasswordForm.reset();
      } else {
        toast.error(result.error || "Failed to send reset email");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Lock className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-medium">Password Management</h3>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-md">
        <TabsList className="grid w-full grid-cols-2 bg-muted/50">
          <TabsTrigger 
            value="change" 
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border"
          >
            <Key className="h-4 w-4" />
            Change Password
          </TabsTrigger>
          <TabsTrigger 
            value="reset" 
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border"
          >
            <Mail className="h-4 w-4" />
            Reset Password
          </TabsTrigger>
        </TabsList>

        <TabsContent value="change" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Key className="h-4 w-4 text-primary" />
                Change Your Password
              </CardTitle>
              <CardDescription>
                Enter your current password and choose a new secure password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={changePasswordForm.handleSubmit(onPasswordChangeSubmit)} className="space-y-4 max-w-md">
                {/* Current Password */}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter your current password"
                      {...changePasswordForm.register("currentPassword")}
                      className={changePasswordForm.formState.errors.currentPassword ? "border-red-500" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {changePasswordForm.formState.errors.currentPassword && (
                    <p className="text-sm text-red-500">
                      {changePasswordForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      {...changePasswordForm.register("newPassword")}
                      className={changePasswordForm.formState.errors.newPassword ? "border-red-500" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {changePasswordForm.formState.errors.newPassword && (
                    <p className="text-sm text-red-500">
                      {changePasswordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      {...changePasswordForm.register("confirmPassword")}
                      className={changePasswordForm.formState.errors.confirmPassword ? "border-red-500" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {changePasswordForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {changePasswordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Password Requirements */}
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Password must contain:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>At least 8 characters</li>
                    <li>One uppercase letter</li>
                    <li>One lowercase letter</li>
                    <li>One number</li>
                    <li>One special character</li>
                  </ul>
                </div>

                <div className="flex justify-center">
                  <Button
                    type="submit"
                    disabled={!changePasswordForm.formState.isValid || isSubmitting}
                    className="gap-2"
                  >
                    {isSubmitting ? "Updating..." : (
                      <>
                        <Save className="h-4 w-4" />
                        Update Password
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reset" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                Reset Your Password
              </CardTitle>
              <CardDescription>
                We&apos;ll send you a secure link to reset your password via email.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={resetPasswordForm.handleSubmit(onPasswordResetSubmit)} className="space-y-4 max-w-md">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="resetEmail">Email Address</Label>
                  <Input
                    id="resetEmail"
                    type="email"
                    placeholder="Enter your email address"
                    {...resetPasswordForm.register("email")}
                    className={resetPasswordForm.formState.errors.email ? "border-red-500" : ""}
                  />
                  {resetPasswordForm.formState.errors.email && (
                    <p className="text-sm text-red-500">
                      {resetPasswordForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-center">
                  <Button
                    type="submit"
                    disabled={!resetPasswordForm.formState.isValid || isSubmitting}
                  >
                    {isSubmitting ? "Sending Reset Email..." : "Send Reset Email"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
