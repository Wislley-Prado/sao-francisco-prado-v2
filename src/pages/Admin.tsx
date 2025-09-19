import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AdminRanchos } from '@/components/admin/AdminRanchos';
import { AdminPacotes } from '@/components/admin/AdminPacotes';
import { AdminLoja } from '@/components/admin/AdminLoja';
import { AdminConfiguracoes } from '@/components/admin/AdminConfiguracoes';

type AdminView = 'dashboard' | 'ranchos' | 'pacotes' | 'loja' | 'configuracoes';

const Admin = () => {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'ranchos':
        return <AdminRanchos />;
      case 'pacotes':
        return <AdminPacotes />;
      case 'loja':
        return <AdminLoja />;
      case 'configuracoes':
        return <AdminConfiguracoes />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50/50">
        <AdminSidebar currentView={currentView} onViewChange={setCurrentView} />
        
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          
          <main className="flex-1 p-6">
            {renderCurrentView()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Admin;