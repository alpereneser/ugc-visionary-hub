import { z } from "zod";

export const CampaignStatus = z.enum(["draft", "active", "completed", "upcoming"]);
export type CampaignStatus = z.infer<typeof CampaignStatus>;

export const campaignFormSchema = z.object({
  name: z.string().min(2, "Campaign name must be at least 2 characters"),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: CampaignStatus,
});

export type CampaignFormValues = z.infer<typeof campaignFormSchema>;