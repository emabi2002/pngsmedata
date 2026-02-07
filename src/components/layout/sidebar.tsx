'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  ClipboardCheck,
  FolderKanban,
  BarChart3,
  FileText,
  Settings,
  Users,
  Leaf,
  TrendingUp,
  Shield,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  ClipboardList,
  Sliders,
  MapPinned,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  children?: NavItem[];
}

const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    badge: 'Live',
    badgeVariant: 'default',
  },
  {
    title: 'MSME Registry',
    href: '/registry',
    icon: Building2,
    badge: '1,247',
  },
  {
    title: 'Verification Queue',
    href: '/verification',
    icon: ClipboardCheck,
    badge: '156',
    badgeVariant: 'destructive',
  },
  {
    title: 'Survey Campaigns',
    href: '/surveys',
    icon: ClipboardList,
    badge: '2',
    badgeVariant: 'default',
  },
  {
    title: 'Programs',
    href: '/programs',
    icon: FolderKanban,
  },
];

const analyticsNavItems: NavItem[] = [
  {
    title: 'Overview Reports',
    href: '/reports',
    icon: BarChart3,
  },
  {
    title: 'Inclusion Dashboard',
    href: '/reports/inclusion',
    icon: Users,
  },
  {
    title: 'Green Growth',
    href: '/reports/green',
    icon: Leaf,
  },
  {
    title: 'Finance Pipeline',
    href: '/reports/finance',
    icon: TrendingUp,
  },
];

const adminNavItems: NavItem[] = [
  {
    title: 'Data Dictionary',
    href: '/data-dictionary',
    icon: FileText,
  },
  {
    title: 'Configuration',
    href: '/admin/config',
    icon: Sliders,
  },
  {
    title: 'Geographic Data',
    href: '/admin/geo',
    icon: MapPinned,
  },
  {
    title: 'Audit Log',
    href: '/audit-log',
    icon: Shield,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

function NavSection({
  title,
  items,
  collapsed
}: {
  title: string;
  items: NavItem[];
  collapsed: boolean;
}) {
  const pathname = usePathname();

  return (
    <div className="mb-4">
      {!collapsed && (
        <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </h3>
      )}
      <nav className="space-y-1 px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-400 -ml-0.5 pl-3.5'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50',
                collapsed && 'justify-center px-2'
              )}
            >
              <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-emerald-400')} />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <Badge
                      variant={item.badgeVariant || 'secondary'}
                      className={cn(
                        'text-xs px-1.5 py-0.5 font-medium',
                        item.badgeVariant === 'default' && 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                        item.badgeVariant === 'destructive' && 'bg-amber-500/20 text-amber-400 border-amber-500/30',
                        !item.badgeVariant && 'bg-slate-700 text-slate-300'
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <>
      {/* Logo Section */}
      <div className={cn(
        'flex items-center gap-3 border-b border-slate-800 px-4 py-5',
        collapsed && 'justify-center px-2'
      )}>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/20">
          <Leaf className="h-6 w-6 text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-lg font-bold text-white tracking-tight">SMEC Registry</span>
            <span className="text-xs text-slate-500">Climate FIRST Platform</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <NavSection title="Command Center" items={mainNavItems} collapsed={collapsed} />
        <NavSection title="Analytics & Reports" items={analyticsNavItems} collapsed={collapsed} />
        <NavSection title="Administration" items={adminNavItems} collapsed={collapsed} />
      </ScrollArea>

      {/* Footer */}
      <div className={cn(
        'border-t border-slate-800 p-4',
        collapsed && 'px-2'
      )}>
        <div className={cn(
          'flex items-center gap-3 rounded-lg bg-slate-800/50 p-3',
          collapsed && 'justify-center p-2'
        )}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-semibold">
            SK
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Sarah Kila</p>
              <p className="text-xs text-slate-500 truncate">SMEC Officer</p>
            </div>
          )}
        </div>

        {!collapsed && (
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>System Operational</span>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden bg-slate-900 text-white hover:bg-slate-800"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen flex-col bg-slate-950 border-r border-slate-800 transition-all duration-300',
          collapsed ? 'w-20' : 'w-72',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {sidebarContent}

        {/* Collapse toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-20 hidden md:flex h-6 w-6 rounded-full border border-slate-700 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3 rotate-90" />
          )}
        </Button>
      </aside>

      {/* Spacer for main content */}
      <div className={cn(
        'hidden md:block flex-shrink-0 transition-all duration-300',
        collapsed ? 'w-20' : 'w-72'
      )} />
    </>
  );
}
