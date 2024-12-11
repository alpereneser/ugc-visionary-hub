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
  additional_expenses: Array<{ name: string; amount: string }>;
  campaign_creators: Array<{ creator_id: string }>;
  campaign_products: Array<{ product_id: string }>;
}

interface CostBreakdownProps {
  campaign?: Campaign;
  selectedProducts?: string[];
  selectedCreators?: string[];
  expenses?: Array<{ name: string; amount: string }>;
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
        .select("id, name, cost_price");
      if (error) throw error;
      return data;
    },
  });

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

  const calculateTotalCost = () => {
    return (calculateProductsCost() + calculateTotalExpenses()).toFixed(2);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Cost Breakdown</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Products Cost:</span>
            <span>${calculateProductsCost().toFixed(2)}</span>
          </div>
          
          {(campaign?.additional_expenses?.length > 0 || expenses?.length > 0) && (
            <>
              <Separator className="my-2" />
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Additional Expenses:</span>
                {(campaign ? campaign.additional_expenses : expenses).map((expense, index) => (
                  <div key={index} className="flex justify-between pl-4">
                    <span>{expense.name || "Unnamed expense"}</span>
                    <span>${Number(expense.amount || 0).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          
          <Separator className="my-2" />
          <div className="flex justify-between font-semibold">
            <span>Total Estimated Cost:</span>
            <span>${calculateTotalCost()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};