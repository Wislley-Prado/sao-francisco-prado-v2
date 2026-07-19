import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PWALifecycle } from "@/components/PWALifecycle";
import { DynamicFavicon } from "@/components/DynamicFavicon";
import { ScrollToTop } from "@/components/ScrollToTop";
import CookieConsent from "@/components/CookieConsent";
import TrackingScripts from "@/components/TrackingScripts";
import PageViewTracker from "@/components/PageViewTracker";
import { AuthProvider } from "@/contexts/AuthContext";
import { PrivateRoute } from "@/components/admin/PrivateRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

import { lazyWithRetry } from "@/utils/lazyWithRetry";

// Lazy load - public secondary pages
const LiveStream = lazyWithRetry(() => import("./pages/LiveStream"));
const RanchoDetalhes = lazyWithRetry(() => import("./pages/RanchoDetalhes"));
const PackageVip = lazyWithRetry(() => import("./pages/PackageVip"));
const PackageLuxo = lazyWithRetry(() => import("./pages/PackageLuxo"));
const PackageDiamante = lazyWithRetry(() => import("./pages/PackageDiamante"));
const RanchosIndex = lazyWithRetry(() => import("./pages/RanchosIndex"));
const PackagesIndex = lazyWithRetry(() => import("./pages/PackagesIndex"));
const PackagesIndexDynamic = lazyWithRetry(() => import("./pages/PackagesIndexDynamic"));
const PacoteDetalhes = lazyWithRetry(() => import("./pages/PacoteDetalhes"));
const PrivacyPolicy = lazyWithRetry(() => import("./pages/PrivacyPolicy"));
const Blog = lazyWithRetry(() => import("./pages/Blog"));
const BlogPost = lazyWithRetry(() => import("./pages/BlogPost"));
const VendasIndex = lazyWithRetry(() => import("./pages/VendasIndex"));
const PropriedadeDetalhes = lazyWithRetry(() => import("./pages/PropriedadeDetalhes"));

// Lazy load - admin pages
const AdminLogin = lazyWithRetry(() => import("./pages/admin/Login"));
const AdminDashboard = lazyWithRetry(() => import("./pages/admin/Dashboard"));
const AdminRanchos = lazyWithRetry(() => import("./pages/admin/Ranchos"));
const RanchoNovo = lazyWithRetry(() => import("./pages/admin/RanchoNovo"));
const RanchoEditar = lazyWithRetry(() => import("./pages/admin/RanchoEditar"));
const AdminPropriedadesVenda = lazyWithRetry(() => import("./pages/admin/PropriedadesVenda"));
const PropriedadeVendaNova = lazyWithRetry(() => import("./pages/admin/PropriedadeVendaNova"));
const PropriedadeVendaEditar = lazyWithRetry(() => import("./pages/admin/PropriedadeVendaEditar"));
const AdminPacotes = lazyWithRetry(() => import("./pages/admin/Pacotes"));
const PacoteNovo = lazyWithRetry(() => import("./pages/admin/PacoteNovo"));
const PacoteEditar = lazyWithRetry(() => import("./pages/admin/PacoteEditar"));
const PacoteAnalytics = lazyWithRetry(() => import("./pages/admin/PacoteAnalytics"));
const AdminBlog = lazyWithRetry(() => import("./pages/admin/Blog"));
const BlogNovo = lazyWithRetry(() => import("./pages/admin/BlogNovo"));
const BlogEditar = lazyWithRetry(() => import("./pages/admin/BlogEditar"));
const BlogAnalytics = lazyWithRetry(() => import("./pages/admin/BlogAnalytics"));
const AdminConfiguracoes = lazyWithRetry(() => import("./pages/admin/Configuracoes"));
const WhatsAppConfig = lazyWithRetry(() => import("./pages/admin/WhatsAppConfig"));
const WhatsAppAnalytics = lazyWithRetry(() => import("./pages/admin/WhatsAppAnalytics"));
const Ajuda = lazyWithRetry(() => import("./pages/admin/Ajuda"));
const ConfiguracoesVideos = lazyWithRetry(() => import("./pages/admin/ConfiguracoesVideos"));
const Anuncios = lazyWithRetry(() => import("./pages/admin/Anuncios"));
const AnuncioNovo = lazyWithRetry(() => import("./pages/admin/AnuncioNovo"));
const AnuncioEditar = lazyWithRetry(() => import("./pages/admin/AnuncioEditar"));
const AdminAvaliacoes = lazyWithRetry(() => import("./pages/admin/Avaliacoes"));
const EstatisticasAvaliacoes = lazyWithRetry(() => import("./pages/admin/EstatisticasAvaliacoes"));
const AdminAnalytics = lazyWithRetry(() => import("./pages/admin/Analytics"));
const FAQs = lazyWithRetry(() => import("./pages/admin/FAQs"));
const FAQNovo = lazyWithRetry(() => import("./pages/admin/FAQNovo"));
const FAQEditar = lazyWithRetry(() => import("./pages/admin/FAQEditar"));
const Depoimentos = lazyWithRetry(() => import("./pages/admin/Depoimentos"));
const DepoimentoNovo = lazyWithRetry(() => import("./pages/admin/DepoimentoNovo"));
const DepoimentoEditar = lazyWithRetry(() => import("./pages/admin/DepoimentoEditar"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15 * 60 * 1000,
      cacheTime: 60 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: 1,
    },
  },
});

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <PWALifecycle />
            <DynamicFavicon />
            <BrowserRouter>
            <ScrollToTop />
            <PageViewTracker />
            <AuthProvider>
              <TrackingScripts />
              <Suspense fallback={<PageFallback />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/live" element={<LiveStream />} />
                <Route path="/rancho/:slug" element={<RanchoDetalhes />} />
                <Route path="/pacotes" element={<PackagesIndexDynamic />} />
                <Route path="/ranchos" element={<RanchosIndex />} />
                <Route path="/pacote/:slug" element={<PacoteDetalhes />} />
                <Route path="/pacotes-estaticos" element={<PackagesIndex />} />
                <Route path="/pacote/vip" element={<PackageVip />} />
                <Route path="/pacote/luxo" element={<PackageLuxo />} />
                <Route path="/pacote/diamante" element={<PackageDiamante />} />
                <Route path="/politica-privacidade" element={<PrivacyPolicy />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/vendas" element={<VendasIndex />} />
                <Route path="/venda/:slug" element={<PropriedadeDetalhes />} />
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
                  <Route path="vendas" element={<AdminPropriedadesVenda />} />
                  <Route path="vendas/nova" element={<PropriedadeVendaNova />} />
                  <Route path="vendas/editar/:id" element={<PropriedadeVendaEditar />} />
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
                  <Route path="anuncios" element={<Anuncios />} />
                  <Route path="anuncios/novo" element={<AnuncioNovo />} />
                  <Route path="anuncios/editar/:id" element={<AnuncioEditar />} />
                  <Route path="configuracoes" element={<AdminConfiguracoes />} />
                  <Route path="whatsapp-config" element={<WhatsAppConfig />} />
                  <Route path="whatsapp-analytics" element={<WhatsAppAnalytics />} />
                  <Route path="videos" element={<ConfiguracoesVideos />} />
                  <Route path="ajuda" element={<Ajuda />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              </Suspense>
              <CookieConsent />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;