'use client';

import { useState, useMemo } from 'react';
import {
  getTopProducts,
  getTopCreators,
  getVideoInsights,
  MOCK_PRODUCTS,
  MOCK_CREATORS,
  MOCK_VIDEO_INSIGHTS,
} from '@/lib/kalodata/client';
import {
  importProductsToInsforge,
  importCreatorsToStrapi,
  importVideoInsightsToStrapi,
} from '@/lib/actions/kalodata';
import type { KalodataProduct, KalodataCreator, KalodataVideoInsight } from '@/lib/kalodata/types';
import DataTable, { type Column } from '@/components/admin/DataTable';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Download,
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Users,
  Video,
} from 'lucide-react';

type TabKey = 'products' | 'creators' | 'videos';

const CATEGORIES = ['All', 'Fashion', 'Beauty', 'Tech', 'Home', 'Food'];
const NICHES = ['All', 'Beauty', 'Tech', 'Fashion', 'Home', 'Food'];

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function TrendBadge({ trend }: { trend: 'rising' | 'stable' | 'declining' }) {
  const config = {
    rising: { icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Rising' },
    stable: { icon: Minus, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Stable' },
    declining: { icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50', label: 'Declining' },
  };
  const { icon: Icon, color, bg, label } = config[trend];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${bg} ${color}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

function ImportResult({ result }: { result: { success: boolean; imported: number; failed: number; error?: string } | null }) {
  if (!result) return null;
  if (!result.success) {
    return (
      <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
        Import failed: {result.error}
      </div>
    );
  }
  return (
    <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
      <CheckCircle className="h-4 w-4 flex-shrink-0" />
      Imported {result.imported} items successfully. {result.failed > 0 && `${result.failed} failed.`}
    </div>
  );
}

export default function KalodataPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('products');
  const [filter, setFilter] = useState('All');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: boolean; imported: number; failed: number; error?: string } | null>(null);

  // Data state
  const [products] = useState<KalodataProduct[]>(MOCK_PRODUCTS);
  const [creators] = useState<KalodataCreator[]>(MOCK_CREATORS);
  const [videoInsights] = useState<KalodataVideoInsight[]>(MOCK_VIDEO_INSIGHTS);

  // Filtered data
  const filteredProducts = useMemo(
    () => filter === 'All' ? products : products.filter((p) => p.category === filter),
    [products, filter],
  );
  const filteredCreators = useMemo(
    () => filter === 'All' ? creators : creators.filter((c) => c.niche === filter),
    [creators, filter],
  );
  const filteredVideos = useMemo(
    () => videoInsights,
    [videoInsights],
  );

  // Sort state
  const [sortColumn, setSortColumn] = useState<string>('gmv_30d');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts].sort((a, b) => {
      const aVal = a[sortColumn as keyof KalodataProduct];
      const bVal = b[sortColumn as keyof KalodataProduct];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortDirection === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return sorted;
  }, [filteredProducts, sortColumn, sortDirection]);

  // Sort creators
  const sortedCreators = useMemo(() => {
    const sorted = [...filteredCreators].sort((a, b) => {
      const aVal = a[sortColumn as keyof KalodataCreator];
      const bVal = b[sortColumn as keyof KalodataCreator];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortDirection === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return sorted;
  }, [filteredCreators, sortColumn, sortDirection]);

  // Sort videos
  const sortedVideos = useMemo(() => {
    const sorted = [...filteredVideos].sort((a, b) => {
      const aVal = a[sortColumn as keyof KalodataVideoInsight];
      const bVal = b[sortColumn as keyof KalodataVideoInsight];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortDirection === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return sorted;
  }, [filteredVideos, sortColumn, sortDirection]);

  // Export to CSV
  const exportToCSV = (data: Record<string, unknown>[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map((row) =>
        headers.map((h) => {
          const val = row[h];
          if (Array.isArray(val)) return `"${val.join('; ')}"`;
          if (typeof val === 'string' && val.includes(',')) return `"${val}"`;
          return val;
        }).join(','),
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import handler
  const handleImport = async () => {
    setImporting(true);
    setImportResult(null);
    try {
      let result: { success: boolean; imported: number; failed: number; error?: string };
      switch (activeTab) {
        case 'products':
          result = await importProductsToInsforge(filteredProducts);
          break;
        case 'creators':
          result = await importCreatorsToStrapi(filteredCreators);
          break;
        case 'videos':
          result = await importVideoInsightsToStrapi(filteredVideos);
          break;
      }
      setImportResult({
        success: result.success,
        imported: result.imported,
        failed: result.failed,
        error: result.error,
      });
    } catch (err) {
      setImportResult({ success: false, imported: 0, failed: 0, error: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      setImporting(false);
    }
  };

  // ── Column Definitions ──

  const productColumns: Column<KalodataProduct>[] = [
    { key: 'name', label: 'Product', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    {
      key: 'gmv_30d',
      label: 'GMV (30d)',
      sortable: true,
      render: (item) => formatCurrency(item.gmv_30d),
    },
    {
      key: 'units_sold_30d',
      label: 'Units Sold',
      sortable: true,
      render: (item) => formatNumber(item.units_sold_30d),
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (item) => formatCurrency(item.price),
    },
    {
      key: 'commission_rate',
      label: 'Commission',
      sortable: true,
      render: (item) => `${item.commission_rate}%`,
    },
    {
      key: 'trend',
      label: 'Trend',
      render: (item) => <TrendBadge trend={item.trend} />,
    },
    {
      key: 'growth_rate',
      label: 'Growth',
      sortable: true,
      render: (item) => (
        <span className={item.growth_rate > 0 ? 'text-emerald-600' : item.growth_rate < 0 ? 'text-red-600' : ''}>
          {item.growth_rate > 0 ? '+' : ''}{item.growth_rate}%
        </span>
      ),
    },
    {
      key: 'creator_count',
      label: 'Creators',
      sortable: true,
      render: (item) => formatNumber(item.creator_count),
    },
  ];

  const creatorColumns: Column<KalodataCreator>[] = [
    {
      key: 'display_name',
      label: 'Creator',
      sortable: true,
      render: (item) => (
        <div>
          <div className="font-medium">{item.display_name}</div>
          <div className="text-xs text-gray-500">{item.username}</div>
        </div>
      ),
    },
    { key: 'niche', label: 'Niche', sortable: true },
    {
      key: 'followers',
      label: 'Followers',
      sortable: true,
      render: (item) => formatNumber(item.followers),
    },
    {
      key: 'engagement_rate',
      label: 'Engagement',
      sortable: true,
      render: (item) => `${item.engagement_rate}%`,
    },
    {
      key: 'gmv_30d',
      label: 'GMV (30d)',
      sortable: true,
      render: (item) => formatCurrency(item.gmv_30d),
    },
    {
      key: 'video_count',
      label: 'Videos',
      sortable: true,
      render: (item) => formatNumber(item.video_count),
    },
  ];

  const videoColumns: Column<KalodataVideoInsight>[] = [
    {
      key: 'product',
      label: 'Product',
      sortable: true,
    },
    {
      key: 'creator',
      label: 'Creator',
      sortable: true,
    },
    {
      key: 'views',
      label: 'Views',
      sortable: true,
      render: (item) => formatNumber(item.views),
    },
    {
      key: 'likes',
      label: 'Likes',
      sortable: true,
      render: (item) => formatNumber(item.likes),
    },
    {
      key: 'gmv_attributed',
      label: 'GMV',
      sortable: true,
      render: (item) => formatCurrency(item.gmv_attributed),
    },
    {
      key: 'hook_type',
      label: 'Hook Type',
      sortable: true,
      render: (item) => (
        <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
          {item.hook_type}
        </span>
      ),
    },
    {
      key: 'hook_text',
      label: 'Hook Text',
      render: (item) => (
        <span className="max-w-xs truncate text-xs text-gray-600" title={item.hook_text}>
          &ldquo;{item.hook_text}&rdquo;
        </span>
      ),
    },
    {
      key: 'retention_rate',
      label: 'Retention',
      sortable: true,
      render: (item) => `${item.retention_rate}%`,
    },
    {
      key: 'duration_seconds',
      label: 'Duration',
      sortable: true,
      render: (item) => `${item.duration_seconds}s`,
    },
  ];

  const tabs: { key: TabKey; label: string; icon: React.ElementType; count: number }[] = [
    { key: 'products', label: 'Top Products', icon: BarChart3, count: filteredProducts.length },
    { key: 'creators', label: 'Top Creators', icon: Users, count: filteredCreators.length },
    { key: 'videos', label: 'Video Insights', icon: Video, count: filteredVideos.length },
  ];

  const filters = activeTab === 'creators' ? NICHES : CATEGORIES;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Market Intelligence</h1>
          <p className="mt-1 text-sm text-gray-500">
            Kalodata insights — discover trending products, top creators, and winning video patterns.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              let data: Record<string, unknown>[];
              let filename: string;
              switch (activeTab) {
                case 'products':
                  data = sortedProducts.map((p) => ({
                    name: p.name,
                    category: p.category,
                    gmv_30d: p.gmv_30d,
                    units_sold_30d: p.units_sold_30d,
                    price: p.price,
                    commission_rate: p.commission_rate,
                    trend: p.trend,
                    growth_rate: p.growth_rate,
                    shop_name: p.shop_name,
                  }));
                  filename = 'kalodata-products';
                  break;
                case 'creators':
                  data = sortedCreators.map((c) => ({
                    username: c.username,
                    display_name: c.display_name,
                    followers: c.followers,
                    engagement_rate: c.engagement_rate,
                    gmv_30d: c.gmv_30d,
                    niche: c.niche,
                  }));
                  filename = 'kalodata-creators';
                  break;
                case 'videos':
                  data = sortedVideos.map((v) => ({
                    creator: v.creator,
                    product: v.product,
                    views: v.views,
                    likes: v.likes,
                    gmv_attributed: v.gmv_attributed,
                    hook_type: v.hook_type,
                    hook_text: v.hook_text,
                    retention_rate: v.retention_rate,
                  }));
                  filename = 'kalodata-video-insights';
                  break;
              }
              exportToCSV(data!, filename);
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button
            onClick={handleImport}
            disabled={importing}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {importing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Import to {activeTab === 'products' ? 'InsForge' : 'Strapi'}
          </button>
        </div>
      </div>

      <ImportResult result={importResult} />

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setFilter('All');
                  setImportResult(null);
                }}
                className={`flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                <span className={`rounded-full px-2 py-0.5 text-xs ${
                  isActive ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Filter:</span>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filter === f
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      {activeTab === 'products' && (
        <DataTable
          columns={productColumns}
          data={sortedProducts}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          keyExtractor={(item) => item.id}
          emptyMessage="No products found for this category."
        />
      )}

      {activeTab === 'creators' && (
        <DataTable
          columns={creatorColumns}
          data={sortedCreators}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          keyExtractor={(item) => item.username}
          emptyMessage="No creators found for this niche."
        />
      )}

      {activeTab === 'videos' && (
        <div className="space-y-4">
          <DataTable
            columns={videoColumns}
            data={sortedVideos}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            keyExtractor={(item) => item.video_url}
            emptyMessage="No video insights found."
          />

          {/* Expanded structure detail for each video */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Video Structure Patterns</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sortedVideos.slice(0, 6).map((video) => (
                <div key={video.video_url} className="rounded-lg border border-gray-100 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{video.product}</span>
                    <span className="text-xs text-gray-500">{video.creator}</span>
                  </div>
                  <p className="mb-2 text-xs text-gray-600">&ldquo;{video.hook_text}&rdquo;</p>
                  <div className="space-y-1 text-xs text-gray-500">
                    <div><span className="font-medium">Structure:</span> {video.structure}</div>
                    <div><span className="font-medium">CTA:</span> {video.cta_type}</div>
                    <div><span className="font-medium">Patterns:</span> {video.key_patterns.join(', ')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
