"use client";

import {
  AudioWaveform,
  Bell,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { NavUser } from "./nav-user";
import Link from "next/link";

const data = {
  navMain: [
    {
      title: "Inicio",
      url: "/dashboard",
      icon: Frame,
      isActive: true,
    },
    {
      title: "Aprender",
      url: "/dashboard/learn",
      icon: BookOpen,
    },
    {
      title: "Práctica",
      url: "/dashboard/practice",
      icon: SquareTerminal,
  
    },
    {
      title: "Desafíos",
      url: "/dashboard/challenges",
      icon: GalleryVerticalEnd,
    },
    {
      title: "Comunidad",
      url: "/dashboard/comunity",
      icon: Bot,
      
    },
    {
      title: "Recursos",
      url: "/dashboard/resources",
      icon: Map,
      
    },
    {
      title: "Progreso",
      url: "/dashboard/progress",
      icon: PieChart,
    },
    {
      title: "Ayuda y Soporte",
      url: "/dashboard/help",
      icon: Command,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  return (
    <Sidebar
      collapsible="icon"
      {...props}
    >
      <SidebarHeader className="scroll-m-20 flex items-start p-4">
        <Link href={'/dashboard'}>
        <h1 className="text-2xl font-extrabold tracking-wide lg:text-3xl text-blue-500 ">
          tabanok
        </h1></Link>
        </SidebarHeader>
      <SidebarContent className="space-y-2">
    <NavMain items={data.navMain}  />
  </SidebarContent>
  <SidebarFooter>
    <NavUser session={session} />
  </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
