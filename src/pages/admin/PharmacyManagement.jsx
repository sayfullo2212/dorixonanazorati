import { useState } from 'react';
import { CheckCircle, XCircle, Clock, Eye, Building2, Phone, MapPin } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { REGIONS } from '../../data/pharmacies.js';
import Badge from '../../components/ui/Badge.jsx';
import Modal from '../../components/ui/Modal.jsx';

function formatDate(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' });
}

const statusConfig = {
  verified: { label: 'Tasdiqlangan', variant: 'success' },
  pending: { label: 'Kutilmoqda', variant: 'warning' },
  rejected: { label: 'Rad etildi', variant: 'danger' },
};

export default function PharmacyManagement() {
  const { state, actions, selectors } = useApp();
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [viewModal, setViewModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectModal, setRejectModal] = useState(null);

  const filtered = state.pharmacies.filter(p => {
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (filterRegion !== 'all' && p.regionId !== filterRegion) return false;
    return true;
  });

  const handleApprove = (pharmacyId) => {
    actions.updatePharmacyStatus(pharmacyId, 'verified');
    actions.showToast('Dorixona tasdiqlandi (Demo)', 'success');
    setViewModal(null);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    actions.updatePharmacyStatus(rejectModal, 'rejected', rejectReason);
    actions.showToast('Dorixona rad etildi (Demo)', 'warning');
    setRejectModal(null);
    setRejectReason('');
    setViewModal(null);
  };

  return (
    <div className="admin-page">
      <div className="container py-8">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Dorixonalar boshqaruvi</h1>
            <p className="admin-subtitle">Ro'yxatdan o'tish arizalarini ko'rib chiqing</p>
          </div>
        </div>

        {/* Filters */}
        <div className="admin-filters">
          <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">Barcha holatlar</option>
            <option value="pending">Kutilmoqda</option>
            <option value="verified">Tasdiqlangan</option>
            <option value="rejected">Rad etildi</option>
          </select>
          <select className="filter-select" value={filterRegion} onChange={e => setFilterRegion(e.target.value)}>
            <option value="all">Barcha viloyatlar</option>
            {REGIONS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <span className="text-sm text-slate-500">{filtered.length} ta topildi</span>
        </div>

        {/* Table */}
        <div className="listings-table-wrapper">
          <table className="listings-table">
            <thead>
              <tr>
                <th>Dorixona nomi</th>
                <th>Hudud</th>
                <th>Mas'ul shaxs</th>
                <th>Litsenziya</th>
                <th>Ro'yxat sanasi</th>
                <th>Holat</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(ph => {
                const region = REGIONS.find(r => r.id === ph.regionId);
                const cfg = statusConfig[ph.status] || statusConfig.pending;
                const listingCount = state.listings.filter(l => l.pharmacyId === ph.id).length;
                return (
                  <tr key={ph.id}>
                    <td>
                      <div className="listing-name">{ph.name}</div>
                      <div className="text-xs text-slate-400">{listingCount} ta dori</div>
                    </td>
                    <td className="text-sm text-slate-600">{region?.name || ph.regionId}</td>
                    <td className="text-sm text-slate-600">{ph.responsiblePerson}</td>
                    <td className="text-sm font-mono text-slate-700">{ph.licenseNumber}</td>
                    <td className="text-sm text-slate-500">{formatDate(ph.registeredAt)}</td>
                    <td>
                      <Badge variant={cfg.variant}>{cfg.label}</Badge>
                    </td>
                    <td>
                      <div className="listing-actions">
                        <button
                          className="action-btn-view"
                          onClick={() => setViewModal(ph)}
                          title="Ko'rish"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {ph.status === 'pending' && (
                          <>
                            <button
                              className="action-btn-approve"
                              onClick={() => handleApprove(ph.id)}
                              title="Tasdiqlash"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              className="action-btn-reject"
                              onClick={() => setRejectModal(ph.id)}
                              title="Rad etish"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="no-results text-center py-8">
              <Building2 className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500">Dorixona topilmadi</p>
            </div>
          )}
        </div>
      </div>

      {/* View modal */}
      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Dorixona ma'lumotlari" size="lg">
        {viewModal && (() => {
          const ph = viewModal;
          const cfg = statusConfig[ph.status] || statusConfig.pending;
          const region = REGIONS.find(r => r.id === ph.regionId);
          const listings = state.listings.filter(l => l.pharmacyId === ph.id);
          return (
            <div className="pharmacy-detail-modal">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-bold text-slate-800">{ph.name}</h2>
                <Badge variant={cfg.variant}>{cfg.label}</Badge>
              </div>
              <div className="profile-details-grid mb-6">
                {[
                  ['Litsenziya raqami', ph.licenseNumber],
                  ['STIR', ph.tin],
                  ['Mas\'ul shaxs', ph.responsiblePerson],
                  ['Telefon', ph.phone],
                  ['Hudud', region?.name || ph.regionId],
                  ['Manzil', ph.address],
                  ['Ro\'yxat sanasi', formatDate(ph.registeredAt)],
                  ['Tasdiqlangan', ph.verifiedAt ? formatDate(ph.verifiedAt) : '—'],
                ].map(([label, val]) => (
                  <div key={label} className="profile-detail-item">
                    <span className="profile-detail-label">{label}</span>
                    <span className="profile-detail-value">{val}</span>
                  </div>
                ))}
              </div>

              {listings.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-slate-700 mb-2">E'lon qilingan dorilar ({listings.length} ta)</h3>
                  <div className="max-h-40 overflow-y-auto">
                    {listings.map(l => {
                      const med = selectors.getMedicineById(l.medicineId);
                      return med ? (
                        <div key={l.id} className="flex justify-between py-1 border-b border-slate-100 text-sm">
                          <span>{med.tradeName} · {med.strength}</span>
                          <span className="font-medium text-blue-600">{l.price.toLocaleString()} so'm</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {ph.status === 'pending' && (
                <div className="flex gap-3 mt-6">
                  <button className="btn-success flex-1" onClick={() => handleApprove(ph.id)}>
                    <CheckCircle className="w-4 h-4" />
                    Tasdiqlash (Demo)
                  </button>
                  <button className="btn-danger flex-1" onClick={() => { setRejectModal(ph.id); }}>
                    <XCircle className="w-4 h-4" />
                    Rad etish (Demo)
                  </button>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>

      {/* Reject modal */}
      <Modal isOpen={!!rejectModal} onClose={() => setRejectModal(null)} title="Rad etish sababi" size="sm">
        <p className="text-slate-600 mb-4">Rad etish sababini kiriting:</p>
        <textarea
          className="form-input"
          rows={3}
          placeholder="Masalan: Litsenziya hujjatlari to'liq emas"
          value={rejectReason}
          onChange={e => setRejectReason(e.target.value)}
        />
        <div className="flex gap-3 mt-4">
          <button className="btn-secondary flex-1" onClick={() => setRejectModal(null)}>Bekor</button>
          <button className="btn-danger flex-1" onClick={handleReject} disabled={!rejectReason.trim()}>
            Rad etish
          </button>
        </div>
      </Modal>
    </div>
  );
}
