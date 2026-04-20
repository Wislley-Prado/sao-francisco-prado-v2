import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface PackagePageLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
  hero?: ReactNode;
}

export const PackagePageLayout = ({ children, sidebar, hero }: PackagePageLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container max-w-7xl mx-auto px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/pacotes')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para pacotes
          </Button>
        </div>
      </div>

      {/* Hero Content (Full Width) */}
      {hero && (
        <div className="w-full">
          {hero}
        </div>
      )}

      {/* Main Content */}
      <div className="pb-16 pt-8">
        {sidebar ? (
          <div className="container max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Column */}
              <div className="lg:col-span-2 space-y-12">
                {children}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                {sidebar}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-0">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
