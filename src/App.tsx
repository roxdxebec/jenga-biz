import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import PasswordReset from "./pages/PasswordReset";
import FinancialTrackerPage from "./pages/FinancialTracker";
import Templates from "./pages/Templates";
import Strategy from "./pages/Strategy";
import Milestones from "./pages/Milestones";
import Profile from "./pages/Profile";
import SaaSFeatures from "./components/SaaSFeatures";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<PasswordReset />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/strategy" element={<Strategy />} />
            <Route path="/milestones" element={<Milestones />} />
            <Route path="/financial-tracker" element={<FinancialTrackerPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/saas" element={<SaaSFeatures onSignOut={() => {}} />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
