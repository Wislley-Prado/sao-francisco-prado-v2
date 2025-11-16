import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PWALifecycle } from "@/components/PWALifecycle";
import CookieConsent from "@/components/CookieConsent";
import TrackingScripts from "@/components/TrackingScripts";
import { AuthProvider } from "@/contexts/AuthContext";
import { PrivateRoute } from "@/components/admin/PrivateRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Index from "./pages/Index";
import LiveStream from "./pages/LiveStream";
import RanchoDetalhes from "./pages/RanchoDetalhes";
import PackageVip from "./pages/PackageVip";
import PackageLuxo from "./pages/PackageLuxo";
import PackageDiamante from "./pages/PackageDiamante";
import PackagesIndex from "./pages/PackagesIndex";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminRanchos from "./pages/admin/Ranchos";
import RanchoNovo from "./pages/admin/RanchoNovo";
import RanchoEditar from "./pages/admin/RanchoEditar";
import AdminPacotes from "./pages/admin/Pacotes";
import AdminBlog from "./pages/admin/Blog";
import AdminConfiguracoes from "./pages/admin/Configuracoes";
import NotFound from "./pages/NotFound";

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
          <TrackingScripts />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/live" element={<LiveStream />} />
                <Route path="/rancho/:slug" element={<RanchoDetalhes />} />
                <Route path="/pacotes" element={<PackagesIndex />} />
                <Route path="/pacote/vip" element={<PackageVip />} />
                <Route path="/pacote/luxo" element={<PackageLuxo />} />
                <Route path="/pacote/diamante" element={<PackageDiamante />} />
                <Route path="/politica-privacidade" element={<PrivacyPolicy />} />
                {/* Backward compatibility */}
                <Route path="/pacote-vip" element={<PackageVip />} />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route 
                  path="/admin" 
                  element={
                    <PrivateRoute>
                      <AdminLayout />
                    </PrivateRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="ranchos" element={<AdminRanchos />} />
                  <Route path="ranchos/novo" element={<RanchoNovo />} />
                  <Route path="ranchos/editar/:id" element={<RanchoEditar />} />
                  <Route path="pacotes" element={<AdminPacotes />} />
                  <Route path="blog" element={<AdminBlog />} />
                  <Route path="configuracoes" element={<AdminConfiguracoes />} />
                </Route>
                
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
