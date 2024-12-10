import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const CostBreakdown = ({ selectedProducts, selectedCreators, expenses }) => {
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
    return selectedProducts.reduce((acc, productId) => {
      const product = products?.find((p) => p.id === productId);
      return acc + (product?.cost_price || 0) * selectedCreators.length;
    }, 0);
  };

  const calculateTotalExpenses = () => {
    return expenses.reduce((acc, expense) => acc + Number(expense.amount || 0), 0);
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
          
          {expenses.length > 0 && (
            <>
              <Separator className="my-2" />
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Additional Expenses:</span>
                {expenses.map((expense, index) => (
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