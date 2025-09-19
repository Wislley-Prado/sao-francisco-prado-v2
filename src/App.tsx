
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PWALifecycle } from "@/components/PWALifecycle";
import CookieConsent from "@/components/CookieConsent";
import Index from "./pages/Index";
import LiveStream from "./pages/LiveStream";
import PackageVip from "./pages/PackageVip";
import PackageLuxo from "./pages/PackageLuxo";
import PackageDiamante from "./pages/PackageDiamante";
import PackagesIndex from "./pages/PackagesIndex";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";

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
          <Toaster />
          <Sonner />
          <PWALifecycle />
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/live" element={<LiveStream />} />
            <Route path="/pacotes" element={<PackagesIndex />} />
            <Route path="/pacote/vip" element={<PackageVip />} />
            <Route path="/pacote/luxo" element={<PackageLuxo />} />
            <Route path="/pacote/diamante" element={<PackageDiamante />} />
            <Route path="/politica-privacidade" element={<PrivacyPolicy />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            {/* Backward compatibility */}
            <Route path="/pacote-vip" element={<PackageVip />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CookieConsent />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
};

export default App;
