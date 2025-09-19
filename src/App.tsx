
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PWALifecycle } from "@/components/PWALifecycle";
import CookieConsent from "@/components/CookieConsent";
import { AuthProvider } from "@/contexts/AuthContext";
import { Suspense, lazy } from "react";
import Index from "./pages/Index";
import LiveStream from "./pages/LiveStream";
import PackageVip from "./pages/PackageVip";
import PackageLuxo from "./pages/PackageLuxo";
import PackageDiamante from "./pages/PackageDiamante";
import PackagesIndex from "./pages/PackagesIndex";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";

// Lazy load admin components
const Admin = lazy(() => import("./pages/Admin"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const App = () => {
  console.log('🚀 App: Starting with PWA support');
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <Toaster />
              <Sonner />
              <PWALifecycle />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/live" element={<LiveStream />} />
                <Route path="/pacotes" element={<PackagesIndex />} />
                <Route path="/pacote/vip" element={<PackageVip />} />
                <Route path="/pacote/luxo" element={<PackageLuxo />} />
                <Route path="/pacote/diamante" element={<PackageDiamante />} />
                <Route path="/politica-privacidade" element={<PrivacyPolicy />} />
                <Route path="/admin" element={
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
                  </div>}>
                    <Admin />
                  </Suspense>
                } />
                <Route path="/admin/login" element={
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
                  </div>}>
                    <AdminLogin />
                  </Suspense>
                } />
                {/* Backward compatibility */}
                <Route path="/pacote-vip" element={<PackageVip />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <CookieConsent />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
);
};

export default App;
