export interface Campaign {
  id: string;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
  media: any | null;
  additional_expenses: Array<{
    name: string;
    amount: string;
  }>;
  campaign_creators: Array<{
    id: string;
    campaign_id: string;
    creator_id: string;
    status: string;
    created_at: string;
    updated_at: string;
    ugc_creators: {
      id: string;
      first_name: string;
      last_name: string;
      email: string | null;
      phone: string | null;
      created_at: string;
      updated_at: string;
    };
  }>;
  campaign_products: Array<{
    id: string;
    campaign_id: string;
    product_id: string;
    quantity: number;
    created_at: string;
    updated_at: string;
    products: {
      id: string;
      name: string;
      description: string | null;
      sku: string | null;
      created_at: string;
      updated_at: string;
      url: string | null;
      retail_price: number | null;
      cost_price: number | null;
    };
  }>;
}