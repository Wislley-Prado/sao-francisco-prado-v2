import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Home, 
  Package, 
  FileText, 
  LogOut,
  Fish,
  Settings,
  Star,
  BarChart3,
  TrendingUp,
  HelpCircle,
  MessageSquare,
  MessageCircle,
  BookOpen,
  Megaphone,
  Video,
  Users
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Ranchos', href: '/admin/ranchos', icon: Home },
  { name: 'Pacotes', href: '/admin/pacotes', icon: Package },
  { name: 'Anúncios', href: '/admin/anuncios', icon: Megaphone },
  { name: 'Avaliações', href: '/admin/avaliacoes', icon: Star },
  { name: 'Estatísticas', href: '/admin/estatisticas-avaliacoes', icon: TrendingUp },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Blog', href: '/admin/blog', icon: FileText },
  { name: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
  { name: 'Depoimentos', href: '/admin/depoimentos', icon: MessageSquare },
  { name: 'WhatsApp Config', href: '/admin/whatsapp-config', icon: MessageCircle },
  { name: 'WhatsApp Analytics', href: '/admin/whatsapp-analytics', icon: TrendingUp },
  { name: 'Manual', href: '/admin/ajuda', icon: BookOpen },
  { name: 'Configurações', href: '/admin/configuracoes', icon: Settings },
  { name: 'Vídeos', href: '/admin/videos', icon: Video },
];

// Super Admin only navigation item
const superAdminNavigation = [
  { name: 'Administradores', href: '/admin/administradores', icon: Users },
];

export const AdminSidebar = () => {
  const location = useLocation();
  const { signOut, isSuperAdmin } = useAuth();

  return (
    <aside className="w-64 border-r bg-card flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Fish className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">Rancho Prado</h1>
            <p className="text-xs text-muted-foreground">Painel Admin</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
        
        {/* Super Admin Only Section */}
        {isSuperAdmin && (
          <>
            <Separator className="my-2" />
            <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Super Admin
            </p>
            {superAdminNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-amber-500 text-white'
                      : 'text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      <Separator />

      {/* Logout Button */}
      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={signOut}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sair
        </Button>
      </div>
    </aside>
  );
};
