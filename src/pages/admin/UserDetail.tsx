import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layouts/MainLayout";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

interface UserLicense {
  id: string;
  user_id: string | null;
  trial_start_date: string | null;
  trial_end_date: string | null;
  has_lifetime_access: boolean | null;
  payment_status: string | null;
  created_at: string | null;
  updated_at: string | null;
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

  const { data: user, isLoading } = useQuery({
    queryKey: ["user-detail", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          user_licenses (*)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as UserProfile;
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
              <h2 className="text-xl font-semibold mb-4">License Information</h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">License Status:</span>{" "}
                  {license?.has_lifetime_access ? "Lifetime Access" : "Trial"}
                </p>
                <p>
                  <span className="font-medium">Payment Status:</span>{" "}
                  {license?.payment_status}
                </p>
                {!license?.has_lifetime_access && (
                  <p>
                    <span className="font-medium">Trial Ends:</span>{" "}
                    {license?.trial_end_date
                      ? format(new Date(license.trial_end_date), "PPP")
                      : "Not available"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserDetail;