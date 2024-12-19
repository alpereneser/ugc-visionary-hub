import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layouts/MainLayout";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface UserLicense {
  id: string;
  user_id: string | null;
  trial_start_date: string | null;
  trial_end_date: string | null;
  has_lifetime_access: boolean | null;
  payment_status: string | null;
  created_at: string | null;
  updated_at: string | null;
  profile_id: string;
}

interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  company: string | null;
  created_at: string;
  user_licenses: UserLicense[];
}

const UserDetail = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user-detail", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          user_licenses!user_licenses_profile_id_fkey (*)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as UserProfile;
    },
  });

  const updateLicenseMutation = useMutation({
    mutationFn: async ({ hasLifetimeAccess }: { hasLifetimeAccess: boolean }) => {
      if (!user?.user_licenses?.[0]?.id) return;

      const { error } = await supabase
        .from("user_licenses")
        .update({
          has_lifetime_access: hasLifetimeAccess,
          payment_status: hasLifetimeAccess ? "completed" : "pending",
        })
        .eq("id", user.user_licenses[0].id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-detail", id] });
      toast.success("License updated successfully");
    },
    onError: (error) => {
      console.error("Error updating license:", error);
      toast.error("Failed to update license");
    },
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">Loading...</div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">User not found</div>
      </MainLayout>
    );
  }

  const license = user.user_licenses?.[0];
  const hasLifetimeAccess = license?.has_lifetime_access || false;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">User Details</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-medium">Full Name:</span>{" "}
                  {user.full_name || "Not provided"}
                </p>
                <p>
                  <span className="font-medium">Company:</span>{" "}
                  {user.company || "Not provided"}
                </p>
                <p>
                  <span className="font-medium">Joined:</span>{" "}
                  {format(new Date(user.created_at), "PPP")}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">License Management</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Switch
                    id="lifetime-access"
                    checked={hasLifetimeAccess}
                    onCheckedChange={(checked) =>
                      updateLicenseMutation.mutate({ hasLifetimeAccess: checked })
                    }
                  />
                  <Label htmlFor="lifetime-access">Lifetime Access</Label>
                </div>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Current License:</span>{" "}
                    {hasLifetimeAccess ? "Lifetime Access" : "Trial"}
                  </p>
                  <p>
                    <span className="font-medium">Payment Status:</span>{" "}
                    {license?.payment_status}
                  </p>
                  {!hasLifetimeAccess && license?.trial_end_date && (
                    <p>
                      <span className="font-medium">Trial Ends:</span>{" "}
                      {format(new Date(license.trial_end_date), "PPP")}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserDetail;