import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Instagram, Facebook, Globe, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const FOLLOWER_RANGES = [
  { min: 0, max: 10000, label: "0 - 10K" },
  { min: 10000, max: 50000, label: "10K - 50K" },
  { min: 50000, max: 100000, label: "50K - 100K" },
  { min: 100000, max: 500000, label: "100K - 500K" },
  { min: 500000, max: 1000000, label: "500K - 1M" },
  { min: 1000000, max: null, label: "1M+" },
];

const PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: Instagram },
  { id: "facebook", label: "Facebook", icon: Facebook },
  { id: "other", label: "Other", icon: Globe },
];

const Creators = () => {
  const navigate = useNavigate();
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [followerRange, setFollowerRange] = useState<number[]>([0, 1000000]);

  const { data: creators, isLoading } = useQuery({
    queryKey: ["creators", selectedPlatform, followerRange],
    queryFn: async () => {
      let query = supabase
        .from("ugc_creators")
        .select(`
          *,
          social_media_profiles (
            id,
            platform,
            username,
            followers_count
          )
        `);

      if (selectedPlatform) {
        query = query.contains("social_media_profiles", [
          { platform: selectedPlatform },
        ]);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data?.filter((creator) => {
        if (!creator.social_media_profiles?.length) return false;
        
        return creator.social_media_profiles.some(
          (profile: any) =>
            (!selectedPlatform || profile.platform === selectedPlatform) &&
            profile.followers_count >= followerRange[0] &&
            (followerRange[1] === null || profile.followers_count <= followerRange[1])
        );
      });
    },
  });

  const getSocialIcon = (platform: string) => {
    const platformConfig = PLATFORMS.find((p) => p.id === platform);
    const Icon = platformConfig?.icon || Globe;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Creators</h1>
          <Button onClick={() => navigate("/creators/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Creator
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Social Platform
            </label>
            <Select
              value={selectedPlatform}
              onValueChange={setSelectedPlatform}
            >
              <SelectTrigger>
                <SelectValue placeholder="All platforms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All platforms</SelectItem>
                {PLATFORMS.map((platform) => (
                  <SelectItem key={platform.id} value={platform.id}>
                    <div className="flex items-center gap-2">
                      <platform.icon className="h-4 w-4" />
                      {platform.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2">
            <label className="text-sm font-medium mb-2 block">
              Followers Range
            </label>
            <Slider
              min={0}
              max={1000000}
              step={1000}
              value={followerRange}
              onValueChange={setFollowerRange}
              className="mt-4"
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>{followerRange[0].toLocaleString()}</span>
              <span>{followerRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {creators?.map((creator) => (
              <Card
                key={creator.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/creators/${creator.id}`)}
              >
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    {creator.first_name} {creator.last_name}
                  </h3>
                  <div className="space-y-2">
                    {creator.social_media_profiles?.map((profile: any) => (
                      <div
                        key={profile.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {getSocialIcon(profile.platform)}
                          <span>{profile.username}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {profile.followers_count?.toLocaleString()} followers
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Creators;