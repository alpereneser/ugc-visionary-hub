import { MainLayout } from "@/components/layouts/MainLayout";
import { AdminTabs } from "@/components/admin/AdminTabs";

const AdminDashboard = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="w-full overflow-x-auto">
          <AdminTabs />
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;