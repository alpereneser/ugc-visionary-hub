import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ProductActions } from "@/components/products/ProductActions";
import { MainLayout } from "@/components/layouts/MainLayout";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data: product, error } = await supabase
        .from("products")
        .select(`
          *,
          campaign_products (
            campaign_id,
            campaigns (
              name,
              status
            )
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
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
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
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
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Product Details</h3>
                <div className="space-y-4">
                  <div>
                    <span className="font-medium">Description:</span>
                    <p className="text-muted-foreground">{product.description || 'No description provided'}</p>
                  </div>
                  {product.url && (
                    <div>
                      <span className="font-medium">Product URL:</span>
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1 mt-1"
                      >
                        Visit Product Page
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {product.campaign_products && product.campaign_products.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Associated Campaigns</h3>
                  <div className="space-y-4">
                    {product.campaign_products.map((cp: any) => (
                      <div key={cp.campaign_id} className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">
                            {cp.campaigns?.name}
                          </span>
                          <p className="text-sm text-muted-foreground">
                            Status: {cp.campaigns?.status}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => navigate(`/campaigns/${cp.campaign_id}`)}
                        >
                          View Campaign
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetail;