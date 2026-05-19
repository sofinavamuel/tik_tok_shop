'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import type { ReactNode } from 'react';
import { CartProvider, useCart } from '@/lib/cart-context';

function Header() {
  const { totalItems } = useCart();

  return (
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
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
    </CartProvider>
  );
}
