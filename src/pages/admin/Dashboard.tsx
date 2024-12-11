import { MainLayout } from "@/components/layouts/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users, Package, BarChart3, Plus } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const fetchCount = async (table: string) => {
        const { count } = await supabase
          .from(table)
          .select("*", { count: 'exact', head: true });
        return count || 0;
      };

      const [creatorsCount, productsCount, campaignsCount] = await Promise.all([
        fetchCount("ugc_creators"),
        fetchCount("products"),
        fetchCount("campaigns"),
      ]);

      return {
        creators: creatorsCount,
        products: productsCount,
        campaigns: campaignsCount,
      };
    },
  });

  const { data: recentProfiles } = useQuery({
    queryKey: ["recent-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            Loading...
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-3">
            <Button
              onClick={() => navigate("/creators/new")}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Creator
            </Button>
            <Button
              onClick={() => navigate("/products/new")}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
            <Button
              onClick={() => navigate("/campaigns/new")}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Campaign
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Creators</p>
                  <h3 className="text-2xl font-bold">{stats?.creators}</h3>
                </div>
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                  <h3 className="text-2xl font-bold">{stats?.products}</h3>
                </div>
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Campaigns</p>
                  <h3 className="text-2xl font-bold">{stats?.campaigns}</h3>
                </div>
                <BarChart3 className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Recent Users</h3>
                <Button variant="outline" size="sm" onClick={() => navigate("/admin/users")}>
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {recentProfiles?.map((profile) => (
                  <div
                    key={profile.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{profile.email}</p>
                      <p className="text-sm text-muted-foreground">
                        Joined {new Date(profile.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/admin/users/${profile.id}`)}
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/creators/new")}
                >
                  Add New Creator
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/products/new")}
                >
                  Add New Product
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/campaigns/new")}
                >
                  Create New Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;