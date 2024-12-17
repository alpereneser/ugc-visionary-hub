import { Json } from "@/integrations/supabase/types";

export interface AdditionalExpense {
  name: string;
  amount: number;
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
  campaign_creators: CampaignCreator[];
  campaign_products: CampaignProduct[];
}

export interface CampaignCreator {
  id: string;
  campaign_id: string;
  creator_id: string;
  status: string | null;
  created_at: string;
  updated_at: string;
  creator: Creator;
}

export interface Creator {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface CampaignProduct {
  id: string;
  campaign_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product: Product;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string | null;
  created_at: string;
  updated_at: string;
  url: string | null;
  retail_price: number | null;
  cost_price: number | null;
  created_by: string | null;
}

// Type for raw campaign data from Supabase
export interface RawCampaign extends Omit<Campaign, 'additional_expenses'> {
  additional_expenses: Json;
}

// Helper function to transform raw campaign data
export function transformCampaignData(rawCampaign: RawCampaign): Campaign {
  return {
    ...rawCampaign,
    additional_expenses: (rawCampaign.additional_expenses as AdditionalExpense[]) || []
  };
}