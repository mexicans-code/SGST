import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, User, DollarSign, Home, Phone, Mail, MessageCircle, CheckCircle, XCircle, ArrowRight, Sparkles } from "lucide-react";
import ChatModal from "../../components/Chat";
import { useNavigate } from "react-router-dom";

export default function HostReservations() {
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
                    // Filtrar reservaciones donde el usuario actual es el anfitrión
                    const hostReservations = result.data.filter(reserva => {
                        // Para hostelería
                        if (reserva.tipo_reserva === 'hosteleria' || reserva.reserva?.tipo_reserva === 'hosteleria') {
                            return reserva.anfitrion?.id_usuario === currentUserId;
                        }
                        // Para experiencias
                        if (reserva.tipo_reserva === 'experiencia' || reserva.reserva?.tipo_reserva === 'experiencia') {
                            return reserva.experiencia?.anfitrion?.id_usuario === currentUserId;
                        }
                        return false;
                    });
                    setReservations(hostReservations);
                }
            } catch (error) {
                console.error('Error al obtener reservaciones:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    const filterReservations = () => {
        if (activeTab === 'todas') {
            return reservations;
        } else if (activeTab === 'pendientes') {
            return reservations.filter(r => r.reserva?.estado === 'pendiente');
        } else if (activeTab === 'confirmadas') {
            return reservations.filter(r => r.reserva?.estado === 'confirmada');
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
        if (!fin) return 1; // Para experiencias que no tienen fecha fin
        const start = new Date(inicio);
        const end = new Date(fin);
        const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const calcularPrecioTotal = (data) => {
        const tipo = data.reserva?.tipo_reserva;

        if (tipo === 'experiencia') {
            return data.experiencia?.precio || 0;
        } else {
            const precioNoche = data.establecimiento?.precio_por_noche || 0;
            const noches = calcularNoches(data.reserva?.fecha_inicio, data.reserva?.fecha_fin);
            return precioNoche * noches;
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

    const handleAcceptReservation = async (reservaId) => {
        if (window.confirm('¿Confirmar esta reservación?')) {
            alert('Reservación confirmada');
        }
    };

    const handleRejectReservation = async (reservaId) => {
        if (window.confirm('¿Rechazar esta reservación?')) {
            alert('Reservación rechazada');
        }
    };

    const handleCancelReservation = async (reservaId) => {
        if (window.confirm('¿Estás seguro de que deseas cancelar esta reservación? Esta acción no se puede deshacer.')) {
            try {
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

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="spinner-border" style={{ color: '#CD5C5C' }} role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    const handleOpenChat = (anfitrion, establecimiento) => {
        setSelectedAnfitrion(anfitrion);
        setSelectedEstablecimiento(establecimiento);
        setChatOpen(true);
    };

    const handleCloseChat = () => {
        setSelectedAnfitrion(null);
        setSelectedEstablecimiento(null);
        setChatOpen(false);
    };

    const filteredReservations = filterReservations();

    const stats = {
        todas: reservations.length,
        pendientes: reservations.filter(r => r.reserva?.estado === 'pendiente').length,
        confirmadas: reservations.filter(r => r.reserva?.estado === 'confirmada').length,
        completadas: reservations.filter(r => r.reserva?.estado === 'completada').length
    };

    return (
        <div style={{ backgroundColor: '#fff', minHeight: '100vh', paddingTop: '7rem', paddingBottom: '3rem' }}>
            <div className="container">
                <div className="mb-4">
                    <h1 className="fw-bold mb-2" style={{ color: '#CD5C5C' }}>Reservas de mis Propiedades y Experiencias</h1>
                    <p className="text-muted">Gestiona las reservaciones de tus huéspedes</p>
                    <button className="btn btn-outline-secondary btn-sm rounded-pill" onClick={() => navigate('/host/publications')}>
                        Mis propiedades <ArrowRight size={16} />
                    </button>
                </div>

                <ChatModal
                    isOpen={chatOpen}
                    onClose={handleCloseChat}
                    anfitrion={selectedAnfitrion}
                    establecimiento={selectedEstablecimiento}
                />

                {/* Modal de Detalles */}
                {detailsModalOpen && selectedReservation && (
                    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={handleCloseDetails}>
                        <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-content rounded-4 border-0 shadow-lg">
                                <div className="modal-header border-0 pb-0" style={{ backgroundColor: '#F4EFEA' }}>
                                    <div>
                                        <h4 className="modal-title fw-bold mb-1" style={{ color: '#CD5C5C' }}>
                                            Detalles de la Reservación
                                        </h4>
                                        <p className="text-muted small mb-0">
                                            ID: #{selectedReservation.reserva?.id_reserva}
                                        </p>
                                    </div>
                                    <button type="button" className="btn-close" onClick={handleCloseDetails}></button>
                                </div>

                                <div className="modal-body p-4">
                                    {/* Estado */}
                                    <div className="mb-4 text-center">
                                        {getStatusBadge(selectedReservation.reserva?.estado)}
                                    </div>

                                    {/* Propiedad o Experiencia */}
                                    <div className="mb-4">
                                        <h6 className="fw-bold mb-3" style={{ color: '#CD5C5C' }}>
                                            {selectedReservation.reserva?.tipo_reserva === 'experiencia' ? (
                                                <><Sparkles size={18} className="me-2" />Experiencia</>
                                            ) : (
                                                <><Home size={18} className="me-2" />Propiedad</>
                                            )}
                                        </h6>
                                        <div className="d-flex gap-3 align-items-center p-3 rounded-3" style={{ backgroundColor: '#F8F9FA' }}>
                                            <img
                                                src={
                                                    selectedReservation.reserva?.tipo_reserva === 'experiencia'
                                                        ? selectedReservation.experiencia?.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500'
                                                        : selectedReservation.establecimiento?.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500'
                                                }
                                                alt={
                                                    selectedReservation.reserva?.tipo_reserva === 'experiencia'
                                                        ? selectedReservation.experiencia?.titulo
                                                        : selectedReservation.establecimiento?.nombre
                                                }
                                                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                                            />
                                            <div>
                                                <h6 className="fw-bold mb-1">
                                                    {selectedReservation.reserva?.tipo_reserva === 'experiencia'
                                                        ? selectedReservation.experiencia?.titulo
                                                        : selectedReservation.establecimiento?.nombre}
                                                </h6>
                                                {selectedReservation.reserva?.tipo_reserva === 'experiencia' ? (
                                                    <p className="text-muted mb-0 small">
                                                        <Calendar size={14} className="me-1" />
                                                        {formatearFecha(selectedReservation.experiencia?.fecha_experiencia)}
                                                    </p>
                                                ) : (
                                                    <p className="text-muted mb-0 small">
                                                        <MapPin size={14} className="me-1" />
                                                        {formatearDireccion(selectedReservation.establecimiento?.direccion)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Fechas */}
                                    <div className="mb-4">
                                        <h6 className="fw-bold mb-3" style={{ color: '#CD5C5C' }}>
                                            <Calendar size={18} className="me-2" />
                                            Fechas {selectedReservation.reserva?.tipo_reserva === 'experiencia' ? 'de la experiencia' : 'de estancia'}
                                        </h6>
                                        {selectedReservation.reserva?.tipo_reserva === 'experiencia' ? (
                                            <div className="p-3 rounded-3" style={{ backgroundColor: '#F8F9FA' }}>
                                                <small className="text-muted d-block mb-1">Fecha de la experiencia</small>
                                                <strong>{formatearFecha(selectedReservation.reserva?.fecha_inicio)}</strong>
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
                                                    {calcularNoches(selectedReservation.reserva?.fecha_inicio, selectedReservation.reserva?.fecha_fin)} noches
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Huésped */}
                                    <div className="mb-4">
                                        <h6 className="fw-bold mb-3" style={{ color: '#CD5C5C' }}>
                                            <User size={18} className="me-2" />
                                            Información del Huésped
                                        </h6>
                                        <div className="p-3 rounded-3" style={{ backgroundColor: '#F8F9FA' }}>
                                            <div className="mb-2">
                                                <strong>{selectedReservation.usuario?.nombre}</strong>
                                            </div>
                                            <div className="d-flex flex-column gap-2">
                                                <span className="text-muted small">
                                                    <Mail size={14} className="me-2" />
                                                    {selectedReservation.usuario?.email}
                                                </span>
                                                {selectedReservation.usuario?.telefono && (
                                                    <span className="text-muted small">
                                                        <Phone size={14} className="me-2" />
                                                        {selectedReservation.usuario.telefono}
                                                    </span>
                                                )}
                                                <span className="text-muted small">
                                                    <User size={14} className="me-2" />
                                                    {selectedReservation.reserva?.personas} persona(s)
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Precio */}
                                    <div className="mb-4">
                                        <h6 className="fw-bold mb-3" style={{ color: '#CD5C5C' }}>
                                            <DollarSign size={18} className="me-2" />
                                            Resumen de pago
                                        </h6>
                                        <div className="p-3 rounded-3" style={{ backgroundColor: '#F8F9FA' }}>
                                            {selectedReservation.reserva?.tipo_reserva === 'experiencia' ? (
                                                <>
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <span className="text-muted">Precio de la experiencia</span>
                                                        <span>${selectedReservation.experiencia?.precio?.toLocaleString('es-MX')}</span>
                                                    </div>
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <span className="text-muted">Personas</span>
                                                        <span>× {selectedReservation.reserva?.personas}</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="text-muted">
                                                        ${selectedReservation.establecimiento?.precio_por_noche?.toLocaleString('es-MX')} × {calcularNoches(selectedReservation.reserva?.fecha_inicio, selectedReservation.reserva?.fecha_fin)} noches
                                                    </span>
                                                    <span>
                                                        ${calcularPrecioTotal(selectedReservation).toLocaleString('es-MX')}
                                                    </span>
                                                </div>
                                            )}
                                            <hr />
                                            <div className="d-flex justify-content-between">
                                                <strong>Total</strong>
                                                <strong style={{ color: '#CD5C5C' }}>
                                                    ${calcularPrecioTotal(selectedReservation).toLocaleString('es-MX')}
                                                </strong>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Acciones */}
                                    {(selectedReservation.reserva?.estado === 'confirmada' || selectedReservation.reserva?.estado === 'pendiente') && (
                                        <div className="border-top pt-3">
                                            <h6 className="fw-bold mb-3 text-danger">Zona de peligro</h6>
                                            <button
                                                className="btn btn-danger w-100 rounded-pill"
                                                onClick={() => handleCancelReservation(selectedReservation.reserva?.id_reserva)}
                                            >
                                                <XCircle size={16} className="me-2" />
                                                Cancelar Reservación
                                            </button>
                                            <small className="text-muted d-block mt-2 text-center">
                                                Esta acción no se puede deshacer
                                            </small>
                                        </div>
                                    )}
                                </div>

                                <div className="modal-footer border-0" style={{ backgroundColor: '#F8F9FA' }}>
                                    <button
                                        className="btn btn-outline-secondary rounded-pill px-4"
                                        onClick={() => handleOpenChat(
                                            selectedReservation.reserva?.tipo_reserva === 'experiencia'
                                                ? selectedReservation.experiencia?.anfitrion
                                                : selectedReservation.anfitrion,
                                            selectedReservation.reserva?.tipo_reserva === 'experiencia'
                                                ? selectedReservation.experiencia
                                                : selectedReservation.establecimiento
                                        )}
                                    >
                                        <MessageCircle size={16} className="me-2" />
                                        Contactar Huésped
                                    </button>
                                    <button className="btn rounded-pill px-4" style={{ backgroundColor: '#CD5C5C', color: 'white' }} onClick={handleCloseDetails}>
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="row g-3 mb-4">
                    <div className="col-md-3 col-sm-6">
                        <div className="card border-0 shadow-sm rounded-3 p-3">
                            <div className="d-flex align-items-center">
                                <div className="p-2 rounded-circle me-3" style={{ backgroundColor: '#E0F2FE' }}>
                                    <Home size={20} style={{ color: '#0369A1' }} />
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
                                <div className="p-2 rounded-circle me-3" style={{ backgroundColor: '#D1FAE5' }}>
                                    <CheckCircle size={20} style={{ color: '#059669' }} />
                                </div>
                                <div>
                                    <small className="text-muted">Confirmadas</small>
                                    <h4 className="fw-bold mb-0">{stats.confirmadas}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6">
                        <div className="card border-0 shadow-sm rounded-3 p-3">
                            <div className="d-flex align-items-center">
                                <div className="p-2 rounded-circle me-3" style={{ backgroundColor: '#E5E7EB' }}>
                                    <Calendar size={20} style={{ color: '#6B7280' }} />
                                </div>
                                <div>
                                    <small className="text-muted">Completadas</small>
                                    <h4 className="fw-bold mb-0">{stats.completadas}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ul className="nav nav-pills mb-4">
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
                            className={`nav-link ${activeTab === 'confirmadas' ? 'active' : ''}`}
                            style={{
                                backgroundColor: activeTab === 'confirmadas' ? '#CD5C5C' : 'transparent',
                                color: activeTab === 'confirmadas' ? 'white' : '#6c757d',
                                border: 'none'
                            }}
                            onClick={() => setActiveTab('confirmadas')}
                        >
                            Confirmadas ({stats.confirmadas})
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
                </ul>

                {filteredReservations.length === 0 ? (
                    <div className="text-center py-5">
                        <Home size={64} color="#CD5C5C" className="mb-3" />
                        <h4 className="text-muted">No tienes reservaciones {activeTab}</h4>
                        <p className="text-muted">Las nuevas reservas aparecerán aquí</p>
                    </div>
                ) : (
                    <div className="row g-4">
                        {filteredReservations.map((data) => {
                            const precioTotal = calcularPrecioTotal(data);
                            const isExperiencia = data.reserva?.tipo_reserva === 'experiencia';

                            return (
                                <div key={data.reserva?.id_reserva} className="col-12">
                                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                                        <div className="row g-0">
                                            <div className="col-md-4">
                                                <img
                                                    src={
                                                        isExperiencia
                                                            ? data.experiencia?.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500'
                                                            : data.establecimiento?.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500'
                                                    }
                                                    alt={isExperiencia ? data.experiencia?.titulo : data.establecimiento?.nombre}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '250px' }}
                                                />
                                                {isExperiencia && (
                                                    <div className="position-absolute top-0 start-0 m-3">
                                                        <span className="badge" style={{ backgroundColor: '#8B5CF6', color: 'white' }}>
                                                            <Sparkles size={14} className="me-1" />
                                                            Experiencia
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-md-8">
                                                <div className="card-body p-4">
                                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                                        <div>
                                                            <h5 className="fw-bold mb-1" style={{ color: '#CD5C5C' }}>
                                                                {isExperiencia ? data.experiencia?.titulo : data.establecimiento?.nombre}
                                                            </h5>
                                                            <p className="text-muted mb-0 d-flex align-items-center gap-1">
                                                                {isExperiencia ? (
                                                                    <>
                                                                        <Calendar size={16} />
                                                                        {formatearFecha(data.experiencia?.fecha_experiencia)}
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <MapPin size={16} />
                                                                        {formatearDireccion(data.establecimiento?.direccion)}
                                                                    </>
                                                                )}
                                                            </p>
                                                        </div>
                                                        {getStatusBadge(data.reserva?.estado)}
                                                    </div>

                                                    <div className="row g-3 mb-3">
                                                        <div className="col-md-6">
                                                            <div className="d-flex align-items-center gap-2 p-3 rounded-3" style={{ backgroundColor: '#F4EFEA' }}>
                                                                <Calendar size={20} color="#CD5C5C" />
                                                                <div>
                                                                    <small className="text-muted d-block">
                                                                        {isExperiencia ? 'Fecha' : 'Check-in'}
                                                                    </small>
                                                                    <strong>{formatearFecha(data.reserva?.fecha_inicio)}</strong>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {!isExperiencia && (
                                                            <div className="col-md-6">
                                                                <div className="d-flex align-items-center gap-2 p-3 rounded-3" style={{ backgroundColor: '#F4EFEA' }}>
                                                                    <Calendar size={20} color="#CD5C5C" />
                                                                    <div>
                                                                        <small className="text-muted d-block">Check-out</small>
                                                                        <strong>{formatearFecha(data.reserva?.fecha_fin)}</strong>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="d-flex gap-4 mb-3">
                                                        {!isExperiencia && (
                                                            <span className="text-muted">
                                                                <Clock size={16} className="me-1" />
                                                                {calcularNoches(data.reserva?.fecha_inicio, data.reserva?.fecha_fin)} noches
                                                            </span>
                                                        )}
                                                        <span className="text-muted">
                                                            <User size={16} className="me-1" />
                                                            {data.reserva?.personas} {isExperiencia ? 'persona(s)' : 'huéspedes'}
                                                        </span>
                                                        <span className="fw-bold" style={{ color: '#CD5C5C' }}>
                                                            <DollarSign size={16} className="me-1" />
                                                            ${precioTotal.toLocaleString('es-MX')}
                                                        </span>
                                                    </div>

                                                    <div className="border-top pt-3 mb-3">
                                                        <small className="text-muted d-block mb-2">Huésped</small>
                                                        <div className="d-flex gap-3 flex-wrap">
                                                            <span className="text-muted small">
                                                                <User size={14} className="me-1" />
                                                                {data.usuario?.nombre}
                                                            </span>
                                                            <span className="text-muted small">
                                                                <Mail size={14} className="me-1" />
                                                                {data.usuario?.email}
                                                            </span>
                                                            {data.usuario?.telefono && (
                                                                <span className="text-muted small">
                                                                    <Phone size={14} className="me-1" />
                                                                    {data.usuario.telefono}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="d-flex gap-2 flex-wrap">
                                                        {data.reserva?.estado === 'pendiente' && (
                                                            <>
                                                                <button
                                                                    className="btn btn-success btn-sm rounded-pill"
                                                                    onClick={() => handleAcceptReservation(data.reserva.id_reserva)}
                                                                >
                                                                    <CheckCircle size={14} className="me-1" />
                                                                    Aceptar
                                                                </button>
                                                                <button
                                                                    className="btn btn-danger btn-sm rounded-pill"
                                                                    onClick={() => handleRejectReservation(data.reserva.id_reserva)}
                                                                >
                                                                    <XCircle size={14} className="me-1" />
                                                                    Rechazar
                                                                </button>
                                                            </>
                                                        )}
                                                        {data.reserva?.estado === 'confirmada' && (
                                                            <button
                                                                className="btn btn-outline-secondary btn-sm rounded-pill"
                                                                onClick={() => handleOpenChat(
                                                                    isExperiencia ? data.experiencia?.anfitrion : data.anfitrion,
                                                                    isExperiencia ? data.experiencia : data.establecimiento
                                                                )}
                                                            >
                                                                Contactar huésped
                                                            </button>
                                                        )}
                                                        <button
                                                            className="btn btn-outline-secondary btn-sm rounded-pill"
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
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}