import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import type { ReactNode } from 'react';

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/shop" className="text-xl font-bold">
            TikTok Shop
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/shop/auth/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Sign In
            </Link>
            <Link
              href="/shop/cart"
              className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-medium text-white">
                0
              </span>
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
