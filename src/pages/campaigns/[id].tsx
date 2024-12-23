import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CampaignActions } from "@/components/campaigns/CampaignActions";
import { MainLayout } from "@/components/layouts/MainLayout";
import { format } from "date-fns";
import { Campaign, RawCampaignResponse, transformCampaignData } from "@/types/campaign-types";

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: campaign, isLoading } = useQuery({
    queryKey: ["campaign", id],
    queryFn: async () => {
      const { data: campaignData, error } = await supabase
        .from("campaigns")
        .select(`
          *,
          campaign_creators (
            creator_id,
            ugc_creators (
              id,
              first_name,
              last_name,
              email
            )
          ),
          campaign_products (
            product_id,
            products (
              id,
              name,
              description,
              sku,
              url,
              retail_price,
              cost_price,
              cost_price_currency,
              retail_price_currency
            )
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      
      return transformCampaignData(campaignData as RawCampaignResponse);
    },
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div>Loading...</div>
        </div>
      </MainLayout>
    );
  }

  if (!campaign) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div>Campaign not found</div>
        </div>
      </MainLayout>
    );
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
              <h1 className="text-3xl font-bold">{campaign.name}</h1>
            </div>
            <CampaignActions campaignId={campaign.id} />
          </div>

          <div className="grid gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Campaign Details</h3>
                <div className="space-y-4">
                  <div>
                    <span className="font-medium">Status:</span>
                    <p className="text-muted-foreground capitalize">{campaign.status}</p>
                  </div>
                  {campaign.description && (
                    <div>
                      <span className="font-medium">Description:</span>
                      <p className="text-muted-foreground">{campaign.description}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Start Date:</span>
                    <p className="text-muted-foreground">
                      {campaign.start_date ? format(new Date(campaign.start_date), 'PPP') : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">End Date:</span>
                    <p className="text-muted-foreground">
                      {campaign.end_date ? format(new Date(campaign.end_date), 'PPP') : 'Not set'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {campaign.campaign_creators && campaign.campaign_creators.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Assigned Creators</h3>
                  <div className="space-y-4">
                    {campaign.campaign_creators.map((cc) => (
                      <div key={cc.creator_id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {cc.ugc_creators.first_name} {cc.ugc_creators.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {cc.ugc_creators.email}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => navigate(`/creators/${cc.creator_id}`)}
                        >
                          View Creator
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {campaign.campaign_products && campaign.campaign_products.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Associated Products</h3>
                  <div className="space-y-4">
                    {campaign.campaign_products.map((cp) => (
                      <div key={cp.product_id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{cp.products.name}</p>
                          {cp.products.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {cp.products.description}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => navigate(`/products/${cp.product_id}`)}
                        >
                          View Product
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

export default CampaignDetail;