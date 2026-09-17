import { useState } from 'react';
import { X, Calendar, Users, Check, CreditCard, MapPin } from 'lucide-react';

const fmt = (n) => '$' + Number(n).toLocaleString('es-MX');

export default function ReservationModal({ item, type = 'hotel', onClose }) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [confirmed, setConfirmed] = useState(false);

  if (!item) return null;

  const price = item.price ?? item.precio_por_noche;
  const name = item.name ?? item.nombre;
  const location = item.location
    ?? (item.direcciones ? `${item.direcciones.ciudad}, ${item.direcciones.estado}` : 'Ubicación no disponible');
  const imageSrc = item.imageSrc ?? item.image;
  const maxGuests = type === 'hotel' ? (item.capacidad || 10) : (item.groupSize || 20);

  const nights = checkIn && checkOut
    ? Math.max(0, Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000))
    : 0;

  const subtotal = type === 'hotel' ? price * nights : price * Math.max(1, guests);
  const total = type === 'hotel' ? price * Math.max(1, nights) : price * Math.max(1, guests);

  const today = new Date().toISOString().split('T')[0];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        backgroundColor: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        className="modal-content rounded-4 shadow-lg border-0 overflow-hidden"
        style={{ maxWidth: '560px', width: '100%', maxHeight: '92vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {!confirmed ? (
          <>
            <div className="position-relative">
              <img
                src={imageSrc}
                alt={name}
                style={{ width: '100%', height: '220px', objectFit: 'cover' }}
              />
              <button
                onClick={onClose}
                className="btn btn-light btn-sm rounded-circle position-absolute top-0 end-0 m-2 shadow"
                style={{ width: '34px', height: '34px' }}
              >
                <X size={18} />
              </button>
              <div
                className="position-absolute bottom-0 start-0 w-100 text-white p-3"
                style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.75))' }}
              >
                <h5 className="fw-bold mb-0">{name}</h5>
                <div className="d-flex align-items-center small">
                  <MapPin size={14} className="me-1" />
                  {location}
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="d-flex align-items-center gap-2 mb-2 fw-semibold text-dark">
                <Calendar size={18} className="text-success" />
                {type === 'hotel' ? 'Fecha de tu estadía' : 'Fecha de tu experiencia'}
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="small text-muted fw-medium">Llegada</label>
                  <input
                    type="date"
                    className="form-control"
                    min={today}
                    value={checkIn}
                    onChange={(e) => {
                      setCheckIn(e.target.value);
                      if (e.target.value && checkOut && new Date(checkOut) <= new Date(e.target.value)) {
                        setCheckOut('');
                      }
                    }}
                  />
                </div>
                <div className="col-6">
                  <label className="small text-muted fw-medium">Salida</label>
                  <input
                    type="date"
                    className="form-control"
                    min={checkIn || today}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>
              </div>

              <div className="d-flex align-items-center gap-2 mb-4 fw-semibold text-dark">
                <Users size={18} className="text-success" />
                {type === 'hotel' ? 'Huéspedes' : 'Personas'}
              </div>
              <div className="d-flex align-items-center mb-4">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setGuests((g) => Math.max(1, g - 1))}
                >
                  -
                </button>
                <span className="fw-bold mx-3" style={{ minWidth: '80px', textAlign: 'center' }}>
                  {guests} {type === 'hotel' ? 'huésped(es)' : 'persona(s)'}
                </span>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))}
                  disabled={guests >= maxGuests}
                >
                  +
                </button>
              </div>

              <div className="border-top pt-3 mb-4">
                <div className="d-flex justify-content-between text-dark small">
                  <span>
                    {type === 'hotel'
                      ? `${fmt(price)} × ${Math.max(1, nights)} noche(s)`
                      : `${fmt(price)} × ${Math.max(1, guests)} persona(s)`}
                  </span>
                  <span className="fw-semibold">{fmt(subtotal)}</span>
                </div>
                <div className="d-flex justify-content-between text-dark small">
                  <span>Servicios y tarifas</span>
                  <span className="fw-semibold">Incluidos</span>
                </div>
                <div className="d-flex justify-content-between fw-bold text-dark mt-2" style={{ fontSize: '1.1rem' }}>
                  <span>Total</span>
                  <span>{fmt(total)}</span>
                </div>
              </div>

              {checkIn && checkOut && new Date(checkOut) <= new Date(checkIn) && (
                <div className="alert alert-danger py-2 small">
                  La fecha de salida debe ser posterior a la de llegada.
                </div>
              )}

              <button
                className="btn w-100 py-3 fw-bold text-white border-0 rounded-3"
                style={{ background: 'rgb(85, 107, 47)' }}
                onClick={() => setConfirmed(true)}
              >
                <CreditCard size={18} className="me-2" />
                Confirmar reserva
              </button>
            </div>
          </>
        ) : (
          <div className="p-5 text-center">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: '72px', height: '72px', background: '#e8f5e9' }}
            >
              <Check size={40} color="#2e7d32" />
            </div>
            <h4 className="fw-bold text-dark mb-2">¡Reserva confirmada!</h4>
            <p className="text-muted mb-1">Tu reserva de <strong>{name}</strong> quedó registrada.</p>
            <p className="text-muted mb-4">
              {type === 'hotel' && nights > 0
                ? `${Math.max(1, nights)} noche(s) · ${guests} huésped(es)`
                : `${Math.max(1, guests)} persona(s)`} · Total <strong>{fmt(total)}</strong>
            </p>
            <div className="small text-secondary mb-4">
              Proyecto demostrativo estático: no se realizó ningún cargo.
            </div>
            <button className="btn btn-outline-secondary px-4 fw-semibold" onClick={onClose}>
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}