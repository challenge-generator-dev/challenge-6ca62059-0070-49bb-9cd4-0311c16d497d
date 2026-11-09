import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const HomeIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const OrdersIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const MenuIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems: NavItem[] = [
    { path: '/', label: 'Inicio', icon: <HomeIcon /> },
    { path: '/orders', label: 'Órdenes', icon: <OrdersIcon /> },
  ];

  const isActivePath = (path: string): boolean => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && isMobileMenuOpen) {
      handleCloseMobileMenu();
    }
  };

  return (
    <div className="layout" onKeyDown={handleKeyDown} role="application" aria-label="Aplicación de gestión de órdenes">
      <header className="layout-header">
        <div className="layout-header-content">
          <Link to="/" className="layout-logo" aria-label="Ir a inicio">
            <span className="layout-logo-text">OrderManager</span>
          </Link>

          <button
            className="layout-mobile-toggle"
            onClick={handleToggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="main-navigation"
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          <nav
            id="main-navigation"
            className={`layout-nav ${isMobileMenuOpen ? 'layout-nav--open' : ''}`}
            aria-label="Navegación principal"
          >
            <ul className="layout-nav-list" role="list">
              {navItems.map((item) => (
                <li key={item.path} className="layout-nav-item">
                  <Link
                    to={item.path}
                    className={`layout-nav-link ${isActivePath(item.path) ? 'layout-nav-link--active' : ''}`}
                    onClick={handleCloseMobileMenu}
                    aria-current={isActivePath(item.path) ? 'page' : undefined}
                  >
                    <span className="layout-nav-icon" aria-hidden="true">{item.icon}</span>
                    <span className="layout-nav-label">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="layout-main" role="main" id="main-content">
        <div className="layout-main-content">
          {children}
        </div>
      </main>

      <footer className="layout-footer" role="contentinfo">
        <div className="layout-footer-content">
          <p className="layout-footer-text">
            © 2024 OrderManager. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;