import { useState } from 'react';
import { Heart, Star, MapPin, Users, Wifi, Car, Coffee, Tv, Wind, X, Calendar, CreditCard } from 'lucide-react';

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
    "https://images.unsplash.com/photo-1556020685-ae41abfc9365?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ]
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleShowDetails = () => {
    setShowModal(true);
  };

  const handleReserve = () => {
    console.log("Reservando:", name);
    // Aquí podrías redirigir a una página de reserva
  };

  const getAmenityIcon = (amenity) => {
    if (amenity.toLowerCase().includes('wifi')) return <Wifi size={16} />;
    if (amenity.toLowerCase().includes('estacion')) return <Car size={16} />;
    if (amenity.toLowerCase().includes('cocina')) return <Coffee size={16} />;
    if (amenity.toLowerCase().includes('tv')) return <Tv size={16} />;
    if (amenity.toLowerCase().includes('aire')) return <Wind size={16} />;
    return <Star size={16} />;
  };

  return (
    <>
      <div 
        className="card shadow border-0 rounded-4 overflow-hidden position-relative mb-4 mx-2"
        style={{ 
          width: '22rem',
          transition: 'all 0.3s ease',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-8px)';
          e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        }}
      >
        <div className="position-relative overflow-hidden">
          <img 
            src={imageSrc}
            className={`card-img-top ${imageLoaded ? '' : 'opacity-0'}`}
            alt={name}
            onLoad={() => setImageLoaded(true)}
            style={{ 
              transition: 'all 0.5s ease', 
              height: '18rem', 
              objectFit: 'cover',
              transform: 'scale(1)'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          />
          
          {!imageLoaded && (
            <div 
              className="position-absolute top-0 start-0 w-100 h-100 bg-secondary bg-gradient"
              style={{ 
                background: 'linear-gradient(45deg, #e9ecef, #dee2e6)',
                animation: 'pulse 1.5s ease-in-out infinite alternate'
              }}
            />
          )}

          {/* Favorite Button */}
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className="btn btn-light position-absolute top-3 end-3 rounded-circle shadow"
            style={{ 
              zIndex: 10,
              width: '45px',
              height: '45px',
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              border: 'none',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)';
              e.target.style.background = 'rgba(255,255,255,1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.background = 'rgba(255,255,255,0.9)';
            }}
          >
            <Heart 
              size={22} 
              className={isFavorite ? "text-danger" : "text-secondary"}
              style={{ 
                fill: isFavorite ? 'currentColor' : 'none',
                transition: 'all 0.3s ease'
              }}
            />
          </button>

          {/* Badges */}
          {isGuest && (
            <span 
              className="badge position-absolute top-3 start-3 shadow-sm"
              style={{ 
                zIndex: 10,
                background: 'rgba(255,255,255,0.95)',
                color: '#6c757d',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
                fontSize: '0.75rem',
                padding: '8px 12px'
              }}
            >
              <Star size={14} className="text-warning me-1" fill="currentColor" />
              Favorito
            </span>
          )}

          {isSuperhost && (
            <span 
              className="badge position-absolute bottom-3 start-3 shadow"
              style={{
                background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: '700',
                letterSpacing: '0.5px',
                padding: '6px 12px',
                border: '2px solid rgba(255,255,255,0.3)'
              }}
            >
              SUPERHOST
            </span>
          )}
        </div>

        <div className="card-body p-4">
          {/* Location & Rating */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="text-muted small d-flex align-items-center flex-grow-1">
              <MapPin size={16} className="me-2 text-secondary" />
              <span className="text-truncate fw-medium">{location}</span>
            </div>
            <div className="d-flex align-items-center small fw-bold ms-3">
              <Star size={16} className="text-warning me-1" fill="currentColor" />
              <span className="text-dark">{rating}</span>
              <span className="text-muted ms-1">({reviews})</span>
            </div>
          </div>

          {/* Title */}
          <h5 
            className="card-title fw-bold mb-3 text-dark lh-sm"
            style={{ 
              WebkitLineClamp: 2, 
              display: '-webkit-box', 
              WebkitBoxOrient: 'vertical', 
              overflow: 'hidden',
              minHeight: '2.5rem',
              fontSize: '1.25rem'
            }}
          >
            {name}
          </h5>

          {/* Property Info */}
          <div className="d-flex align-items-center mb-3 text-muted small">
            <Users size={16} className="me-2" />
            <span className="fw-medium me-3">{guests} huéspedes</span>
            <span className="me-3">• {bedrooms} habitaciones</span>
            <span>• {bathrooms} baños</span>
          </div>

          {/* Price & Button */}
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <span className="fw-bold fs-5 text-dark">${price}</span>
              <span className="text-muted small ms-1">/ noche</span>
            </div>
            <button 
              onClick={handleShowDetails}
              className="btn btn-danger btn-sm rounded-3 px-4 py-2 fw-semibold shadow-sm"
              style={{ 
                background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                border: 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(220, 38, 38, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }}
            >
              Ver más
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Información Detallada */}
      {showModal && (
        <div 
          className="modal fade show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 overflow-hidden">
              {/* Modal Header */}
              <div className="modal-header border-bottom-0 p-4">
                <h4 className="modal-title fw-bold text-dark">{name}</h4>
                <button 
                  type="button" 
                  className="btn-close-white btn btn-light rounded-circle"
                  onClick={() => setShowModal(false)}
                  style={{ 
                    width: '40px', 
                    height: '40px',
                    border: 'none'
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body p-0">
                <div className="row g-0">
                  {/* Galería de Imágenes */}
                  <div className="col-lg-7">
                    <div className="position-relative">
                      <img 
                        src={images[currentImageIndex]} 
                        className="img-fluid w-100"
                        alt={name}
                        style={{ height: '400px', objectFit: 'cover' }}
                      />
                      
                      {/* Navegación de imágenes */}
                      <div className="position-absolute bottom-3 start-50 translate-middle-x">
                        <div className="d-flex gap-2">
                          {images.map((_, index) => (
                            <button
                              key={index}
                              className={`btn btn-sm rounded-circle ${
                                index === currentImageIndex ? 'btn-light' : 'btn-outline-light'
                              }`}
                              style={{ width: '12px', height: '12px', padding: 0 }}
                              onClick={() => setCurrentImageIndex(index)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información Detallada */}
                  <div className="col-lg-5">
                    <div className="p-4">
                      {/* Rating y Ubicación */}
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center">
                          <MapPin size={18} className="me-2 text-secondary" />
                          <span className="text-muted">{location}</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <Star size={18} className="text-warning me-1" fill="currentColor" />
                          <span className="fw-bold">{rating}</span>
                          <span className="text-muted ms-1">({reviews} reseñas)</span>
                        </div>
                      </div>

                      {/* Detalles de la Propiedad */}
                      <div className="row g-3 mb-4">
                        <div className="col-4 text-center">
                          <div className="p-3 bg-light rounded-3">
                            <Users size={24} className="text-primary mb-2" />
                            <div className="fw-bold">{guests}</div>
                            <small className="text-muted">Huéspedes</small>
                          </div>
                        </div>
                        <div className="col-4 text-center">
                          <div className="p-3 bg-light rounded-3">
                            <div className="fw-bold fs-4 text-primary mb-1">{bedrooms}</div>
                            <small className="text-muted">Habitaciones</small>
                          </div>
                        </div>
                        <div className="col-4 text-center">
                          <div className="p-3 bg-light rounded-3">
                            <div className="fw-bold fs-4 text-primary mb-1">{bathrooms}</div>
                            <small className="text-muted">Baños</small>
                          </div>
                        </div>
                      </div>

                      {/* Descripción */}
                      <div className="mb-4">
                        <h6 className="fw-bold mb-3">Descripción</h6>
                        <p className="text-muted lh-sm">{description}</p>
                      </div>

                      {/* Amenidades */}
                      <div className="mb-4">
                        <h6 className="fw-bold mb-3">Amenidades</h6>
                        <div className="row g-2">
                          {amenities.map((amenity, index) => (
                            <div key={index} className="col-12">
                              <div className="d-flex align-items-center p-2 bg-light rounded-3">
                                <span className="text-primary me-3">
                                  {getAmenityIcon(amenity)}
                                </span>
                                <span className="small fw-medium">{amenity}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Precio y Reserva */}
                      <div className="border-top pt-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <span className="fw-bold fs-3 text-dark">${price}</span>
                            <span className="text-muted">/ noche</span>
                          </div>
                          {isSuperhost && (
                            <span className="badge bg-danger">SUPERHOST</span>
                          )}
                        </div>

                        <div className="row g-3">
                          <div className="col-6">
                            <button 
                              className="btn btn-outline-danger w-100 rounded-3 fw-semibold"
                              onClick={() => setIsFavorite(!isFavorite)}
                            >
                              <Heart 
                                size={18} 
                                className={`me-2 ${isFavorite ? 'text-danger' : ''}`}
                                style={{ fill: isFavorite ? 'currentColor' : 'none' }}
                              />
                              {isFavorite ? 'Guardado' : 'Guardar'}
                            </button>
                          </div>
                          <div className="col-6">
                            <button 
                              onClick={handleReserve}
                              className="btn btn-danger w-100 rounded-3 fw-semibold"
                              style={{ 
                                background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                                border: 'none'
                              }}
                            >
                              <Calendar size={18} className="me-2" />
                              Reservar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        
        .modal.show {
          animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}