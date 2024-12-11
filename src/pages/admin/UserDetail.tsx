import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

const UserDetail = () => {
  const { id } = useParams();

  const { data: user, isLoading } = useQuery({
    queryKey: ["admin-user", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading user details...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">User Details</h1>
        <Card>
          <CardHeader>
            <CardTitle>{user.full_name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Company</p>
              <p>{user.company || "Not specified"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Joined Date</p>
              <p>{format(new Date(user.created_at), "MMMM d, yyyy")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default UserDetail;