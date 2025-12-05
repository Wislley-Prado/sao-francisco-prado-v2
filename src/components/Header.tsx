import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, Calendar, Fish, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from '@/hooks/use-toast';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleUpdateApp = async () => {
    setIsUpdating(true);
    toast({
      title: "Atualizando aplicativo...",
      description: "Limpando cache e recarregando",
    });

    try {
      // Unregister all service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(reg => reg.unregister()));
      }

      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      // Reload the page
      setTimeout(() => {
        window.location.replace('/');
      }, 500);
    } catch (error) {
      console.error('Erro ao atualizar app:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Tente recarregar a página manualmente",
        variant: "destructive",
      });
      setIsUpdating(false);
    }
  };

  const navItems = [
    { name: 'Início', href: '#home' },
    { name: 'Ranchos', href: '#ranchos' },
    { name: 'Pacotes', href: '#pacotes' },
    { name: 'Blog', href: '#blog' },
    { name: 'Transmissão', href: '/live' },
    { name: 'Represa', href: '#represa' },
  ];

  return (
    <header className="bg-rio-blue shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Fish className="h-8 w-8 text-white" />
            <div className="text-white">
              <h1 className="text-2xl font-bold">PradoAqui</h1>
              <p className="text-xs text-blue-200">Rio São Francisco</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              item.href.startsWith('/') ? (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-white hover:text-sand-beige transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-white hover:text-sand-beige transition-colors duration-200"
                >
                  {item.name}
                </a>
              )
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUpdateApp}
              disabled={isUpdating}
              className="text-white hover:bg-white hover:bg-opacity-10"
              title="Atualizar aplicativo"
            >
              <RefreshCw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
            </Button>
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent border-white text-white hover:bg-white hover:text-rio-blue"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Reservar
            </Button>
            <Button
              size="sm"
              className="bg-sunset-orange hover:bg-orange-600 text-white"
            >
              <Phone className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-white hover:bg-opacity-10"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                item.href.startsWith('/') ? (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-white hover:text-sand-beige transition-colors duration-200 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-white hover:text-sand-beige transition-colors duration-200 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                )
              ))}
              <div className="flex flex-col space-y-2 pt-4">
                <div className="flex justify-center gap-2 mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleUpdateApp}
                    disabled={isUpdating}
                    className="text-white hover:bg-white hover:bg-opacity-10"
                    title="Atualizar aplicativo"
                  >
                    <RefreshCw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
                  </Button>
                  <ThemeToggle />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-rio-blue"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Reservar
                </Button>
                <Button
                  size="sm"
                  className="bg-sunset-orange hover:bg-orange-600 text-white"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
