import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface UserMenuProps {
  fullName: string;
  email?: string;
  onLogout: () => Promise<void>;
}

export const UserMenu = ({ fullName, email, onLogout }: UserMenuProps) => {
  const navigate = useNavigate();
  const getInitials = (name: string) => {
    if (!name) return "T";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="border border-gray-200">
                {getInitials(fullName)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>{fullName || email}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/settings')} className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/feedback')} className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Feedback</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onLogout} className="flex items-center text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <span className="text-sm font-medium hidden md:block border border-gray-200 rounded-[10px] py-2 px-4">
        {fullName || email}
      </span>
    </div>
  );
};