import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const ProductsList = () => {
  const navigate = useNavigate();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center min-h-[200px] flex items-center justify-center">
        Error loading products. Please try again.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => navigate("/products/new")}>
          <Plus className="w-4 h-4 mr-2" />
          New Product
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products?.map((product) => (
          <Card
            key={product.id}
            className="cursor-pointer hover:shadow-lg transition-shadow relative z-0"
            onClick={() => navigate(`/products/${product.id}`)}
          >
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              {product.description && (
                <p className="text-sm text-muted-foreground mb-2">
                  {product.description}
                </p>
              )}
              <div className="flex justify-between items-center text-sm">
                <span>SKU: {product.sku || "N/A"}</span>
                <span className="font-medium">
                  ${product.retail_price || "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};