import { AdminActions } from "./AdminActions";
import { UserActions } from "./UserActions";

export const DashboardHeader = () => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="flex gap-3">
        <UserActions />
        <AdminActions />
      </div>
    </div>
  );
};