import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Settings from "./pages/Settings";
import Home from "./pages/Home";
import Creators from "./pages/Creators";
import NewCreator from "./pages/creators/new";
import CreatorDetail from "./pages/creators/[id]";
import EditCreator from "./pages/creators/edit/[id]";
import Products from "./pages/products";
import NewProduct from "./pages/products/new";
import ProductDetail from "./pages/products/[id]";
import EditProduct from "./pages/products/edit/[id]";
import Campaigns from "./pages/campaigns";
import NewCampaign from "./pages/campaigns/new";
import CampaignDetail from "./pages/campaigns/[id]";
import EditCampaign from "./pages/campaigns/edit/[id]";
import { supabase } from "./integrations/supabase/client";
import { useEffect } from "react";

const queryClient = new QueryClient();

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const handleAuthStateChange = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = '/login';
    }
  };

  useEffect(() => {
    handleAuthStateChange();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        window.location.href = '/login';
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase} initialSession={null}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/settings"
                element={
                  <AuthWrapper>
                    <Settings />
                  </AuthWrapper>
                }
              />
              <Route
                path="/home"
                element={
                  <AuthWrapper>
                    <Home />
                  </AuthWrapper>
                }
              />
              <Route
                path="/creators"
                element={
                  <AuthWrapper>
                    <Creators />
                  </AuthWrapper>
                }
              />
              <Route
                path="/creators/new"
                element={
                  <AuthWrapper>
                    <NewCreator />
                  </AuthWrapper>
                }
              />
              <Route
                path="/creators/:id"
                element={
                  <AuthWrapper>
                    <CreatorDetail />
                  </AuthWrapper>
                }
              />
              <Route
                path="/creators/edit/:id"
                element={
                  <AuthWrapper>
                    <EditCreator />
                  </AuthWrapper>
                }
              />
              <Route
                path="/products"
                element={
                  <AuthWrapper>
                    <Products />
                  </AuthWrapper>
                }
              />
              <Route
                path="/products/new"
                element={
                  <AuthWrapper>
                    <NewProduct />
                  </AuthWrapper>
                }
              />
              <Route
                path="/products/:id"
                element={
                  <AuthWrapper>
                    <ProductDetail />
                  </AuthWrapper>
                }
              />
              <Route
                path="/products/edit/:id"
                element={
                  <AuthWrapper>
                    <EditProduct />
                  </AuthWrapper>
                }
              />
              <Route
                path="/campaigns"
                element={
                  <AuthWrapper>
                    <Campaigns />
                  </AuthWrapper>
                }
              />
              <Route
                path="/campaigns/new"
                element={
                  <AuthWrapper>
                    <NewCampaign />
                  </AuthWrapper>
                }
              />
              <Route
                path="/campaigns/:id"
                element={
                  <AuthWrapper>
                    <CampaignDetail />
                  </AuthWrapper>
                }
              />
              <Route
                path="/campaigns/edit/:id"
                element={
                  <AuthWrapper>
                    <EditCampaign />
                  </AuthWrapper>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
};

export default App;
