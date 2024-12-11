import { MainLayout } from "@/components/layouts/MainLayout";
import { ActiveCampaigns } from "@/components/home/ActiveCampaigns";
import { RecentCreators } from "@/components/home/RecentCreators";
import { StatsCard } from "@/components/home/StatsCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, Package, BarChart3, Lock } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Pricing } from "@/components/Pricing";

const Home = () => {
  const session = useSession();
  const navigate = useNavigate();
  
  const { data: creators } = useQuery({
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

  const isAdmin = session?.user?.email === "alperen@tracefluence.com";
  const hasLifetimeAccess = license?.has_lifetime_access;
  const shouldShowPricing = !isAdmin && !hasLifetimeAccess;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          {isAdmin && (
            <Button
              onClick={() => navigate("/admin")}
              variant="outline"
              className="gap-2"
            >
              <Lock className="w-4 h-4" />
              Admin Panel
            </Button>
          )}
        </div>
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              title="Active Campaigns"
              value="12"
              description="+2.5% from last month"
              type="increase"
              icon={BarChart3}
              link="/campaigns"
            />
            <StatsCard
              title="Total Creators"
              value="48"
              description="+12% from last month"
              type="increase"
              icon={Users}
              link="/creators"
            />
            <StatsCard
              title="Products Tracked"
              value="156"
              description="-4% from last month"
              type="decrease"
              icon={Package}
              link="/products"
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ActiveCampaigns />
            </div>
            <div>
              <RecentCreators creators={creators} />
            </div>
          </div>
        </div>
        {shouldShowPricing && <Pricing />}
      </div>
    </MainLayout>
  );
};

export default Home;