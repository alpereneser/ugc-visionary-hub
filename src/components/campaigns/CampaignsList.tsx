import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import { useState } from "react";

export const CampaignsList = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const session = useSession();

  const { data: campaigns, isLoading, error } = useQuery({
    queryKey: ["campaigns", statusFilter],
    queryFn: async () => {
      console.log("Fetching campaigns with status filter:", statusFilter);
      console.log("Current user ID:", session?.user?.id);

      let query = supabase
        .from("campaigns")
        .select(`
          *,
          campaign_creators (
            creator_id,
            ugc_creators (
              first_name,
              last_name
            )
          ),
          campaign_products (
            product_id,
            products (
              name
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching campaigns:", error);
        throw error;
      }

      console.log("Campaigns fetched:", data);
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const getCampaignStatus = (campaign: any) => {
    const now = new Date();
    const startDate = campaign.start_date ? new Date(campaign.start_date) : null;
    const endDate = campaign.end_date ? new Date(campaign.end_date) : null;

    if (!startDate || !endDate) return campaign.status;

    if (now < startDate) return "upcoming";
    if (now > endDate) return "completed";
    return "active";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        Loading...
      </div>
    );
  }

  if (error) {
    console.error("Query error:", error);
    return (
      <div className="text-red-500 text-center min-h-[200px] flex items-center justify-center">
        An error occurred while loading campaigns. Please try again.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        <div className="flex gap-4 items-center">
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => navigate("/campaigns/new")}>
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {!campaigns || campaigns.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No campaigns added yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <Card
              key={campaign.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/campaigns/${campaign.id}`)}
            >
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">{campaign.name}</h3>
                {campaign.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {campaign.description}
                  </p>
                )}
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {campaign.start_date
                        ? format(new Date(campaign.start_date), "dd MMM yyyy")
                        : "Start date not set"}
                    </span>
                  </div>
                  <div
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getCampaignStatus(campaign) === "active"
                        ? "bg-green-100 text-green-800"
                        : getCampaignStatus(campaign) === "completed"
                        ? "bg-gray-100 text-gray-800"
                        : getCampaignStatus(campaign) === "upcoming"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {getCampaignStatus(campaign)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};