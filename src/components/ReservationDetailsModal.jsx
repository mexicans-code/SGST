import React from 'react';
import { Calendar, MapPin, Clock, User, DollarSign, Home, Phone, Mail, MessageCircle, XCircle, Compass } from 'lucide-react';

export default function ReservationDetailsModal({ 
    isOpen, 
    onClose, 
    reservation, 
    onCancelReservation,
    onOpenChat 
}) {
    if (!isOpen || !reservation) return null;

    // Helper para obtener info según el tipo
    const getReservationInfo = (data) => {
        const isExperiencia = data.reserva?.tipo_reserva === 'experiencia';

        if (isExperiencia) {
            return {
                tipo: 'experiencia',
                nombre: data.experiencia?.titulo || 'Experiencia sin título',
                imagen: data.experiencia?.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500',
                precio: data.experiencia?.precio || 0,
                anfitrion: data.experiencia?.anfitrion,
                ubicacion: null,
                fechaUnica: data.experiencia?.fecha_experiencia
            };
        } else {
            return {
                tipo: 'hosteleria',
                nombre: data.establecimiento?.nombre || 'Alojamiento',
                imagen: data.establecimiento?.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500',
                precio: data.establecimiento?.precio_por_noche || 0,
                anfitrion: data.anfitrion,
                ubicacion: data.establecimiento?.direccion,
                fechaUnica: null
            };
        }
    };

    const calcularNoches = (inicio, fin) => {
        if (!fin) return 1;
        const start = new Date(inicio);
        const end = new Date(fin);
        const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const calcularPrecioTotal = (data) => {
        const info = getReservationInfo(data);

        if (info.tipo === 'experiencia') {
            return info.precio * data.reserva?.personas;
        } else {
            const noches = calcularNoches(data.reserva?.fecha_inicio, data.reserva?.fecha_fin);
            return info.precio * noches;
        }
    };

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-MX', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatearDireccion = (direccion) => {
        if (!direccion) return 'Sin ubicación';
        return `${direccion.ciudad || ''}, ${direccion.estado || ''}`.trim();
    };

    const getStatusBadge = (estado) => {
        const badges = {
            confirmada: { bg: 'success', text: 'Confirmada' },
            pendiente: { bg: 'warning', text: 'Pendiente' },
            completada: { bg: 'secondary', text: 'Completada' },
            cancelada: { bg: 'danger', text: 'Cancelada' }
        };
        const badge = badges[estado] || badges.pendiente;
        return <span className={`badge bg-${badge.bg}`}>{badge.text}</span>;
    };

    const info = getReservationInfo(reservation);

    return (
        <div 
            className="modal show d-block" 
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} 
            onClick={onClose}
        >
            <div 
                className="modal-dialog modal-dialog-centered modal-lg" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content rounded-4 border-0 shadow-lg">
                    {/* Header */}
                    <div className="modal-header border-0 pb-0" style={{ backgroundColor: '#F4EFEA' }}>
                        <div>
                            <h4 className="modal-title fw-bold mb-1" style={{ color: '#CD5C5C' }}>
                                Detalles de tu Reservación
                            </h4>
                            <p className="text-muted small mb-0">
                                ID: #{reservation.reserva?.id_reserva} • {info.tipo === 'experiencia' ? 'Experiencia' : 'Alojamiento'}
                            </p>
                        </div>
                        <button 
                            type="button" 
                            className="btn-close" 
                            onClick={onClose}
                        ></button>
                    </div>

                    {/* Body */}
                    <div className="modal-body p-4">
                        {/* Estado */}
                        <div className="mb-4 text-center">
                            {getStatusBadge(reservation.reserva?.estado)}
                        </div>

                        {/* Info del servicio */}
                        <div className="mb-4">
                            <h6 className="fw-bold mb-3" style={{ color: '#CD5C5C' }}>
                                {info.tipo === 'experiencia' ? (
                                    <><Compass size={18} className="me-2" />Tu Experiencia</>
                                ) : (
                                    <><Home size={18} className="me-2" />Tu Alojamiento</>
                                )}
                            </h6>
                            <div 
                                className="d-flex gap-3 align-items-center p-3 rounded-3" 
                                style={{ backgroundColor: '#F8F9FA' }}
                            >
                                <img
                                    src={info.imagen}
                                    alt={info.nombre}
                                    style={{ 
                                        width: '80px', 
                                        height: '80px', 
                                        objectFit: 'cover', 
                                        borderRadius: '8px' 
                                    }}
                                />
                                <div>
                                    <h6 className="fw-bold mb-1">{info.nombre}</h6>
                                    {info.ubicacion && (
                                        <p className="text-muted mb-0 small">
                                            <MapPin size={14} className="me-1" />
                                            {formatearDireccion(info.ubicacion)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Fechas */}
                        <div className="mb-4">
                            <h6 className="fw-bold mb-3" style={{ color: '#CD5C5C' }}>
                                <Calendar size={18} className="me-2" />
                                {info.tipo === 'experiencia' ? 'Fecha de la experiencia' : 'Fechas de tu estancia'}
                            </h6>

                            {info.tipo === 'experiencia' ? (
                                <div className="p-3 rounded-3" style={{ backgroundColor: '#F8F9FA' }}>
                                    <small className="text-muted d-block mb-1">Fecha programada</small>
                                    <strong>{formatearFecha(info.fechaUnica || reservation.reserva?.fecha_inicio)}</strong>
                                    <div className="mt-2 text-muted small">
                                        <User size={14} className="me-1" />
                                        {reservation.reserva?.personas} persona(s)
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <div className="p-3 rounded-3" style={{ backgroundColor: '#F8F9FA' }}>
                                                <small className="text-muted d-block mb-1">Check-in</small>
                                                <strong>{formatearFecha(reservation.reserva?.fecha_inicio)}</strong>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="p-3 rounded-3" style={{ backgroundColor: '#F8F9FA' }}>
                                                <small className="text-muted d-block mb-1">Check-out</small>
                                                <strong>{formatearFecha(reservation.reserva?.fecha_fin)}</strong>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-muted small">
                                        <Clock size={14} className="me-1" />
                                        {calcularNoches(reservation.reserva?.fecha_inicio, reservation.reserva?.fecha_fin)} noches • {reservation.reserva?.personas} huésped(es)
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Anfitrión */}
                        <div className="mb-4">
                            <h6 className="fw-bold mb-3" style={{ color: '#CD5C5C' }}>
                                <User size={18} className="me-2" />
                                {info.tipo === 'experiencia' ? 'Guía' : 'Anfitrión'}
                            </h6>
                            <div className="p-3 rounded-3" style={{ backgroundColor: '#F8F9FA' }}>
                                <div className="mb-2">
                                    <strong>{info.anfitrion?.nombre || 'No disponible'}</strong>
                                </div>
                                <div className="d-flex flex-column gap-2">
                                    <span className="text-muted small">
                                        <Mail size={14} className="me-2" />
                                        {info.anfitrion?.email || 'No disponible'}
                                    </span>
                                    {info.anfitrion?.telefono && (
                                        <span className="text-muted small">
                                            <Phone size={14} className="me-2" />
                                            {info.anfitrion.telefono}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Resumen de pago */}
                        <div className="mb-4">
                            <h6 className="fw-bold mb-3" style={{ color: '#CD5C5C' }}>
                                <DollarSign size={18} className="me-2" />
                                Resumen de pago
                            </h6>
                            <div className="p-3 rounded-3" style={{ backgroundColor: '#F8F9FA' }}>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">
                                        {info.tipo === 'experiencia'
                                            ? `$${info.precio.toLocaleString('es-MX')} × ${reservation.reserva?.personas} persona(s)`
                                            : `$${info.precio.toLocaleString('es-MX')} × ${calcularNoches(reservation.reserva?.fecha_inicio, reservation.reserva?.fecha_fin)} noches`
                                        }
                                    </span>
                                    <span>
                                        ${calcularPrecioTotal(reservation).toLocaleString('es-MX')}
                                    </span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between">
                                    <strong>Total pagado</strong>
                                    <strong style={{ color: '#CD5C5C' }}>
                                        ${calcularPrecioTotal(reservation).toLocaleString('es-MX')}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        {/* Cancelación */}
                        {(reservation.reserva?.estado === 'confirmada' || reservation.reserva?.estado === 'pendiente') && (
                            <div className="border-top pt-3">
                                <h6 className="fw-bold mb-3 text-danger">¿Necesitas cancelar?</h6>
                                <button
                                    className="btn btn-danger w-100 rounded-pill"
                                    onClick={() => onCancelReservation(reservation.reserva?.id_reserva)}
                                >
                                    <XCircle size={16} className="me-2" />
                                    Cancelar mi Reservación
                                </button>
                                <small className="text-muted d-block mt-2 text-center">
                                    Esta acción no se puede deshacer
                                </small>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="modal-footer border-0" style={{ backgroundColor: '#F8F9FA' }}>
                        {(reservation.reserva?.estado === 'confirmada' || reservation.reserva?.estado === 'pendiente') && (
                            <button
                                className="btn btn-outline-secondary rounded-pill px-4"
                                onClick={() => onOpenChat(
                                    info.anfitrion,
                                    info.tipo === 'experiencia' ? reservation.experiencia : reservation.establecimiento,
                                    info.tipo
                                )}
                            >
                                <MessageCircle size={16} className="me-2" />
                                Contactar {info.tipo === 'experiencia' ? 'Guía' : 'Anfitrión'}
                            </button>
                        )}
                        <button 
                            className="btn rounded-pill px-4" 
                            style={{ backgroundColor: '#CD5C5C', color: 'white' }} 
                            onClick={onClose}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}