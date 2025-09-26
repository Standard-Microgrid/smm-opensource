import { z } from "zod";

export const userSettingsSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  fullName: z.string().min(1, "Full name is required"),
  phoneNumber: z.string().optional(),
});

export type UserSettingsFormData = z.infer<typeof userSettingsSchema>;
