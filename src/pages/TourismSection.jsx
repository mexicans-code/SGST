import { useState } from 'react';
import { Star, MapPin, Clock, Compass } from 'lucide-react';

import { EXPERIENCES } from '../const/data';
import ReservationModal from '../components/ReservationModal';

function ExperienceCard({ experience, onReserve, darkMode = false }) {
  const { name, price, rating, location, imageSrc, duration, category, groupSize } = experience;
  const [imageLoaded, setImageLoaded] = useState(false);

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
            <span className="fw-bold" style={{ fontSize: '0.8rem' }}>{rating}</span>
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
          <span className="me-2">• disponibilidad {groupSize}</span>
          <span>• {category}</span>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span className="fw-bold" style={{ fontSize: '1.1rem' }}>${price}</span>
            <span className="text-muted ms-1" style={{ fontSize: '0.8rem' }}>/ persona</span>
          </div>
          <button
            onClick={() => onReserve(experience)}
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
  const [selected, setSelected] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const visibleExperiences = showAll ? EXPERIENCES : EXPERIENCES.slice(0, 4);

  return (
    <div className={darkMode ? 'bg-dark' : 'bg-light'}>
      <div className="container py-5">
        <div className="row mb-4">
          <div className="col-12">
            <h2 className={`fw-bold mb-3 ${darkMode ? 'text-light' : 'text-dark'}`}>Experiencias Destacadas</h2>
            <p className={darkMode ? 'text-light' : 'text-muted'}>
              {visibleExperiences.length} de {EXPERIENCES.length} experiencias disponibles en la Sierra Gorda
            </p>
          </div>
        </div>

        <div className="row g-4 justify-content-center">
          {visibleExperiences.map((experience) => (
            <div key={experience.id} className="col-auto">
              <ExperienceCard experience={experience} darkMode={darkMode} onReserve={setSelected} />
            </div>
          ))}
        </div>

        <div className="row mt-5">
          <div className="col-12 text-center">
            <button
              className="btn btn-outline-success btn-lg px-5 py-3 fw-bold"
              onClick={() => setShowAll((v) => !v)}
            >
              {showAll ? 'Ver Menos Experiencias' : 'Ver Más Experiencias'}
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

      {selected && (
        <ReservationModal item={selected} type="experience" onClose={() => setSelected(null)} />
      )}
    </div>
  );
}