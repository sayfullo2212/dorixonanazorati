import { Link } from 'react-router-dom';
import { Shield, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-primary">Dori</span><span className="logo-accent">Narx</span>
            </div>
            <p className="footer-desc">
              O'zbekiston Respublikasi dori vositalari narx shaffofligini ta'minlash bo'yicha
              milliy platformaning namunali prototipi.
            </p>
            <div className="footer-demo-badge">
              <Shield className="w-4 h-4" />
              Demo platforma — Beta versiya
            </div>
          </div>

          {/* Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Fuqarolar uchun</h4>
            <Link to="/citizen" className="footer-link">Bosh sahifa</Link>
            <Link to="/citizen/search" className="footer-link">Dori qidirish</Link>
            <Link to="/citizen/map" className="footer-link">Dorixonalar xaritasi</Link>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Dorixonalar uchun</h4>
            <Link to="/pharmacy/register" className="footer-link">Ro'yxatdan o'tish</Link>
            <Link to="/pharmacy/dashboard" className="footer-link">Boshqaruv paneli</Link>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Ma'lumot</h4>
            <p className="footer-text">Ushbu platforma hakaton prototipi hisoblanadi.</p>
            <p className="footer-text">Haqiqiy dori narxlari uchun rasmiy manbalarga murojaat qiling.</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © 2024 DoriNarx Demo Platforma. Barcha ma'lumotlar namunali.
          </p>
          <p className="footer-disclaimer">
            Bu platforma haqiqiy hukumat tizimi emas. Litsenziya tekshiruvi amalga oshirilmaydi.
          </p>
        </div>
      </div>
    </footer>
  );
}
