import { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Clock, Search } from 'lucide-react';
import { useApp } from '../../store/AppContext';

function formatPrice(price) {
  return price.toLocaleString('uz-UZ') + ' so\'m';
}

export default function MapView() {
  const { state } = useApp();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const verifiedPharmacies = state.pharmacies.filter(p => p.status === 'verified' && p.lat && p.lng);

  useEffect(() => {
    if (mapInstanceRef.current) return;

    // Dynamically import leaflet to avoid SSR issues
    import('leaflet').then(L => {
      // Fix default marker icon
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current).setView([41.2995, 69.2401], 6);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      verifiedPharmacies.forEach(pharmacy => {
        const listings = state.listings.filter(l => l.pharmacyId === pharmacy.id);
        const medicineNames = listings.map(l => {
          const med = state.medicines.find(m => m.id === l.medicineId);
          return med ? `${med.tradeName}: ${formatPrice(l.price)}` : '';
        }).filter(Boolean).slice(0, 3);

        const popupContent = `
          <div style="font-family: system-ui, sans-serif; min-width: 220px;">
            <h3 style="font-weight: bold; font-size: 14px; margin: 0 0 6px; color: #1e293b;">${pharmacy.name}</h3>
            <p style="font-size: 12px; color: #64748b; margin: 0 0 4px;">📍 ${pharmacy.address}</p>
            <p style="font-size: 12px; color: #64748b; margin: 0 0 4px;">📞 ${pharmacy.phone}</p>
            <p style="font-size: 12px; color: #64748b; margin: 0 0 8px;">🕐 ${pharmacy.workingHours}</p>
            ${medicineNames.length > 0 ? `
              <div style="border-top: 1px solid #e2e8f0; padding-top: 8px;">
                <p style="font-size: 11px; font-weight: 600; color: #475569; margin: 0 0 4px;">Namuna narxlar:</p>
                ${medicineNames.map(n => `<p style="font-size: 11px; color: #64748b; margin: 0 0 2px;">💊 ${n}</p>`).join('')}
              </div>
            ` : ''}
            <p style="font-size: 10px; color: #94a3b8; margin: 8px 0 0; font-style: italic;">Demo ma'lumotlar</p>
          </div>
        `;

        const marker = L.marker([pharmacy.lat, pharmacy.lng])
          .addTo(map)
          .bindPopup(popupContent, { maxWidth: 280 });

        marker.on('click', () => setSelectedPharmacy(pharmacy));
      });

      mapInstanceRef.current = map;
      setMapLoaded(true);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const pharmacyListings = selectedPharmacy
    ? state.listings.filter(l => l.pharmacyId === selectedPharmacy.id)
    : [];

  return (
    <div className="map-page">
      <div className="map-header">
        <div className="container">
          <h1 className="map-title">Dorixonalar xaritasi</h1>
          <p className="map-subtitle">
            {verifiedPharmacies.length} ta tasdiqlangan dorixona ko'rsatilmoqda · Demo ma'lumotlar
          </p>
        </div>
      </div>

      <div className="map-layout">
        {/* Sidebar */}
        <div className="map-sidebar">
          <div className="map-sidebar-header">
            <h2 className="map-sidebar-title">Dorixonalar</h2>
            <span className="map-sidebar-count">{verifiedPharmacies.length}</span>
          </div>
          <div className="map-pharmacy-list">
            {verifiedPharmacies.map(ph => {
              const listingCount = state.listings.filter(l => l.pharmacyId === ph.id).length;
              return (
                <div
                  key={ph.id}
                  className={`map-pharmacy-item ${selectedPharmacy?.id === ph.id ? 'map-pharmacy-item-active' : ''}`}
                  onClick={() => {
                    setSelectedPharmacy(ph);
                    if (mapInstanceRef.current) {
                      mapInstanceRef.current.setView([ph.lat, ph.lng], 14);
                    }
                  }}
                >
                  <div className="map-ph-name">{ph.name}</div>
                  <div className="map-ph-address">
                    <MapPin className="w-3 h-3" />
                    {ph.address}
                  </div>
                  <div className="map-ph-meta">
                    <span><Phone className="w-3 h-3 inline mr-1" />{ph.phone}</span>
                    <span>{listingCount} ta dori</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map */}
        <div className="map-container-wrapper">
          <div ref={mapRef} className="map-container" style={{ height: '600px' }} />
          {!mapLoaded && (
            <div className="map-loading">
              <div className="map-loading-spinner" />
              <p>Xarita yuklanmoqda...</p>
            </div>
          )}
        </div>
      </div>

      {/* Selected pharmacy info */}
      {selectedPharmacy && (
        <div className="container py-6">
          <div className="selected-pharmacy-card">
            <div className="selected-ph-header">
              <div>
                <h2 className="selected-ph-name">{selectedPharmacy.name}</h2>
                <p className="selected-ph-address">{selectedPharmacy.address}</p>
              </div>
              <div className="selected-ph-meta">
                <span><Phone className="w-4 h-4 inline mr-1" />{selectedPharmacy.phone}</span>
                <span><Clock className="w-4 h-4 inline mr-1" />{selectedPharmacy.workingHours}</span>
              </div>
            </div>

            {pharmacyListings.length > 0 && (
              <div className="selected-ph-listings">
                <h3 className="selected-ph-listings-title">Mavjud dorilar (Demo)</h3>
                <div className="selected-listings-grid">
                  {pharmacyListings.map(listing => {
                    const med = state.medicines.find(m => m.id === listing.medicineId);
                    if (!med) return null;
                    return (
                      <div key={listing.id} className="selected-listing-item">
                        <div className="selected-listing-name">{med.tradeName}</div>
                        <div className="selected-listing-details">{med.strength} · {med.packageSize}</div>
                        <div className="selected-listing-price">{formatPrice(listing.price)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
