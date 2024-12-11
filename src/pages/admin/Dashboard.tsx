import { MainLayout } from "@/components/layouts/MainLayout";
import { AdminTabs } from "@/components/admin/AdminTabs";

const AdminDashboard = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <AdminTabs />
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;