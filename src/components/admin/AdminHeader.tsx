import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminProfileDialog } from './AdminProfileDialog';

const getBreadcrumbs = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ name: 'Admin', path: '/admin' }];

  if (segments.length > 1) {
    const section = segments[1];
    const sectionName = section.charAt(0).toUpperCase() + section.slice(1);
    breadcrumbs.push({ name: sectionName, path: `/admin/${section}` });

    if (segments.length > 2) {
      const action = segments[2];
      if (action === 'novo') {
        breadcrumbs.push({ name: 'Novo', path: pathname });
      } else {
        breadcrumbs.push({ name: 'Editar', path: pathname });
      }
    }
  }

  return breadcrumbs;
};

export const AdminHeader = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const breadcrumbs = getBreadcrumbs(location.pathname);

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0];
  const avatarUrl = user?.user_metadata?.avatar_url;

  const userInitials = displayName
    ?.substring(0, 2)
    .toUpperCase() || 'AD';

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.path} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
            <Link
              to={crumb.path}
              className={
                index === breadcrumbs.length - 1
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }
            >
              {crumb.name}
            </Link>
          </div>
        ))}
      </nav>

      {/* User Info Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-3 outline-none hover:bg-muted/50 p-2 rounded-md transition-colors cursor-pointer group">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{displayName}</p>
            <p className="text-xs text-muted-foreground">Administrador</p>
          </div>
          <Avatar className="group-hover:ring-2 group-hover:ring-primary/20 transition-all">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName || 'Avatar'} className="object-cover" />}
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-56 mt-1">
          <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setProfileOpen(true)} className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Editar Meu Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()} className="text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair do Painel</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AdminProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
    </header>
  );
};
