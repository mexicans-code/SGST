import { useState } from 'react';
import { X, Calendar, Users, Check, CreditCard, MapPin, ShieldCheck } from 'lucide-react';

const GREEN = 'rgb(85, 107, 47)';
const fmt = (n) => '$' + Number(n).toLocaleString('es-MX');

const today = () => new Date().toISOString().split('T')[0];

export default function ReservationModal({ item, type = 'hotel', onClose }) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [personDate, setPersonDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [confirmed, setConfirmed] = useState(false);

  if (!item) return null;

  const price = item.price ?? item.precio_por_noche;
  const name = item.name ?? item.nombre;
  const location = item.location
    ?? (item.direcciones ? `${item.direcciones.ciudad}, ${item.direcciones.estado}` : 'Ubicación no disponible');
  const imageSrc = item.imageSrc ?? item.image;
  const maxGuests = type === 'hotel' ? (item.capacidad || 10) : (item.groupSize || 20);

  const isHotel = type === 'hotel';
  const nights = isHotel && checkIn && checkOut
    ? Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000)
    : 0;
  const hasValidDates = isHotel ? nights > 0 : !!personDate;
  const quantity = isHotel ? Math.max(1, nights) : Math.max(1, guests);
  const total = price * quantity;

  const qtyLabel = isHotel
    ? `${quantity} ${quantity === 1 ? 'noche' : 'noches'}`
    : `${quantity} ${quantity === 1 ? 'persona' : 'personas'}`;

  const handleDates = (setter) => (e) => {
    const v = e.target.value;
    if (isHotel && setter === setCheckIn && v && checkOut && new Date(checkOut) <= new Date(v)) {
      setCheckOut('');
    }
    setter(v);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        className="bg-white shadow-lg overflow-hidden"
        style={{ maxWidth: '480px', width: '100%', maxHeight: '92vh', overflowY: 'auto', borderRadius: '20px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {!confirmed ? (
          <>
            <div className="position-relative">
              <img
                src={imageSrc}
                alt={name}
                style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }}
              />
              <button
                onClick={onClose}
                className="btn btn-light btn-sm rounded-circle position-absolute top-0 end-0 m-3 shadow-sm border-0"
                style={{ width: '34px', height: '34px', zIndex: 2 }}
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
              <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.7))' }}
              />
              <div className="position-absolute bottom-0 start-0 w-100 p-4 text-white">
                <h5 className="fw-bold mb-1">{name}</h5>
                <div className="d-flex align-items-center small opacity-75">
                  <MapPin size={14} className="me-1" />
                  {location}
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{ width: '38px', height: '38px', background: '#eef3e7' }}
                >
                  <Calendar size={20} color={GREEN} />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-0">
                    {isHotel ? 'Fecha de tu estadía' : 'Fecha de tu experiencia'}
                  </h6>
                  <small className="text-muted">
                    {isHotel ? 'Selecciona llegada y salida' : 'Elige el día de tu actividad'}
                  </small>
                </div>
              </div>

              <div className="row g-2 mb-1">
                <div className="col-6">
                  <label className="small text-muted fw-medium mb-1">{isHotel ? 'Llegada' : 'Fecha'}</label>
                  <input
                    type="date"
                    className={`form-control ${isHotel ? '' : 'form-control'}`}
                    min={today()}
                    value={isHotel ? checkIn : personDate}
                    onChange={handleDates(isHotel ? setCheckIn : setPersonDate)}
                    style={{ borderRadius: '10px' }}
                  />
                </div>
                {isHotel && (
                  <div className="col-6">
                    <label className="small text-muted fw-medium mb-1">Salida</label>
                    <input
                      type="date"
                      className="form-control"
                      min={checkIn || today()}
                      value={checkOut}
                      onChange={handleDates(setCheckOut)}
                      style={{ borderRadius: '10px' }}
                    />
                  </div>
                )}
              </div>
              {isHotel && checkIn && checkOut && nights <= 0 && (
                <small className="text-danger d-block mt-1">
                  La salida debe ser posterior a la llegada.
                </small>
              )}

              <hr className="my-4 text-muted" />

              <div className="d-flex align-items-center gap-2 mb-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{ width: '38px', height: '38px', background: '#eef3e7' }}
                >
                  <Users size={20} color={GREEN} />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-0">{isHotel ? 'Huéspedes' : 'Participantes'}</h6>
                  <small className="text-muted">Máximo {maxGuests}</small>
                </div>
              </div>

              <div
                className="d-flex align-items-center justify-content-between rounded-3"
                style={{ background: '#f8f9fa', border: '1px solid #e9ecef', padding: '10px 14px' }}
              >
                <span className="fw-semibold text-dark">
                  {guests} {isHotel ? 'huésped(es)' : 'persona(s)'}
                </span>
                <div className="d-flex align-items-center gap-2">
                  <button
                    className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                    style={{ width: '32px', height: '32px', background: '#fff', border: '1px solid #dee2e6' }}
                    onClick={() => setGuests((g) => Math.max(1, g - 1))}
                    aria-label="Restar"
                  >
                    -
                  </button>
                  <button
                    className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                    style={{ width: '32px', height: '32px', background: '#fff', border: '1px solid #dee2e6' }}
                    onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))}
                    disabled={guests >= maxGuests}
                    aria-label="Sumar"
                  >
                    +
                  </button>
                </div>
              </div>

              <hr className="my-4 text-muted" />

              {hasValidDates ? (
                <div className="rounded-3 p-3" style={{ background: '#f8f9fa', border: '1px solid #e9ecef' }}>
                  <div className="d-flex justify-content-between text-dark small">
                    <span>{isHotel ? `${fmt(price)} × ${qtyLabel}` : `${fmt(price)} / persona × ${qtyLabel}`}</span>
                    <span className="fw-semibold">{fmt(total)}</span>
                  </div>
                  <div className="d-flex justify-content-between text-dark small mt-1">
                    <span>Servicios y tarifas</span>
                    <span className="text-success fw-medium">Incluidos</span>
                  </div>
                  <div className="border-top pt-3 mt-3 d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-dark">Total</span>
                    <span className="fw-bold" style={{ fontSize: '1.25rem', color: GREEN }}>{fmt(total)}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted small py-3 rounded-3" style={{ background: '#f8f9fa', border: '1px dashed #ced4da' }}>
                  {isHotel
                    ? 'Selecciona tus fechas para ver el total de tu estadía.'
                    : 'Selecciona la fecha de tu experiencia para confirmar.'}
                </div>
              )}

              <button
                className="btn w-100 py-3 fw-bold text-white border-0 rounded-3 mt-3"
                style={{ background: GREEN }}
                onClick={() => setConfirmed(true)}
                disabled={!hasValidDates}
              >
                <CreditCard size={18} className="me-2" />
                Confirmar reserva
              </button>

              <div className="d-flex align-items-center justify-content-center gap-1 mt-3 text-muted small">
                <ShieldCheck size={14} color={GREEN} />
                Reserva 100% demostrativa · sin cargos a tu tarjeta
              </div>
            </div>
          </>
        ) : (
          <div className="p-5 text-center">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: '72px', height: '72px', background: '#eef3e7' }}
            >
              <Check size={40} color={GREEN} />
            </div>
            <h4 className="fw-bold text-dark mb-2">¡Reserva confirmada!</h4>
            <p className="text-muted mb-1">Tu reserva de <strong>{name}</strong> quedó registrada.</p>
            <p className="text-muted mb-3">
              {isHotel
                ? `${qtyLabel} · ${guests} huésped(es)`
                : `${qtyLabel} · ${personDate}`}
            </p>
            <div className="rounded-3 p-3 mb-4" style={{ background: '#f8f9fa', border: '1px solid #e9ecef' }}>
              <span className="text-muted small">Total a pagar</span>
              <div className="fw-bold" style={{ fontSize: '1.5rem', color: GREEN }}>{fmt(total)}</div>
            </div>
            <div className="small text-secondary mb-4">
              Proyecto demostrativo estático: no se realizó ningún cargo.
            </div>
            <button className="btn text-white px-4 fw-semibold border-0 rounded-3" style={{ background: GREEN }} onClick={onClose}>
              Listo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}