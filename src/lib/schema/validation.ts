import { z } from "zod";

export const jobSchema = z.object({
  id: z.number().optional(),
  slug: z.string().min(1),
  title: z.string().min(1),
  type: z.string().min(1),
  location_type: z.string().min(1),
  location: z.string().optional(),
  description: z.string().optional(),
  salary: z.number().nonnegative(),
  company_name: z.string().min(1),
  application_email: z.string().email().optional(),
  application_url: z.string().url().optional(),
  company_logo_url: z.string().url().optional(),
  approved: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const approveJobSchema = z.object({
  approved: z.literal(true),
});
