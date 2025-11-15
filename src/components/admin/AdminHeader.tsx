import { useLocation, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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
  const { user } = useAuth();
  const breadcrumbs = getBreadcrumbs(location.pathname);

  const userInitials = user?.email
    ?.split('@')[0]
    .substring(0, 2)
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

      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">{user?.email}</p>
          <p className="text-xs text-muted-foreground">Administrador</p>
        </div>
        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground">
            {userInitials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};
