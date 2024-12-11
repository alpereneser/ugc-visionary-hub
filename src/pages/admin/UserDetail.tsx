import { MainLayout } from "@/components/layouts/MainLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const { data: user, error } = await supabase
        .from("users")
        .select(`
          *,
          user_licenses (*)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return user;
    },
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div>Loading...</div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div>User not found</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-bold">User Details</h1>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <span className="font-medium">Email:</span>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                  <div>
                    <span className="font-medium">Created At:</span>
                    <p className="text-muted-foreground">
                      {format(new Date(user.created_at), "PPpp")}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Last Sign In:</span>
                    <p className="text-muted-foreground">
                      {user.last_sign_in_at
                        ? format(new Date(user.last_sign_in_at), "PPpp")
                        : "Never"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {user.user_licenses && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">License Information</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="font-medium">License Type:</span>
                      <p className="text-muted-foreground">
                        {user.user_licenses.has_lifetime_access
                          ? "Lifetime License"
                          : "Trial"}
                      </p>
                    </div>
                    {!user.user_licenses.has_lifetime_access && (
                      <div>
                        <span className="font-medium">Trial End Date:</span>
                        <p className="text-muted-foreground">
                          {format(new Date(user.user_licenses.trial_end_date), "PPpp")}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserDetail;