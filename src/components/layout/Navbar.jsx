import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Shield, Building2, ChevronDown, RotateCcw } from 'lucide-react';
import { useApp } from '../../store/AppContext';

const roleLabels = {
  citizen: { label: 'Fuqaro', icon: User, color: 'text-blue-400' },
  pharmacy: { label: 'Dorixona', icon: Building2, color: 'text-green-400' },
  admin: { label: 'Administrator', icon: Shield, color: 'text-purple-400' },
};

const navLinks = {
  citizen: [
    { to: '/citizen', label: 'Bosh sahifa' },
    { to: '/citizen/search', label: 'Dori qidirish' },
    { to: '/citizen/map', label: 'Xarita' },
  ],
  pharmacy: [
    { to: '/pharmacy/dashboard', label: 'Boshqaruv' },
    { to: '/pharmacy/medicines', label: 'Dorilar' },
    { to: '/pharmacy/register', label: 'Ro\'yxatdan o\'tish' },
  ],
  admin: [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/pharmacies', label: 'Dorixonalar' },
    { to: '/admin/prices', label: 'Narx nazorati' },
  ],
};

export default function Navbar() {
  const { state, actions } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = state.currentUser;

  const links = user ? navLinks[user.role] || [] : [];
  const roleInfo = user ? roleLabels[user.role] : null;
  const RoleIcon = roleInfo?.icon;

  const handleLogout = () => {
    actions.logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const handleResetData = () => {
    if (window.confirm('Barcha demo ma\'lumotlarni boshlang\'ich holatga qaytarishni xohlaysizmi?')) {
      actions.resetDemoData();
      actions.showToast('Demo ma\'lumotlar qayta tiklandi', 'info');
    }
    setDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to={user ? `/${user.role}` : '/'} className="navbar-logo">
          <div className="logo-icon">
            <span>DN</span>
          </div>
          <div className="logo-text">
            <span className="logo-primary">Dori</span><span className="logo-accent">Narx</span>
            <span className="logo-subtitle">Beta • Demo</span>
          </div>
        </Link>

        {/* Desktop nav links */}
        {user && (
          <div className="navbar-links">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${location.pathname === link.to ? 'nav-link-active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right side */}
        <div className="navbar-right">
          {user ? (
            <div className="relative">
              <button
                className="user-menu-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {RoleIcon && <RoleIcon className={`w-4 h-4 ${roleInfo.color}`} />}
                <span className="user-name">{user.name}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <div className="dropdown-role">{roleInfo?.label}</div>
                    <div className="dropdown-name">{user.name}</div>
                  </div>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item" onClick={handleResetData}>
                    <RotateCcw className="w-4 h-4" />
                    Demo ma'lumotlarni tiklash
                  </button>
                  <button className="dropdown-item text-red-400" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                    Chiqish
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/" className="btn-primary-sm">
              Kirish
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && user && (
        <div className="mobile-menu">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`mobile-nav-link ${location.pathname === link.to ? 'mobile-nav-link-active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button className="mobile-nav-link text-red-400" onClick={() => { handleLogout(); setMenuOpen(false); }}>
            <LogOut className="w-4 h-4 inline mr-2" />
            Chiqish
          </button>
        </div>
      )}

      {/* Demo banner */}
      <div className="demo-banner">
        ⚠️ Bu demo platforma. Barcha ma'lumotlar namunali va haqiqiy hukumat tizimlari bilan bog'liq emas.
      </div>
    </nav>
  );
}
