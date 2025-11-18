import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Compass } from 'lucide-react';

function ExperienceCard({
  id,
  name = "Casa moderna en el centro",
  price = 120,
  rating = 4.8,
  location = "Ciudad de México",
  imageSrc = "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6OTgzNjEwMjg4MDc1MTM0Mjg5/original/6530be09-e469-42eb-ad40-c24de66631e9.jpeg",
  duration = "",
  category = "",
  groupSize = "",
  darkMode = false,
  onReserve
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleReserve = () => {
    if (onReserve) {
      onReserve(id);
    } else {
      console.log("Reservando experiencia con ID:", id);
    }
  };

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
          alt={name}
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
            <span className={`fw-bold ${darkMode ? 'text-light' : 'text-dark'}`} style={{ fontSize: '0.8rem' }}>{rating}</span>
          </div>
        </div>

        <h5
          className={`card-title fw-bold mb-2 lh-sm ${darkMode ? 'text-light' : 'text-dark'}`}
          style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.2rem', fontSize: '1.1rem' }}
        >
          {name}
        </h5>

        <div className={`d-flex align-items-center mb-3 ${darkMode ? 'text-light' : 'text-muted'}`} style={{ fontSize: '0.8rem' }}>
          <Clock size={14} className="me-2" />
          <span className="fw-medium me-2">{duration}h</span>
          {groupSize && <span className="me-2">• disponibilidad {groupSize}</span>}
          {category && <span>• {category}</span>}
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span className={`fw-bold ${darkMode ? 'text-light' : 'text-dark'}`} style={{ fontSize: '1.1rem' }}>${price}</span>
            <span className="text-muted ms-1" style={{ fontSize: '0.8rem' }}>/ persona</span>
          </div>
          <button
            onClick={handleReserve}
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

export default function ExperiencesSection({ darkMode = false }) {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/adminTouristExperiences/getTouristExperiences');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();

        if (result.success && result.data) {
            const validExperiences = result.data.filter(exp => exp.capacidad > 0);

          const mappedExperiences = validExperiences.map(exp => ({
            id: exp.id_experiencia,
            name: exp.titulo,
            price: exp.precio,
            rating: exp.calificacion ?? 4.5,
            location: exp.direcciones ? `${exp.direcciones.ciudad}, ${exp.direcciones.estado}` : 'Ubicación no disponible',
            imageSrc: exp.image || 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
            duration: exp.duracion,
            category: exp.tipo_experiencia,
            groupSize: exp.capacidad,
          }));
          setExperiences(mappedExperiences);
        } else throw new Error('Formato de respuesta inválido');
        setError(null);
      } catch (err) {
        console.error('Error fetching experiences:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  const handleReserveExperience = (experienceId) => {
    localStorage.setItem('experienceId', experienceId);
    navigate('/reservation/tourism');
  };

  if (loading) return (
    <div className={darkMode ? 'bg-dark' : 'bg-light'}>
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className={`mt-3 ${darkMode ? 'text-light' : 'text-muted'}`}>Cargando experiencias...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className={darkMode ? 'bg-dark' : 'bg-light'}>
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error al cargar experiencias</h4>
          <p>{error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={darkMode ? 'bg-dark' : 'bg-light'}>
      <div className="container py-5">
        <div className="row mb-4">
          <div className="col-12">
            <h2 className={`fw-bold mb-3 ${darkMode ? 'text-light' : 'text-dark'}`}>Experiencias Destacadas</h2>
            <p className={darkMode ? 'text-light' : 'text-muted'}>
              {experiences.length} {experiences.length === 1 ? 'experiencia disponible' : 'experiencias disponibles'}
            </p>
          </div>
        </div>

        {experiences.length === 0 ? (
          <div className="text-center py-5">
            <Compass size={48} className="text-muted mb-3" />
            <p className="text-muted">No hay experiencias disponibles en este momento</p>
          </div>
        ) : (
          <div className="row g-4 justify-content-center">
            {experiences.map((experience) => (
              <div key={experience.id} className="col-auto">
                <ExperienceCard
                  {...experience}
                  darkMode={darkMode}
                  onReserve={handleReserveExperience}
                />
              </div>
            ))}
          </div>
        )}

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
            style={{ transition: 'all 0.3s ease', border: '2px solid transparent' }}
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
