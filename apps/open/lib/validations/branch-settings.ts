import { z } from "zod";

export const branchSettingsSchema = z.object({
  name: z.string().min(1, "Branch name is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  currency: z.string().min(1, "Currency is required"),
  timezone: z.string().min(1, "Timezone is required"),
});

export type BranchSettingsFormData = z.infer<typeof branchSettingsSchema>;