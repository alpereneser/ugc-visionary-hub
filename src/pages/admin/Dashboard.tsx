import { MainLayout } from "@/components/layouts/MainLayout";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AdminDashboard = () => {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session?.user?.email !== 'alperen@tracefluence.com') {
      navigate('/home');
    }
  }, [session, navigate]);

  if (session?.user?.email !== 'alperen@tracefluence.com') {
    return null;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <AdminTabs />
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;