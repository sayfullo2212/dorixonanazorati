import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useApp } from '../../store/AppContext';

function formatPrice(price) {
  return price.toLocaleString('uz-UZ') + ' so\'m';
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' });
}

export default function PriceHistory() {
  const { state, selectors } = useApp();
  const navigate = useNavigate();
  const pharmacyId = state.currentUser?.pharmacyId || 'ph-001';
  const listings = selectors.getListingsForPharmacy(pharmacyId);

  const [selectedMedicineId, setSelectedMedicineId] = useState(
    listings.length > 0 ? listings[0].medicineId : null
  );

  const history = selectedMedicineId
    ? selectors.getPriceHistoryForListing(pharmacyId, selectedMedicineId)
    : [];

  const selectedMed = selectedMedicineId ? selectors.getMedicineById(selectedMedicineId) : null;

  const chartData = history.map(h => ({
    date: formatDate(h.recordedAt),
    narx: h.price,
  }));

  return (
    <div className="price-history-page">
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-6">
          <button className="btn-secondary-sm" onClick={() => navigate('/pharmacy/dashboard')}>
            <ArrowLeft className="w-4 h-4" />
            Orqaga
          </button>
          <div>
            <h1 className="page-title">Narx tarixi</h1>
            <p className="page-subtitle">Narx o'zgarishlarini kuzating</p>
          </div>
        </div>

        {/* Medicine selector */}
        <div className="medicine-selector-row">
          <label className="form-label">Dori tanlang:</label>
          <select
            className="filter-select w-auto"
            value={selectedMedicineId || ''}
            onChange={e => setSelectedMedicineId(e.target.value)}
          >
            {listings.map(l => {
              const med = selectors.getMedicineById(l.medicineId);
              return med ? <option key={l.medicineId} value={l.medicineId}>{med.tradeName}</option> : null;
            })}
          </select>
        </div>

        {selectedMed && history.length > 0 ? (
          <>
            <div className="history-medicine-info">
              <h2 className="text-xl font-bold text-slate-800">{selectedMed.tradeName}</h2>
              <p className="text-slate-500">{selectedMed.strength} · {selectedMed.dosageForm}</p>
            </div>

            {/* Chart */}
            <div className="history-chart-card">
              <h3 className="chart-title">Narx dinamikasi</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickFormatter={v => `${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    formatter={(value) => [formatPrice(value), 'Narx']}
                    contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="narx"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={{ fill: '#3b82f6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Table */}
            <div className="history-table-card">
              <h3 className="chart-title mb-4">O'zgarishlar jadvali</h3>
              <table className="listings-table">
                <thead>
                  <tr>
                    <th>Sana</th>
                    <th>Narx</th>
                    <th>O'zgarish</th>
                  </tr>
                </thead>
                <tbody>
                  {[...history].reverse().map(h => {
                    const change = h.changePercent;
                    const isUp = change > 0;
                    const isDown = change < 0;
                    return (
                      <tr key={h.id}>
                        <td className="text-sm text-slate-600">{new Date(h.recordedAt).toLocaleString('uz-UZ')}</td>
                        <td><span className="listing-price">{formatPrice(h.price)}</span></td>
                        <td>
                          {change === null ? (
                            <span className="flex items-center gap-1 text-slate-400 text-sm">
                              <Minus className="w-3 h-3" /> Birinchi narx
                            </span>
                          ) : isUp ? (
                            <span className="flex items-center gap-1 text-red-600 text-sm font-medium">
                              <TrendingUp className="w-4 h-4" />
                              +{change}%
                              {Math.abs(change) > 15 && <span className="badge badge-danger text-xs ml-1">Shubhali</span>}
                            </span>
                          ) : isDown ? (
                            <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                              <TrendingDown className="w-4 h-4" />
                              {change}%
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-slate-400 text-sm">
                              <Minus className="w-3 h-3" /> O'zgarishsiz
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="no-results text-center py-12">
            <TrendingUp className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500">
              {listings.length === 0 ? 'Hali hech qanday dori qo\'shilmagan' : 'Narx tarixi topilmadi'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
