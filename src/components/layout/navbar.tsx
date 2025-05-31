
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { Link } from 'react-router-dom';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/common/mode-toggle";
import { useAuthModalStore } from '@/stores/authModalStore'; // Importar el store de Zustand

interface NavbarProps {
  hideToggle?: boolean;
  isLandingPage?: boolean;
}

export function Navbar({ hideToggle, isLandingPage }: NavbarProps) {
  const { t, i18n } = useTranslation(); // Extraer 't' de useTranslation
  const { openModal } = useAuthModalStore(); // Extraer 'openModal' del store

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className={`flex items-center justify-between p-4 border-b ${isLandingPage ? 'sticky top-0 z-50 bg-background' : ''}`}>
      <div className="flex items-center">
        {!hideToggle && <SidebarTrigger />}
      </div>
      {isLandingPage && (
        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:underline">Inicio</Link>
          <Link to="/#features" className="hover:underline">Características</Link>
          <Link to="/#about" className="hover:underline">Acerca de</Link>
          <Link to="/#cta" className="hover:underline active">Contacto</Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                {i18n.language.toUpperCase()} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeLanguage("en")}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage("es")}>
                Español
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage("kmt")}>
                Kamentsa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={openModal}>{t('login_button')}</Button> {/* Botón de Login */}
          <ModeToggle />
        </div>
      )}
    </nav>
  );
}
