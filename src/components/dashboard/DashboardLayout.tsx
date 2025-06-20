
"use client"

import React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarGroup,
  SidebarGroupLabel
} from "@/components/ui/sidebar";
import { Header } from "./Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, Wallet, BarChart3, Settings, LogOut, ChevronDown, ChevronUp, Home, Briefcase, TrendingUp as TrendingUpIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";


export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [portfolioOpen, setPortfolioOpen] = React.useState(false);

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    {
      label: "Portfolio",
      icon: Briefcase,
      onClick: () => setPortfolioOpen(!portfolioOpen),
      isOpen: portfolioOpen,
      subItems: [
        { href: "/portfolio/overview", label: "Overview" },
        { href: "/portfolio/add-transaction", label: "Add Transaction" },
      ]
    },
    { href: "/markets", label: "Markets", icon: TrendingUpIcon },
    { href: "/settings", label: "Settings", icon: Settings },
  ];


  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon" variant="sidebar" side="left">
        <SidebarHeader className="p-4 items-center justify-center">
           <div className="flex flex-col items-center gap-2 group-data-[collapsible=icon]:hidden">
            <Avatar className="h-16 w-16">
              <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="avatar user" />
              <AvatarFallback>CG</AvatarFallback>
            </Avatar>
            <p className="font-semibold font-headline">User Name</p>
          </div>
           <Avatar className="h-10 w-10 hidden group-data-[collapsible=icon]:flex">
              <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="avatar user" />
              <AvatarFallback>CG</AvatarFallback>
            </Avatar>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                {item.subItems ? (
                  <>
                    <SidebarMenuButton
                      onClick={item.onClick}
                      isActive={item.subItems.some(sub => pathname === sub.href)}
                      tooltip={item.label}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                      {item.isOpen ? <ChevronUp className="ml-auto h-4 w-4"/> : <ChevronDown className="ml-auto h-4 w-4"/>}
                    </SidebarMenuButton>
                    {item.isOpen && (
                       <SidebarMenuSub>
                        {item.subItems.map((subItem) => (
                           <SidebarMenuSubItem key={subItem.href}>
                            <Link href={subItem.href}>
                              <SidebarMenuSubButton asChild isActive={pathname === subItem.href}>
                                {subItem.label}
                              </SidebarMenuSubButton>
                            </Link>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </>
                ) : (
                  <Link href={item.href || "#"}>
                    <SidebarMenuButton isActive={pathname === item.href} tooltip={item.label}>
                        <item.icon />
                        <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-4">
           <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Log Out">
                <LogOut />
                <span>Log Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
