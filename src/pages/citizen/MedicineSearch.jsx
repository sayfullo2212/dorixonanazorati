import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, Filter, ArrowUpDown, Phone, Clock, ChevronDown, Package, AlertCircle, Pill } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { REGIONS, DISTRICTS } from '../../data/pharmacies.js';
import Badge from '../../components/ui/Badge.jsx';

function formatPrice(price) {
  return price.toLocaleString('uz-UZ') + ' so\'m';
}

function formatDate(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' });
}

function PharmacyResultCard({ medicine, listing, pharmacy }) {
  const reg = medicine.regulatoryPrice;
  const isOverLimit = reg && listing.price > reg;

  return (
    <div className="result-card">
      <div className="result-card-header">
        <div className="result-pharmacy-info">
          <div className="result-pharmacy-name">{pharmacy.name}</div>
          <div className="result-pharmacy-address">
            <MapPin className="w-3.5 h-3.5" />
            {pharmacy.address}
          </div>
        </div>
        <div className="result-price-col">
          <div className={`result-price ${isOverLimit ? 'text-red-500' : ''}`}>
            {formatPrice(listing.price)}
          </div>
          {isOverLimit && (
            <Badge variant="danger" size="xs">Limit oshgan</Badge>
          )}
          {reg && !isOverLimit && (
            <Badge variant="success" size="xs">Ruxsat doirasida</Badge>
          )}
        </div>
      </div>

      <div className="result-card-medicine">
        <div className="result-med-detail">
          <Pill className="w-3.5 h-3.5 text-blue-400" />
          <span>{medicine.tradeName}</span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-400">{medicine.strength}</span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-400">{medicine.dosageForm}</span>
        </div>
        <div className="result-med-manufacturer text-slate-500 text-xs mt-1">
          {medicine.manufacturer} · {medicine.packageSize}
        </div>
      </div>

      <div className="result-card-footer">
        <div className="result-meta">
          <span className="result-meta-item">
            <Clock className="w-3.5 h-3.5" />
            Yangilangan: {formatDate(listing.updatedAt)}
          </span>
          <span className="result-meta-item">
            <Phone className="w-3.5 h-3.5" />
            {pharmacy.phone}
          </span>
          <span className="result-meta-item">
            <Clock className="w-3.5 h-3.5" />
            {pharmacy.workingHours}
          </span>
        </div>
        <div className="result-actions">
          <Link to="/citizen/map" className="result-map-btn">
            <MapPin className="w-3.5 h-3.5" />
            Xaritada
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MedicineSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { state, selectors } = useApp();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [regionId, setRegionId] = useState(searchParams.get('region') || '');
  const [districtId, setDistrictId] = useState('');
  const [sortBy, setSortBy] = useState('price');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const districts = regionId ? (DISTRICTS[regionId] || []) : [];

  const doSearch = () => {
    const r = selectors.searchMedicines(query, regionId || null, districtId || null, sortBy);
    setResults(r);
    setHasSearched(true);
  };

  useEffect(() => {
    if (searchParams.get('q')) {
      setQuery(searchParams.get('q'));
      const r = selectors.searchMedicines(
        searchParams.get('q'),
        searchParams.get('region') || null,
        null,
        'price'
      );
      setResults(r);
      setHasSearched(true);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ q: query, region: regionId });
    doSearch();
  };

  // Group results by medicine
  const groupedResults = {};
  for (const r of results) {
    const key = r.medicine.id;
    if (!groupedResults[key]) groupedResults[key] = { medicine: r.medicine, entries: [] };
    groupedResults[key].entries.push(r);
  }

  return (
    <div className="search-page">
      <div className="container py-8">
        {/* Search bar */}
        <div className="search-page-header">
          <h1 className="search-page-title">Dori qidirish</h1>
          <p className="search-page-subtitle">Dorixonalardagi haqiqiy narxlarni solishtiring</p>
        </div>

        <form onSubmit={handleSearch} className="search-form-box">
          <div className="search-row">
            <div className="search-input-box">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Dori nomi, INN yoki ishlab chiqaruvchi..."
                className="search-input-field"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary">
              <Search className="w-4 h-4" />
              Qidirish
            </button>
          </div>

          <div className="search-filter-row">
            <select
              className="filter-select"
              value={regionId}
              onChange={e => { setRegionId(e.target.value); setDistrictId(''); }}
            >
              <option value="">Barcha viloyatlar</option>
              {REGIONS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>

            {districts.length > 0 && (
              <select
                className="filter-select"
                value={districtId}
                onChange={e => setDistrictId(e.target.value)}
              >
                <option value="">Barcha tumanlar</option>
                {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            )}

            <select
              className="filter-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="price">Narz bo'yicha (arzon)</option>
              <option value="distance">Masofa bo'yicha</option>
            </select>
          </div>
        </form>

        {/* Results */}
        {hasSearched && (
          <div className="search-results">
            {results.length === 0 ? (
              <div className="no-results">
                <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="no-results-title">Natija topilmadi</h3>
                <p className="no-results-desc">
                  "{query}" bo'yicha hech qanday natija topilmadi.
                  Qidiruv so'zini o'zgartiring yoki boshqa hududni tanlang.
                </p>
                <div className="no-results-suggestions">
                  <p className="font-medium text-slate-600 mb-2">Tavsiya etiladi:</p>
                  {['Paracetamol', 'Ibuprofen', 'No-Shpa', 'Citramon'].map(s => (
                    <button
                      key={s}
                      className="suggestion-tag"
                      onClick={() => { setQuery(s); }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="results-summary">
                  <span className="results-count">
                    {Object.keys(groupedResults).length} ta dori, {results.length} ta narx topildi
                  </span>
                  <span className="results-demo-note">
                    <AlertCircle className="w-4 h-4" />
                    Demo ma'lumotlar — real narxlar emas
                  </span>
                </div>

                {Object.values(groupedResults).map(({ medicine, entries }) => (
                  <div key={medicine.id} className="medicine-group">
                    <div className="medicine-group-header">
                      <div>
                        <h2 className="medicine-group-name">{medicine.tradeName}</h2>
                        <div className="medicine-group-details">
                          <span className="medicine-inn">{medicine.inn}</span>
                          <span className="text-slate-300">·</span>
                          <span>{medicine.strength}</span>
                          <span className="text-slate-300">·</span>
                          <span>{medicine.dosageForm}</span>
                          <span className="text-slate-300">·</span>
                          <span>{medicine.packageSize}</span>
                        </div>
                        <div className="medicine-manufacturer">{medicine.manufacturer}</div>
                      </div>
                      <Badge variant="info">{medicine.category}</Badge>
                    </div>

                    <div className="medicine-listings">
                      {entries.map((e, i) => (
                        <PharmacyResultCard
                          key={`${e.listing.id}-${i}`}
                          medicine={e.medicine}
                          listing={e.listing}
                          pharmacy={e.pharmacy}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {!hasSearched && (
          <div className="search-placeholder">
            <Search className="w-20 h-20 text-slate-200 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-slate-400">Dori qidiring</h3>
            <p className="text-slate-400 mt-2">
              Dori nomini kiriting va yaqin dorixonalardagi narxlarni solishtiring
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
