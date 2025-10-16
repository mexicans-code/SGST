import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, User, DollarSign, Home, Phone, Mail, MessageCircle, XCircle, ArrowRight, Compass } from "lucide-react";
import ChatModal from "../../components/Chat";
import { useNavigate } from "react-router-dom";

export default function UserReservations() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('todas');
    const [userId, setUserId] = useState(null);
    const [chatOpen, setChatOpen] = useState(false);
    const [selectedAnfitrion, setSelectedAnfitrion] = useState(null);
    const [selectedEstablecimiento, setSelectedEstablecimiento] = useState(null);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const navigate = useNavigate();

    function parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        let currentUserId = null;

        if (token) {
            const decodedToken = parseJwt(token);
            if (decodedToken?.id_usuario) {
                currentUserId = decodedToken.id_usuario;
                setUserId(currentUserId);
            }
        }

        const fetchReservations = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch('http://localhost:3000/api/booking/getBookings', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const result = await response.json();

                if (result.success && result.data) {
                    const userReservations = result.data.filter(
                        reserva => reserva.usuario?.id_usuario === currentUserId
                    );
                    setReservations(userReservations);
                }
            } catch (error) {
                console.error('Error al obtener reservaciones:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

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

    const filterReservations = () => {
        if (activeTab === 'todas') {
            return reservations;
        } else if (activeTab === 'proximas') {
            return reservations.filter(r =>
                r.reserva?.estado === 'confirmada' &&
                new Date(r.reserva?.fecha_inicio) > new Date()
            );
        } else if (activeTab === 'pendientes') {
            return reservations.filter(r => r.reserva?.estado === 'pendiente');
        } else if (activeTab === 'completadas') {
            return reservations.filter(r => r.reserva?.estado === 'completada');
        } else {
            return reservations.filter(r => r.reserva?.estado === 'cancelada');
        }
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

    const handleCancelReservation = async (reservaId) => {
        if (window.confirm('¿Estás seguro de que deseas cancelar esta reservación? Esta acción no se puede deshacer.')) {
            try {
                const token = localStorage.getItem("token");
                // const response = await fetch(`http://localhost:3000/api/booking/cancel/${reservaId}`, {
                //     method: 'PUT',
                //     headers: {
                //         'Authorization': `Bearer ${token}`,
                //         'Content-Type': 'application/json'
                //     }
                // });

                alert('Reservación cancelada exitosamente');
                setDetailsModalOpen(false);
            } catch (error) {
                console.error('Error al cancelar reservación:', error);
                alert('Error al cancelar la reservación');
            }
        }
    };

    const handleOpenDetails = (data) => {
        setSelectedReservation(data);
        setDetailsModalOpen(true);
    };

    const handleCloseDetails = () => {
        setSelectedReservation(null);
        setDetailsModalOpen(false);
    };

const handleOpenChat = (anfitrion, item, tipo) => {
    setSelectedAnfitrion(anfitrion);
    setSelectedEstablecimiento({
        ...item,
        tipo: tipo,
        nombre: tipo === 'experiencia' ? item?.titulo : item?.nombre
    });
    setChatOpen(true);
};

    const handleCloseChat = () => {
        setSelectedAnfitrion(null);
        setSelectedEstablecimiento(null);
        setChatOpen(false);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="spinner-border" style={{ color: '#CD5C5C' }} role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    const filteredReservations = filterReservations();

    const stats = {
        todas: reservations.length,
        proximas: reservations.filter(r =>
            r.reserva?.estado === 'confirmada' &&
            new Date(r.reserva?.fecha_inicio) > new Date()
        ).length,
        pendientes: reservations.filter(r => r.reserva?.estado === 'pendiente').length,
        completadas: reservations.filter(r => r.reserva?.estado === 'completada').length
    };

    return (
        <div style={{ backgroundColor: '#fff', minHeight: '100vh', paddingTop: '7rem', paddingBottom: '3rem' }}>
            <div className="container">
                <div className="mb-4">
                    <h1 className="fw-bold mb-2" style={{ color: '#CD5C5C' }}>Mis Viajes</h1>
                    <p className="text-muted">Administra tus reservaciones y próximos viajes</p>
                    <button className="btn btn-outline-secondary btn-sm rounded-pill" onClick={() => navigate('/search')}>
                        Buscar alojamientos <ArrowRight size={16} />
                    </button>
                </div>

                <ChatModal
                    isOpen={chatOpen}
                    onClose={handleCloseChat}
                    anfitrion={selectedAnfitrion}
                    establecimiento={selectedEstablecimiento}
                />

                {/* Modal de Detalles */}
                {detailsModalOpen && selectedReservation && (() => {
                    const info = getReservationInfo(selectedReservation);

                    return (
                        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={handleCloseDetails}>
                            <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-content rounded-4 border-0 shadow-lg">
                                    <div className="modal-header border-0 pb-0" style={{ backgroundColor: '#F4EFEA' }}>
                                        <div>
                                            <h4 className="modal-title fw-bold mb-1" style={{ color: '#CD5C5C' }}>
                                                Detalles de tu Reservación
                                            </h4>
                                            <p className="text-muted small mb-0">
                                                ID: #{selectedReservation.reserva?.id_reserva} • {info.tipo === 'experiencia' ? 'Experiencia' : 'Alojamiento'}
                                            </p>
                                        </div>
                                        <button type="button" className="btn-close" onClick={handleCloseDetails}></button>
                                    </div>

                                    <div className="modal-body p-4">
                                        <div className="mb-4 text-center">
                                            {getStatusBadge(selectedReservation.reserva?.estado)}
                                        </div>

                                        {/* Info del servicio */}
                                        <div className="mb-4">
                                            <h6 className="fw-bold mb-3" style={{ color: '#CD5C5C' }}>
                                                {info.tipo === 'experiencia' ? <Compass size={18} className="me-2" /> : <Home size={18} className="me-2" />}
                                                {info.tipo === 'experiencia' ? 'Tu Experiencia' : 'Tu Alojamiento'}
                                            </h6>
                                            <div className="d-flex gap-3 align-items-center p-3 rounded-3" style={{ backgroundColor: '#F8F9FA' }}>
                                                <img
                                                    src={info.imagen}
                                                    alt={info.nombre}
                                                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
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
                                                    <strong>{formatearFecha(info.fechaUnica || selectedReservation.reserva?.fecha_inicio)}</strong>
                                                    <div className="mt-2 text-muted small">
                                                        <User size={14} className="me-1" />
                                                        {selectedReservation.reserva?.personas} persona(s)
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="row g-3">
                                                        <div className="col-md-6">
                                                            <div className="p-3 rounded-3" style={{ backgroundColor: '#F8F9FA' }}>
                                                                <small className="text-muted d-block mb-1">Check-in</small>
                                                                <strong>{formatearFecha(selectedReservation.reserva?.fecha_inicio)}</strong>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="p-3 rounded-3" style={{ backgroundColor: '#F8F9FA' }}>
                                                                <small className="text-muted d-block mb-1">Check-out</small>
                                                                <strong>{formatearFecha(selectedReservation.reserva?.fecha_fin)}</strong>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 text-muted small">
                                                        <Clock size={14} className="me-1" />
                                                        {calcularNoches(selectedReservation.reserva?.fecha_inicio, selectedReservation.reserva?.fecha_fin)} noches • {selectedReservation.reserva?.personas} huésped(es)
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

                                        <div className="mb-4">
                                            <h6 className="fw-bold mb-3" style={{ color: '#CD5C5C' }}>
                                                <DollarSign size={18} className="me-2" />
                                                Resumen de pago
                                            </h6>
                                            <div className="p-3 rounded-3" style={{ backgroundColor: '#F8F9FA' }}>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="text-muted">
                                                        {info.tipo === 'experiencia'
                                                            ? `$${info.precio.toLocaleString('es-MX')} × ${selectedReservation.reserva?.personas} persona(s)`
                                                            : `$${info.precio.toLocaleString('es-MX')} × ${calcularNoches(selectedReservation.reserva?.fecha_inicio, selectedReservation.reserva?.fecha_fin)} noches`
                                                        }
                                                    </span>
                                                    <span>
                                                        ${calcularPrecioTotal(selectedReservation).toLocaleString('es-MX')}
                                                    </span>
                                                </div>
                                                <hr />
                                                <div className="d-flex justify-content-between">
                                                    <strong>Total pagado</strong>
                                                    <strong style={{ color: '#CD5C5C' }}>
                                                        ${calcularPrecioTotal(selectedReservation).toLocaleString('es-MX')}
                                                    </strong>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Cancelación */}
                                        {(selectedReservation.reserva?.estado === 'confirmada' || selectedReservation.reserva?.estado === 'pendiente') && (
                                            <div className="border-top pt-3">
                                                <h6 className="fw-bold mb-3 text-danger">¿Necesitas cancelar?</h6>
                                                <button
                                                    className="btn btn-danger w-100 rounded-pill"
                                                    onClick={() => handleCancelReservation(selectedReservation.reserva?.id_reserva)}
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

                                    <div className="modal-footer border-0" style={{ backgroundColor: '#F8F9FA' }}>
                                        {(selectedReservation.reserva?.estado === 'confirmada' || selectedReservation.reserva?.estado === 'pendiente') && (
                                            <button
                                                className="btn btn-outline-secondary rounded-pill px-4"
                                                onClick={() => handleOpenChat(
                                                    info.anfitrion,
                                                    info.tipo === 'experiencia' ? selectedReservation.experiencia : selectedReservation.establecimiento,
                                                    info.tipo
                                                )}
                                            >
                                                <MessageCircle size={16} className="me-2" />
                                                Contactar {info.tipo === 'experiencia' ? 'Guía' : 'Anfitrión'}
                                            </button>
                                        )}
                                        <button className="btn rounded-pill px-4" style={{ backgroundColor: '#CD5C5C', color: 'white' }} onClick={handleCloseDetails}>
                                            Cerrar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })()}
                {/* 
                <div className="row g-3 mb-4">
                    <div className="col-md-3 col-sm-6">
                        <div className="card border-0 shadow-sm rounded-3 p-3">
                            <div className="d-flex align-items-center">
                                <div className="p-2 rounded-circle me-3" style={{ backgroundColor: '#E0F2FE' }}>
                                    <Calendar size={20} style={{ color: '#0369A1' }} />
                                </div>
                                <div>
                                    <small className="text-muted">Total</small>
                                    <h4 className="fw-bold mb-0">{stats.todas}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6">
                        <div className="card border-0 shadow-sm rounded-3 p-3">
                            <div className="d-flex align-items-center">
                                <div className="p-2 rounded-circle me-3" style={{ backgroundColor: '#D1FAE5' }}>
                                    <ArrowRight size={20} style={{ color: '#059669' }} />
                                </div>
                                <div>
                                    <small className="text-muted">Próximas</small>
                                    <h4 className="fw-bold mb-0">{stats.proximas}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6">
                        <div className="card border-0 shadow-sm rounded-3 p-3">
                            <div className="d-flex align-items-center">
                                <div className="p-2 rounded-circle me-3" style={{ backgroundColor: '#FEF3C7' }}>
                                    <Clock size={20} style={{ color: '#A16207' }} />
                                </div>
                                <div>
                                    <small className="text-muted">Pendientes</small>
                                    <h4 className="fw-bold mb-0">{stats.pendientes}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6">
                        <div className="card border-0 shadow-sm rounded-3 p-3">
                            <div className="d-flex align-items-center">
                                <div className="p-2 rounded-circle me-3" style={{ backgroundColor: '#E5E7EB' }}>
                                    <Home size={20} style={{ color: '#6B7280' }} />
                                </div>
                                <div>
                                    <small className="text-muted">Completadas</small>
                                    <h4 className="fw-bold mb-0">{stats.completadas}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* Tabs */}
                {/* <ul className="nav nav-pills mb-4">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'todas' ? 'active' : ''}`}
                            style={{
                                backgroundColor: activeTab === 'todas' ? '#CD5C5C' : 'transparent',
                                color: activeTab === 'todas' ? 'white' : '#6c757d',
                                border: 'none'
                            }}
                            onClick={() => setActiveTab('todas')}
                        >
                            Todas ({stats.todas})
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'proximas' ? 'active' : ''}`}
                            style={{
                                backgroundColor: activeTab === 'proximas' ? '#CD5C5C' : 'transparent',
                                color: activeTab === 'proximas' ? 'white' : '#6c757d',
                                border: 'none'
                            }}
                            onClick={() => setActiveTab('proximas')}
                        >
                            Próximas ({stats.proximas})
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'pendientes' ? 'active' : ''}`}
                            style={{
                                backgroundColor: activeTab === 'pendientes' ? '#CD5C5C' : 'transparent',
                                color: activeTab === 'pendientes' ? 'white' : '#6c757d',
                                border: 'none'
                            }}
                            onClick={() => setActiveTab('pendientes')}
                        >
                            Pendientes ({stats.pendientes})
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'completadas' ? 'active' : ''}`}
                            style={{
                                backgroundColor: activeTab === 'completadas' ? '#CD5C5C' : 'transparent',
                                color: activeTab === 'completadas' ? 'white' : '#6c757d',
                                border: 'none'
                            }}
                            onClick={() => setActiveTab('completadas')}
                        >
                            Completadas ({stats.completadas})
                        </button>
                    </li>
                </ul> */}

                {filteredReservations.length === 0 ? (
                    <div className="text-center py-5">
                        <Calendar size={64} color="#CD5C5C" className="mb-3" />
                        <h4 className="text-muted">No tienes reservaciones {activeTab}</h4>
                        <p className="text-muted">¿Listo para tu próxima aventura?</p>
                        <button className="btn rounded-pill px-4 mt-3" style={{ backgroundColor: '#CD5C5C', color: 'white' }} onClick={() => navigate('/search')}>
                            Explorar alojamientos
                        </button>
                    </div>
                ) : (
                    <div className="row g-4">
                        {filteredReservations.map((data) => {
                            const info = getReservationInfo(data);
                            const precioTotal = calcularPrecioTotal(data);

                            return (
                                <div key={data.reserva?.id_reserva} className="col-12">
                                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                                        <div className="row g-0">
                                            <div className="col-md-4 position-relative">
                                                <img
                                                    src={info.imagen}
                                                    alt={info.nombre}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '250px' }}
                                                />
                                                {info.tipo === 'experiencia' && (
                                                    <span className="position-absolute top-0 start-0 m-3 badge" style={{ backgroundColor: '#CD5C5C' }}>
                                                        <Compass size={14} className="me-1" />
                                                        Experiencia
                                                    </span>
                                                )}
                                            </div>

                                            <div className="col-md-8">
                                                <div className="card-body p-4">
                                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                                        <div>
                                                            <h5 className="fw-bold mb-1" style={{ color: '#CD5C5C' }}>
                                                                {info.nombre}
                                                            </h5>
                                                            {info.ubicacion && (
                                                                <p className="text-muted mb-0 d-flex align-items-center gap-1">
                                                                    <MapPin size={16} />
                                                                    {formatearDireccion(info.ubicacion)}
                                                                </p>
                                                            )}
                                                        </div>
                                                        {getStatusBadge(data.reserva?.estado)}
                                                    </div>

                                                    {info.tipo === 'experiencia' ? (
                                                        <div className="mb-3">
                                                            <div className="d-flex align-items-center gap-2 p-3 rounded-3" style={{ backgroundColor: '#F4EFEA' }}>
                                                                <Calendar size={20} color="#CD5C5C" />
                                                                <div>
                                                                    <small className="text-muted d-block">Fecha programada</small>
                                                                    <strong>{formatearFecha(info.fechaUnica || data.reserva?.fecha_inicio)}</strong>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="row g-3 mb-3">
                                                            <div className="col-md-6">
                                                                <div className="d-flex align-items-center gap-2 p-3 rounded-3" style={{ backgroundColor: '#F4EFEA' }}>
                                                                    <Calendar size={20} color="#CD5C5C" />
                                                                    <div>
                                                                        <small className="text-muted d-block">Check-in</small>
                                                                        <strong>{formatearFecha(data.reserva?.fecha_inicio)}</strong>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="d-flex align-items-center gap-2 p-3 rounded-3" style={{ backgroundColor: '#F4EFEA' }}>
                                                                    <Calendar size={20} color="#CD5C5C" />
                                                                    <div>
                                                                        <small className="text-muted d-block">Check-out</small>
                                                                        <strong>{formatearFecha(data.reserva?.fecha_fin)}</strong>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                                        <div>
                                                            <strong>Total: </strong>
                                                            <span style={{ color: '#CD5C5C' }}>
                                                                ${precioTotal.toLocaleString('es-MX')}
                                                            </span>
                                                        </div>

                                                        <div className="d-flex align-items-center gap-2">
                                                            <strong>Personas: </strong>
                                                            <span style={{ color: '#CD5C5C' }}>
                                                                {data.reserva?.personas}
                                                            </span>
                                                        </div>

                                                        <div className="d-flex align-items-center gap-2">
                                                            <strong>Anfitrion: </strong>
                                                            <span style={{ color: '#CD5C5C' }}>
                                                                {info.anfitrion?.nombre}
                                                            </span>
                                                        </div>


                                                        <div className="d-flex gap-2">
                                                            <button
                                                                className="btn btn-outline-secondary rounded-pill btn-sm"
                                                                onClick={() => handleOpenChat(
                                                                    info.anfitrion,
                                                                    info.tipo === 'experiencia' ? data.experiencia : data.establecimiento,
                                                                    info.tipo
                                                                )}
                                                            >
                                                                <MessageCircle size={14} className="me-1" />
                                                                Contactar
                                                            </button>
                                                            <button
                                                                className="btn btn-primary rounded-pill btn-sm"
                                                                style={{ backgroundColor: '#CD5C5C', borderColor: '#CD5C5C' }}
                                                                onClick={() => handleOpenDetails(data)}
                                                            >
                                                                Ver detalles
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
