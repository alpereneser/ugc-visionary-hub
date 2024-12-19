import { z } from "zod";
import { Json } from "@/integrations/supabase/types";

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

export interface AdditionalExpense {
  name: string;
  amount: string;
  currency: string;
}

export interface Creator {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string | null;
  url: string | null;
  retail_price: number | null;
  cost_price: number | null;
}

export interface CampaignCreatorResponse {
  creator_id: string;
  ugc_creators: Creator;
}

export interface CampaignProductResponse {
  product_id: string;
  products: Product;
}

export interface RawCampaignResponse {
  id: string;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
  media: Json | null;
  additional_expenses: Json;
  additional_expenses_currency: string | null;
  campaign_creators: CampaignCreatorResponse[];
  campaign_products: CampaignProductResponse[];
}

export interface Campaign {
  id: string;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
  media: Json | null;
  additional_expenses: AdditionalExpense[];
  additional_expenses_currency: string | null;
  campaign_creators: CampaignCreatorResponse[];
  campaign_products: CampaignProductResponse[];
}

export function transformCampaignData(rawCampaign: RawCampaignResponse): Campaign {
  return {
    ...rawCampaign,
    additional_expenses: Array.isArray(rawCampaign.additional_expenses)
      ? rawCampaign.additional_expenses.map((expense: any) => ({
          name: expense.name || '',
          amount: expense.amount || '',
          currency: expense.currency || 'USD'
        }))
      : []
  };
}