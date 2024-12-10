import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Campaign {
  campaign_id: string;
  status: string;
  campaigns?: {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    status: string;
  };
}

interface CreatorCampaignsProps {
  campaigns?: Campaign[];
}

export const CreatorCampaigns = ({ campaigns }: CreatorCampaignsProps) => {
  const navigate = useNavigate();

  return (
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
                <h3 className="font-medium">{campaign.campaigns?.name}</h3>
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
  );
};