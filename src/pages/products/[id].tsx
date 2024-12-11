import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ProductActions } from "@/components/products/ProductActions";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data: product, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast.error("Error loading product details");
        throw error;
      }

      return product;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-3xl font-bold">{product.name}</h1>
            </div>
            <ProductActions productId={product.id} />
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {product.description && (
                  <div>
                    <h3 className="font-medium mb-1">Description</h3>
                    <p className="text-muted-foreground">{product.description}</p>
                  </div>
                )}

                {product.sku && (
                  <div>
                    <h3 className="font-medium mb-1">SKU</h3>
                    <p className="text-muted-foreground">{product.sku}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.retail_price && (
                    <div>
                      <h3 className="font-medium mb-1">Retail Price</h3>
                      <p className="text-muted-foreground">
                        ${product.retail_price.toFixed(2)}
                      </p>
                    </div>
                  )}

                  {product.cost_price && (
                    <div>
                      <h3 className="font-medium mb-1">Cost Price</h3>
                      <p className="text-muted-foreground">
                        ${product.cost_price.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>

                {product.url && (
                  <div>
                    <h3 className="font-medium mb-2">Product URL</h3>
                    <div className="space-y-2">
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        Visit product page
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <div className="border rounded-lg overflow-hidden">
                        <iframe
                          src={product.url}
                          title="Product preview"
                          className="w-full h-[400px]"
                          sandbox="allow-same-origin allow-scripts"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
