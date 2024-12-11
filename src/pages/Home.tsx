import { MainLayout } from "@/components/layouts/MainLayout";
import { ActiveCampaigns } from "@/components/home/ActiveCampaigns";
import { RecentCreators } from "@/components/home/RecentCreators";
import { StatsCard } from "@/components/home/StatsCard";
import { DashboardHeader } from "@/components/home/DashboardHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, Package, BarChart3 } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { BankTransferPayment } from "@/components/payment/BankTransferPayment";
import { motion } from "framer-motion";

const Home = () => {
  const session = useSession();
  const navigate = useNavigate();

  // Fetch campaigns data
  const { data: campaignsData } = useQuery({
    queryKey: ["dashboard-campaigns", session?.user?.id],
    queryFn: async () => {
      const { data: currentData, error: currentError } = await supabase
        .from("campaigns")
        .select("*")
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(5);

      const { count: totalLastMonth } = await supabase
        .from("campaigns")
        .select("*", { count: 'exact', head: true })
        .eq('status', 'active')
        .lte('created_at', new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString());

      const { count: totalCurrent } = await supabase
        .from("campaigns")
        .select("*", { count: 'exact', head: true })
        .eq('status', 'active');

      if (currentError) throw currentError;

      const percentageChange = totalLastMonth > 0 
        ? ((totalCurrent - totalLastMonth) / totalLastMonth) * 100 
        : 0;

      return {
        campaigns: currentData,
        total: totalCurrent,
        percentageChange
      };
    },
    enabled: !!session?.user?.id,
  });

  const { data: creatorsData } = useQuery({
    queryKey: ["dashboard-creators", session?.user?.id],
    queryFn: async () => {
      const { data: currentData, error: currentError } = await supabase
        .from("ugc_creators")
        .select("*")
        .order('created_at', { ascending: false })
        .limit(5);

      const { count: totalLastMonth } = await supabase
        .from("ugc_creators")
        .select("*", { count: 'exact', head: true })
        .lte('created_at', new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString());

      const { count: totalCurrent } = await supabase
        .from("ugc_creators")
        .select("*", { count: 'exact', head: true });

      if (currentError) throw currentError;

      const percentageChange = totalLastMonth > 0 
        ? ((totalCurrent - totalLastMonth) / totalLastMonth) * 100 
        : 0;

      return {
        creators: currentData,
        total: totalCurrent,
        percentageChange
      };
    },
    enabled: !!session?.user?.id,
  });

  // Fetch products data
  const { data: productsData } = useQuery({
    queryKey: ["dashboard-products", session?.user?.id],
    queryFn: async () => {
      const { count: totalLastMonth } = await supabase
        .from("products")
        .select("*", { count: 'exact', head: true })
        .lte('created_at', new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString());

      const { count: totalCurrent } = await supabase
        .from("products")
        .select("*", { count: 'exact', head: true });

      const percentageChange = totalLastMonth > 0 
        ? ((totalCurrent - totalLastMonth) / totalLastMonth) * 100 
        : 0;

      return {
        total: totalCurrent,
        percentageChange
      };
    },
    enabled: !!session?.user?.id,
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
  const trialDaysLeft = license?.trial_end_date ? Math.ceil((new Date(license.trial_end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader />

        {!hasLifetimeAccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-primary/20"
          >
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              {trialDaysLeft > 0 ? `${trialDaysLeft} Days Left in Trial` : "Trial Period Ended"}
            </h2>
            <p className="text-muted-foreground mb-4">
              Get lifetime access to all features of UGC Tracker. 
              Pay once, use forever!
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  Get Lifetime License - $50
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <BankTransferPayment />
              </DialogContent>
            </Dialog>
          </motion.div>
        )}

        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              title="Active Campaigns"
              value={campaignsData?.total?.toString() || "0"}
              description={`${campaignsData?.percentageChange.toFixed(1)}% from last month`}
              type={campaignsData?.percentageChange >= 0 ? "increase" : "decrease"}
              icon={BarChart3}
              link="/campaigns"
            />
            <StatsCard
              title="Total Creators"
              value={creatorsData?.total?.toString() || "0"}
              description={`${creatorsData?.percentageChange.toFixed(1)}% from last month`}
              type={creatorsData?.percentageChange >= 0 ? "increase" : "decrease"}
              icon={Users}
              link="/creators"
            />
            <StatsCard
              title="Products Tracked"
              value={productsData?.total?.toString() || "0"}
              description={`${productsData?.percentageChange.toFixed(1)}% from last month`}
              type={productsData?.percentageChange >= 0 ? "increase" : "decrease"}
              icon={Package}
              link="/products"
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ActiveCampaigns campaigns={campaignsData?.campaigns} />
            </div>
            <div>
              <RecentCreators creators={creatorsData?.creators} />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;