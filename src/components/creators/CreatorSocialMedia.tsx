import { Instagram, Facebook, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SocialMediaProfile {
  id: string;
  platform: string;
  username: string;
  url?: string;
  followers_count?: number;
}

interface CreatorSocialMediaProps {
  profiles?: SocialMediaProfile[];
}

export const CreatorSocialMedia = ({ profiles }: CreatorSocialMediaProps) => {
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <Instagram className="h-4 w-4" />;
      case "facebook":
        return <Facebook className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Profiles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {profiles?.map((profile) => (
          <div key={profile.id} className="flex items-center gap-2">
            {getSocialIcon(profile.platform)}
            <a
              href={profile.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {profile.username}
            </a>
            {profile.followers_count && (
              <span className="text-sm text-muted-foreground">
                ({profile.followers_count.toLocaleString()} followers)
              </span>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};