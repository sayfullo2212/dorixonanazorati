import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, CheckCircle, Package, Info, Pill } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import Badge from '../../components/ui/Badge.jsx';

function formatPrice(price) {
  return price.toLocaleString('uz-UZ') + ' so\'m';
}

export default function AddMedicine() {
  const { state, actions, selectors } = useApp();
  const navigate = useNavigate();

  const pharmacyId = state.currentUser?.pharmacyId || 'ph-001';
  const pharmacy = selectors.getPharmacyById(pharmacyId);
  const existingListings = selectors.getListingsForPharmacy(pharmacyId);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [price, setPrice] = useState('');
  const [priceError, setPriceError] = useState('');
  const [step, setStep] = useState(1); // 1=search, 2=confirm, 3=success
  const [added, setAdded] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    const results = state.medicines.filter(m =>
      m.tradeName.toLowerCase().includes(q) ||
      m.inn.toLowerCase().includes(q) ||
      m.manufacturer.toLowerCase().includes(q)
    );
    setSearchResults(results);
  };

  const handleSelect = (med) => {
    setSelectedMedicine(med);
    // Check if already listed
    const existing = existingListings.find(l => l.medicineId === med.id);
    if (existing) {
      setPrice(String(existing.price));
    } else {
      setPrice('');
    }
    setStep(2);
  };

  const handleAdd = () => {
    const priceVal = parseInt(price.replace(/\s/g, ''), 10);
    if (!priceVal || priceVal <= 0) {
      setPriceError('Narxni to\'g\'ri kiriting');
      return;
    }
    if (priceVal > 10000000) {
      setPriceError('Narx 10,000,000 so\'mdan oshmasligi kerak');
      return;
    }
    setPriceError('');

    actions.addListing({ pharmacyId, medicineId: selectedMedicine.id, price: priceVal });
    const isUpdate = existingListings.some(l => l.medicineId === selectedMedicine.id);
    actions.showToast(
      isUpdate ? 'Narx muvaffaqiyatli yangilandi!' : 'Dori muvaffaqiyatli qo\'shildi!',
      'success'
    );
    setAdded({ medicine: selectedMedicine, price: priceVal, isUpdate });
    setStep(3);
  };

  const isAlreadyListed = (medicineId) => existingListings.some(l => l.medicineId === medicineId);

  if (step === 3 && added) {
    return (
      <div className="add-medicine-page">
        <div className="container py-12">
          <div className="add-success-card">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="add-success-title">
              {added.isUpdate ? 'Narx yangilandi!' : 'Dori qo\'shildi!'}
            </h2>
            <div className="add-success-medicine">
              <div className="add-success-med-name">{added.medicine.tradeName}</div>
              <div className="add-success-med-details">
                {added.medicine.strength} · {added.medicine.dosageForm} · {added.medicine.packageSize}
              </div>
              <div className="add-success-price">{formatPrice(added.price)}</div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                className="btn-secondary flex-1"
                onClick={() => { setStep(1); setSelectedMedicine(null); setSearchQuery(''); setSearchResults([]); setPrice(''); }}
              >
                Boshqa dori qo'shish
              </button>
              <button className="btn-primary flex-1" onClick={() => navigate('/pharmacy/dashboard')}>
                Dashboard ga qaytish
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-medicine-page">
      <div className="container py-8">
        <div className="add-medicine-header">
          <h1 className="add-medicine-title">Dori qo'shish</h1>
          <p className="add-medicine-subtitle">
            Markaziy katalogdan dori tanlang va narxini belgilang
          </p>
        </div>

        {/* Step indicator */}
        <div className="steps-indicator">
          {['Katalogdan qidirish', 'Narx belgilash', 'Tasdiqlash'].map((s, i) => (
            <div key={i} className={`step-item ${step > i + 1 ? 'step-done' : step === i + 1 ? 'step-active' : 'step-inactive'}`}>
              <div className="step-num">{step > i + 1 ? '✓' : i + 1}</div>
              <span className="step-label">{s}</span>
              {i < 2 && <div className={`step-line ${step > i + 1 ? 'step-line-done' : ''}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Search */}
        {step === 1 && (
          <div className="add-step-card">
            <div className="add-step-header">
              <Search className="w-6 h-6 text-blue-500" />
              <div>
                <h2 className="add-step-title">Markaziy katalogdan qidiring</h2>
                <p className="add-step-desc">Dori nomi, INN yoki ishlab chiqaruvchi bo'yicha qidiring</p>
              </div>
            </div>

            <div className="add-info-banner">
              <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="text-sm text-blue-700">
                Dori katalogi namunali ma'lumotlar. Haqiqiy tizimda rasmiy farmatsevtika ro'yxatiga ulanadi.
              </span>
            </div>

            <form onSubmit={handleSearch} className="add-search-form">
              <div className="search-input-box">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  className="search-input-field"
                  placeholder="Dori nomi, INN yoki ishlab chiqaruvchi..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
              <button type="submit" className="btn-primary">Qidirish</button>
            </form>

            {/* Quick access to all medicines */}
            {searchResults.length === 0 && searchQuery === '' && (
              <div>
                <p className="text-sm text-slate-500 mb-3">Yoki barcha mavjud dorilarni ko'ring:</p>
                <div className="catalog-grid">
                  {state.medicines.map(med => (
                    <div
                      key={med.id}
                      className={`catalog-item ${isAlreadyListed(med.id) ? 'catalog-item-listed' : ''}`}
                      onClick={() => handleSelect(med)}
                    >
                      <div className="catalog-item-name">{med.tradeName}</div>
                      <div className="catalog-item-inn">{med.inn}</div>
                      <div className="catalog-item-strength">{med.strength} · {med.dosageForm}</div>
                      {isAlreadyListed(med.id) && (
                        <span className="catalog-item-badge">
                          <CheckCircle className="w-3 h-3" />
                          Qo'shilgan
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search results */}
            {searchResults.length > 0 && (
              <div>
                <p className="text-sm text-slate-500 mb-3">{searchResults.length} ta natija topildi:</p>
                <div className="catalog-grid">
                  {searchResults.map(med => (
                    <div
                      key={med.id}
                      className={`catalog-item ${isAlreadyListed(med.id) ? 'catalog-item-listed' : ''}`}
                      onClick={() => handleSelect(med)}
                    >
                      <div className="catalog-item-name">{med.tradeName}</div>
                      <div className="catalog-item-inn">{med.inn}</div>
                      <div className="catalog-item-strength">{med.strength} · {med.dosageForm} · {med.packageSize}</div>
                      <div className="catalog-item-manufacturer">{med.manufacturer}</div>
                      {isAlreadyListed(med.id) && (
                        <span className="catalog-item-badge">
                          <CheckCircle className="w-3 h-3" />
                          Allaqachon qo'shilgan — tahrirlash
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchResults.length === 0 && searchQuery.trim() && (
              <div className="no-results text-center py-8">
                <Package className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500">Natija topilmadi. Boshqa so'z bilan qidiring.</p>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Price entry */}
        {step === 2 && selectedMedicine && (
          <div className="add-step-card">
            <div className="add-step-header">
              <Pill className="w-6 h-6 text-blue-500" />
              <div>
                <h2 className="add-step-title">Narxni belgilang</h2>
                <p className="add-step-desc">Katalogdan yuklangan ma'lumotlarni tekshiring va narx kiriting</p>
              </div>
            </div>

            {/* Medicine info (auto-loaded from catalog) */}
            <div className="medicine-preview-card">
              <div className="medicine-preview-header">
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                  ✓ Katalogdan yuklandi
                </span>
              </div>
              <div className="medicine-preview-grid">
                {[
                  ['Savdo nomi', selectedMedicine.tradeName],
                  ['INN / Faol modda', selectedMedicine.inn],
                  ['Ishlab chiqaruvchi', selectedMedicine.manufacturer],
                  ['Kuch (dozaj)', selectedMedicine.strength],
                  ['Dori shakli', selectedMedicine.dosageForm],
                  ['Qadoq hajmi', selectedMedicine.packageSize],
                  ['Shtrix-kod', selectedMedicine.barcode || '—'],
                  ['Kategoriya', selectedMedicine.category],
                ].map(([label, value]) => (
                  <div key={label} className="medicine-preview-item">
                    <span className="medicine-preview-label">{label}</span>
                    <span className="medicine-preview-value">{value}</span>
                  </div>
                ))}
              </div>
              {selectedMedicine.regulatoryPrice && (
                <div className="medicine-reg-price">
                  <Info className="w-4 h-4 text-amber-500" />
                  <span>Belgilangan chegara narxi: <strong>{formatPrice(selectedMedicine.regulatoryPrice)}</strong></span>
                </div>
              )}
            </div>

            {/* Price input */}
            <div className="price-input-section">
              <label className="form-label">Chakana sotish narxi (so'mda) *</label>
              <div className="price-input-wrapper">
                <input
                  type="number"
                  className={`form-input price-input ${priceError ? 'form-input-error' : ''}`}
                  placeholder="Masalan: 12500"
                  value={price}
                  onChange={e => { setPrice(e.target.value); setPriceError(''); }}
                  min="1"
                  autoFocus
                />
                <span className="price-unit">so'm</span>
              </div>
              {priceError && <p className="form-error">{priceError}</p>}
              {price && !priceError && selectedMedicine.regulatoryPrice && parseInt(price) > selectedMedicine.regulatoryPrice && (
                <p className="form-warning">
                  ⚠️ Belgilangan chegara narxidan ({formatPrice(selectedMedicine.regulatoryPrice)}) yuqori
                </p>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button className="btn-secondary flex-1" onClick={() => setStep(1)}>
                Orqaga
              </button>
              <button className="btn-primary flex-1" onClick={handleAdd}>
                {isAlreadyListed(selectedMedicine.id) ? 'Narxni yangilash' : 'Qo\'shish'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
