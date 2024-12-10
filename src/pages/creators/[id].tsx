import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ArrowLeft, Mail, Phone, Instagram, Facebook, Tiktok, Snapchat, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <Instagram className="h-4 w-4" />;
      case "facebook":
        return <Facebook className="h-4 w-4" />;
      case "tiktok":
        return <Tiktok className="h-4 w-4" />;
      case "snapchat":
        return <Snapchat className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

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
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {creator?.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{creator.email}</span>
                  </div>
                )}
                {creator?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{creator.phone}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Social Media Profiles */}
            <Card>
              <CardHeader>
                <CardTitle>Social Media Profiles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {creator?.social_media_profiles?.map((profile) => (
                  <div key={profile.id} className="flex items-center gap-2">
                    {getSocialIcon(profile.platform)}
                    <a
                      href={profile.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {profile.username}
                    </a>
                    {profile.followers_count && (
                      <span className="text-sm text-muted-foreground">
                        ({profile.followers_count.toLocaleString()} followers)
                      </span>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Separator className="my-8" />

          {/* Campaigns */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {campaigns?.map((campaign) => (
                  <div
                    key={campaign.campaign_id}
                    className="py-4 flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-medium">
                        {campaign.campaigns?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Status: {campaign.status}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/campaigns/${campaign.campaign_id}`)}
                    >
                      View Campaign
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Products */}
          <Card>
            <CardHeader>
              <CardTitle>Products Received</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {products?.map((product) => (
                  <div key={product.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">
                          {product.products?.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {product.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">
                          Given on: {new Date(product.given_date).toLocaleDateString()}
                        </p>
                        {product.campaigns?.name && (
                          <p className="text-sm text-muted-foreground">
                            Campaign: {product.campaigns.name}
                          </p>
                        )}
                      </div>
                    </div>
                    {product.notes && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        Notes: {product.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CreatorDetail;