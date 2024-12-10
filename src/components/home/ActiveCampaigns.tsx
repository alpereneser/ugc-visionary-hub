import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";

interface ActiveCampaignsProps {
  campaigns?: Tables<"campaigns">[];
}

export const ActiveCampaigns = ({ campaigns }: ActiveCampaignsProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Campaigns</CardTitle>
      </CardHeader>
      <CardContent>
        {campaigns && campaigns.length > 0 ? (
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