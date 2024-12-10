import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

type AdditionalExpense = {
  name: string;
  amount: string;
};

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: campaign, isLoading: campaignLoading } = useQuery({
    queryKey: ["campaign", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select(`
          *,
          campaign_creators(
            creator_id,
            ugc_creators(
              id,
              first_name,
              last_name
            )
          ),
          campaign_products(
            product_id,
            products(
              id,
              name,
              cost_price
            )
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (campaignLoading) {
    return <div>Loading...</div>;
  }

  const creators = campaign?.campaign_creators?.map(
    (cc) => cc.ugc_creators
  ).filter(Boolean);
  
  const products = campaign?.campaign_products?.map(
    (cp) => cp.products
  ).filter(Boolean);

  const additionalExpenses = (campaign?.additional_expenses || []) as AdditionalExpense[];

  const calculateProductsCost = () => {
    return products?.reduce((acc, product) => {
      return acc + (Number(product?.cost_price || 0) * (creators?.length || 0));
    }, 0) || 0;
  };

  const calculateTotalExpenses = () => {
    return additionalExpenses.reduce((acc, expense) => acc + Number(expense.amount || 0), 0);
  };

  const calculateTotalCost = () => {
    return (calculateProductsCost() + calculateTotalExpenses()).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <nav className="flex mb-6 text-sm text-muted-foreground">
            <Button
              variant="ghost"
              className="p-0 mr-2"
              onClick={() => navigate("/campaigns")}
            >
              Campaigns
            </Button>
            <span className="mx-2">/</span>
            <span className="text-foreground">{campaign?.name}</span>
          </nav>

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">{campaign?.name}</h1>
            <Button
              variant="outline"
              onClick={() => navigate("/campaigns")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Campaigns
            </Button>
          </div>

          <div className="grid gap-6">
            {campaign?.description && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">
                    {campaign.description}
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-4 h-4" />
                    <h3 className="font-semibold">Campaign Period</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Start Date:</span>
                      <span>
                        {campaign?.start_date
                          ? format(new Date(campaign.start_date), "PPP")
                          : "Not set"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>End Date:</span>
                      <span>
                        {campaign?.end_date
                          ? format(new Date(campaign.end_date), "PPP")
                          : "Not set"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-4 h-4" />
                    <h3 className="font-semibold">Campaign Status</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Status:</span>
                      <span className="capitalize">{campaign?.status}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Selected Creators</h3>
                <div className="grid gap-2">
                  {creators?.map((creator) => (
                    <div
                      key={creator.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted"
                    >
                      <span>
                        {creator.first_name} {creator.last_name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/creators/${creator.id}`)}
                      >
                        View Profile
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Selected Products</h3>
                <div className="grid gap-2">
                  {products?.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted"
                    >
                      <span>{product.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        View Product
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {additionalExpenses.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Campaign Costs</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Products Cost:</span>
                      <span>${calculateProductsCost().toFixed(2)}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="font-medium">Additional Expenses:</div>
                      {additionalExpenses.map((expense, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-2 rounded-lg hover:bg-muted pl-4"
                        >
                          <span>{expense.name}</span>
                          <span>${Number(expense.amount).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center font-semibold">
                      <span>Total Campaign Cost:</span>
                      <span>${calculateTotalCost()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {campaign?.media && campaign.media.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Campaign Media</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {campaign.media.map((item: any, index: number) => (
                      <div key={index} className="aspect-video rounded-lg overflow-hidden">
                        {item.type === 'image' ? (
                          <img
                            src={item.url}
                            alt={`Campaign media ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video
                            src={item.url}
                            controls
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CampaignDetail;