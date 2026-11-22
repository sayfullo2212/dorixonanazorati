import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, TrendingUp, Package, Clock, CheckCircle, AlertCircle, Building2, Phone, MapPin } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { REGIONS } from '../../data/pharmacies.js';
import Badge from '../../components/ui/Badge.jsx';
import Modal from '../../components/ui/Modal.jsx';

function formatPrice(price) {
  return price.toLocaleString('uz-UZ') + ' so\'m';
}

function formatDate(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' });
}

const statusConfig = {
  verified: { label: 'Tasdiqlangan', variant: 'success', icon: CheckCircle },
  pending: { label: 'Ko\'rib chiqilmoqda', variant: 'warning', icon: AlertCircle },
  rejected: { label: 'Rad etildi', variant: 'danger', icon: AlertCircle },
};

export default function PharmacyDashboard() {
  const { state, actions, selectors } = useApp();
  const navigate = useNavigate();
  const pharmacyId = state.currentUser?.pharmacyId || 'ph-001';
  const pharmacy = selectors.getPharmacyById(pharmacyId);
  const listings = selectors.getListingsForPharmacy(pharmacyId);

  const [editModal, setEditModal] = useState(null); // { listing, medicine }
  const [newPrice, setNewPrice] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  if (!pharmacy) {
    return (
      <div className="dashboard-page">
        <div className="container py-16 text-center">
          <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-600">Dorixona topilmadi</h2>
          <p className="text-slate-500 mt-2 mb-6">Avval ro'yxatdan o'ting</p>
          <Link to="/pharmacy/register" className="btn-primary">
            Ro'yxatdan o'tish
          </Link>
        </div>
      </div>
    );
  }

  const statusCfg = statusConfig[pharmacy.status] || statusConfig.pending;
  const StatusIcon = statusCfg.icon;
  const regionName = REGIONS.find(r => r.id === pharmacy.regionId)?.name || pharmacy.regionId;

  const handleUpdatePrice = () => {
    const price = parseInt(newPrice.replace(/\s/g, ''), 10);
    if (!price || price <= 0) return;
    actions.updateListingPrice(editModal.listing.id, price);
    actions.showToast(`Narx yangilandi: ${formatPrice(price)}`, 'success');
    setEditModal(null);
    setNewPrice('');
  };

  const handleDelete = (listingId) => {
    actions.removeListing(listingId);
    actions.showToast('Dori ro\'yxatdan o\'chirildi', 'info');
    setDeleteConfirm(null);
  };

  return (
    <div className="dashboard-page">
      <div className="container py-8">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">{pharmacy.name}</h1>
            <p className="dashboard-subtitle">Dorixona boshqaruv paneli</p>
          </div>
          <button
            className="btn-primary"
            onClick={() => navigate('/pharmacy/medicines')}
          >
            <Plus className="w-4 h-4" />
            Dori qo'shish
          </button>
        </div>

        {/* Pharmacy profile card */}
        <div className="profile-card">
          <div className="profile-card-header">
            <div className="profile-icon">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div className="profile-info">
              <h2 className="profile-name">{pharmacy.name}</h2>
              <div className="profile-meta">
                <span><MapPin className="w-3.5 h-3.5 inline mr-1" />{pharmacy.address}</span>
                <span><Phone className="w-3.5 h-3.5 inline mr-1" />{pharmacy.phone}</span>
                <span>📍 {regionName}</span>
              </div>
            </div>
            <Badge variant={statusCfg.variant}>
              <StatusIcon className="w-3.5 h-3.5 inline mr-1" />
              {statusCfg.label}
            </Badge>
          </div>

          <div className="profile-details-grid">
            <div className="profile-detail-item">
              <span className="profile-detail-label">Litsenziya raqami</span>
              <span className="profile-detail-value">{pharmacy.licenseNumber}</span>
            </div>
            <div className="profile-detail-item">
              <span className="profile-detail-label">STIR</span>
              <span className="profile-detail-value">{pharmacy.tin}</span>
            </div>
            <div className="profile-detail-item">
              <span className="profile-detail-label">Mas'ul shaxs</span>
              <span className="profile-detail-value">{pharmacy.responsiblePerson}</span>
            </div>
            <div className="profile-detail-item">
              <span className="profile-detail-label">Ish vaqti</span>
              <span className="profile-detail-value">{pharmacy.workingHours || '—'}</span>
            </div>
            <div className="profile-detail-item">
              <span className="profile-detail-label">Ro'yxatdan o'tgan</span>
              <span className="profile-detail-value">{formatDate(pharmacy.registeredAt)}</span>
            </div>
            <div className="profile-detail-item">
              <span className="profile-detail-label">Tasdiqlangan</span>
              <span className="profile-detail-value">{pharmacy.verifiedAt ? formatDate(pharmacy.verifiedAt) : '—'}</span>
            </div>
          </div>

          {pharmacy.status === 'pending' && (
            <div className="profile-pending-notice">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <span>Dorixonangiz hozir ko'rib chiqilmoqda. Tasdiqlangandan so'ng dori qo'sha olasiz.</span>
            </div>
          )}
          {pharmacy.status === 'rejected' && (
            <div className="profile-rejected-notice">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span>Ro'yxatdan o'tish rad etildi. {pharmacy.rejectionReason}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="dashboard-stats-grid">
          {[
            { label: 'Jami dorilar', value: listings.length, icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'Narx yangilanishlari', value: state.priceHistory.filter(h => h.pharmacyId === pharmacyId).length, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' },
            { label: 'Oxirgi yangilanish', value: listings.length > 0 ? formatDate(Math.max(...listings.map(l => new Date(l.updatedAt))).toString()) : '—', icon: Clock, color: 'text-purple-500', bg: 'bg-purple-50', isText: true },
          ].map((s, i) => (
            <div key={i} className="dashboard-stat-card">
              <div className={`dashboard-stat-icon ${s.bg}`}>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
              <div>
                <div className="dashboard-stat-value">{s.isText ? s.value : s.value.toLocaleString()}</div>
                <div className="dashboard-stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Medicine listings */}
        <div className="listings-section">
          <div className="listings-header">
            <h2 className="listings-title">E'lon qilingan dorilar</h2>
            <button className="btn-primary-sm" onClick={() => navigate('/pharmacy/medicines')}>
              <Plus className="w-4 h-4" />
              Yangi dori
            </button>
          </div>

          {listings.length === 0 ? (
            <div className="listings-empty">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">Hali hech qanday dori qo'shilmagan</p>
              <button className="btn-primary mt-4" onClick={() => navigate('/pharmacy/medicines')}>
                <Plus className="w-4 h-4" />
                Dori qo'shish
              </button>
            </div>
          ) : (
            <div className="listings-table-wrapper">
              <table className="listings-table">
                <thead>
                  <tr>
                    <th>Dori nomi</th>
                    <th>INN / Faol modda</th>
                    <th>Kuch · Shakl</th>
                    <th>Narx</th>
                    <th>Yangilangan</th>
                    <th>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map(listing => {
                    const med = selectors.getMedicineById(listing.medicineId);
                    if (!med) return null;
                    return (
                      <tr key={listing.id}>
                        <td>
                          <div className="listing-name">{med.tradeName}</div>
                          <div className="listing-manufacturer text-xs text-slate-400">{med.manufacturer}</div>
                        </td>
                        <td className="text-sm text-slate-600">{med.inn}</td>
                        <td className="text-sm text-slate-600">{med.strength} · {med.dosageForm}</td>
                        <td>
                          <span className="listing-price">{formatPrice(listing.price)}</span>
                        </td>
                        <td className="text-sm text-slate-500">{formatDate(listing.updatedAt)}</td>
                        <td>
                          <div className="listing-actions">
                            <button
                              className="action-btn-edit"
                              onClick={() => { setEditModal({ listing, medicine: med }); setNewPrice(String(listing.price)); }}
                              title="Narxni tahrirlash"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              className="action-btn-delete"
                              onClick={() => setDeleteConfirm(listing.id)}
                              title="O'chirish"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Price history link */}
        {listings.length > 0 && (
          <div className="text-center mt-4">
            <Link to="/pharmacy/history" className="text-blue-600 hover:underline text-sm font-medium">
              <TrendingUp className="w-4 h-4 inline mr-1" />
              Narx tarixini ko'rish
            </Link>
          </div>
        )}
      </div>

      {/* Edit price modal */}
      <Modal
        isOpen={!!editModal}
        onClose={() => setEditModal(null)}
        title="Narxni yangilash"
        size="sm"
      >
        {editModal && (
          <div className="edit-price-modal">
            <div className="edit-medicine-info">
              <p className="font-semibold text-slate-800">{editModal.medicine.tradeName}</p>
              <p className="text-sm text-slate-500">{editModal.medicine.strength} · {editModal.medicine.dosageForm}</p>
              <p className="text-sm text-slate-500">Joriy narx: <span className="font-medium text-blue-600">{formatPrice(editModal.listing.price)}</span></p>
            </div>
            <div className="form-group mt-4">
              <label className="form-label">Yangi narx (so'm) *</label>
              <input
                type="number"
                className="form-input"
                placeholder="Masalan: 15000"
                value={newPrice}
                onChange={e => setNewPrice(e.target.value)}
                min="1"
                autoFocus
              />
            </div>
            <div className="edit-price-info">
              <AlertCircle className="w-4 h-4 text-blue-400" />
              Oldingi narx tarix sifatida saqlanib qoladi
            </div>
            <div className="flex gap-3 mt-4">
              <button className="btn-secondary flex-1" onClick={() => setEditModal(null)}>Bekor qilish</button>
              <button className="btn-primary flex-1" onClick={handleUpdatePrice}>Saqlash</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirm modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="O'chirishni tasdiqlash"
        size="sm"
      >
        <p className="text-slate-600 mb-6">Ushbu dorini ro'yxatdan o'chirishni xohlaysizmi?</p>
        <div className="flex gap-3">
          <button className="btn-secondary flex-1" onClick={() => setDeleteConfirm(null)}>Bekor qilish</button>
          <button className="btn-danger flex-1" onClick={() => handleDelete(deleteConfirm)}>O'chirish</button>
        </div>
      </Modal>
    </div>
  );
}
