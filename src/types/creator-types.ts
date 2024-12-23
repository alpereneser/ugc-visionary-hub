import { z } from "zod";

export const creatorFormSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().nullable(),
  phone: z.string().optional().nullable(),
  instagram_username: z.string().optional(),
  tiktok_username: z.string().optional(),
  youtube_username: z.string().optional(),
});

export type CreatorFormValues = z.infer<typeof creatorFormSchema>;