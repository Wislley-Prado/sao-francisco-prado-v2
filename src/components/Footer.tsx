import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Fish, Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (href: string, hash: string) => {
    if (hash) {
      if (location.pathname === '/') {
        const element = document.getElementById(hash);
        element?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(hash);
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      navigate(href);
    }
  };

  return <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Fish className="h-8 w-8 text-rio-blue" />
              <div>
                <h3 className="text-xl font-bold">PradoAqui</h3>
                <p className="text-sm text-gray-400">Rio São Francisco</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              Sua experiência de pesca no Rio São Francisco começa aqui. 
              Oferecemos os melhores ranchos e pacotes para uma pescaria inesquecível.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Navegação</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => handleNavClick('/', '')}
                  className="text-gray-300 hover:text-rio-blue transition-colors bg-transparent border-none cursor-pointer"
                >
                  Início
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('/', 'ranchos')}
                  className="text-gray-300 hover:text-rio-blue transition-colors bg-transparent border-none cursor-pointer"
                >
                  Ranchos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('/pacotes', '')}
                  className="text-gray-300 hover:text-rio-blue transition-colors bg-transparent border-none cursor-pointer"
                >
                  Pacotes
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('/blog', '')}
                  className="text-gray-300 hover:text-rio-blue transition-colors bg-transparent border-none cursor-pointer"
                >
                  Blog
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('/live', '')}
                  className="text-gray-300 hover:text-rio-blue transition-colors bg-transparent border-none cursor-pointer"
                >
                  Transmissão Ao Vivo
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contato</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-rio-blue" />
                <span className="text-gray-300">(38) 98832-0108</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-rio-blue" />
                <span className="text-gray-300">contato@pradoaqui.com.br</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-rio-blue mt-0.5" />
                <span className="text-gray-300">
                  Rio São Francisco<br />
                  Minas Gerais, Brasil
                </span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Redes Sociais</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-rio-blue transition-colors" aria-label="Facebook">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-rio-blue transition-colors" aria-label="Instagram">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-rio-blue transition-colors" aria-label="YouTube">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2025 PradoAqui. Todos os direitos reservados.
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <Link to="/politica-privacidade" className="text-gray-300 hover:text-rio-blue transition-colors">
                Política de Privacidade
              </Link>
              <a href="#termos" className="text-gray-300 hover:text-rio-blue transition-colors">
                Termos de Uso
              </a>
              <a href="#cookies" className="text-gray-300 hover:text-rio-blue transition-colors" onClick={e => {
              e.preventDefault();
              // Reset cookie consent to show banner again
              localStorage.removeItem('cookie-consent');
              window.location.reload();
            }}>
                Configurar Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;