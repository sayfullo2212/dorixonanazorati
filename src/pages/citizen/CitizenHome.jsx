import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, TrendingUp, Shield, ChevronRight, Star, Clock, ArrowRight } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { REGIONS } from '../../data/pharmacies.js';
import { MEDICINE_CATEGORIES } from '../../data/medicines.js';

export default function CitizenHome() {
  const { state, selectors } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const navigate = useNavigate();
  const stats = selectors.getStats();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/citizen/search?q=${encodeURIComponent(searchQuery)}&region=${selectedRegion}`);
    }
  };

  const featuredMedicines = state.medicines.slice(0, 6);

  return (
    <div className="citizen-home">
      {/* Hero section */}
      <section className="hero-section">
        <div className="hero-bg-pattern" />
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <Shield className="w-4 h-4" />
              Davlat nazorati ostidagi platforma (Demo)
            </div>
            <h1 className="hero-title">
              Eng yaxshi narxda<br />
              <span className="hero-title-accent">dori toping</span>
            </h1>
            <p className="hero-subtitle">
              Yaqin atrofingizdagi dorixonalarda dori narxlarini solishtiring.
              Eng arzon va sifatli variantni tanlang.
            </p>

            {/* Search bar */}
            <form className="hero-search-form" onSubmit={handleSearch}>
              <div className="hero-search-bar">
                <div className="search-input-wrapper">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    placeholder="Dori nomi, INN yoki ishlab chiqaruvchi..."
                    className="search-input-main"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="search-divider" />
                <div className="search-region-wrapper">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <select
                    className="search-region-select"
                    value={selectedRegion}
                    onChange={e => setSelectedRegion(e.target.value)}
                  >
                    <option value="">Barcha viloyatlar</option>
                    {REGIONS.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="search-btn-main">
                  <Search className="w-5 h-5" />
                  Qidirish
                </button>
              </div>
            </form>

            {/* Quick searches */}
            <div className="quick-searches">
              <span className="quick-label">Mashhur:</span>
              {['Paracetamol', 'No-Shpa', 'Ibuprofen', 'Citramon', 'Omez'].map(term => (
                <button
                  key={term}
                  className="quick-tag"
                  onClick={() => navigate(`/citizen/search?q=${encodeURIComponent(term)}`)}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {[
              { value: stats.verifiedPharmacies, label: 'Tasdiqlangan dorixona', icon: Shield, color: 'text-green-500' },
              { value: stats.totalMedicines, label: 'Dori katalogida', icon: Search, color: 'text-blue-500' },
              { value: stats.totalListings, label: 'Narx e\'loni', icon: TrendingUp, color: 'text-purple-500' },
              { value: '5', label: 'Viloyat qamrovi', icon: MapPin, color: 'text-orange-500' },
            ].map((stat, i) => (
              <div key={i} className="stat-card">
                <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
                <div className="stat-value">{stat.value.toLocaleString()}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Dori kategoriyalari</h2>
            <Link to="/citizen/search" className="section-link">
              Hammasini ko'rish <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="categories-grid">
            {MEDICINE_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
              <button
                key={cat.id}
                className="category-card"
                onClick={() => navigate(`/citizen/search?category=${encodeURIComponent(cat.id)}`)}
              >
                <span className="category-icon">{cat.icon}</span>
                <span className="category-name">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured medicines */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Mashhur dorilar</h2>
            <Link to="/citizen/search" className="section-link">
              Hammasini ko'rish <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="featured-grid">
            {featuredMedicines.map(med => {
              const listings = state.listings.filter(l => l.medicineId === med.id);
              const minPrice = listings.length ? Math.min(...listings.map(l => l.price)) : null;
              return (
                <div
                  key={med.id}
                  className="featured-card"
                  onClick={() => navigate(`/citizen/search?q=${encodeURIComponent(med.tradeName)}`)}
                >
                  <div className="featured-category-badge">{med.category}</div>
                  <h3 className="featured-name">{med.tradeName}</h3>
                  <p className="featured-inn">{med.inn}</p>
                  <p className="featured-strength">{med.strength} · {med.dosageForm}</p>
                  <p className="featured-manufacturer">{med.manufacturer}</p>
                  <div className="featured-price-row">
                    {minPrice ? (
                      <span className="featured-price">
                        <span className="price-from">dan</span>
                        {minPrice.toLocaleString()} so'm
                      </span>
                    ) : (
                      <span className="featured-no-price">Narx mavjud emas</span>
                    )}
                    <button className="featured-search-btn">
                      <Search className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-section">
        <div className="container">
          <h2 className="section-title text-center mb-12">Platforma qanday ishlaydi?</h2>
          <div className="how-grid">
            {[
              { step: '1', icon: Search, title: 'Dori qidiring', desc: 'Dori nomini yoki faol moddasini kiriting' },
              { step: '2', icon: MapPin, title: 'Hududni tanlang', desc: 'Viloyat va tumaningizni belgilang' },
              { step: '3', icon: TrendingUp, title: 'Narxlarni solishtiring', desc: 'Turli dorixonalardagi narxlarni ko\'ring' },
              { step: '4', icon: Star, title: 'Eng yaxshisini tanlang', desc: 'Narx va masofaga qarab qaror qiling' },
            ].map((item, i) => (
              <div key={i} className="how-card">
                <div className="how-step-num">{item.step}</div>
                <item.icon className="how-icon" />
                <h3 className="how-title">{item.title}</h3>
                <p className="how-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2 className="cta-title">Dorixonangizni ro'yxatdan o'tkazing</h2>
            <p className="cta-desc">
              Dorixona egasi bo'lsangiz, platformaga qo'shiling va mijozlar sonini oshiring
            </p>
            <Link to="/pharmacy/register" className="cta-btn">
              Ro'yxatdan o'tish
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
