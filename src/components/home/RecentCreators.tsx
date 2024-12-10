import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";

interface RecentCreatorsProps {
  creators?: Tables<"ugc_creators">[];
}

export const RecentCreators = ({ creators }: RecentCreatorsProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent UGC Creators</CardTitle>
      </CardHeader>
      <CardContent>
        {creators && creators.length > 0 ? (
          <div className="space-y-4">
            {creators.map((creator) => (
              <div
                key={creator.id}
                className="flex items-center justify-between hover:bg-accent/50 p-2 rounded-lg cursor-pointer"
                onClick={() => navigate(`/creators/${creator.id}`)}
              >
                <div>
                  <p className="font-medium">
                    {creator.first_name} {creator.last_name}
                  </p>
                  {creator.email && (
                    <p className="text-sm text-muted-foreground">
                      {creator.email}
                    </p>
                  )}
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No creators yet</p>
        )}
      </CardContent>
    </Card>
  );
};