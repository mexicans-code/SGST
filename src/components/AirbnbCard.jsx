import { useState } from 'react';
import { Heart, Star, MapPin, Users, Wifi, Car, Coffee, Tv, Wind, X, Calendar, CreditCard } from 'lucide-react';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";



export default function AirbnbCard({
  name = "Casa moderna en el centro",
  price = 120,
  rating = 4.8,
  reviews = 127,
  location = "Ciudad de México",
  imageSrc = "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6OTgzNjEwMjg4MDc1MTM0Mjg5/original/6530be09-e469-42eb-ad40-c24de66631e9.jpeg",
  guests = 4,
  bedrooms = 2,
  bathrooms = 2,
  isGuest = false,
  isSuperhost = false,
  description = "Hermosa casa moderna ubicada en el corazón de la ciudad. Perfecta para familias o grupos de amigos que buscan comodidad y estilo. Cuenta con todas las amenidades necesarias para una estancia inolvidable.",
  amenities = ["WiFi gratuito", "Estacionamiento", "Cocina equipada", "TV con cable", "Aire acondicionado"],
  images = [
    "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6OTgzNjEwMjg4MDc1MTM0Mjg5/original/6530be09-e469-42eb-ad40-c24de66631e9.jpeg",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1556020685-ae41abfc9365?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1556020685-ae41abfc9365?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ]
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const navigate = useNavigate();

  const handleReserve = () => {
    const reservationData = {
      name,
      price,
      rating,
      reviews,
      location,
      imageSrc,
      guests,
      bedrooms,
      bathrooms,
      isGuest,
      isSuperhost,
      description,
      amenities,
      images
    };

    navigate('/reservation', { state: { reservationData } });
  };

  return (
    <>
      <div
        className="card shadow border-0 rounded-4 overflow-hidden position-relative mb-4 h-100"
        style={{
          width: '19rem',
          maxWidth: '19rem',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div className="position-relative overflow-hidden">
          <img
            src={imageSrc}
            className={`card-img-top ${imageLoaded ? '' : 'opacity-0'}`}
            alt={name}
            onLoad={() => setImageLoaded(true)}
            style={{
              height: '14rem',
              objectFit: 'cover',
              transform: 'scale(1)'
            }}
          />

          {!imageLoaded && (
            <div
              className="position-absolute top-0 start-0 w-100 h-100 bg-secondary bg-gradient"
              style={{
                background: 'linear-gradient(45deg, #e9ecef, #dee2e6)',
              }}
            />
          )}
        </div>

        <div className="card-body p-3">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div className="text-muted d-flex align-items-center" style={{ flex: '1', minWidth: 0 }}>
              <MapPin size={14} className="me-2 text-dark flex-shrink-0" />
              <span className="text-truncate fw-medium" style={{ fontSize: '0.8rem' }}>{location}</span>
            </div>
            <div className="d-flex align-items-center ms-2 flex-shrink-0">
              <Star size={14} className="text-warning me-1" fill="currentColor" />
              <span className="text-dark fw-bold" style={{ fontSize: '0.8rem' }}>{rating}</span>
              <span className="text-muted ms-1" style={{ fontSize: '0.75rem' }}>({reviews})</span>
            </div>
          </div>

          <h5
            className="card-title fw-bold mb-2 text-dark lh-sm"
            style={{
              WebkitLineClamp: 2,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.2rem',
              fontSize: '1.1rem'
            }}
          >
            {name}
          </h5>

          <div className="d-flex align-items-center mb-3 text-muted" style={{ fontSize: '0.8rem' }}>
            <Users size={14} className="me-2" />
            <span className="fw-medium me-2">{guests} huéspedes</span>
            <span className="me-2">• {bedrooms} hab</span>
            <span>• {bathrooms} baños</span>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <div>
              <span className="fw-bold text-dark" style={{ fontSize: '1.1rem' }}>${price}</span>
              <span className="text-muted ms-1" style={{ fontSize: '0.8rem' }}>/ noche</span>
            </div>
            <button
              onClick={handleReserve}
              className="btn btn-danger btn-sm rounded-3 px-3 py-2 fw-semibold shadow-sm"
              style={{
                background: 'rgb(85, 107, 47)',
                border: 'none',
                fontSize: '0.8rem'
              }}
            >
              Reservar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}