import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

export const ActiveCampaigns = () => {
  const navigate = useNavigate();
  const session = useSession();

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["active-campaigns", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq('created_by', session?.user?.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Campaigns</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-muted-foreground">Loading campaigns...</p>
        ) : campaigns && campaigns.length > 0 ? (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="flex items-center justify-between hover:bg-accent/50 p-2 rounded-lg cursor-pointer"
                onClick={() => navigate(`/campaigns/${campaign.id}`)}
              >
                <div>
                  <p className="font-medium">{campaign.name}</p>
                  {campaign.start_date && (
                    <p className="text-sm text-muted-foreground">
                      Started: {new Date(campaign.start_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No active campaigns</p>
        )}
      </CardContent>
    </Card>
  );
};