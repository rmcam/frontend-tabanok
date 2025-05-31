import React, { useEffect } from 'react';
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { cn } from "@/lib/utils";
import { useProfile } from '@/hooks/auth/auth.hooks';
import { useUserStore } from '@/stores/userStore';
// import Header from '@/components/layout/Header'; // Eliminar la importación del Header

export default function RootLayout({ children, isLandingPage = false }: { children: React.ReactNode, isLandingPage?: boolean }) {
  return (
    <SidebarProvider>
      <LayoutContent isLandingPage={isLandingPage}>
        {children}
      </LayoutContent>
    </SidebarProvider>
  );
}

function LayoutContent({ children, isLandingPage }: { children: React.ReactNode, isLandingPage: boolean }) {
  const { state, isMobile } = useSidebar();
  const { data: userProfile } = useProfile({ enabled: !isLandingPage });
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (userProfile) {
      setUser(userProfile);
    }
  }, [userProfile, setUser]);

  const sidebarPaddingClass = isMobile
    ? state === "expanded"
      ? "pl-[var(--sidebar-width-mobile)]"
      : "pl-[var(--sidebar-width-icon)]"
    : state === "expanded"
      ? "pl-[var(--sidebar-width)]"
      : "pl-[var(--sidebar-width-icon)]";

  return (
    <>
      {/* <Header /> Eliminar el Header de aquí */}
      {!isLandingPage && <AppSidebar />}
      <main className={cn("flex-1 overflow-auto", !isLandingPage && sidebarPaddingClass)}> {/* Eliminar padding-top condicional */}
        {children}
      </main>
      {!isLandingPage && (
        <SidebarTrigger
          className={cn(
            "absolute top-2 z-20 transition-[left] duration-200 ease-linear",
            isMobile
              ? state === "expanded"
                ? "left-[calc(var(--sidebar-width-mobile)+0.5rem)]"
                : "left-[calc(var(--sidebar-width-icon)+0.5rem)]"
              : state === "expanded"
                ? "left-[calc(var(--sidebar-width)+0.5rem)]"
                : "left-[calc(var(--sidebar-width-icon)+0.5rem)]"
          )}
        />
      )}
    </>
  );
}
