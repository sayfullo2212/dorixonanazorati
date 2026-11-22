// Demo users for role-based access demonstration

export const DEMO_USERS = [
  {
    id: 'user-citizen',
    role: 'citizen',
    name: 'Fuqaro (Demo)',
    description: 'Oddiy fuqaro — dori qidirish va narxlarni solishtirish',
    icon: '👤',
    color: 'blue',
  },
  {
    id: 'user-pharmacy',
    role: 'pharmacy',
    name: 'Shifo Dorixonasi №1',
    pharmacyId: 'ph-001',
    description: 'Dorixona boshqaruvi — dorilar va narxlarni boshqarish',
    icon: '🏥',
    color: 'green',
  },
  {
    id: 'user-admin',
    role: 'admin',
    name: 'Administrator (Demo)',
    description: 'Davlat nazoratchi — barcha dorixonalar va narxlarni kuzatish',
    icon: '🏛️',
    color: 'purple',
  },
];

export default DEMO_USERS;
