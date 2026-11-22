import { useMemo } from 'react';
import { Building2, Package, TrendingUp, AlertTriangle, Shield, BarChart2, CheckCircle } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import { useApp } from '../../store/AppContext';
import { REGIONS } from '../../data/pharmacies.js';

function formatPrice(p) { return p.toLocaleString('uz-UZ') + ' so\'m'; }

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function AdminDashboard() {
  const { state, selectors } = useApp();
  const stats = selectors.getStats();

  // Pharmacies by region
  const byRegion = useMemo(() => {
    return REGIONS.map(r => ({
      name: r.name.replace(' viloyati', '').replace(' shahri', ''),
      count: state.pharmacies.filter(p => p.regionId === r.id).length,
      verified: state.pharmacies.filter(p => p.regionId === r.id && p.status === 'verified').length,
    }));
  }, [state.pharmacies]);

  // Price trends over months (from history)
  const priceTrends = useMemo(() => {
    const months = ['Sen', 'Okt', 'Noy'];
    return months.map((month, mi) => {
      const relevantHistory = state.priceHistory.filter(h => {
        const d = new Date(h.recordedAt);
        return d.getMonth() === 8 + mi; // Sep=8, Oct=9, Nov=10
      });
      const avgPrice = relevantHistory.length
        ? Math.round(relevantHistory.reduce((s, h) => s + h.price, 0) / relevantHistory.length)
        : 0;
      return { month, avgPrice, count: relevantHistory.length };
    });
  }, [state.priceHistory]);

  // Suspicious changes
  const suspicious = useMemo(() => {
    return state.priceHistory
      .filter(h => h.changePercent && Math.abs(h.changePercent) > 15)
      .slice(-10);
  }, [state.priceHistory]);

  // Status pie data
  const statusData = [
    { name: 'Tasdiqlangan', value: state.pharmacies.filter(p => p.status === 'verified').length },
    { name: 'Kutilmoqda', value: state.pharmacies.filter(p => p.status === 'pending').length },
    { name: 'Rad etildi', value: state.pharmacies.filter(p => p.status === 'rejected').length },
  ];

  return (
    <div className="admin-page">
      <div className="container py-8">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Boshqaruv paneli</h1>
            <p className="admin-subtitle">Milliy dori narx monitoring tizimi — Demo</p>
          </div>
          <div className="admin-header-badge">
            <Shield className="w-5 h-5 text-purple-500" />
            Administrator
          </div>
        </div>

        {/* Stats grid */}
        <div className="admin-stats-grid">
          {[
            { label: 'Jami dorixonalar', value: stats.totalPharmacies, icon: Building2, color: 'blue', sub: `${stats.verifiedPharmacies} tasdiqlangan` },
            { label: 'Dori katalogi', value: stats.totalMedicines, icon: Package, color: 'emerald', sub: 'Namunali ma\'lumotlar' },
            { label: 'Narx e\'lonlari', value: stats.totalListings, icon: BarChart2, color: 'purple', sub: `${stats.totalPriceUpdates} ta yangilanish` },
            { label: 'Shubhali o\'zgarish', value: stats.suspiciousChanges, icon: AlertTriangle, color: 'red', sub: '>15% farq' },
          ].map((s, i) => (
            <div key={i} className={`admin-stat-card admin-stat-${s.color}`}>
              <div className="admin-stat-icon-wrapper">
                <s.icon className="w-6 h-6" />
              </div>
              <div className="admin-stat-body">
                <div className="admin-stat-value">{s.value}</div>
                <div className="admin-stat-label">{s.label}</div>
                <div className="admin-stat-sub">{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="admin-charts-grid">
          {/* Price trend */}
          <div className="admin-chart-card">
            <h3 className="admin-chart-title">O'rtacha narx tendensiyasi</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={priceTrends} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={v => formatPrice(v)} contentStyle={{ borderRadius: 8, fontSize: 13 }} />
                <Area type="monotone" dataKey="avgPrice" stroke="#3b82f6" strokeWidth={2} fill="url(#priceGrad)" name="O'rtacha narx" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pharmacies by region */}
          <div className="admin-chart-card">
            <h3 className="admin-chart-title">Viloyatlar bo'yicha dorixonalar</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={byRegion} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
                <Legend />
                <Bar dataKey="count" name="Jami" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                <Bar dataKey="verified" name="Tasdiqlangan" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status pie */}
          <div className="admin-chart-card admin-chart-sm">
            <h3 className="admin-chart-title">Dorixona holati</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={['#10b981', '#f59e0b', '#ef4444'][index]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Suspicious changes */}
        {suspicious.length > 0 && (
          <div className="admin-alert-section">
            <div className="admin-alert-header">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="admin-alert-title">Shubhali narx o'zgarishlari (Demo)</h3>
            </div>
            <div className="listings-table-wrapper">
              <table className="listings-table">
                <thead>
                  <tr>
                    <th>Dori</th>
                    <th>Dorixona</th>
                    <th>Narx</th>
                    <th>O'zgarish</th>
                    <th>Sana</th>
                  </tr>
                </thead>
                <tbody>
                  {suspicious.map(h => {
                    const med = selectors.getMedicineById(h.medicineId);
                    const ph = selectors.getPharmacyById(h.pharmacyId);
                    return (
                      <tr key={h.id}>
                        <td className="font-medium">{med?.tradeName || '—'}</td>
                        <td className="text-sm text-slate-600">{ph?.name || '—'}</td>
                        <td><span className="listing-price">{formatPrice(h.price)}</span></td>
                        <td>
                          <span className={`font-semibold ${h.changePercent > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {h.changePercent > 0 ? '+' : ''}{h.changePercent}%
                          </span>
                          <span className="badge badge-warning ml-2 text-xs">Tekshirish talab etiladi</span>
                        </td>
                        <td className="text-sm text-slate-500">
                          {new Date(h.recordedAt).toLocaleDateString('uz-UZ')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick links */}
        <div className="admin-quick-links">
          <a href="#/admin/pharmacies" className="admin-quick-link">
            <Building2 className="w-5 h-5" />
            Dorixonalarni boshqarish
          </a>
          <a href="#/admin/prices" className="admin-quick-link">
            <TrendingUp className="w-5 h-5" />
            Narx nazorati
          </a>
        </div>
      </div>
    </div>
  );
}
