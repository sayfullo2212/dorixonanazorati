import { createContext, useContext, useReducer, useEffect } from 'react';
import MEDICINES from '../data/medicines.js';
import PHARMACIES from '../data/pharmacies.js';
import { INITIAL_LISTINGS, INITIAL_PRICE_HISTORY } from '../data/priceHistory.js';

const STORAGE_KEY = 'dorinarz_state_v1';

const initialState = {
  currentUser: null, // { id, role, name, pharmacyId? }
  pharmacies: PHARMACIES,
  medicines: MEDICINES,
  listings: INITIAL_LISTINGS,
  priceHistory: INITIAL_PRICE_HISTORY,
  toasts: [],
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...initialState,
        ...parsed,
        toasts: [], // never persist toasts
      };
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  return initialState;
}

function saveState(state) {
  try {
    const { toasts, ...toSave } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function calculateChangePercent(oldPrice, newPrice) {
  if (!oldPrice) return null;
  return parseFloat((((newPrice - oldPrice) / oldPrice) * 100).toFixed(1));
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, currentUser: action.payload };

    case 'LOGOUT':
      return { ...state, currentUser: null };

    case 'RESET_DEMO_DATA':
      return { ...initialState, currentUser: state.currentUser, toasts: [] };

    // Pharmacy actions
    case 'REGISTER_PHARMACY': {
      const newPharmacy = {
        ...action.payload,
        id: generateId('ph'),
        status: 'pending',
        registeredAt: new Date().toISOString(),
      };
      return { ...state, pharmacies: [...state.pharmacies, newPharmacy] };
    }

    case 'UPDATE_PHARMACY_STATUS': {
      return {
        ...state,
        pharmacies: state.pharmacies.map(p =>
          p.id === action.payload.id
            ? {
                ...p,
                status: action.payload.status,
                verifiedAt: action.payload.status === 'verified' ? new Date().toISOString() : undefined,
                rejectedAt: action.payload.status === 'rejected' ? new Date().toISOString() : undefined,
                rejectionReason: action.payload.rejectionReason || undefined,
              }
            : p
        ),
      };
    }

    // Medicine listings
    case 'ADD_LISTING': {
      const existing = state.listings.find(
        l => l.pharmacyId === action.payload.pharmacyId && l.medicineId === action.payload.medicineId
      );
      if (existing) {
        // Update existing
        const changePercent = calculateChangePercent(existing.price, action.payload.price);
        const historyEntry = {
          id: generateId('h'),
          pharmacyId: existing.pharmacyId,
          medicineId: existing.medicineId,
          price: action.payload.price,
          recordedAt: new Date().toISOString(),
          changePercent,
        };
        return {
          ...state,
          listings: state.listings.map(l =>
            l.id === existing.id ? { ...l, price: action.payload.price, updatedAt: new Date().toISOString() } : l
          ),
          priceHistory: [...state.priceHistory, historyEntry],
        };
      } else {
        const newListing = {
          id: generateId('lst'),
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        const historyEntry = {
          id: generateId('h'),
          pharmacyId: action.payload.pharmacyId,
          medicineId: action.payload.medicineId,
          price: action.payload.price,
          recordedAt: new Date().toISOString(),
          changePercent: null,
        };
        return {
          ...state,
          listings: [...state.listings, newListing],
          priceHistory: [...state.priceHistory, historyEntry],
        };
      }
    }

    case 'UPDATE_LISTING_PRICE': {
      const listing = state.listings.find(l => l.id === action.payload.id);
      if (!listing) return state;
      const changePercent = calculateChangePercent(listing.price, action.payload.price);
      const historyEntry = {
        id: generateId('h'),
        pharmacyId: listing.pharmacyId,
        medicineId: listing.medicineId,
        price: action.payload.price,
        recordedAt: new Date().toISOString(),
        changePercent,
      };
      return {
        ...state,
        listings: state.listings.map(l =>
          l.id === action.payload.id
            ? { ...l, price: action.payload.price, updatedAt: new Date().toISOString() }
            : l
        ),
        priceHistory: [...state.priceHistory, historyEntry],
      };
    }

    case 'REMOVE_LISTING': {
      return {
        ...state,
        listings: state.listings.filter(l => l.id !== action.payload.id),
      };
    }

    // Toasts
    case 'ADD_TOAST': {
      const toast = { id: generateId('toast'), ...action.payload };
      return { ...state, toasts: [...state.toasts, toast] };
    }

    case 'REMOVE_TOAST': {
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload.id) };
    }

    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const actions = {
    login: (user) => dispatch({ type: 'LOGIN', payload: user }),
    logout: () => dispatch({ type: 'LOGOUT' }),
    resetDemoData: () => dispatch({ type: 'RESET_DEMO_DATA' }),
    registerPharmacy: (data) => dispatch({ type: 'REGISTER_PHARMACY', payload: data }),
    updatePharmacyStatus: (id, status, rejectionReason) =>
      dispatch({ type: 'UPDATE_PHARMACY_STATUS', payload: { id, status, rejectionReason } }),
    addListing: (data) => dispatch({ type: 'ADD_LISTING', payload: data }),
    updateListingPrice: (id, price) =>
      dispatch({ type: 'UPDATE_LISTING_PRICE', payload: { id, price } }),
    removeListing: (id) => dispatch({ type: 'REMOVE_LISTING', payload: { id } }),
    showToast: (message, type = 'success') =>
      dispatch({ type: 'ADD_TOAST', payload: { message, type } }),
    removeToast: (id) => dispatch({ type: 'REMOVE_TOAST', payload: { id } }),
  };

  // Derived selectors
  const selectors = {
    getPharmacyById: (id) => state.pharmacies.find(p => p.id === id),
    getMedicineById: (id) => state.medicines.find(m => m.id === id),
    getListingsForPharmacy: (pharmacyId) => state.listings.filter(l => l.pharmacyId === pharmacyId),
    getPriceHistoryForListing: (pharmacyId, medicineId) =>
      state.priceHistory
        .filter(h => h.pharmacyId === pharmacyId && h.medicineId === medicineId)
        .sort((a, b) => new Date(a.recordedAt) - new Date(b.recordedAt)),
    searchMedicines: (query, regionId, districtId, sortBy = 'price') => {
      if (!query || query.trim().length < 2) return [];
      const q = query.toLowerCase();
      const matchingMedicines = state.medicines.filter(m =>
        m.tradeName.toLowerCase().includes(q) ||
        m.inn.toLowerCase().includes(q) ||
        m.manufacturer.toLowerCase().includes(q)
      );
      if (matchingMedicines.length === 0) return [];

      const results = [];
      for (const med of matchingMedicines) {
        const relevantListings = state.listings.filter(l => {
          if (l.medicineId !== med.id) return false;
          const pharmacy = state.pharmacies.find(p => p.id === l.pharmacyId && p.status === 'verified');
          if (!pharmacy) return false;
          if (regionId && pharmacy.regionId !== regionId) return false;
          if (districtId && pharmacy.districtId !== districtId) return false;
          return true;
        });

        for (const listing of relevantListings) {
          const pharmacy = state.pharmacies.find(p => p.id === listing.pharmacyId);
          results.push({ medicine: med, listing, pharmacy });
        }
      }

      if (sortBy === 'price') {
        results.sort((a, b) => a.listing.price - b.listing.price);
      } else if (sortBy === 'distance') {
        results.sort(() => Math.random() - 0.5); // demo: random order for "distance"
      }

      return results;
    },
    getStats: () => {
      const totalPharmacies = state.pharmacies.length;
      const verifiedPharmacies = state.pharmacies.filter(p => p.status === 'verified').length;
      const totalMedicines = state.medicines.length;
      const totalListings = state.listings.length;
      const totalPriceUpdates = state.priceHistory.length;
      const suspiciousChanges = state.priceHistory.filter(h => h.changePercent && Math.abs(h.changePercent) > 15).length;
      return { totalPharmacies, verifiedPharmacies, totalMedicines, totalListings, totalPriceUpdates, suspiciousChanges };
    },
  };

  return (
    <AppContext.Provider value={{ state, actions, selectors }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export default AppContext;
