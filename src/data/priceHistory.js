// DEMO price listings and history — fictional demonstration data

// Initial pharmacy medicine listings (pharmacy -> medicine -> price)
export const INITIAL_LISTINGS = [
  // Shifo Dorixonasi №1
  { id: 'lst-001', pharmacyId: 'ph-001', medicineId: 'med-001', price: 7500, updatedAt: '2024-11-01T10:00:00Z' },
  { id: 'lst-002', pharmacyId: 'ph-001', medicineId: 'med-002', price: 4200, updatedAt: '2024-11-05T11:00:00Z' },
  { id: 'lst-003', pharmacyId: 'ph-001', medicineId: 'med-003', price: 9800, updatedAt: '2024-11-10T09:00:00Z' },
  { id: 'lst-004', pharmacyId: 'ph-001', medicineId: 'med-009', price: 16500, updatedAt: '2024-11-12T14:00:00Z' },
  { id: 'lst-005', pharmacyId: 'ph-001', medicineId: 'med-010', price: 3800, updatedAt: '2024-11-15T10:00:00Z' },
  { id: 'lst-006', pharmacyId: 'ph-001', medicineId: 'med-006', price: 32000, updatedAt: '2024-11-18T09:00:00Z' },

  // Dori-Darmon Markazi
  { id: 'lst-007', pharmacyId: 'ph-002', medicineId: 'med-001', price: 8000, updatedAt: '2024-11-02T10:00:00Z' },
  { id: 'lst-008', pharmacyId: 'ph-002', medicineId: 'med-002', price: 3900, updatedAt: '2024-11-06T12:00:00Z' },
  { id: 'lst-009', pharmacyId: 'ph-002', medicineId: 'med-005', price: 45000, updatedAt: '2024-11-08T10:00:00Z' },
  { id: 'lst-010', pharmacyId: 'ph-002', medicineId: 'med-007', price: 28000, updatedAt: '2024-11-11T11:00:00Z' },
  { id: 'lst-011', pharmacyId: 'ph-002', medicineId: 'med-008', price: 62000, updatedAt: '2024-11-14T10:00:00Z' },
  { id: 'lst-012', pharmacyId: 'ph-002', medicineId: 'med-004', price: 18500, updatedAt: '2024-11-16T09:00:00Z' },

  // Oq Oltin Dorixonasi
  { id: 'lst-013', pharmacyId: 'ph-003', medicineId: 'med-001', price: 7800, updatedAt: '2024-11-03T09:00:00Z' },
  { id: 'lst-014', pharmacyId: 'ph-003', medicineId: 'med-003', price: 10200, updatedAt: '2024-11-07T11:00:00Z' },
  { id: 'lst-015', pharmacyId: 'ph-003', medicineId: 'med-009', price: 17800, updatedAt: '2024-11-13T10:00:00Z' },
  { id: 'lst-016', pharmacyId: 'ph-003', medicineId: 'med-011', price: 14500, updatedAt: '2024-11-15T14:00:00Z' },
  { id: 'lst-017', pharmacyId: 'ph-003', medicineId: 'med-012', price: 21000, updatedAt: '2024-11-17T09:00:00Z' },
  { id: 'lst-018', pharmacyId: 'ph-003', medicineId: 'med-006', price: 38000, updatedAt: '2024-11-19T10:00:00Z' },

  // Samarqand Shifo
  { id: 'lst-019', pharmacyId: 'ph-004', medicineId: 'med-002', price: 4500, updatedAt: '2024-11-04T10:00:00Z' },
  { id: 'lst-020', pharmacyId: 'ph-004', medicineId: 'med-005', price: 42000, updatedAt: '2024-11-09T11:00:00Z' },
  { id: 'lst-021', pharmacyId: 'ph-004', medicineId: 'med-010', price: 3500, updatedAt: '2024-11-13T09:00:00Z' },
  { id: 'lst-022', pharmacyId: 'ph-004', medicineId: 'med-014', price: 12000, updatedAt: '2024-11-16T10:00:00Z' },
  { id: 'lst-023', pharmacyId: 'ph-004', medicineId: 'med-013', price: 15500, updatedAt: '2024-11-18T11:00:00Z' },

  // Farg'ona Farmatsiya
  { id: 'lst-024', pharmacyId: 'ph-005', medicineId: 'med-001', price: 7200, updatedAt: '2024-11-05T09:00:00Z' },
  { id: 'lst-025', pharmacyId: 'ph-005', medicineId: 'med-002', price: 4000, updatedAt: '2024-11-08T10:00:00Z' },
  { id: 'lst-026', pharmacyId: 'ph-005', medicineId: 'med-007', price: 25500, updatedAt: '2024-11-12T11:00:00Z' },
  { id: 'lst-027', pharmacyId: 'ph-005', medicineId: 'med-015', price: 55000, updatedAt: '2024-11-15T09:00:00Z' },

  // Buxoro Dori Markazi
  { id: 'lst-028', pharmacyId: 'ph-006', medicineId: 'med-003', price: 9500, updatedAt: '2024-11-06T10:00:00Z' },
  { id: 'lst-029', pharmacyId: 'ph-006', medicineId: 'med-004', price: 17000, updatedAt: '2024-11-10T11:00:00Z' },
  { id: 'lst-030', pharmacyId: 'ph-006', medicineId: 'med-009', price: 15800, updatedAt: '2024-11-14T10:00:00Z' },
  { id: 'lst-031', pharmacyId: 'ph-006', medicineId: 'med-016', price: 22000, updatedAt: '2024-11-17T09:00:00Z' },

  // Andijon Tabobat
  { id: 'lst-032', pharmacyId: 'ph-008', medicineId: 'med-001', price: 7600, updatedAt: '2024-11-07T09:00:00Z' },
  { id: 'lst-033', pharmacyId: 'ph-008', medicineId: 'med-006', price: 33500, updatedAt: '2024-11-11T10:00:00Z' },
  { id: 'lst-034', pharmacyId: 'ph-008', medicineId: 'med-008', price: 58000, updatedAt: '2024-11-15T11:00:00Z' },
  { id: 'lst-035', pharmacyId: 'ph-008', medicineId: 'med-017', price: 5500, updatedAt: '2024-11-18T09:00:00Z' },

  // Chilonzor Farmatsiya
  { id: 'lst-036', pharmacyId: 'ph-010', medicineId: 'med-001', price: 7900, updatedAt: '2024-11-08T10:00:00Z' },
  { id: 'lst-037', pharmacyId: 'ph-010', medicineId: 'med-002', price: 4100, updatedAt: '2024-11-12T11:00:00Z' },
  { id: 'lst-038', pharmacyId: 'ph-010', medicineId: 'med-005', price: 46500, updatedAt: '2024-11-14T10:00:00Z' },
  { id: 'lst-039', pharmacyId: 'ph-010', medicineId: 'med-009', price: 16200, updatedAt: '2024-11-16T09:00:00Z' },
  { id: 'lst-040', pharmacyId: 'ph-010', medicineId: 'med-011', price: 13800, updatedAt: '2024-11-18T10:00:00Z' },
];

