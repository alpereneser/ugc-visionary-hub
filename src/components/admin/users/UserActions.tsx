import { Button } from "@/components/ui/button";
import { Eye, Key, Trash } from "lucide-react";

interface UserActionsProps {
  onView: () => void;
  onResetPassword: () => void;
  onDelete: () => void;
  isResettingPassword: boolean;
}

export const UserActions = ({
  onView,
  onResetPassword,
  onDelete,
  isResettingPassword,
}: UserActionsProps) => {
  return (
    <div className="flex gap-2 flex-nowrap">
      <Button
        variant="ghost"
        size="icon"
        onClick={onView}
        className="h-8 w-8"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onResetPassword}
        disabled={isResettingPassword}
        className="h-8 w-8"
      >
        <Key className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="h-8 w-8"
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};