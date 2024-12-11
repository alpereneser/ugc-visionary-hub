import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Creators = () => {
  const navigate = useNavigate();

  const { data: creators, isLoading } = useQuery({
    queryKey: ["creators"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ugc_creators")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">UGC Creators</h1>
          <Button onClick={() => navigate("/creators/new")}>
            <Plus className="w-4 h-4 mr-2" />
            New Creator
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {creators?.map((creator) => (
            <Card
              key={creator.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/creators/${creator.id}`)}
            >
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">
                  {creator.first_name} {creator.last_name}
                </h3>
                {creator.email && (
                  <p className="text-sm text-muted-foreground">{creator.email}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Creators;