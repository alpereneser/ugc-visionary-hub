import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export const CampaignsList = () => {
  const navigate = useNavigate();
  const session = useSession();
  const [filter, setFilter] = useState<string>("all");

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["campaigns", session?.user?.id, filter],
    queryFn: async () => {
      let query = supabase
        .from("campaigns")
        .select(`
          id,
          name,
          description,
          start_date,
          end_date,
          status,
          created_at,
          campaign_creators (
            creator_id,
            ugc_creators (
              id,
              first_name,
              last_name
            )
          ),
          campaign_products (
            product_id,
            products (
              id,
              name
            )
          )
        `)
        .eq('created_by', session?.user?.id)
        .order('created_at', { ascending: false });

      if (filter !== "all") {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        Loading campaigns...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <Select
            value={filter}
            onValueChange={setFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter campaigns" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => navigate("/campaigns/new")}>
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {campaigns?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No campaigns found. Create your first campaign to get started.
          </p>
          <Button onClick={() => navigate("/campaigns/new")}>
            <Plus className="w-4 h-4 mr-2" />
            Create First Campaign
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {campaigns?.map((campaign) => (
            <Card
              key={campaign.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/campaigns/${campaign.id}`)}
            >
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">{campaign.name}</h3>
                {campaign.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {campaign.description}
                  </p>
                )}
                <div className="flex justify-between items-center text-sm">
                  <span className="capitalize">{campaign.status}</span>
                  {campaign.start_date && (
                    <span className="text-muted-foreground">
                      Started: {new Date(campaign.start_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};