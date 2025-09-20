import { useState } from 'react';
import { Heart, Star, MapPin, Search, Calendar, Users, ChevronDown, Menu, Globe, User } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav 
      className="navbar navbar-expand-lg navbar-light position-absolute w-100"
      style={{ 
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
      }}
    >
      <div className="container">
        {/* Logo */}
        <a 
          className="navbar-brand fw-bold fs-3 text-danger"
          href="#"
          style={{ 
            fontFamily: 'Georgia, serif',
            letterSpacing: '-0.5px'
          }}
        >
           SGST
        </a>

        {/* Mobile Toggle */}
        <button 
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ outline: 'none', boxShadow: 'none' }}
        >
          <Menu size={24} className="text-dark" />
        </button>

        {/* Navbar Content */}
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          {/* Center Links */}
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a 
                className="nav-link fw-semibold px-3 py-2 rounded-3 mx-1"
                href="#"
                style={{ 
                  transition: 'all 0.3s ease',
                  color: '#6c757d'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(220, 38, 38, 0.1)';
                  e.target.style.color = '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#6c757d';
                }}
              >
                Alojamientos
              </a>
            </li>
            <li className="nav-item">
              <a 
                className="nav-link fw-semibold px-3 py-2 rounded-3 mx-1"
                href="#"
                style={{ 
                  transition: 'all 0.3s ease',
                  color: '#6c757d'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(220, 38, 38, 0.1)';
                  e.target.style.color = '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#6c757d';
                }}
              >
                Experiencias
              </a>
            </li>
            <li className="nav-item">
              <a 
                className="nav-link fw-semibold px-3 py-2 rounded-3 mx-1"
                href="#"
                style={{ 
                  transition: 'all 0.3s ease',
                  color: '#6c757d'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(220, 38, 38, 0.1)';
                  e.target.style.color = '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#6c757d';
                }}
              >
                Aventuras
              </a>
            </li>
          </ul>

          {/* Right Side Actions */}
          <div className="d-flex align-items-center">
            {/* Host Link */}
            <a 
              className="nav-link fw-semibold px-3 py-2 rounded-3 me-2 text-decoration-none"
              href="#"
              style={{ 
                transition: 'all 0.3s ease',
                color: '#6c757d'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(220, 38, 38, 0.1)';
                e.target.style.color = '#dc2626';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#6c757d';
              }}
            >
              SGST
            </a>

            {/* Language */}
            <button 
              className="btn btn-light rounded-circle me-3 d-flex align-items-center justify-content-center"
              style={{ 
                width: '40px', 
                height: '40px',
                border: '1px solid rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.borderColor = '#dc2626';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.borderColor = 'rgba(0,0,0,0.1)';
              }}
            >
              <Globe size={16} className="text-dark" />
            </button>

            {/* User Menu */}
            <div className="dropdown">
              <button 
                className="btn btn-light rounded-pill d-flex align-items-center px-3 py-2 shadow-sm"
                type="button"
                data-bs-toggle="dropdown"
                style={{ 
                  border: '1px solid rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  e.target.style.borderColor = '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                  e.target.style.borderColor = 'rgba(0,0,0,0.1)';
                }}
              >
                <Menu size={16} className="text-dark me-2" />
                <div 
                  className="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
                  style={{ width: '28px', height: '28px' }}
                >
                  <User size={14} className="text-white" />
                </div>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 mt-2">
                <li><a className="dropdown-item fw-semibold py-2" href="#">Registrarse</a></li>
                <li><a className="dropdown-item py-2" href="#">Iniciar sesión</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item py-2" href="#">Pon tu espacio en Airbnb</a></li>
                <li><a className="dropdown-item py-2" href="#">Organiza una experiencia</a></li>
                <li><a className="dropdown-item py-2" href="#">Centro de ayuda</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}