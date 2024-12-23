import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Campaign {
  id: string;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  additional_expenses: Array<{ name: string; amount: string; currency: string }>;
  campaign_creators: Array<{ creator_id: string }>;
  campaign_products: Array<{ product_id: string }>;
}

interface CostBreakdownProps {
  campaign?: Campaign;
  selectedProducts?: string[];
  selectedCreators?: string[];
  expenses?: Array<{ name: string; amount: string; currency: string }>;
}

export const CostBreakdown = ({ 
  campaign,
  selectedProducts = [],
  selectedCreators = [],
  expenses = []
}: CostBreakdownProps) => {
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, cost_price, cost_price_currency");
      if (error) throw error;
      return data;
    },
  });

  const formatCurrency = (amount: number, currency: string) => {
    const symbols = {
      USD: "$",
      EUR: "€",
      TRY: "₺"
    };
    return `${symbols[currency as keyof typeof symbols]}${amount.toFixed(2)}`;
  };

  const calculateProductsCost = () => {
    if (campaign) {
      return campaign.campaign_products.reduce((acc, cp) => {
        const product = products?.find((p) => p.id === cp.product_id);
        return acc + (product?.cost_price || 0) * campaign.campaign_creators.length;
      }, 0);
    }

    return (selectedProducts || []).reduce((acc, productId) => {
      const product = products?.find((p) => p.id === productId);
      return acc + (product?.cost_price || 0) * (selectedCreators || []).length;
    }, 0);
  };

  const calculateTotalExpenses = () => {
    const expensesToUse = campaign ? campaign.additional_expenses : expenses;
    return (expensesToUse || []).reduce((acc, expense) => 
      acc + Number(expense.amount || 0), 0
    );
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Cost Breakdown</h3>
        <div className="space-y-2">
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">Products Cost:</span>
            {(campaign ? campaign.campaign_products : selectedProducts).map((productId) => {
              const product = products?.find((p) => p.id === (typeof productId === 'string' ? productId : productId.product_id));
              if (!product) return null;
              return (
                <div key={product.id} className="flex justify-between pl-4">
                  <span>{product.name}</span>
                  <span>{formatCurrency(product.cost_price || 0, product.cost_price_currency || 'USD')}</span>
                </div>
              );
            })}
          </div>
          
          {(campaign?.additional_expenses?.length > 0 || expenses?.length > 0) && (
            <>
              <Separator className="my-2" />
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Additional Expenses:</span>
                {(campaign ? campaign.additional_expenses : expenses).map((expense, index) => (
                  <div key={index} className="flex justify-between pl-4">
                    <span>{expense.name || "Unnamed expense"}</span>
                    <span>{formatCurrency(Number(expense.amount || 0), expense.currency || 'USD')}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          
          <Separator className="my-2" />
          <div className="flex justify-between font-semibold">
            <span>Total Estimated Cost:</span>
            <div className="space-y-1">
              {Object.entries(
                (campaign ? campaign.additional_expenses : expenses).reduce((acc: Record<string, number>, expense) => {
                  const currency = expense.currency || 'USD';
                  acc[currency] = (acc[currency] || 0) + Number(expense.amount || 0);
                  return acc;
                }, {})
              ).map(([currency, amount]) => (
                <div key={currency} className="text-right">
                  {formatCurrency(amount, currency)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};