// Historical price changes
export const INITIAL_PRICE_HISTORY = [
  // med-001 at ph-001 history
  { id: 'h-001', pharmacyId: 'ph-001', medicineId: 'med-001', price: 6800, recordedAt: '2024-09-01T10:00:00Z', changePercent: null },
  { id: 'h-002', pharmacyId: 'ph-001', medicineId: 'med-001', price: 7100, recordedAt: '2024-10-01T10:00:00Z', changePercent: 4.4 },
  { id: 'h-003', pharmacyId: 'ph-001', medicineId: 'med-001', price: 7500, recordedAt: '2024-11-01T10:00:00Z', changePercent: 5.6 },

  // med-001 at ph-002 history
  { id: 'h-004', pharmacyId: 'ph-002', medicineId: 'med-001', price: 7200, recordedAt: '2024-09-02T10:00:00Z', changePercent: null },
  { id: 'h-005', pharmacyId: 'ph-002', medicineId: 'med-001', price: 7600, recordedAt: '2024-10-02T10:00:00Z', changePercent: 5.6 },
  { id: 'h-006', pharmacyId: 'ph-002', medicineId: 'med-001', price: 8000, recordedAt: '2024-11-02T10:00:00Z', changePercent: 5.3 },

  // med-002 price history
  { id: 'h-007', pharmacyId: 'ph-001', medicineId: 'med-002', price: 3800, recordedAt: '2024-09-05T11:00:00Z', changePercent: null },
  { id: 'h-008', pharmacyId: 'ph-001', medicineId: 'med-002', price: 4000, recordedAt: '2024-10-05T11:00:00Z', changePercent: 5.3 },
  { id: 'h-009', pharmacyId: 'ph-001', medicineId: 'med-002', price: 4200, recordedAt: '2024-11-05T11:00:00Z', changePercent: 5.0 },

  // med-006 suspicious price spike
  { id: 'h-010', pharmacyId: 'ph-003', medicineId: 'med-006', price: 28000, recordedAt: '2024-09-10T09:00:00Z', changePercent: null },
  { id: 'h-011', pharmacyId: 'ph-003', medicineId: 'med-006', price: 30000, recordedAt: '2024-10-10T09:00:00Z', changePercent: 7.1 },
  { id: 'h-012', pharmacyId: 'ph-003', medicineId: 'med-006', price: 38000, recordedAt: '2024-11-19T10:00:00Z', changePercent: 26.7 },

  // med-008 history
  { id: 'h-013', pharmacyId: 'ph-002', medicineId: 'med-008', price: 55000, recordedAt: '2024-09-14T10:00:00Z', changePercent: null },
  { id: 'h-014', pharmacyId: 'ph-002', medicineId: 'med-008', price: 58000, recordedAt: '2024-10-14T10:00:00Z', changePercent: 5.5 },
  { id: 'h-015', pharmacyId: 'ph-002', medicineId: 'med-008', price: 62000, recordedAt: '2024-11-14T10:00:00Z', changePercent: 6.9 },

  // med-009 history
  { id: 'h-016', pharmacyId: 'ph-001', medicineId: 'med-009', price: 15000, recordedAt: '2024-09-12T14:00:00Z', changePercent: null },
  { id: 'h-017', pharmacyId: 'ph-001', medicineId: 'med-009', price: 15800, recordedAt: '2024-10-12T14:00:00Z', changePercent: 5.3 },
  { id: 'h-018', pharmacyId: 'ph-001', medicineId: 'med-009', price: 16500, recordedAt: '2024-11-12T14:00:00Z', changePercent: 4.4 },

  // med-005 suspicious
  { id: 'h-019', pharmacyId: 'ph-002', medicineId: 'med-005', price: 36000, recordedAt: '2024-09-08T10:00:00Z', changePercent: null },
  { id: 'h-020', pharmacyId: 'ph-002', medicineId: 'med-005', price: 38000, recordedAt: '2024-10-08T10:00:00Z', changePercent: 5.6 },
  { id: 'h-021', pharmacyId: 'ph-002', medicineId: 'med-005', price: 45000, recordedAt: '2024-11-08T10:00:00Z', changePercent: 18.4 },
];

export default INITIAL_LISTINGS;
