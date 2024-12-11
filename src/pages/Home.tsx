import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Package, Users, Flag, Plus, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { StatsCard } from "@/components/home/StatsCard";
import { RecentCreators } from "@/components/home/RecentCreators";
import { ActiveCampaigns } from "@/components/home/ActiveCampaigns";
import { Pricing } from "@/components/Pricing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Home = () => {
  const session = useSession();
  const navigate = useNavigate();

  // Query to check user's license status
  const { data: license } = useQuery({
    queryKey: ["user-license", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from("user_licenses")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (!session) {
      navigate("/login");
      return;
    }

    // Check if trial has ended and user doesn't have lifetime access
    if (license && 
        !license.has_lifetime_access && 
        new Date(license.trial_end_date) < new Date()) {
      // If trial ended and no lifetime access, show only pricing section
      return;
    }
  }, [session, navigate, license]);

  // If trial ended and no lifetime access, show only pricing and support
  if (license && 
      !license.has_lifetime_access && 
      new Date(license.trial_end_date) < new Date()) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header />
        <main className="container mx-auto px-4 py-8 pt-24">
          <div className="max-w-4xl mx-auto space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Need help? Contact our support team at:
                </p>
                <a 
                  href="mailto:support@tracefluence.com" 
                  className="text-primary hover:underline flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  support@tracefluence.com
                </a>
              </CardContent>
            </Card>
            <Pricing />
          </div>
        </main>
      </div>
    );
  }

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
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your campaigns and creators from one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => navigate("/creators/new")}
              className="bg-white text-black border shadow-sm hover:bg-gray-100"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Creator
            </Button>
            <Button 
              onClick={() => navigate("/products/new")}
              className="bg-white text-black border shadow-sm hover:bg-gray-100"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
            <Button 
              onClick={() => navigate("/campaigns/new")}
              variant="default"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              link={stat.link}
            />
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <RecentCreators creators={recentCreators} />
          </div>
          <div className="space-y-6">
            <ActiveCampaigns campaigns={activeCampaigns} />
          </div>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Need help? Contact our support team at:
              </p>
              <a 
                href="mailto:support@tracefluence.com" 
                className="text-primary hover:underline flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                support@tracefluence.com
              </a>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Pricing />
        </div>
      </main>
    </div>
  );
};

export default Home;
