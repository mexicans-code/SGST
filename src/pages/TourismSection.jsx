import { useState } from 'react';
import { Heart, Star, MapPin, Clock, Users, Compass } from 'lucide-react';

// Componente AirbnbCard adaptado (copia del original con las props necesarias)
function AirbnbCard({
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
  description = "Hermosa casa moderna ubicada en el corazón de la ciudad. Perfecta para familias o grupos de amigos que buscan comodidad y estilo.",
  amenities = ["WiFi gratuito", "Estacionamiento", "Cocina equipada", "TV con cable", "Aire acondicionado"],
  images = [],
  duration = "",
  category = "",
  groupSize = "",
  isPopular = false,
  isNew = false,
  isExperience = false // Nueva prop para distinguir experiencias
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleReserve = () => {
    console.log(isExperience ? "Reservando experiencia:" : "Reservando alojamiento:", name);
  };

  return (
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

        {/* Info específica según el tipo */}
        <div className="d-flex align-items-center mb-3 text-muted" style={{ fontSize: '0.8rem' }}>
          {isExperience ? (
            <>
              <Clock size={14} className="me-2" />
              <span className="fw-medium me-2">{duration}</span>
              {groupSize && <span className="me-2">• {groupSize}</span>}
              {category && <span>• {category}</span>}
            </>
          ) : (
            <>
              <Users size={14} className="me-2" />
              <span className="fw-medium me-2">{guests} huéspedes</span>
              <span className="me-2">• {bedrooms} hab</span>
              <span>• {bathrooms} baños</span>
            </>
          )}
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span className="fw-bold text-dark" style={{ fontSize: '1.1rem' }}>${price}</span>
            <span className="text-muted ms-1" style={{ fontSize: '0.8rem' }}>
              {isExperience ? '/ persona' : '/ noche'}
            </span>
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
            {isExperience ? 'Reservar' : 'Reservar'}
          </button>
        </div>
      </div>
    </div>
  );
}

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
  return (
    <AirbnbCard
      name={name}
      price={price}
      rating={rating}
      reviews={reviews}
      location={location}
      imageSrc={imageSrc}
      duration={duration}
      category={category}
      groupSize={groupSize}
      isPopular={isPopular}
      isNew={isNew}
      isExperience={true} // Marcamos que es una experiencia
    />
  );
}

export default function ExperiencesSection() {
  // Datos de ejemplo para las experiencias
  const experiences = [
    {
      name: "Senderismo en la Sierra Gorda",
      price: 350,
      rating: 4.9,
      reviews: 89,
      location: "Jalpan, Querétaro",
      imageSrc: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      duration: "6 horas",
      category: "Aventura",
      groupSize: "Hasta 12 personas",
      isPopular: true,
      isNew: false
    },
    {
      name: "Tour de Cascadas y Grutas",
      price: 280,
      rating: 4.8,
      reviews: 156,
      location: "Ranas, Querétaro",
      imageSrc: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      duration: "8 horas",
      category: "Naturaleza",
      groupSize: "Hasta 8 personas",
      isPopular: false,
      isNew: true
    },
    {
      name: "Experiencia Gastronómica Local",
      price: 420,
      rating: 4.7,
      reviews: 73,
      location: "Arroyo Seco, Querétaro",
      imageSrc: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      duration: "4 horas",
      category: "Gastronomía",
      groupSize: "Hasta 10 personas",
      isPopular: false,
      isNew: false
    },
    {
      name: "Observación de Aves",
      price: 200,
      rating: 4.6,
      reviews: 45,
      location: "Landa de Matamoros, Querétaro",
      imageSrc: "https://images.unsplash.com/photo-1444464666168-49d633b86797?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      duration: "5 horas",
      category: "Naturaleza",
      groupSize: "Hasta 6 personas",
      isPopular: false,
      isNew: true
    },
    {
      name: "Observación de Peces",
      price: 200,
      rating: 4.6,
      reviews: 45,
      location: "Landa de Matamoros, Querétaro",
      imageSrc: "https://picsum.photos/200",
      duration: "5 horas",
      category: "Naturaleza",
      groupSize: "Hasta 6 personas",
      isPopular: false,
      isNew: true
    },
    {
      name: "Observación de jaguares",
      price: 200,
      rating: 4.6,
      reviews: 45,
      location: "Landa de Matamoros, Querétaro",
      imageSrc: "https://picsum.photos/100",
      duration: "5 horas",
      category: "Naturaleza",
      groupSize: "Hasta 6 personas",
      isPopular: false,
      isNew: true
    },
    {
      name: "Observación de Osos",
      price: 200,
      rating: 4.6,
      reviews: 45,
      location: "Landa de Matamoros, Querétaro",
      imageSrc: "https://picsum.photos/90",
      duration: "5 horas",
      category: "Naturaleza",
      groupSize: "Hasta 6 personas",
      isPopular: false,
      isNew: true
    }

  ];

  return (
    <div className="bg-light">
      <div className="container py-5">
        <div className="row mb-4">
          <div className="col-12">
            <h2 className="fw-bold text-dark mb-3">Experiencias Destacadas</h2>
          </div>
        </div>
        
        <div className="row g-4 justify-content-center">
          {experiences.map((experience, index) => (
            <div key={index} className="col-auto">
              <ExperienceCard {...experience} />
            </div>
          ))}
        </div>

        <div className="row mt-5">
          <div className="col-12 text-center">
            <button className="btn btn-outline-success btn-lg px-5 py-3 fw-bold">
              Ver Más Experiencias
            </button>
          </div>
        </div>
      </div>

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