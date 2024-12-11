import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layouts/MainLayout";
import { CostBreakdown } from "@/components/campaigns/CostBreakdown";
import { CampaignActions } from "@/components/campaigns/CampaignActions";

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: campaign, isLoading } = useQuery({
    queryKey: ["campaign", id],
    queryFn: async () => {
      const { data: campaign, error } = await supabase
        .from("campaigns")
        .select(`
          *,
          campaign_creators (
            *,
            ugc_creators (*)
          ),
          campaign_products (
            *,
            products (*)
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return campaign;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!campaign) {
    return <div>Campaign not found</div>;
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
                  {campaign.description && (
                    <div>
                      <span className="font-medium">Description:</span>
                      <p className="text-muted-foreground">{campaign.description}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    {campaign.start_date && (
                      <div>
                        <span className="font-medium">Start Date:</span>
                        <p className="text-muted-foreground">
                          {new Date(campaign.start_date).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {campaign.end_date && (
                      <div>
                        <span className="font-medium">End Date:</span>
                        <p className="text-muted-foreground">
                          {new Date(campaign.end_date).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <p className="text-muted-foreground capitalize">{campaign.status}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <CostBreakdown campaign={campaign} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CampaignDetail;