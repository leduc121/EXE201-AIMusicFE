import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  ArrowUpRight,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CreditCard,
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  ShoppingCart,
  WalletCards,
} from 'lucide-react';

type RangeKey = '1y' | '3m' | '30d';

interface FinancialMonth {
  month: string;
  label: string;
  revenue?: number;
  cogs?: number;
  operatingExpenses?: number;
  totalCosts?: number;
}

interface FinancialData {
  revenueOverview: {
    totalRevenue: number;
    monthly: FinancialMonth[];
  };
  costsBreakdown: {
    totalCosts: number;
    monthly: FinancialMonth[];
  };
  cards: {
    grossRevenue: number;
    netProfit: number;
    refundRate: number;
    avgTransaction: number;
  };
}

interface TransactionRow {
  id: string;
  transactionId: string;
  customerName: string;
  customerEmail?: string | null;
  amount: number;
  currency: string;
  type: string;
  paymentMethod: string;
  date: string;
  status: string;
}

interface TransactionsData {
  items: TransactionRow[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function mkMonth(label: string, revenue: number, cogs: number, opex: number): FinancialMonth {
  return { month: label, label, revenue, cogs, operatingExpenses: opex, totalCosts: cogs + opex };
}

const fallbackByRange: Record<RangeKey, FinancialData> = {
  '1y': {
    revenueOverview: { totalRevenue: 4702000000, monthly: [
      mkMonth('Jan',280000000,105000000,54000000), mkMonth('Feb',315000000,112000000,61000000),
      mkMonth('Mar',345000000,120000000,69000000), mkMonth('Apr',360000000,128000000,73000000),
      mkMonth('May',342000000,121000000,71000000), mkMonth('Jun',385000000,136000000,76000000),
      mkMonth('Jul',398000000,142000000,79000000), mkMonth('Aug',418000000,151000000,82000000),
      mkMonth('Sep',432000000,158000000,84000000), mkMonth('Oct',458000000,166000000,90000000),
      mkMonth('Nov',475000000,173000000,95000000), mkMonth('Dec',512000000,184000000,106000000),
    ]},
    costsBreakdown: { totalCosts: 2705800000, monthly: [] },
    cards: { grossRevenue: 487500000, netProfit: 213100000, refundRate: 3.1, avgTransaction: 1855000 },
  },
  '3m': {
    revenueOverview: { totalRevenue: 487500000, monthly: [
      mkMonth('Tuần 1',88000000,32000000,18000000), mkMonth('Tuần 2',94000000,34000000,19000000),
      mkMonth('Tuần 3',98000000,36000000,20000000), mkMonth('Tuần 4',102000000,38000000,21000000),
      mkMonth('Tuần 5',105600000,39000000,22000000),
    ]},
    costsBreakdown: { totalCosts: 274400000, monthly: [] },
    cards: { grossRevenue: 487500000, netProfit: 213100000, refundRate: 2.8, avgTransaction: 1920000 },
  },
  '30d': {
    revenueOverview: { totalRevenue: 162500000, monthly: [
      mkMonth('1-5',28000000,10500000,5400000), mkMonth('6-10',31500000,11200000,6100000),
      mkMonth('11-15',34500000,12000000,6900000), mkMonth('16-20',29000000,10800000,5800000),
      mkMonth('21-25',22500000,8500000,4600000), mkMonth('26-30',17000000,6500000,3500000),
    ]},
    costsBreakdown: { totalCosts: 91700000, monthly: [] },
    cards: { grossRevenue: 162500000, netProfit: 70800000, refundRate: 3.5, avgTransaction: 1780000 },
  },
};
// Fill costsBreakdown.monthly from revenueOverview.monthly for each range
Object.values(fallbackByRange).forEach(d => { d.costsBreakdown.monthly = d.revenueOverview.monthly; });

const fallbackFinancials = fallbackByRange['1y'];

const fallbackTransactions: TransactionsData = {
  items: [
    ['TXN-100201', 'Nguyễn Văn An', 3249750, 'sale', 'credit_card', 'completed'],
    ['TXN-100202', 'Trần Minh Châu', 2112500, 'sale', 'paypal', 'completed'],
    ['TXN-100203', 'Lê Thị Mai', 6225000, 'subscription', 'credit_card', 'pending'],
    ['TXN-100204', 'Phạm Đức Huy', 1149750, 'refund', 'card', 'refunded'],
    ['TXN-100205', 'Hoàng Yến Nhi', 7800000, 'sale', 'bank_transfer', 'failed'],
    ['TXN-100206', 'Vũ Quang Minh', 1681250, 'sale', 'credit_card', 'completed'],
    ['TXN-100207', 'Đặng Thu Hà', 4749750, 'subscription', 'payos', 'completed'],
    ['TXN-100208', 'Bùi Thanh Tùng', 2375000, 'sale', 'card', 'pending'],
    ['TXN-100209', 'Ngô Lan Anh', 3912500, 'refund', 'credit_card', 'refunded'],
    ['TXN-100210', 'Lý Hoàng Nam', 1974750, 'sale', 'payos', 'completed'],
  ].map(([transactionId, customerName, amount, type, paymentMethod, status], index) => ({
    id: String(transactionId),
    transactionId: String(transactionId),
    customerName: String(customerName),
    customerEmail: `${String(customerName).toLowerCase().replace(' ', '.')}@example.com`,
    amount: Number(amount),
    currency: 'VND',
    type: String(type),
    paymentMethod: String(paymentMethod),
    status: String(status),
    date: new Date(Date.now() - index * 3600 * 1000 * 12).toISOString(),
  })),
  pagination: {
    page: 1,
    limit: 10,
    total: 50,
    totalPages: 5,
  },
};

function getToken() {
  return (
    localStorage.getItem('access_token') ||
    localStorage.getItem('accessToken') ||
    localStorage.getItem('token') ||
    ''
  );
}

async function apiGet<T>(path: string): Promise<T> {
  const token = getToken();
  const response = await fetch(`${API_BASE}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  const json = await response.json();
  return (json.data || json) as T;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);
}

function formatShort(value: number) {
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)} tỷ`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(0)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(0)}K`;
  return `₫${value}`;
}

function formatDate(value: string) {
  const date = new Date(value);
  const today = new Date();
  const diff = today.getTime() - date.getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function AdminDashboardPage() {
  const [range, setRange] = useState<RangeKey>('1y');
  const [financials, setFinancials] = useState<FinancialData>(fallbackFinancials);
  const [transactions, setTransactions] = useState<TransactionsData>(fallbackTransactions);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [method, setMethod] = useState('');
  const [page, setPage] = useState(1);

  const [revHover, setRevHover] = useState<number | null>(null);
  const [costHover, setCostHover] = useState<number | null>(null);
  const revChartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    apiGet<FinancialData>(`/dashboard/admin/financials?range=${range}`)
      .then(setFinancials)
      .catch(() => setFinancials(fallbackByRange[range] || fallbackFinancials));
  }, [range]);

  useEffect(() => {
    const params = new URLSearchParams({
      page: String(page),
      limit: '10',
    });
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    if (method) params.set('method', method);

    apiGet<TransactionsData>(`/payments/admin/transactions?${params.toString()}`)
      .then(setTransactions)
      .catch(() => setTransactions(fallbackTransactions));
  }, [search, status, method, page]);

  const revenueMax = useMemo(
    () =>
      Math.max(
        ...financials.revenueOverview.monthly.map((item) => item.revenue || 0),
        1,
      ),
    [financials],
  );
  const costMax = useMemo(
    () =>
      Math.max(
        ...financials.costsBreakdown.monthly.map((item) => item.totalCosts || 0),
        1,
      ),
    [financials],
  );

  const CW = 600; const CH = 170; const CL = 60; const CT = 10;
  const niceRevMax = useMemo(() => { const r = revenueMax * 1.15; const p = Math.pow(10, Math.floor(Math.log10(r))); return Math.ceil(r / p) * p; }, [revenueMax]);
  const niceCostMax = useMemo(() => { const r = costMax * 1.15; const p = Math.pow(10, Math.floor(Math.log10(r))); return Math.ceil(r / p) * p; }, [costMax]);
  const revTicks = useMemo(() => [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(niceRevMax * f)), [niceRevMax]);
  const costTicks = useMemo(() => [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(niceCostMax * f)), [niceCostMax]);

  const revCoords = useMemo(() => {
    const n = financials.revenueOverview.monthly.length;
    const step = CW / Math.max(n - 1, 1);
    return financials.revenueOverview.monthly.map((item, i) => ({
      x: CL + i * step,
      y: CT + CH - ((item.revenue || 0) / niceRevMax) * CH,
    }));
  }, [financials, niceRevMax]);

  const revenuePoints = useMemo(() => revCoords.map(p => `${p.x},${p.y}`).join(' '), [revCoords]);
  const revenueAreaPoints = useMemo(() => `${CL},${CT + CH} ${revenuePoints} ${CL + CW},${CT + CH}`, [revenuePoints]);

  const handleRevMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = revChartRef.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const svgW = CL + CW + 10;
    const relX = ((e.clientX - rect.left) / rect.width) * svgW;
    const n = financials.revenueOverview.monthly.length;
    const step = CW / Math.max(n - 1, 1);
    const idx = Math.round((relX - CL) / step);
    setRevHover(Math.max(0, Math.min(n - 1, idx)));
  }, [financials]);

  const handleExport = async () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    if (method) params.set('method', method);

    const token = getToken();
    const response = await fetch(
      `${API_BASE}/payments/admin/transactions/export?${params.toString()}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    );
    if (!response.ok) return;

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `uniwave-transactions-${new Date().toISOString().slice(0, 10)}.xlsx`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white text-slate-950 font-sans">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-6 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="inline-flex w-fit rounded-lg border border-slate-200 bg-slate-100 p-1">
            {[
              ['1y', '1 Year'],
              ['3m', '3 Months'],
              ['30d', '30 Days'],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setRange(key as RangeKey)}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  range === key
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700 hover:shadow-md"
            >
              <Download size={16} />
              Export
            </button>
            <button className="inline-flex h-10 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md">
              <Plus size={16} />
              New Transaction
            </button>
          </div>
        </div>

        <section className="grid gap-6 xl:grid-cols-2">
          {/* ── Revenue Overview ── */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Revenue Overview</p>
                <div className="mt-1 flex items-center gap-3">
                  <h2 className="text-3xl font-bold tracking-tight">{formatMoney(financials.revenueOverview.totalRevenue)}</h2>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600"><ArrowUpRight size={13} />+18.5%</span>
                </div>
              </div>
              <BarChart3 className="text-blue-600" size={22} />
            </div>
            <div ref={revChartRef} className="relative select-none" onMouseMove={handleRevMouseMove} onMouseLeave={() => setRevHover(null)}>
              <svg className="w-full" viewBox={`0 0 ${CL + CW + 10} ${CT + CH + 30}`} preserveAspectRatio="xMidYMid meet">
                {/* Y-axis labels + grid */}
                {revTicks.map((v, i) => {
                  const y = CT + CH - (v / niceRevMax) * CH;
                  return <g key={i}><text x={CL - 6} y={y + 4} textAnchor="end" className="fill-slate-400" fontSize="10">{formatShort(v)}</text><line x1={CL} x2={CL + CW} y1={y} y2={y} stroke="#f1f5f9" strokeWidth="1" /></g>;
                })}
                {/* Area */}
                <polygon points={revenueAreaPoints} fill="rgba(37,99,235,0.08)" />
                {/* Line */}
                <polyline points={revenuePoints} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                {/* Hover elements */}
                {revHover !== null && revCoords[revHover] && (<>
                  <line x1={revCoords[revHover].x} x2={revCoords[revHover].x} y1={CT} y2={CT + CH} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3" />
                  <circle cx={revCoords[revHover].x} cy={revCoords[revHover].y} r="5" fill="#fff" stroke="#2563eb" strokeWidth="2.5" />
                </>)}
                {/* X-axis labels */}
                {financials.revenueOverview.monthly.map((item, i) => {
                  const x = CL + (i / Math.max(financials.revenueOverview.monthly.length - 1, 1)) * CW;
                  return <text key={item.month} x={x} y={CT + CH + 18} textAnchor="middle" className="fill-slate-400" fontSize="10">{item.label}</text>;
                })}
              </svg>
              {/* Tooltip */}
              {revHover !== null && revCoords[revHover] && (() => {
                const item = financials.revenueOverview.monthly[revHover];
                const pctX = (revCoords[revHover].x / (CL + CW + 10)) * 100;
                return (
                  <div className="pointer-events-none absolute z-20" style={{ left: `${pctX}%`, top: '40%', transform: 'translate(-50%, -50%)' }}>
                    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                      <p className="font-bold text-slate-800 mb-1">{item.label}</p>
                      <p className="text-slate-600">● Revenue: <span className="font-semibold text-slate-900">{formatMoney(item.revenue || 0)}</span></p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* ── Costs Breakdown ── */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Costs Breakdown</p>
                <div className="mt-1 flex items-center gap-3">
                  <h2 className="text-3xl font-bold tracking-tight">{formatMoney(financials.costsBreakdown.totalCosts)}</h2>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600"><ArrowUpRight size={13} />-12.1%</span>
                </div>
              </div>
              <div className="flex gap-5 text-xs text-slate-500"><span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-blue-600" />COGS</span><span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-blue-300" />Operating</span></div>
            </div>
            <div className="relative">
              <svg className="w-full" viewBox={`0 0 ${CL + CW + 10} ${CT + CH + 30}`} preserveAspectRatio="xMidYMid meet">
                {/* Y-axis */}
                {costTicks.map((v, i) => {
                  const y = CT + CH - (v / niceCostMax) * CH;
                  return <g key={i}><text x={CL - 6} y={y + 4} textAnchor="end" className="fill-slate-400" fontSize="10">{formatShort(v)}</text><line x1={CL} x2={CL + CW} y1={y} y2={y} stroke="#f1f5f9" strokeWidth="1" /></g>;
                })}
                {/* Bars */}
                {financials.costsBreakdown.monthly.map((item, i) => {
                  const n = financials.costsBreakdown.monthly.length;
                  const barW = (CW / n) * 0.6;
                  const gap = (CW / n) * 0.4;
                  const x = CL + i * (barW + gap) + gap / 2;
                  const cogsH = ((item.cogs || 0) / niceCostMax) * CH;
                  const opexH = ((item.operatingExpenses || 0) / niceCostMax) * CH;
                  const totalH = cogsH + opexH;
                  const baseY = CT + CH;
                  return (
                    <g key={item.month} onMouseEnter={() => setCostHover(i)} onMouseLeave={() => setCostHover(null)} className="cursor-pointer">
                      <rect x={x} y={baseY - totalH} width={barW} height={totalH} rx={3} fill="#bfdbfe" />
                      <rect x={x} y={baseY - cogsH} width={barW} height={cogsH} rx={0} fill="#2563eb" />
                      <text x={x + barW / 2} y={CT + CH + 18} textAnchor="middle" className="fill-slate-400" fontSize="10">{item.label}</text>
                    </g>
                  );
                })}
              </svg>
              {/* Cost tooltip */}
              {costHover !== null && (() => {
                const item = financials.costsBreakdown.monthly[costHover];
                const n = financials.costsBreakdown.monthly.length;
                const pctX = ((CL + (costHover + 0.5) * (CW / n)) / (CL + CW + 10)) * 100;
                return (
                  <div className="pointer-events-none absolute z-20" style={{ left: `${pctX}%`, top: '20%', transform: 'translate(-50%, 0)' }}>
                    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg min-w-[160px]">
                      <p className="font-bold text-slate-800 mb-1">{item.label}</p>
                      <p className="text-slate-600">● COGS: <span className="font-semibold">{formatMoney(item.cogs || 0)}</span></p>
                      <p className="text-slate-600">● Operating: <span className="font-semibold">{formatMoney(item.operatingExpenses || 0)}</span></p>
                      <p className="text-blue-700 font-bold mt-1">Total: {formatMoney(item.totalCosts || 0)}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </section>

        <section className="grid rounded-lg border border-slate-200 bg-white shadow-sm md:grid-cols-4">
          <MetricCard title="Gross Revenue" previous={`${formatMoney(financials.cards.grossRevenue * 0.88)} tháng trước`} value={formatMoney(financials.cards.grossRevenue)} icon={<WalletCards size={16} />} />
          <MetricCard title="Net Profit" previous={`${formatMoney(financials.cards.netProfit * 0.79)} tháng trước`} value={formatMoney(financials.cards.netProfit)} icon={<CreditCard size={16} />} />
          <MetricCard title="Refund Rate" previous="4.2% tháng trước" value={`${financials.cards.refundRate}%`} icon={<BarChart3 size={16} />} />
          <MetricCard title="Avg Transaction" previous={`${formatMoney(financials.cards.avgTransaction * 0.92)} tháng trước`} value={formatMoney(financials.cards.avgTransaction)} icon={<CreditCard size={16} />} />
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200">
                <ShoppingCart size={18} />
              </div>
              <h2 className="text-lg font-bold">Transactions</h2>
              <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                {transactions.pagination.total}
              </span>
            </div>

            <div className="flex flex-col gap-2 md:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search transactions"
                  className="h-10 w-full rounded-md border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 md:w-64"
                />
              </div>
              <select
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value);
                  setPage(1);
                }}
                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">All</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
              <select
                value={method}
                onChange={(event) => {
                  setMethod(event.target.value);
                  setPage(1);
                }}
                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Method</option>
                <option value="payos">PayOS</option>
                <option value="card">Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="paypal">PayPal</option>
              </select>
              <button className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-semibold transition hover:border-blue-300 hover:text-blue-700">
                <Filter size={16} />
                Status
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-md border border-slate-100">
            <table className="w-full min-w-[980px] border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Transaction ID</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Payment Method</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {transactions.items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-slate-100 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-50/70 hover:shadow-sm"
                  >
                    <td className="px-4 py-4 font-bold text-slate-950">{item.transactionId}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                          {initials(item.customerName)}
                        </span>
                        <span className="font-medium text-slate-700">{item.customerName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-bold">
                      {formatMoney(item.amount)}
                    </td>
                    <td className="px-4 py-4">
                      <Badge>{item.type}</Badge>
                    </td>
                    <td className="px-4 py-4">
                      <Badge>{item.paymentMethod.replace('_', ' ')}</Badge>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{formatDate(item.date)}</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-4 py-4 text-right text-slate-400">
                      <MoreHorizontal size={18} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span>Rows per page:</span>
              <span className="rounded-md border border-slate-200 px-3 py-2 text-slate-800">10</span>
              <span>
                {(transactions.pagination.page - 1) * transactions.pagination.limit + 1}-
                {Math.min(
                  transactions.pagination.page * transactions.pagination.limit,
                  transactions.pagination.total,
                )}{' '}
                of {transactions.pagination.total}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <PagerButton onClick={() => setPage(1)}>
                <ChevronsLeft size={16} />
              </PagerButton>
              <PagerButton onClick={() => setPage(Math.max(page - 1, 1))}>
                <ChevronLeft size={16} />
              </PagerButton>
              {[1, 2, 3, 4, 5].map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`h-9 min-w-9 rounded-md px-3 text-sm font-bold transition ${
                    page === pageNumber
                      ? 'bg-blue-600 text-white'
                      : 'border border-slate-200 hover:border-blue-300 hover:text-blue-700'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
              <PagerButton onClick={() => setPage(Math.min(page + 1, transactions.pagination.totalPages))}>
                <ChevronRight size={16} />
              </PagerButton>
              <PagerButton onClick={() => setPage(transactions.pagination.totalPages)}>
                <ChevronsRight size={16} />
              </PagerButton>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  previous,
  value,
  icon,
}: {
  title: string;
  previous: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="border-slate-200 p-6 transition duration-300 hover:bg-blue-50/60 md:border-r last:md:border-r-0">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-500">
        {icon}
        {title}
      </div>
      <p className="text-sm text-slate-500">{previous}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
      <p className="mt-3 flex items-center gap-1 text-sm font-medium text-emerald-600">
        <ArrowUpRight size={14} />
        +14.2% so với tháng trước
      </p>
    </div>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-md border border-slate-200 px-2 py-1 text-xs font-medium capitalize text-slate-600">
      {children}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const classes: Record<string, string> = {
    completed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    paid: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    pending: 'border-amber-200 bg-amber-50 text-amber-700',
    failed: 'border-red-200 bg-red-50 text-red-700',
    refunded: 'border-blue-200 bg-blue-50 text-blue-700',
    cancelled: 'border-slate-200 bg-slate-50 text-slate-600',
  };

  return (
    <span className={`inline-flex rounded-md border px-2 py-1 text-xs font-bold capitalize ${classes[status] || classes.pending}`}>
      {status}
    </span>
  );
}

function PagerButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 transition hover:border-blue-300 hover:text-blue-700"
    >
      {children}
    </button>
  );
}
