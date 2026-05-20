'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Sparkles,
  Menu,
  X,
  LogOut,
  FileText,
  BarChart3,
  Bot,
  Clapperboard,
  Library,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const sidebarLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/content-studio', label: 'Content Studio', icon: Clapperboard },
  { href: '/admin/content-studio/history', label: 'Ideas Library', icon: Library },
  { href: '/admin/briefings', label: 'Briefings', icon: FileText },
  { href: '/admin/analysis', label: 'Analysis', icon: Sparkles },
  { href: '/admin/agents', label: 'Agents', icon: Bot },
];

const storeLinks = [
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
];

const marketIntelLinks = [
  { href: '/admin/kalodata', label: 'Market Intelligence', icon: BarChart3 },
];

const linkClasses = (active: boolean) =>
  cn(
    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    active
      ? 'bg-brand text-white'
      : 'text-text-muted hover:bg-gray-100 hover:text-text',
  );

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/shop');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-white transition-transform duration-200 lg:static lg:translate-x-0',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <Link href="/admin" className="text-lg font-bold text-text">
            Espacio <span className="text-brand">EME</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-1 text-text-muted hover:bg-gray-100 hover:text-text lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-4 px-3 py-4">
          {/* Content section */}
          <div>
            <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted/60">
              Content Creation
            </p>
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={linkClasses(active)}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Store section */}
          <div>
            <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted/60">
              Store
            </p>
            {storeLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={linkClasses(active)}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Market Intelligence section */}
          <div>
            <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted/60">
              Market Intelligence
            </p>
            {marketIntelLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={linkClasses(active)}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User section */}
        <div className="border-t border-border px-4 py-3">
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
              <div className="flex-1">
                <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
                <div className="mt-1 h-2 w-32 animate-pulse rounded bg-gray-100" />
              </div>
            </div>
          ) : user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-medium text-white">
                  {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text">
                    {user.name || user.email}
                  </p>
                  {user.name && (
                    <p className="truncate text-xs text-text-muted">{user.email}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/shop"
                  className="flex-1 text-center text-xs text-text-muted hover:text-text"
                >
                  ← Shop
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-3 w-3" />
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/shop/auth/login"
              className="text-sm text-text-muted hover:text-text"
            >
              ← Sign in
            </Link>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex h-16 items-center gap-4 border-b border-border bg-white px-4 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-lg p-1 text-text-muted hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/admin" className="text-lg font-bold text-text">
            Espacio <span className="text-brand">EME</span>
          </Link>
        </header>

        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
