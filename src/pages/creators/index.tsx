import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Creators = () => {
  const navigate = useNavigate();

  const { data: creators, isLoading } = useQuery({
    queryKey: ["creators"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ugc_creators")
        .select(`
          *,
          social_media_profiles (*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Creators</h1>
          <Button onClick={() => navigate("/creators/new")}>
            <Plus className="w-4 h-4 mr-2" />
            Add Creator
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <p>Loading creators...</p>
          </div>
        ) : (
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
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Mail className="w-4 h-4" />
                      <span>{creator.email}</span>
                    </div>
                  )}
                  {creator.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{creator.phone}</span>
                    </div>
                  )}
                  {creator.social_media_profiles && creator.social_media_profiles.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-muted-foreground">
                        {creator.social_media_profiles.length} social media {creator.social_media_profiles.length === 1 ? 'profile' : 'profiles'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {creators?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No creators found</p>
            <Button onClick={() => navigate("/creators/new")}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Creator
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Creators;