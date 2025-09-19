import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export const AdminHeader = () => {
  return (
    <header className="h-14 border-b bg-white/50 backdrop-blur supports-[backdrop-filter]:bg-white/50 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold">Painel Administrativo</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <a href="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver Site
          </a>
        </Button>
      </div>
    </header>
  );
};