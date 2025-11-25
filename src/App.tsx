import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PWALifecycle } from "@/components/PWALifecycle";
import { ScrollToTop } from "@/components/ScrollToTop";
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
import PackagesIndexDynamic from "./pages/PackagesIndexDynamic";
import PacoteDetalhes from "./pages/PacoteDetalhes";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminRanchos from "./pages/admin/Ranchos";
import RanchoNovo from "./pages/admin/RanchoNovo";
import RanchoEditar from "./pages/admin/RanchoEditar";
import AdminPacotes from "./pages/admin/Pacotes";
import PacoteNovo from "./pages/admin/PacoteNovo";
import PacoteEditar from "./pages/admin/PacoteEditar";
import PacoteAnalytics from "./pages/admin/PacoteAnalytics";
import AdminBlog from "./pages/admin/Blog";
import BlogNovo from "./pages/admin/BlogNovo";
import BlogEditar from "./pages/admin/BlogEditar";
import BlogAnalytics from "./pages/admin/BlogAnalytics";
import AdminConfiguracoes from "./pages/admin/Configuracoes";
import WhatsAppConfig from "./pages/admin/WhatsAppConfig";
import WhatsAppAnalytics from "./pages/admin/WhatsAppAnalytics";
import Ajuda from "./pages/admin/Ajuda";
import PropriedadesVenda from "./pages/admin/PropriedadesVenda";
import PropriedadeVendaNova from "./pages/admin/PropriedadeVendaNova";
import PropriedadeVendaEditar from "./pages/admin/PropriedadeVendaEditar";
import Anuncios from "./pages/admin/Anuncios";
import AnuncioNovo from "./pages/admin/AnuncioNovo";
import AnuncioEditar from "./pages/admin/AnuncioEditar";
import AdminAvaliacoes from "./pages/admin/Avaliacoes";
import EstatisticasAvaliacoes from "./pages/admin/EstatisticasAvaliacoes";
import AdminAnalytics from "./pages/admin/Analytics";
import FAQs from "./pages/admin/FAQs";
import FAQNovo from "./pages/admin/FAQNovo";
import FAQEditar from "./pages/admin/FAQEditar";
import Depoimentos from "./pages/admin/Depoimentos";
import DepoimentoNovo from "./pages/admin/DepoimentoNovo";
import DepoimentoEditar from "./pages/admin/DepoimentoEditar";
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
            <ScrollToTop />
            <AuthProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/live" element={<LiveStream />} />
                <Route path="/rancho/:slug" element={<RanchoDetalhes />} />
                <Route path="/pacotes" element={<PackagesIndexDynamic />} />
                <Route path="/pacote/:slug" element={<PacoteDetalhes />} />
                {/* Páginas estáticas antigas (manter para compatibilidade) */}
                <Route path="/pacotes-estaticos" element={<PackagesIndex />} />
                <Route path="/pacote/vip" element={<PackageVip />} />
                <Route path="/pacote/luxo" element={<PackageLuxo />} />
                <Route path="/pacote/diamante" element={<PackageDiamante />} />
                <Route path="/politica-privacidade" element={<PrivacyPolicy />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
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
                  <Route path="pacotes/novo" element={<PacoteNovo />} />
                  <Route path="pacotes/:id/editar" element={<PacoteEditar />} />
                  <Route path="pacotes/analytics" element={<PacoteAnalytics />} />
                  <Route path="avaliacoes" element={<AdminAvaliacoes />} />
                  <Route path="estatisticas-avaliacoes" element={<EstatisticasAvaliacoes />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="blog" element={<AdminBlog />} />
                  <Route path="blog/novo" element={<BlogNovo />} />
                  <Route path="blog/editar/:id" element={<BlogEditar />} />
                  <Route path="blog/analytics" element={<BlogAnalytics />} />
                  <Route path="faqs" element={<FAQs />} />
                  <Route path="faqs/novo" element={<FAQNovo />} />
                  <Route path="faqs/editar/:id" element={<FAQEditar />} />
                  <Route path="depoimentos" element={<Depoimentos />} />
                  <Route path="depoimentos/novo" element={<DepoimentoNovo />} />
                  <Route path="depoimentos/editar/:id" element={<DepoimentoEditar />} />
                  <Route path="propriedades-venda" element={<PropriedadesVenda />} />
                  <Route path="propriedades-venda/novo" element={<PropriedadeVendaNova />} />
                  <Route path="propriedades-venda/editar/:id" element={<PropriedadeVendaEditar />} />
                  <Route path="anuncios" element={<Anuncios />} />
                  <Route path="anuncios/novo" element={<AnuncioNovo />} />
                  <Route path="anuncios/editar/:id" element={<AnuncioEditar />} />
                  <Route path="configuracoes" element={<AdminConfiguracoes />} />
                  <Route path="whatsapp-config" element={<WhatsAppConfig />} />
                  <Route path="whatsapp-analytics" element={<WhatsAppAnalytics />} />
                  <Route path="ajuda" element={<Ajuda />} />
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
