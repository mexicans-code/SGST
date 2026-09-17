import { useState } from 'react';
import { Star, MapPin, Users } from 'lucide-react';

import { HOTELS } from '../const/data';
import ReservationModal from './ReservationModal';

function AirbnbCard({ hotel, onReserve, darkMode = false }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const imageSrc = hotel.image === "255"
    ? "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop&q=60"
    : hotel.image;

  const rating = getRandomRating();
  const reviews = getRandomReviews();
  const { bedrooms, bathrooms } = getRoomsFromCapacity(hotel.capacidad);
  const location = hotel.direcciones
    ? `${hotel.direcciones.ciudad}, ${hotel.direcciones.estado}`
    : "Ubicación no disponible";

  return (
    <div
      className={`card shadow border-0 rounded-4 overflow-hidden position-relative mb-4 h-100 ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}
      style={{
        width: '19rem',
        maxWidth: '19rem',
        background: darkMode ? 'rgba(33,33,33,0.95)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div className="position-relative overflow-hidden">
        <img
          src={imageSrc}
          className={`card-img-top ${imageLoaded ? '' : 'opacity-0'}`}
          alt={hotel.nombre}
          onLoad={() => setImageLoaded(true)}
          style={{ height: '14rem', objectFit: 'cover' }}
        />
        {!imageLoaded && (
          <div
            className="position-absolute top-0 start-0 w-100 h-100 bg-secondary bg-gradient"
            style={{ background: 'linear-gradient(45deg, #e9ecef, #dee2e6)' }}
          />
        )}
      </div>

      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className={`d-flex align-items-center ${darkMode ? 'text-light' : 'text-muted'}`} style={{ flex: '1', minWidth: 0 }}>
            <MapPin size={14} className={`me-2 flex-shrink-0 ${darkMode ? 'text-light' : 'text-dark'}`} />
            <span className="text-truncate fw-medium" style={{ fontSize: '0.8rem' }}>{location}</span>
          </div>
          <div className="d-flex align-items-center ms-2 flex-shrink-0">
            <Star size={14} className="text-warning me-1" fill="currentColor" />
            <span className="fw-bold" style={{ fontSize: '0.8rem' }}>{rating}</span>
            <span className="text-muted ms-1" style={{ fontSize: '0.75rem' }}>({reviews})</span>
          </div>
        </div>

        <h5
          className="card-title fw-bold mb-2 lh-sm"
          style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.2rem', fontSize: '1.1rem' }}
        >
          {hotel.nombre}
        </h5>

        <div className={`d-flex align-items-center mb-3 ${darkMode ? 'text-light' : 'text-muted'}`} style={{ fontSize: '0.8rem' }}>
          <Users size={14} className="me-2" />
          <span className="fw-medium me-2">{hotel.capacidad} huéspedes</span>
          <span className="me-2">• {bedrooms} hab</span>
          <span>• {bathrooms} baños</span>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span className="fw-bold" style={{ fontSize: '1.1rem' }}>${hotel.precio_por_noche}</span>
            <span className="text-muted ms-1" style={{ fontSize: '0.8rem' }}>/ noche</span>
          </div>
          <button
            onClick={() => onReserve(hotel)}
            className="btn btn-danger btn-sm rounded-3 px-3 py-2 fw-semibold shadow-sm"
            style={{ background: 'rgb(85, 107, 47)', border: 'none', fontSize: '0.8rem' }}
          >
            Reservar
          </button>
        </div>
      </div>
    </div>
  );
}

function getRandomRating() {
  const ratings = [4.2, 4.3, 4.5, 4.6, 4.7, 4.8, 4.9];
  return ratings[Math.floor(Math.random() * ratings.length)];
}

function getRandomReviews() {
  return Math.floor(Math.random() * 200) + 20;
}

function getRoomsFromCapacity(capacity) {
  if (capacity <= 2) return { bedrooms: 1, bathrooms: 1 };
  if (capacity <= 4) return { bedrooms: 2, bathrooms: 1 };
  if (capacity <= 6) return { bedrooms: 3, bathrooms: 2 };
  return { bedrooms: 4, bathrooms: 2 };
}

export default function HotelListings({ darkMode = false }) {
  const [selected, setSelected] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const visibleHotels = showAll ? HOTELS : HOTELS.slice(0, 4);

  return (
    <div className={darkMode ? 'bg-dark' : 'bg-light'}>
      <div className="container py-5">
        <div className="row mb-4">
          <div className="col-12">
            <h2 className={`fw-bold mb-3 ${darkMode ? 'text-light' : 'text-dark'}`}>Propiedades Disponibles</h2>
            <p className={darkMode ? 'text-light' : 'text-muted'}>
              {visibleHotels.length} de {HOTELS.length} propiedades únicas para tu estadía en la Sierra Gorda
            </p>
          </div>
        </div>

        <div className="row g-4 justify-content-center">
          {visibleHotels.map((hotel) => (
            <div key={hotel.id_hosteleria} className="col-auto">
              <AirbnbCard hotel={hotel} darkMode={darkMode} onReserve={setSelected} />
            </div>
          ))}
        </div>

        <div className="row mt-5">
          <div className="col-12 text-center">
            <button
              className="btn btn-outline-success btn-lg px-5 py-3 fw-bold"
              onClick={() => setShowAll((v) => !v)}
            >
              {showAll ? 'Ver Menos Propiedades' : 'Ver Más Propiedades'}
            </button>
          </div>
        </div>
      </div>

      {selected && (
        <ReservationModal item={selected} type="hotel" onClose={() => setSelected(null)} />
      )}
    </div>
  );
}