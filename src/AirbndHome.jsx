import { useState } from 'react';
import { Heart, Star, MapPin, Search, Calendar, Users, ChevronDown } from 'lucide-react';

// Hero Section Component
export default function HeroSection() {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  return (
    <div 
      className="hero-section position-relative d-flex align-items-center justify-content-center text-white"
      style={{
        height: '100vh',
        background: 'linear-gradient(135deg, rgba(48, 228, 63, 0.85), rgba(227, 241, 213, 0.85)), url("https://queretaro.travel/wp-content/uploads/2022/02/DJI_0480.jpg") center/cover no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="container text-center">
        <h1 className="display-1 fw-bold mb-4 text-shadow">
          Descubre Arroyo Seco
        </h1>
        <p className="lead fs-3 mb-5 fw-light">
          El corazón de la Sierra Gorda de Querétaro te espera
        </p>
        
        {/* Search Form Mejorado */}
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            <div className="card shadow-lg border-0 rounded-4 p-4 bg-white text-dark">
              <div className="card-body">
                <div className="row g-4 align-items-end">
                  <div className="col-md-3">
                    <label className="form-label small fw-bold text-uppercase text-muted mb-2 tracking-wide">
                      Llegada
                    </label>
                    <div className="input-group">
                      <span className="input-group-text border-end-0 bg-transparent text-muted">
                        <Calendar size={18} />
                      </span>
                      <input 
                        type="date" 
                        className="form-control border-start-0 py-3 fs-6" 
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        style={{ transition: 'all 0.3s ease' }}
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-3">
                    <label className="form-label small fw-bold text-uppercase text-muted mb-2">
                      Salida
                    </label>
                    <div className="input-group">
                      <span className="input-group-text border-end-0 bg-transparent text-muted">
                        <Calendar size={18} />
                      </span>
                      <input 
                        type="date" 
                        className="form-control border-start-0 py-3 fs-6" 
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        style={{ transition: 'all 0.3s ease' }}
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-3">
                    <label className="form-label small fw-bold text-uppercase text-muted mb-2">
                      Huéspedes
                    </label>
                    <div className="input-group">
                      <span className="input-group-text border-end-0 bg-transparent text-muted">
                        <Users size={18} />
                      </span>
                      <select 
                        className="form-select border-start-0 py-3 fs-6" 
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        style={{ transition: 'all 0.3s ease' }}
                      >
                        <option value={1}>1 huésped</option>
                        <option value={2}>2 huéspedes</option>
                        <option value={3}>3 huéspedes</option>
                        <option value={4}>4 huéspedes</option>
                        <option value={5}>5+ huéspedes</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="col-md-3">
                    <button 
                      className="btn btn-danger btn-lg w-100 rounded-3 py-3 fw-semibold shadow-sm"
                      onClick={() => document.getElementById('propiedades')?.scrollIntoView({ behavior: 'smooth' })}
                      style={{ 
                        background: 'linear-gradient(135deg, #dc2626, #e11d48)',
                        border: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 25px rgba(220, 38, 38, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                      }}
                    >
                      <Search size={18} className="me-2" />
                      Buscar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator mejorado */}
      <div 
        className="position-absolute bottom-0 start-50 translate-middle-x mb-4 cursor-pointer"
        onClick={() => document.getElementById('propiedades')?.scrollIntoView({ behavior: 'smooth' })}
        style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
        onMouseEnter={(e) => e.target.style.transform = 'translateX(-50%) scale(1.1)'}
        onMouseLeave={(e) => e.target.style.transform = 'translateX(-50%) scale(1)'}
      >
        <ChevronDown 
          size={40} 
          className="text-white opacity-75"
          style={{ 
            animation: 'bounce 2s infinite',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
          }}
        />
      </div>
    </div>
  );
}
