import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, Flag, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const Home = () => {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  const { data: creatorsCount } = useQuery({
    queryKey: ["creators-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("ugc_creators")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: productsCount } = useQuery({
    queryKey: ["products-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: activeCampaignsCount } = useQuery({
    queryKey: ["active-campaigns-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("campaigns")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: recentCreators } = useQuery({
    queryKey: ["recent-creators"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ugc_creators")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  const { data: activeCampaigns } = useQuery({
    queryKey: ["active-campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  if (!session) {
    return null;
  }

  const stats = [
    {
      title: "UGC Creators",
      value: creatorsCount?.toString() || "0",
      icon: Users,
      link: "/creators",
    },
    {
      title: "Products",
      value: productsCount?.toString() || "0",
      icon: Package,
      link: "/products",
    },
    {
      title: "Active Campaigns",
      value: activeCampaignsCount?.toString() || "0",
      icon: Flag,
      link: "/campaigns",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <div className="space-x-4">
            <Button onClick={() => navigate("/creators/new")}>
              <Plus className="w-4 h-4 mr-2" />
              Add Creator
            </Button>
            <Button onClick={() => navigate("/products/new")}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
            <Button onClick={() => navigate("/campaigns/new")}>
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <Card
              key={stat.title}
              className="hover:bg-accent/50 cursor-pointer transition-colors"
              onClick={() => navigate(stat.link)}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent UGC Creators</CardTitle>
            </CardHeader>
            <CardContent>
              {recentCreators && recentCreators.length > 0 ? (
                <div className="space-y-4">
                  {recentCreators.map((creator) => (
                    <div
                      key={creator.id}
                      className="flex items-center justify-between hover:bg-accent/50 p-2 rounded-lg cursor-pointer"
                      onClick={() => navigate(`/creators/${creator.id}`)}
                    >
                      <div>
                        <p className="font-medium">
                          {creator.first_name} {creator.last_name}
                        </p>
                        {creator.email && (
                          <p className="text-sm text-muted-foreground">
                            {creator.email}
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
                <p className="text-muted-foreground">No creators yet</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              {activeCampaigns && activeCampaigns.length > 0 ? (
                <div className="space-y-4">
                  {activeCampaigns.map((campaign) => (
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
        </div>
      </main>
    </div>
  );
};

export default Home;