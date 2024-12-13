import { AdminActions } from "./AdminActions";
import { UserActions } from "./UserActions";

export const DashboardHeader = () => {
  return (
    <div className="flex flex-col gap-4 mb-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <div className="flex flex-wrap gap-2 w-full">
          <UserActions />
        </div>
        <div className="flex flex-wrap gap-2">
          <AdminActions />
        </div>
      </div>
    </div>
  );
};