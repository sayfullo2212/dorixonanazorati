# DoriNarx — Dori Narx Shaffoflik Platformasi

> **Demo platforma** — Hackathon prototipi. Haqiqiy hukumat tizimlari bilan bog'liq emas.

---

## 📋 Loyiha haqida

**DoriNarx** — O'zbekiston Respublikasidagi dori vositalari narx shaffofligini ta'minlash uchun mo'ljallangan milliy platformaning hackathon prototipi.

### Maqsadlar
- 🏥 Fuqarolarga yaqin dorixonalardagi dori narxlarini solishtirish imkonini berish
- 💊 Litsenziyalangan dorixonalarga narxlarini e'lon qilish platformasi
- 🏛️ Davlat organlariga dori narxlarini monitoring qilish vositasi

---

## 🚀 Ishga tushirish

### Talablar
- Node.js 18+
- npm

### O'rnatish va ishga tushirish

```bash
# Bog'liqliklarni o'rnating
npm install

# Ishlab chiqish serverini ishga tushiring
npm run dev
```

Brauzerda: `http://localhost:5173`

### Production build

```bash
npm run build
npm run preview
```

---

## 👥 Demo foydalanuvchi rollari

Platformada 3 ta rol mavjud. Demo logindan rol tanlang:

| Rol | Tavsif |
|-----|--------|
| 👤 **Fuqaro** | Dori qidirish va narxlarni solishtirish |
| 🏥 **Dorixona** | Narxlarni boshqarish va yangilash |
| 🏛️ **Administrator** | Barcha dorixonalar va narxlarni kuzatish |

---

## 🛠️ Texnologiyalar

| Texnologiya | Maqsad |
|------------|--------|
| React 19 | UI framework |
| Vite 8 | Build tool |
| Tailwind CSS 4 | Stillar |
| React Router 7 | Routing (HashRouter) |
| Leaflet + OpenStreetMap | Interaktiv xarita |
| Recharts | Analitik grafiklar |
| LocalStorage | Demo ma'lumotlar saqlash |
| Lucide React | Ikonkalar |

---

## 📁 Loyiha tuzilmasi

```
src/
├── data/              # Namunali ma'lumotlar
│   ├── medicines.js   # 17 ta dori katalogi
│   ├── pharmacies.js  # 10 ta dorixona (5 viloyat)
│   ├── priceHistory.js # Narx tarixi va ro'yxat
│   └── users.js       # Demo foydalanuvchilar
├── store/
│   └── AppContext.jsx  # State management (Context + LocalStorage)
├── pages/
│   ├── DemoLogin.jsx
│   ├── citizen/        # Fuqaro interfeysi
│   ├── pharmacy/       # Dorixona boshqaruvi
│   └── admin/          # Administrator paneli
├── components/
│   ├── layout/         # Navbar, Footer
│   └── ui/             # Badge, Modal, Toast
├── App.jsx             # Routing
├── main.jsx
└── index.css           # Premium CSS
```

---

## 🌐 GitHub Pages Deploy

```bash
# Repozitoriyni boshing va gh-pages sozlamalarini oching:
# Settings → Pages → Source: GitHub Actions
# Keyin main branchga push qiling
git push origin main
```

Deployment URL: `https://<username>.github.io/dorixona-nazorati/`

---

## ⚠️ Muhim eslatmalar

- Bu **demo platforma** — barcha ma'lumotlar namunali
- Haqiqiy litsenziya tekshiruvi amalga oshirilmaydi
- Narxlar demonstratsiya maqsadida yaratilgan
- LocalStorage orqali ma'lumotlar saqlanadi (brauzer tozalanganda yo'qoladi)
- Demo ma'lumotlarni tiklash: foydalanuvchi menyusidan "Demo ma'lumotlarni tiklash"

---

## 📊 Demo ma'lumotlar

- 🗂️ **17** ta dori katalogida
- 🏪 **10** ta dorixona (Toshkent, Samarqand, Farg'ona, Buxoro, Andijon)
- 📍 **5** ta viloyat
- 💰 **40+** narx e'loni
- 📈 **21** ta narx tarixi yozuvi

---

*DoriNarx — Hackathon 2024 prototipi*
