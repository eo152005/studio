'use client';

import { usePathname } from 'next/navigation';
import {
  FileText,
  Gauge,
  Settings,
  Truck,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import Link from 'next/link';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                <Truck className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold font-headline text-sidebar-foreground">
              KR Parking Pro
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive('/')}
                tooltip="Dashboard"
                aria-label="Dashboard"
              >
                <Link href="/">
                  <Gauge />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive('/reports')}
                tooltip="Reports"
                aria-label="Reports"
              >
                <Link href="/reports">
                  <FileText />
                  <span>Reports</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive('/settings')}
                tooltip="Settings"
                aria-label="Settings"
              >
                <Link href="/settings">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex items-center h-14 px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger className="md:hidden" />
            <h2 className="text-xl font-semibold capitalize font-headline">
                {pathname.substring(1) || 'Dashboard'}
            </h2>
        </header>
        <main className="flex-1 p-4 overflow-auto md:p-6">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
