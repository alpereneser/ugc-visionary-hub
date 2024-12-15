import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserActions } from "./UserActions";

interface User {
  id: string;
  email: string;
  full_name: string;
  company: string;
  created_at: string;
}

interface UsersTableProps {
  users: User[] | null;
  onDeleteUser: (userId: string) => void;
  onResetPassword: (email: string) => void;
  isResettingPassword: boolean;
}

export const UsersTable = ({
  users,
  onDeleteUser,
  onResetPassword,
  isResettingPassword,
}: UsersTableProps) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-md border overflow-x-auto">
      <div className="min-w-[800px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Email</TableHead>
              <TableHead className="min-w-[150px]">Full Name</TableHead>
              <TableHead className="min-w-[150px]">Company</TableHead>
              <TableHead className="min-w-[120px]">Joined Date</TableHead>
              <TableHead className="min-w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium break-all">{user.email}</TableCell>
                <TableCell>{user.full_name}</TableCell>
                <TableCell>{user.company}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {format(new Date(user.created_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <UserActions
                    onView={() => navigate(`/admin/users/${user.id}`)}
                    onResetPassword={() => onResetPassword(user.email)}
                    onDelete={() => onDeleteUser(user.id)}
                    isResettingPassword={isResettingPassword}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};