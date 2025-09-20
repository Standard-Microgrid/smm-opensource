import { z } from "zod";
import { countries } from "@smm/shared/src/countries";

export const onboardingSchema = z.object({
  organizationName: z.string()
    .min(1, "Organization name is required")
    .min(2, "Organization name must be at least 2 characters")
    .max(100, "Organization name must be less than 100 characters")
    .regex(/^[a-zA-Z0-9\s\-&.,'()]+$/, "Organization name contains invalid characters"),
  
  headquartersCity: z.string()
    .min(1, "City is required")
    .min(2, "City must be at least 2 characters")
    .max(100, "City must be less than 100 characters")
    .regex(/^[a-zA-Z\s\-'\.]+$/, "City can only contain letters, spaces, hyphens, apostrophes, and periods"),
  
  headquartersCountry: z.string()
    .min(1, "Country is required")
    .refine((val) => countries.some(country => country.code === val), "Please select a valid country"),
  
  organizationWhatsApp: z.string()
    .min(1, "WhatsApp phone number is required")
    .regex(/^\+[1-9]\d{1,14}$/, "Invalid phone number format. Please include country code (e.g., +260)")
    .refine((val) => val.length >= 10, "Phone number must be at least 10 digits")
    .refine((val) => val.length <= 15, "Phone number must be less than 15 digits"),
  
  fullName: z.string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters")
    .regex(/^[a-zA-Z\s\-'\.]+$/, "Full name can only contain letters, spaces, hyphens, apostrophes, and periods"),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
