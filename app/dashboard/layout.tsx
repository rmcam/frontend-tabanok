import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (!session) {
    return <div>Not authenticated</div>;
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
