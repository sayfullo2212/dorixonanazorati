import { useNavigate } from 'react-router-dom';
import { User, Building2, Shield, ArrowRight, Info } from 'lucide-react';
import { useApp } from '../store/AppContext';
import DEMO_USERS from '../data/users.js';

const roleConfig = {
  citizen: {
    icon: User,
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'role-card-blue',
    to: '/citizen',
    features: ['Dori qidirish va narxlarni solishtirish', 'Yaqin dorixonalarni topish', 'Interaktiv xarita'],
  },
  pharmacy: {
    icon: Building2,
    gradient: 'from-emerald-500 to-green-500',
    bg: 'role-card-green',
    to: '/pharmacy/dashboard',
    features: ['Dorixona profilini boshqarish', 'Dori narxlarini yangilash', 'Narx tarixi'],
  },
  admin: {
    icon: Shield,
    gradient: 'from-purple-500 to-violet-500',
    bg: 'role-card-purple',
    to: '/admin/dashboard',
    features: ['Barcha dorixonalarni kuzatish', 'Narx monitoring', 'Statistika va grafiklar'],
  },
};

export default function DemoLogin() {
  const { actions } = useApp();
  const navigate = useNavigate();

  const handleLogin = (demoUser) => {
    actions.login({
      id: demoUser.id,
      role: demoUser.role,
      name: demoUser.name,
      pharmacyId: demoUser.pharmacyId,
    });
    const cfg = roleConfig[demoUser.role];
    navigate(cfg.to);
  };

  return (
    <div className="login-page">
      {/* Background decorations */}
      <div className="login-bg-decoration" />

      <div className="login-container">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo">
            <span className="logo-primary text-5xl font-black">Dori</span>
            <span className="logo-accent text-5xl font-black">Narx</span>
          </div>
          <p className="login-tagline">
            O'zbekiston dori vositalari narx shaffoflik platformasi
          </p>
          <div className="login-demo-notice">
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>
              Bu <strong>demo platforma</strong>. Haqiqiy autentifikatsiya talab etilmaydi.
              Rol tanlang va platformani sinab ko'ring.
            </span>
          </div>
        </div>

        {/* Role cards */}
        <h2 className="login-section-title">Rolni tanlang</h2>
        <div className="role-cards-grid">
          {DEMO_USERS.map(demoUser => {
            const cfg = roleConfig[demoUser.role];
            const Icon = cfg.icon;
            return (
              <div key={demoUser.id} className={`role-card ${cfg.bg}`}>
                <div className={`role-icon-wrapper bg-gradient-to-br ${cfg.gradient}`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="role-info">
                  <div className="role-emoji">{demoUser.icon}</div>
                  <h3 className="role-name">{demoUser.name}</h3>
                  <p className="role-desc">{demoUser.description}</p>
                  <ul className="role-features">
                    {cfg.features.map((f, i) => (
                      <li key={i} className="role-feature-item">
                        <span className="role-feature-dot" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className={`role-btn bg-gradient-to-r ${cfg.gradient}`}
                  onClick={() => handleLogin(demoUser)}
                >
                  Kirish
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="login-footer-note">
          <p>
            DoriNarx — O'zbekiston farmatsevtika bozoridagi narx shaffofligini oshirish va
            sog'lom raqobatni qo'llab-quvvatlash maqsadida ishlab chiqilgan milliy platforma prototipi.
          </p>
        </div>
      </div>
    </div>
  );
}
