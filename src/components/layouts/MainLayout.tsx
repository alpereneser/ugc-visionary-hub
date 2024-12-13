import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TrialExpiredOverlay } from "@/components/TrialExpiredOverlay";

interface MainLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
}

export const MainLayout = ({ children, showHeader = true }: MainLayoutProps) => {
  const session = useSession();

  const { data: license } = useQuery({
    queryKey: ["user-license", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from("user_licenses")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const hasLifetimeAccess = license?.has_lifetime_access;
  const isTrialActive = license && new Date(license.trial_end_date) > new Date();
  const showOverlay = session && !isTrialActive && !hasLifetimeAccess;

  // Filter out the Pricing component if user has lifetime access
  const filteredChildren = React.Children.map(children, child => {
    if (React.isValidElement(child) && hasLifetimeAccess) {
      const childrenArray = React.Children.toArray(child.props.children);
      const filteredGrandChildren = childrenArray.filter(grandChild => {
        if (!React.isValidElement(grandChild)) return false;
        const componentType = grandChild.type as { name?: string };
        return componentType.name !== 'Pricing';
      });
      
      return React.cloneElement(child, {
        ...child.props,
        children: filteredGrandChildren
      });
    }
    return child;
  });

  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <Header />}
      <main className={`flex-grow ${showHeader ? 'pt-16' : ''} relative`}>
        {filteredChildren}
        {showOverlay && <TrialExpiredOverlay />}
      </main>
      <Footer />
    </div>
  );
};