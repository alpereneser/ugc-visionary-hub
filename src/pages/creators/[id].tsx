import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CreatorContact } from "@/components/creators/CreatorContact";
import { CreatorSocialMedia } from "@/components/creators/CreatorSocialMedia";
import { CreatorCampaigns } from "@/components/creators/CreatorCampaigns";
import { CreatorProducts } from "@/components/creators/CreatorProducts";

const CreatorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: creator, isLoading: creatorLoading } = useQuery({
    queryKey: ["creator", id],
    queryFn: async () => {
      const { data: creator, error } = await supabase
        .from("ugc_creators")
        .select("*, social_media_profiles(*)")
        .eq("id", id)
        .single();

      if (error) {
        toast.error("Error loading creator details");
        throw error;
      }

      return creator;
    },
  });

  const { data: campaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: ["creator-campaigns", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaign_creators")
        .select(`
          campaign_id,
          status,
          campaigns (
            id,
            name,
            start_date,
            end_date,
            status
          )
        `)
        .eq("creator_id", id);

      if (error) {
        toast.error("Error loading campaign details");
        throw error;
      }

      return data;
    },
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["creator-products", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("creator_products")
        .select(`
          id,
          quantity,
          given_date,
          notes,
          products (
            id,
            name,
            sku
          ),
          campaigns (
            id,
            name
          )
        `)
        .eq("creator_id", id);

      if (error) {
        toast.error("Error loading product details");
        throw error;
      }

      return data;
    },
  });

  if (creatorLoading || campaignsLoading || productsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/creators")}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-bold">
              {creator?.first_name} {creator?.last_name}
            </h1>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <CreatorContact email={creator?.email} phone={creator?.phone} />
            <CreatorSocialMedia profiles={creator?.social_media_profiles} />
          </div>

          <Separator className="my-8" />

          <CreatorCampaigns campaigns={campaigns} />
          <CreatorProducts products={products} />
        </div>
      </main>
    </div>
  );
};

export default CreatorDetail;