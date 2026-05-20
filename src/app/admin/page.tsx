import { Clapperboard, BarChart3, FileText, Sparkles, TrendingUp, Users, Video } from 'lucide-react';
import type { Metadata } from 'next';
import { insforge } from '@/lib/insforge';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dashboard',
};

async function getStats() {
  const [productsRes, categoriesRes, ordersRes] = await Promise.all([
    insforge.database.from('products').select('*', { count: 'exact', head: true }),
    insforge.database.from('categories').select('*', { count: 'exact', head: true }),
    insforge.database.from('orders').select('*', { count: 'exact', head: true }),
  ]);

  return {
    productCount: productsRes.count ?? 0,
    categoryCount: categoriesRes.count ?? 0,
    orderCount: ordersRes.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const { productCount, categoryCount, orderCount } = await getStats();

  const storeStats = [
    {
      label: 'Total Products',
      value: productCount,
      icon: TrendingUp,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Categories',
      value: categoryCount,
      icon: BarChart3,
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      label: 'Orders',
      value: orderCount,
      icon: Users,
      color: 'bg-amber-100 text-amber-600',
    },
  ];

  const contentTools = [
    {
      href: '/admin/content-studio',
      label: 'Content Studio',
      description: 'Generate viral content ideas from TikTok Shop trending data',
      icon: Clapperboard,
      color: 'from-indigo-500 to-purple-600',
      badge: 'New',
    },
    {
      href: '/admin/kalodata',
      label: 'Market Intelligence',
      description: 'Browse trending products, top creators, and winning video patterns',
      icon: BarChart3,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      href: '/admin/briefings',
      label: 'Briefings',
      description: 'AI-generated video production briefings with scripts and shot lists',
      icon: FileText,
      color: 'from-amber-500 to-orange-600',
    },
    {
      href: '/admin/analysis',
      label: 'Video Analysis',
      description: 'Analyze TikTok videos to extract hooks, structures, and patterns',
      icon: Sparkles,
      color: 'from-pink-500 to-rose-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Espacio EME — Content Studio</h1>
        <p className="mt-2 text-sm text-gray-600">
          Use TikTok Shop data as market intelligence to create viral content for any brand or client.
        </p>
      </div>

      {/* Store Stats */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Store Overview</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {storeStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <div className="flex items-center gap-4">
                  <div className={`rounded-lg p-3 ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content Creation Tools */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Content Creation Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {contentTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-transparent hover:shadow-lg"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 transition-opacity group-hover:opacity-5`} />
                <div className="relative flex items-start gap-4">
                  <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tool.color} text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-gray-900">{tool.label}</h3>
                      {tool.badge && (
                        <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                          {tool.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{tool.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Workflow */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Content Workflow</h2>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="grid gap-4 sm:grid-cols-4">
            {[
              { step: 1, label: 'Discover', desc: 'Find trending products on Kalodata', href: '/admin/kalodata', emoji: '🔍' },
              { step: 2, label: 'Analyze', desc: 'Study winning video patterns', href: '/admin/analysis', emoji: '📊' },
              { step: 3, label: 'Generate', desc: 'AI creates content ideas & scripts', href: '/admin/content-studio', emoji: '✨' },
              { step: 4, label: 'Produce', desc: 'Film, edit, and publish', href: '/admin/briefings', emoji: '🎬' },
            ].map((item) => (
              <Link
                key={item.step}
                href={item.href}
                className="group relative rounded-lg border border-gray-100 bg-gray-50 p-4 text-center transition-all hover:border-indigo-200 hover:bg-indigo-50/50"
              >
                <div className="text-2xl mb-2">{item.emoji}</div>
                <div className="text-xs font-bold text-indigo-600 mb-1">Step {item.step}</div>
                <div className="text-sm font-semibold text-gray-900">{item.label}</div>
                <div className="mt-1 text-xs text-gray-500">{item.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
