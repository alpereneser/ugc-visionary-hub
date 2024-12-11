import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CreatorActions } from "@/components/creators/CreatorActions";

const CreatorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: creator, isLoading } = useQuery({
    queryKey: ["creator", id],
    queryFn: async () => {
      const { data: creator, error } = await supabase
        .from("ugc_creators")
        .select(`
          *,
          social_media_profiles (*)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return creator;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!creator) {
    return <div>Creator not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-3xl font-bold">
                {creator?.first_name} {creator?.last_name}
              </h1>
            </div>
            <CreatorActions creatorId={creator?.id} />
          </div>

          <div className="grid gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <span className="font-medium">Email:</span>
                    <p className="text-muted-foreground">{creator.email}</p>
                  </div>
                  {creator.phone && (
                    <div>
                      <span className="font-medium">Phone:</span>
                      <p className="text-muted-foreground">{creator.phone}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {creator.social_media_profiles && creator.social_media_profiles.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Social Media Profiles</h3>
                  <div className="space-y-4">
                    {creator.social_media_profiles.map((profile: any) => (
                      <div key={profile.id} className="flex items-center justify-between">
                        <div>
                          <span className="font-medium capitalize">
                            {profile.platform}:
                          </span>
                          <p className="text-muted-foreground">
                            {profile.username}
                          </p>
                        </div>
                        {profile.url && (
                          <a
                            href={profile.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            Visit Profile
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {creator.bio && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Bio</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {creator.bio}
                  </p>
                </CardContent>
              </Card>
            )}

            {creator.interests && creator.interests.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {creator.interests.map((interest: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatorDetail;