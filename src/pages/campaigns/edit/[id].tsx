import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CampaignFormFields, type CampaignFormData } from "@/components/campaigns/shared/CampaignFormFields";
import { MainLayout } from "@/components/layouts/MainLayout";

const EditCampaign = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: campaign, isLoading } = useQuery({
    queryKey: ["campaign", id],
    queryFn: async () => {
      const { data: campaignData, error: campaignError } = await supabase
        .from("campaigns")
        .select(`
          *,
          campaign_creators (
            creator_id
          ),
          campaign_products (
            product_id
          )
        `)
        .eq("id", id)
        .single();

      if (campaignError) throw campaignError;

      return {
        ...campaignData,
        selectedCreators: campaignData.campaign_creators?.map((cc: any) => cc.creator_id) || [],
        selectedProducts: campaignData.campaign_products?.map((cp: any) => cp.product_id) || [],
      };
    },
  });

  const updateCampaign = useMutation({
    mutationFn: async (values: CampaignFormData) => {
      // Update campaign
      const { error: campaignError } = await supabase
        .from("campaigns")
        .update({
          name: values.name,
          description: values.description,
          status: values.status,
          start_date: values.startDate,
          end_date: values.endDate,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (campaignError) throw campaignError;

      // Update campaign creators
      const { error: deleteCreatorsError } = await supabase
        .from("campaign_creators")
        .delete()
        .eq("campaign_id", id);

      if (deleteCreatorsError) throw deleteCreatorsError;

      if (values.selectedCreators.length > 0) {
        const { error: creatorsError } = await supabase
          .from("campaign_creators")
          .insert(
            values.selectedCreators.map((creatorId) => ({
              campaign_id: id,
              creator_id: creatorId,
            }))
          );

        if (creatorsError) throw creatorsError;
      }

      // Update campaign products
      const { error: deleteProductsError } = await supabase
        .from("campaign_products")
        .delete()
        .eq("campaign_id", id);

      if (deleteProductsError) throw deleteProductsError;

      if (values.selectedProducts.length > 0) {
        const { error: productsError } = await supabase
          .from("campaign_products")
          .insert(
            values.selectedProducts.map((productId) => ({
              campaign_id: id,
              product_id: productId,
            }))
          );

        if (productsError) throw productsError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaign", id] });
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Campaign updated successfully");
      navigate(`/campaigns/${id}`);
    },
    onError: (error) => {
      console.error("Error updating campaign:", error);
      toast.error("Failed to update campaign");
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

  const defaultValues: CampaignFormData = {
    name: campaign.name,
    description: campaign.description || "",
    status: campaign.status as CampaignFormData["status"],
    startDate: campaign.start_date || "",
    endDate: campaign.end_date || "",
    selectedCreators: campaign.selectedCreators,
    selectedProducts: campaign.selectedProducts,
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold">Edit Campaign</h1>
          </div>

          <CampaignFormFields
            defaultValues={defaultValues}
            onSubmit={(values) => updateCampaign.mutate(values)}
            onCancel={() => navigate(-1)}
            initialExpenses={campaign.additional_expenses || []}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default EditCampaign;