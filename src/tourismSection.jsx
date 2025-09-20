import { useState } from 'react';
import { Heart, Star, MapPin, Clock, Users, Compass } from 'lucide-react';

// Card de Experiencia
function ExperienceCard({
  name = "",
  price = 0,
  rating = 0,
  reviews = 0,
  location = "",
  imageSrc = "",
  duration = "",
  category = "",
  groupSize = "",
  isPopular = false,
  isNew = false,
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleBooking = () => {
    console.log("Reservando experiencia:", name);
  };

  return (
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

        {/* Popular Badge */}
        {isPopular && (
          <span 
            className="badge position-absolute top-3 start-3 shadow-sm"
            style={{ 
              zIndex: 10,
              background: 'rgba(255, 193, 7, 0.95)',
              color: '#6c757d',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              fontSize: '0.75rem',
              padding: '8px 12px'
            }}
          >
            <Star size={14} className="text-warning me-1" fill="currentColor" />
            Popular
          </span>
        )}

        {/* New Badge */}
        {isNew && (
          <span 
            className="badge position-absolute bottom-3 start-3 shadow"
            style={{
              background: 'linear-gradient(135deg, #059669, #10b981)',
              color: 'white',
              fontSize: '0.7rem',
              fontWeight: '700',
              letterSpacing: '0.5px',
              padding: '6px 12px',
              border: '2px solid rgba(255,255,255,0.3)'
            }}
          >
            NUEVA
          </span>
        )}

        {/* Category Badge */}
        <span 
          className="badge position-absolute bottom-3 end-3 shadow-sm"
          style={{
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            fontSize: '0.7rem',
            padding: '6px 10px',
            backdropFilter: 'blur(10px)'
          }}
        >
          {category}
        </span>
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

        {/* Duration & Group Size */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center text-muted small">
            <Clock size={16} className="me-2" />
            <span className="fw-medium">{duration}</span>
          </div>
          <div className="d-flex align-items-center text-muted small">
            <Users size={16} className="me-2" />
            <span className="fw-medium">{groupSize}</span>
          </div>
        </div>

        {/* Price & Button */}
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span className="fw-bold fs-5 text-dark">${price}</span>
            <span className="text-muted small ms-1">/ persona</span>
          </div>
          <button 
            onClick={handleBooking}
            className="btn btn-success btn-sm rounded-3 px-4 py-2 fw-semibold shadow-sm"
            style={{ 
              background: 'linear-gradient(135deg, #059669, #10b981)',
              border: 'none',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(5, 150, 105, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}
          >
            Reservar
          </button>
        </div>
      </div>
    </div>
  );
}

// Datos de experiencias
const experiences = [
  {
    name: "Senderismo en la Sierra Gorda",
    price: 75,
    rating: 4.9,
    reviews: 156,
    location: "Arroyo Seco, Querétaro",
    imageSrc: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    duration: "4 horas",
    category: "Aventura",
    groupSize: "Hasta 8 personas",
    isPopular: true,
    isNew: false
  },
  {
    name: "Tour de Cascadas y Pozas Azules",
    price: 95,
    rating: 4.8,
    reviews: 203,
    location: "Ranas, Querétaro",
    imageSrc: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    duration: "6 horas",
    category: "Naturaleza",
    groupSize: "Hasta 12 personas",
    isPopular: false,
    isNew: true
  },
  {
    name: "Rappel en la Peña de Bernal",
    price: 120,
    rating: 4.7,
    reviews: 98,
    location: "Bernal, Querétaro",
    imageSrc: "https://dynamic-media.tacdn.com/media/vr-ha-splice-j/10/46/e9/53.jpg?w=800&h=-1",
    duration: "5 horas",
    category: "Extremo",
    groupSize: "Hasta 6 personas",
    isPopular: true,
    isNew: false
  },
  {
    name: "Tour Gastronómico Local",
    price: 65,
    rating: 4.6,
    reviews: 142,
    location: "Jalpan, Querétaro",
    imageSrc: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    duration: "3 horas",
    category: "Cultura",
    groupSize: "Hasta 15 personas",
    isPopular: false,
    isNew: false
  },
  {
    name: "Observación de Aves y Vida Silvestre",
    price: 85,
    rating: 4.8,
    reviews: 76,
    location: "Landa de Matamoros",
    imageSrc: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    duration: "4 horas",
    category: "Naturaleza",
    groupSize: "Hasta 10 personas",
    isPopular: false,
    isNew: true
  },
  {
    name: "Ciclismo de Montaña",
    price: 90,
    rating: 4.5,
    reviews: 89,
    location: "Arroyo Seco, Querétaro",
    imageSrc: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/45/49/bf/caption.jpg?w=300&h=300&s=1",
    duration: "5 horas",
    category: "Aventura",
    groupSize: "Hasta 8 personas",
    isPopular: true,
    isNew: false
  }
];

// Componente Principal - Solo Sección de Experiencias
export default function ExperiencesSection() {
  return (
    <div className="bg-light">
      {/* Custom CSS Styles */}
      <style>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>

      {/* Section Header */}
      <div className="bg-white shadow-sm border-bottom">
        <div className="container py-5">
          <div className="text-center">
            <h2 className="display-4 fw-bold text-dark mb-3">
              Experiencias Únicas
            </h2>
            <p className="lead text-muted fs-5">
              Vive aventuras inolvidables en la Sierra Gorda
            </p>
          </div>
        </div>
      </div>

      {/* Experiences Grid */}
      <div className="container py-5">
        <div className="row justify-content-center g-4">
          {experiences.map((experience, index) => (
            <div key={`${experience.name}-${index}`} className="col-auto">
              <ExperienceCard {...experience} />
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-success text-white py-5">
        <div className="container text-center">
          <h3 className="display-5 fw-bold mb-3">¿Listo para tu próxima aventura?</h3>
          <p className="lead mb-4">Únete a miles de aventureros que han descubierto la magia de la Sierra Gorda</p>
          <button 
            className="btn btn-light btn-lg px-5 py-3 fw-bold"
            style={{ 
              transition: 'all 0.3s ease',
              border: '2px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <Compass size={20} className="me-2" />
            Explorar Todas las Experiencias
          </button>
        </div>
      </div>
    </div>
  );
}