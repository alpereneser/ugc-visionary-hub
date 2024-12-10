import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, Flag, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Home = () => {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  if (!session) {
    return null;
  }

  const stats = [
    {
      title: "UGC Creators",
      value: "0",
      icon: Users,
      link: "/creators",
    },
    {
      title: "Products",
      value: "0",
      icon: Package,
      link: "/products",
    },
    {
      title: "Active Campaigns",
      value: "0",
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
            <Card key={stat.title} className="hover:bg-accent/50 cursor-pointer transition-colors" onClick={() => navigate(stat.link)}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
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
              <p className="text-muted-foreground">No creators yet</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No active campaigns</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Home;