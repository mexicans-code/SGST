import { useState, useEffect } from 'react';
import { Heart, MapPin, Calendar, Users, Search, ChevronDown } from 'lucide-react';
import { GATEWAY_URL } from '../const/Const';

export default function HeroSection({ darkMode = false, onSearchResults }) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [destination, setDestination] = useState('');
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllProperties();
  }, []);

  const fetchAllProperties = async () => {
    try {
      const response = await fetch(`https://hospitality-production-72f9.up.railway.app/getHotelData`);
      const data = await response.json();
      setAllProperties(data);
    } catch (error) {
      console.error('Error al cargar propiedades:', error);
    }
  };

  const handleSearch = () => {
    setLoading(true);

    // Filtrar propiedades según los criterios
    let filtered = [...allProperties];

    // Filtro por destino/nombre
    if (destination.trim()) {
      const searchTerm = destination.toLowerCase();
      filtered = filtered.filter(property => 
        property.nombre?.toLowerCase().includes(searchTerm) ||
        property.descripcion?.toLowerCase().includes(searchTerm) ||
        property.direccion?.ciudad?.toLowerCase().includes(searchTerm) ||
        property.direccion?.estado?.toLowerCase().includes(searchTerm)
      );
    }

    // Filtro por capacidad de huéspedes
    filtered = filtered.filter(property => 
      (property.capacidad_personas || 10) >= guests
    );

    // Filtro por fechas (verificar disponibilidad)
    if (checkIn && checkOut) {
      // Aquí puedes agregar lógica de verificación de disponibilidad
      // Por ahora solo validamos que checkout sea después de checkin
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      
      if (end <= start) {
        alert('La fecha de salida debe ser después de la fecha de llegada');
        setLoading(false);
        return;
      }
    }

    // Pasar resultados al componente padre
    if (onSearchResults) {
      onSearchResults(filtered, { checkIn, checkOut, guests, destination });
    }

    // Scroll a resultados
    setTimeout(() => {
      document.getElementById('propiedades')?.scrollIntoView({ behavior: 'smooth' });
      setLoading(false);
    }, 300);
  };

  return (
    <>
      <style>{`
        .hero-main {
          background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.2)), 
                      url("https://queretaro.travel/wp-content/uploads/2022/02/DJI_0480.jpg") center/cover;
          height: 100vh;
        }
        .search-card {
          background: rgba(255,255,255,0.98);
          backdrop-filter: blur(20px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          border: 1px solid rgba(255,255,255,0.2);
        }
        .search-item {
          transition: all 0.3s ease;
          cursor: pointer;
          border-radius: 12px;
        }
        .search-item:hover { 
          background: rgba(59,130,246,0.08);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59,130,246,0.15);
        }
        .search-input {
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .search-input:focus {
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
          background: rgba(59,130,246,0.02);
        }
        .divider {
          width: 1px;
          height: 40px;
          background: rgba(0,0,0,0.1);
        }
        .btn-search {
          background:rgb(85, 107, 47);
          transition: all 0.3s ease;
          color: #ffffff;
        }
        .btn-search:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(85,107,47,0.3);
          background:rgb(70, 92, 37);
        }
        .btn-search:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .title-gradient {
          background: linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 2px 2px 20px rgba(0,0,0,0.3);
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.8s ease-out; }
        .bounce { animation: bounce 2s infinite; }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
          60% { transform: translateY(-4px); }
        }
      `}</style>

      <div className="hero-main d-flex align-items-center justify-content-center position-relative">
        <div className="container px-2">

          <div className="text-center mb-5 fade-up bounce position-relative" style={{ top: '-50px' }}>
            <h1 className="display-1 fw-bold mb-3 title-gradient" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
              Arroyo Seco
              <Heart className="text-danger ms-3" size={60} fill="currentColor" />
            </h1>
            <p className="lead text-white mb-2" style={{ fontSize: '1.3rem', textShadow: '1px 1px 8px rgba(0,0,0,0.5)' }}>
              Sierra Gorda de Querétaro • Pueblo Mágico
            </p>
          </div>

          {/* <div className="row justify-content-center fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="col-12 col-lg-11">
              <div className="search-card rounded-4 p-3">
                <div className="row g-2 align-items-center">

                  <div className="col-12 col-md-3">
                    <div className="search-item p-3 position-relative">
                      <label className="d-flex align-items-center mb-2 fw-semibold text-dark" style={{ fontSize: '0.85rem' }}>
                        <MapPin size={16} className="text-danger me-2" />
                        DESTINO
                      </label>
                      <input
                        type="text"
                        className="search-input form-control border-0 p-2 bg-light rounded-2 fw-medium"
                        placeholder="Buscar destino..."
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        style={{ fontSize: '0.95rem' }}
                      />
                    </div>
                    <div className="divider d-none d-md-block position-absolute top-50 end-0 translate-middle-y"></div>
                  </div>

                  <div className="col-6 col-md-2">
                    <div className="search-item p-3 position-relative">
                      <label className="d-flex align-items-center mb-2 fw-semibold text-dark" style={{ fontSize: '0.85rem' }}>
                        <Calendar size={16} className="text-primary me-2" />
                        LLEGADA
                      </label>
                      <input
                        type="date"
                        className="search-input form-control border-0 p-2 bg-light rounded-2 fw-medium"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        style={{ fontSize: '0.9rem' }}
                      />
                    </div>
                    <div className="divider d-none d-md-block position-absolute top-50 end-0 translate-middle-y"></div>
                  </div>

                  <div className="col-6 col-md-2">
                    <div className="search-item p-3 position-relative">
                      <label className="d-flex align-items-center mb-2 fw-semibold text-dark" style={{ fontSize: '0.85rem' }}>
                        <Calendar size={16} className="text-success me-2" />
                        SALIDA
                      </label>
                      <input
                        type="date"
                        className="search-input form-control border-0 p-2 bg-light rounded-2 fw-medium"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn || new Date().toISOString().split('T')[0]}
                        style={{ fontSize: '0.9rem' }}
                      />
                    </div>
                    <div className="divider d-none d-md-block position-absolute top-50 end-0 translate-middle-y"></div>
                  </div>

                  <div className="col-8 col-md-3">
                    <div className="search-item p-3">
                      <label className="d-flex align-items-center mb-2 fw-semibold text-dark" style={{ fontSize: '0.85rem' }}>
                        <Users size={16} className="text-warning me-2" />
                        HUÉSPEDES
                      </label>
                      <div className="d-flex align-items-center">
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm me-2"
                          onClick={() => setGuests(Math.max(1, guests - 1))}
                          style={{ width: '30px', height: '30px' }}
                        >
                          -
                        </button>
                        <span className="fw-bold mx-2" style={{ minWidth: '60px', textAlign: 'center' }}>
                          {guests} {guests === 1 ? 'huésped' : 'huéspedes'}
                        </span>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm ms-2"
                          onClick={() => setGuests(guests + 1)}
                          style={{ width: '30px', height: '30px' }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-4 col-md-2">
                    <div className="text-center">
                      <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="btn btn-search text-white rounded-3 px-4 py-3 fw-semibold border-0 w-100"
                        style={{ minHeight: '56px' }}
                      >
                        {loading ? (
                          <span className="spinner-border spinner-border-sm me-2" />
                        ) : (
                          <Search size={20} className="me-1" />
                        )}
                        <span className="d-none d-md-inline">
                          {loading ? 'Buscando...' : 'Buscar'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>

        <div className="position-absolute bottom-4 start-50 translate-middle-x text-center"
          style={{ cursor: 'pointer' }} onClick={handleSearch}>
          <small className="text-white opacity-75 d-block mb-2">Explorar propiedades</small>
          <ChevronDown size={28} className="text-white opacity-75 bounce" />
        </div>
      </div>
    </>
  );
}