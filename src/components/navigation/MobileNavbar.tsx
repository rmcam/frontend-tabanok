import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';

export function MobileNavbar() {
  return (
    <div className="fixed top-0 left-0 right-0 bg-background p-4 flex items-center justify-between md:hidden z-30">
      <SidebarTrigger className="z-40" /> {/* Asegurar que el trigger esté por encima del navbar */}
      <div className="flex-1 text-center font-bold text-xl">
        Tabanok
      </div>
      <div className="w-7"></div> {/* Espaciador para centrar el título */}
    </div>
  );
}