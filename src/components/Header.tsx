import { Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UserMenu } from "./header/UserMenu";
import { NavigationItems, navigationItems } from "./header/NavigationItems";

export const Header = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      // Clear any local storage data first
      localStorage.clear();
      
      // Attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Always navigate to login page
      navigate("/login", { replace: true });
      toast.success("Successfully logged out");
    } catch (error: any) {
      console.error("Logout failed:", error);
      // Even if there's an error, we want to clear local state and redirect
      localStorage.clear();
      navigate("/login", { replace: true });
      toast.error("An error occurred during logout, but you've been redirected to login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLogoClick = () => {
    if (session) {
      navigate('/home');
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      if (!session?.user?.id) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;
        if (data) setFullName(data.full_name || "");
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    loadProfile();
  }, [session, supabase]);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div 
            onClick={handleLogoClick}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <span className="font-['Montserrat'] font-bold text-xl">TRACEFLUENCE</span>
          </div>

          {session ? (
            <>
              <NavigationItems />
              
              {/* Mobile Navigation */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-4 mt-4">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-accent"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.icon && <item.icon className="w-4 h-4" />}
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>

              <UserMenu 
                fullName={fullName} 
                email={session.user.email} 
                onLogout={handleLogout}
              />
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link 
                to="/login" 
                className="text-foreground hover:text-primary transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-primary text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};