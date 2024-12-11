import { Layout, Users, Package, Flag } from "lucide-react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";

export const navigationItems = [
  { path: '/home', label: 'Dashboard', icon: Layout },
  { path: '/creators', label: 'Creators', icon: Users },
  { path: '/products', label: 'Products', icon: Package },
  { path: '/campaigns', label: 'Campaigns', icon: Flag },
];

export const NavigationItems = () => {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {navigationItems.map((item) => (
          <NavigationMenuItem key={item.path}>
            <Link 
              to={item.path} 
              className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
            >
              {item.icon && <item.icon className="w-4 h-4 mr-2" />}
              {item.label}
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};