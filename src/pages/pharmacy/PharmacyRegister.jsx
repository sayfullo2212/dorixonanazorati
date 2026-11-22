import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, User, Phone, MapPin, FileText, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { REGIONS, DISTRICTS } from '../../data/pharmacies.js';

const STATUS_LABELS = {
  pending: { label: 'Ko\'rib chiqilmoqda', color: 'badge-warning', icon: AlertCircle },
  verified: { label: 'Demo tasdiqlandi', color: 'badge-success', icon: CheckCircle },
  rejected: { label: 'Rad etildi', color: 'badge-danger', icon: AlertCircle },
};

export default function PharmacyRegister() {
  const { actions } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=form, 2=submitted
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submittedPharmacy, setSubmittedPharmacy] = useState(null);

  const [form, setForm] = useState({
    name: '',
    licenseNumber: '',
    tin: '',
    responsiblePerson: '',
    phone: '',
    regionId: '',
    districtId: '',
    address: '',
    lat: '',
    lng: '',
    workingHours: '',
    description: '',
  });

  const districts = form.regionId ? (DISTRICTS[form.regionId] || []) : [];

  const updateField = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Dorixona nomi kiritilishi shart';
    if (!form.licenseNumber.trim()) errs.licenseNumber = 'Litsenziya raqami kiritilishi shart';
    if (!form.tin.trim()) errs.tin = 'STIR kiritilishi shart';
    if (!/^\d{9}$/.test(form.tin.replace(/\s/g, ''))) errs.tin = 'STIR 9 ta raqamdan iborat bo\'lishi kerak';
    if (!form.responsiblePerson.trim()) errs.responsiblePerson = 'Mas\'ul shaxs kiritilishi shart';
    if (!form.phone.trim()) errs.phone = 'Telefon raqami kiritilishi shart';
    if (!form.regionId) errs.regionId = 'Viloyat tanlanishi shart';
    if (!form.address.trim()) errs.address = 'Manzil kiritilishi shart';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    // Simulate verification delay
    await new Promise(r => setTimeout(r, 1500));

    const pharmacyData = {
      ...form,
      lat: parseFloat(form.lat) || null,
      lng: parseFloat(form.lng) || null,
      workingHours: form.workingHours || '09:00 - 20:00',
    };

    actions.registerPharmacy(pharmacyData);
    setSubmittedPharmacy({ ...pharmacyData, status: 'pending' });
    actions.showToast('Ariza muvaffaqiyatli yuborildi!', 'success');
    setLoading(false);
    setStep(2);
  };

  if (step === 2) {
    return (
      <div className="register-page">
        <div className="container py-12">
          <div className="register-success-card">
            <div className="register-success-icon">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="register-success-title">Ariza yuborildi!</h2>
            <p className="register-success-desc">
              Dorixonangiz ro'yxatdan o'tish arizasi qabul qilindi. Demo tekshiruv jarayoni boshlanmoqda.
            </p>

            <div className="register-status-card">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-6 h-6 text-blue-500" />
                <h3 className="font-semibold text-lg">{submittedPharmacy?.name}</h3>
              </div>
              <div className="register-status-row">
                <span className="text-slate-500">Holat:</span>
                <span className="badge badge-warning">Ko'rib chiqilmoqda</span>
              </div>
              <div className="register-status-row">
                <span className="text-slate-500">Litsenziya:</span>
                <span className="font-medium">{submittedPharmacy?.licenseNumber}</span>
              </div>
            </div>

            <div className="register-info-box">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">Demo platforma haqida</p>
                <p className="text-blue-700 text-sm mt-1">
                  Bu demo muhitda litsenziya tekshiruvi avtomatik simulyatsiya qilinadi.
                  Haqiqiy tizimda barcha hujjatlar davlat organlari tomonidan tekshiriladi.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => navigate('/pharmacy/dashboard')} className="btn-primary flex-1">
                Dashboard ga o'tish
              </button>
              <button onClick={() => { setStep(1); setForm({ name: '', licenseNumber: '', tin: '', responsiblePerson: '', phone: '', regionId: '', districtId: '', address: '', lat: '', lng: '', workingHours: '', description: '' }); }} className="btn-secondary flex-1">
                Yangi ariza
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-page">
      <div className="container py-8">
        <div className="register-header">
          <h1 className="register-title">Dorixonani ro'yxatdan o'tkazish</h1>
          <p className="register-subtitle">
            Platformaga qo'shiling va mijozlaringiz sonini oshiring
          </p>
        </div>

        <div className="register-info-banner">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span>
            Bu <strong>demo platforma</strong>. Haqiqiy litsenziya tekshiruvi amalga oshirilmaydi.
            Namuna ma'lumotlar bilan formani to'ldiring.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {/* Basic info */}
          <div className="form-section">
            <div className="form-section-title">
              <Building2 className="w-5 h-5 text-blue-500" />
              Asosiy ma'lumotlar
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Dorixona nomi *</label>
                <input
                  className={`form-input ${errors.name ? 'form-input-error' : ''}`}
                  placeholder="Masalan: Shifo Dorixonasi"
                  value={form.name}
                  onChange={e => updateField('name', e.target.value)}
                />
                {errors.name && <p className="form-error">{errors.name}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Litsenziya raqami *</label>
                <input
                  className={`form-input ${errors.licenseNumber ? 'form-input-error' : ''}`}
                  placeholder="DX-2024-XXXXXX"
                  value={form.licenseNumber}
                  onChange={e => updateField('licenseNumber', e.target.value)}
                />
                {errors.licenseNumber && <p className="form-error">{errors.licenseNumber}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">STIR (9 ta raqam) *</label>
                <input
                  className={`form-input ${errors.tin ? 'form-input-error' : ''}`}
                  placeholder="123456789"
                  value={form.tin}
                  onChange={e => updateField('tin', e.target.value.replace(/\D/g, '').slice(0, 9))}
                />
                {errors.tin && <p className="form-error">{errors.tin}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Mas'ul shaxs *</label>
                <input
                  className={`form-input ${errors.responsiblePerson ? 'form-input-error' : ''}`}
                  placeholder="To'liq ismi sharifi"
                  value={form.responsiblePerson}
                  onChange={e => updateField('responsiblePerson', e.target.value)}
                />
                {errors.responsiblePerson && <p className="form-error">{errors.responsiblePerson}</p>}
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="form-section">
            <div className="form-section-title">
              <Phone className="w-5 h-5 text-blue-500" />
              Aloqa va manzil
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Telefon raqami *</label>
                <input
                  className={`form-input ${errors.phone ? 'form-input-error' : ''}`}
                  placeholder="+998 71 XXX-XX-XX"
                  value={form.phone}
                  onChange={e => updateField('phone', e.target.value)}
                />
                {errors.phone && <p className="form-error">{errors.phone}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Ish vaqti</label>
                <input
                  className="form-input"
                  placeholder="08:00 - 22:00"
                  value={form.workingHours}
                  onChange={e => updateField('workingHours', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Viloyat *</label>
                <select
                  className={`form-input ${errors.regionId ? 'form-input-error' : ''}`}
                  value={form.regionId}
                  onChange={e => { updateField('regionId', e.target.value); updateField('districtId', ''); }}
                >
                  <option value="">Viloyatni tanlang</option>
                  {REGIONS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
                {errors.regionId && <p className="form-error">{errors.regionId}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Tuman</label>
                <select
                  className="form-input"
                  value={form.districtId}
                  onChange={e => updateField('districtId', e.target.value)}
                  disabled={!form.regionId}
                >
                  <option value="">Tumanni tanlang</option>
                  {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className="form-group form-col-2">
                <label className="form-label">To'liq manzil *</label>
                <input
                  className={`form-input ${errors.address ? 'form-input-error' : ''}`}
                  placeholder="Ko'cha, uy raqami"
                  value={form.address}
                  onChange={e => updateField('address', e.target.value)}
                />
                {errors.address && <p className="form-error">{errors.address}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Kenglik (lat)</label>
                <input
                  className="form-input"
                  placeholder="41.2995"
                  value={form.lat}
                  onChange={e => updateField('lat', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Uzunlik (lng)</label>
                <input
                  className="form-input"
                  placeholder="69.2401"
                  value={form.lng}
                  onChange={e => updateField('lng', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="form-section">
            <div className="form-section-title">
              <FileText className="w-5 h-5 text-blue-500" />
              Qo'shimcha ma'lumot
            </div>
            <div className="form-group">
              <label className="form-label">Dorixona haqida</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="Dorixonangiz haqida qisqacha ma'lumot..."
                value={form.description}
                onChange={e => updateField('description', e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <span className="loading-spinner-sm" />
                Tekshirilmoqda...
              </span>
            ) : 'Arizani yuborish'}
          </button>
        </form>
      </div>
    </div>
  );
}
