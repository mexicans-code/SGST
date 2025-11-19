import { useState, useEffect } from 'react';
import { Heart, Star, MapPin, Users, Wifi, Car, Coffee, Tv, Wind, X, Calendar, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Componente individual de card (mantiene tus estilos originales)
function AirbnbCard({ hotel }) {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleReserve = () => {
    const reservationData = {
      id: hotel.id_hosteleria,
      name: hotel.nombre,
      price: hotel.precio_por_noche,
      location: hotel.direcciones
        ? `${hotel.direcciones.ciudad}, ${hotel.direcciones.estado}`
        : "Ubicación no disponible",
      imageSrc: hotel.image === "255" ? "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" : hotel.image,
      guests: hotel.capacidad,
      description: hotel.descripcion,
      hostId: hotel.id_anfitrion,
      rating: rating,
      reviews: reviews,
      bedrooms: bedrooms,
      bathrooms: bathrooms
    };

    // Guarda los datos en localStorage para pasarlos a la página de reserva
    localStorage.setItem('reservationData', JSON.stringify(reservationData));

    console.log("Id de la propiedad: ", hotel.id_hosteleria);

    // Navega a la página de reserva
    navigate('/reservation');
  };

  // Función para obtener una calificación aleatoria realista
  const getRandomRating = () => {
    const ratings = [4.2, 4.3, 4.5, 4.6, 4.7, 4.8, 4.9];
    return ratings[Math.floor(Math.random() * ratings.length)];
  };

  // Función para obtener número de reseñas aleatorio
  const getRandomReviews = () => {
    return Math.floor(Math.random() * 200) + 20;
  };

  // Función para estimar habitaciones y baños basado en capacidad
  const getRoomsFromCapacity = (capacity) => {
    if (capacity <= 2) return { bedrooms: 1, bathrooms: 1 };
    if (capacity <= 4) return { bedrooms: 2, bathrooms: 1 };
    if (capacity <= 6) return { bedrooms: 3, bathrooms: 2 };
    return { bedrooms: 4, bathrooms: 2 };
  };

  const rating = getRandomRating();
  const reviews = getRandomReviews();
  const { bedrooms, bathrooms } = getRoomsFromCapacity(hotel.capacidad);

  const name = hotel.nombre;
  const price = hotel.precio_por_noche;
  const location = hotel.direcciones
    ? `${hotel.direcciones.ciudad}, ${hotel.direcciones.estado}`
    : "Ubicación no disponible";
  const imageSrc = hotel.image === "255" ? "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" : hotel.image;
  const guests = hotel.capacidad;
  const description = hotel.descripcion;

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

export default function HotelListings() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/getHotelData');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Datos de hoteles recibidos:', result);

        if (result.success && result.data) {

          // solo hoteles activos Y con capacidad > 0
          const hotelesActivos = result.data.filter(
            hotel => hotel.estado === 'activo' && hotel.capacidad > 0
          );

          setHotels(hotelesActivos);

        } else {
          throw new Error('Formato de respuesta inválido');
        }

        setError(null);

      } catch (err) {
        console.error('Error fetching hotels:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);


  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div>Cargando hoteles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
        <h5>⚠️ Error de conexión</h5>
        <p>No se pudieron cargar las propiedades desde el servidor.</p>
        <small>Error: {error}</small>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>Propiedades Disponibles</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Encontramos {hotels.length} propiedades únicas para tu estadía</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1rem'
      }}>
        {hotels.map((hotel) => (
          <AirbnbCard key={hotel.id_hosteleria} hotel={hotel} />
        ))}
      </div>

      {hotels.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No se encontraron propiedades disponibles.</p>
        </div>
      )}
    </div>
  );
}