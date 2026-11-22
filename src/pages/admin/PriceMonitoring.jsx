import { useState, useMemo } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Filter } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useApp } from '../../store/AppContext';
import { REGIONS } from '../../data/pharmacies.js';
import Badge from '../../components/ui/Badge.jsx';

function formatPrice(p) { return p.toLocaleString('uz-UZ') + ' so\'m'; }
function formatDate(s) { return new Date(s).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' }); }

function getStatusInfo(changePercent, med) {
  if (changePercent === null) return { label: 'Birinchi narx', variant: 'default' };
  const abs = Math.abs(changePercent);
  if (med?.regulatoryPrice) {
    // We'd need current price here — simplified check
  }
  if (abs > 15) return { label: 'Tekshirish talab etiladi', variant: 'danger' };
  if (abs > 8) return { label: 'Kuzatuvda', variant: 'warning' };
  return { label: 'Oddiy yangilanish', variant: 'success' };
}

export default function PriceMonitoring() {
  const { state, selectors } = useApp();
  const [filterMed, setFilterMed] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // All history entries with enriched data
  const enriched = useMemo(() => {
    return state.priceHistory.map(h => {
      const med = selectors.getMedicineById(h.medicineId);
      const ph = selectors.getPharmacyById(h.pharmacyId);
      const region = REGIONS.find(r => r.id === ph?.regionId);
      const statusInfo = getStatusInfo(h.changePercent, med);
      return { ...h, med, ph, region, statusInfo };
    }).sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt));
  }, [state.priceHistory, state.medicines, state.pharmacies]);

  const filtered = enriched.filter(e => {
    if (filterMed !== 'all' && e.medicineId !== filterMed) return false;
    if (filterRegion !== 'all' && e.ph?.regionId !== filterRegion) return false;
    if (filterType === 'suspicious' && (!e.changePercent || Math.abs(e.changePercent) <= 15)) return false;
    if (filterType === 'normal' && e.changePercent && Math.abs(e.changePercent) > 15) return false;
    return true;
  });

  // Chart: price trends for a specific medicine
  const trendMedicineId = filterMed !== 'all' ? filterMed : state.medicines[0]?.id;
  const trendMed = selectors.getMedicineById(trendMedicineId);
  const trendData = useMemo(() => {
    if (!trendMedicineId) return [];
    // Group by pharmacy
    const pharmacies = [...new Set(state.priceHistory
      .filter(h => h.medicineId === trendMedicineId)
      .map(h => h.pharmacyId))].slice(0, 3);
    
    const allDates = [...new Set(state.priceHistory
      .filter(h => h.medicineId === trendMedicineId)
      .map(h => new Date(h.recordedAt).toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric' }))
    )];

    return allDates.map(date => {
      const point = { date };
      pharmacies.forEach(phId => {
        const ph = selectors.getPharmacyById(phId);
        const entry = state.priceHistory.find(h =>
          h.medicineId === trendMedicineId &&
          h.pharmacyId === phId &&
          new Date(h.recordedAt).toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric' }) === date
        );
        if (entry && ph) {
          point[ph.name.substring(0, 15)] = entry.price;
        }
      });
      return point;
    });
  }, [trendMedicineId, state.priceHistory]);

  const chartPharmacies = [...new Set(state.priceHistory
    .filter(h => h.medicineId === trendMedicineId)
    .map(h => h.pharmacyId))].slice(0, 3)
    .map(id => selectors.getPharmacyById(id));

  const lineColors = ['#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div className="admin-page">
      <div className="container py-8">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Narx nazorati</h1>
            <p className="admin-subtitle">Narx o'zgarishlarini real vaqtda kuzating</p>
          </div>
        </div>

        {/* Summary badges */}
        <div className="monitoring-summary">
          {[
            { label: 'Jami yangilanish', value: state.priceHistory.length, color: 'blue' },
            { label: 'Shubhali (>15%)', value: state.priceHistory.filter(h => h.changePercent && Math.abs(h.changePercent) > 15).length, color: 'red' },
            { label: 'Kuzatuvda (>8%)', value: state.priceHistory.filter(h => h.changePercent && Math.abs(h.changePercent) > 8 && Math.abs(h.changePercent) <= 15).length, color: 'amber' },
            { label: 'Oddiy', value: state.priceHistory.filter(h => !h.changePercent || Math.abs(h.changePercent) <= 8).length, color: 'green' },
          ].map((s, i) => (
            <div key={i} className={`monitoring-summary-card monitoring-summary-${s.color}`}>
              <div className="monitoring-summary-value">{s.value}</div>
              <div className="monitoring-summary-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Price comparison chart */}
        {trendData.length > 0 && (
          <div className="admin-chart-card mb-6">
            <h3 className="admin-chart-title">
              Narx solishtirmasi: {trendMed?.tradeName}
              <span className="text-sm font-normal text-slate-500 ml-2">(Dorixonalar bo'yicha)</span>
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={trendData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={v => formatPrice(v)} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Legend />
                {chartPharmacies.map((ph, i) => ph && (
                  <Line
                    key={ph.id}
                    type="monotone"
                    dataKey={ph.name.substring(0, 15)}
                    stroke={lineColors[i]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Filters */}
        <div className="admin-filters mb-4">
          <Filter className="w-4 h-4 text-slate-400" />
          <select className="filter-select" value={filterMed} onChange={e => setFilterMed(e.target.value)}>
            <option value="all">Barcha dorilar</option>
            {state.medicines.map(m => <option key={m.id} value={m.id}>{m.tradeName}</option>)}
          </select>
          <select className="filter-select" value={filterRegion} onChange={e => setFilterRegion(e.target.value)}>
            <option value="all">Barcha viloyatlar</option>
            {REGIONS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <select className="filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="all">Barcha holatlar</option>
            <option value="suspicious">Faqat shubhali</option>
            <option value="normal">Oddiy yangilanish</option>
          </select>
          <span className="text-sm text-slate-500">{filtered.length} ta yozuv</span>
        </div>

        {/* Monitoring table */}
        <div className="listings-table-wrapper">
          <table className="listings-table">
            <thead>
              <tr>
                <th>Dori nomi</th>
                <th>Dorixona</th>
                <th>Viloyat</th>
                <th>Narx</th>
                <th>O'zgarish</th>
                <th>Sana</th>
                <th>Holat</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 50).map(e => (
                <tr key={e.id} className={e.statusInfo.variant === 'danger' ? 'row-suspicious' : ''}>
                  <td>
                    <div className="listing-name">{e.med?.tradeName || '—'}</div>
                    <div className="text-xs text-slate-400">{e.med?.strength}</div>
                  </td>
                  <td className="text-sm text-slate-700">{e.ph?.name || '—'}</td>
                  <td className="text-sm text-slate-500">{e.region?.name || '—'}</td>
                  <td><span className="listing-price">{formatPrice(e.price)}</span></td>
                  <td>
                    {e.changePercent === null ? (
                      <span className="text-slate-400 text-sm flex items-center gap-1">
                        <Minus className="w-3 h-3" /> —
                      </span>
                    ) : e.changePercent > 0 ? (
                      <span className="text-red-600 font-medium text-sm flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        +{e.changePercent}%
                      </span>
                    ) : (
                      <span className="text-green-600 font-medium text-sm flex items-center gap-1">
                        <TrendingDown className="w-3.5 h-3.5" />
                        {e.changePercent}%
                      </span>
                    )}
                  </td>
                  <td className="text-sm text-slate-500">{formatDate(e.recordedAt)}</td>
                  <td>
                    <Badge variant={e.statusInfo.variant} size="xs">
                      {e.statusInfo.variant === 'danger' && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                      {e.statusInfo.label}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="no-results text-center py-8">
              <TrendingUp className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500">Yozuv topilmadi</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
