'use client';

import { usePathname } from 'next/navigation';
import {
  Car,
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
              <Link href="/" legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={isActive('/')}
                  tooltip="Dashboard"
                  aria-label="Dashboard"
                >
                  <Gauge />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/entry" legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={isActive('/entry')}
                  tooltip="New Entry"
                  aria-label="New Entry"
                >
                  <Car />
                  <span>New Entry</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/reports" legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={isActive('/reports')}
                  tooltip="Reports"
                  aria-label="Reports"
                >
                  <FileText />
                  <span>Reports</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/settings" legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={isActive('/settings')}
                  tooltip="Settings"
                  aria-label="Settings"
                >
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </Link>
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
