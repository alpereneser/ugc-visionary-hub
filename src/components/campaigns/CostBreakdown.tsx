import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const CostBreakdown = ({ selectedProducts, selectedCreators, budget }) => {
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

  const calculateTotalCost = () => {
    let total = 0;
    
    // Add product costs
    selectedProducts.forEach((productId) => {
      const product = products?.find((p) => p.id === productId);
      if (product?.cost_price) {
        total += Number(product.cost_price) * selectedCreators.length;
      }
    });

    // Add campaign budget if specified
    if (budget) {
      total += Number(budget);
    }

    return total.toFixed(2);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Cost Breakdown</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Products Cost:</span>
            <span>
              $
              {selectedProducts
                .reduce((acc, productId) => {
                  const product = products?.find(
                    (p) => p.id === productId
                  );
                  return (
                    acc +
                    (product?.cost_price || 0) *
                      selectedCreators.length
                  );
                }, 0)
                .toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Additional Budget:</span>
            <span>${budget || "0.00"}</span>
          </div>
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