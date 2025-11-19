import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, User, DollarSign, Home, Phone, Mail } from "lucide-react";
import ChatModal from "../components/Chat";

import { GATEWAY_URL } from "../const/Const";

export default function ReservationUser() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('activas');
    const [userId, setUserId] = useState(null);

    const [chatOpen, setChatOpen] = useState(false);
    const [selectedAnfitrion, setSelectedAnfitrion] = useState(null);
    const [selectedEstablecimiento, setSelectedEstablecimiento] = useState(null);

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
                const response = await fetch(`${GATEWAY_URL}/api/booking/getBooking`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                const result = await response.json();

                console.log("=== DATOS DE RESERVACIONES ===");
                console.log(result.data);

                if (result.success && result.data) {
                    // Filtrar solo las reservaciones del usuario logueado
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

    const filterReservations = () => {
        if (activeTab === 'activas') {
            return reservations.filter(r => r.reserva?.estado === 'confirmada' || r.reserva?.estado === 'pendiente');
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
        const start = new Date(inicio);
        const end = new Date(fin);
        const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const calcularPrecioTotal = (precioNoche, inicio, fin) => {
        const noches = calcularNoches(inicio, fin);
        return precioNoche * noches;
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
        console.log("=== ABRIENDO CHAT ===");
        console.log("Anfitrión recibido:", anfitrion);
        console.log("Establecimiento recibido:", establecimiento);
        console.log("ID Anfitrión:", anfitrion?.id_usuario);
        console.log("ID Establecimiento:", establecimiento?.id_establecimiento);
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

    return (
        <div style={{ backgroundColor: '#fff', minHeight: '100vh', paddingTop: '7rem', paddingBottom: '3rem' }}>
            <div className="container">
                <div className="mb-4">
                    <h1 className="fw-bold mb-2" style={{ color: '#CD5C5C' }}>Mis Reservaciones</h1> 
                    <p className="text-muted">Gestiona tus próximos viajes y consulta tu historial</p>
                </div>

                <ChatModal
                    isOpen={chatOpen}
                    onClose={handleCloseChat}
                    anfitrion={selectedAnfitrion}
                    establecimiento={selectedEstablecimiento}
                />

                <ul className="nav nav-pills mb-4">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'activas' ? 'active' : ''}`}
                            style={{
                                backgroundColor: activeTab === 'activas' ? '#CD5C5C' : 'transparent',
                                color: activeTab === 'activas' ? 'white' : '#6c757d',
                                border: 'none'
                            }}
                            onClick={() => setActiveTab('activas')}
                        >
                            Activas ({reservations.filter(r => r.reserva?.estado === 'confirmada' || r.reserva?.estado === 'pendiente').length})
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
                            Completadas ({reservations.filter(r => r.reserva?.estado === 'completada').length})
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'canceladas' ? 'active' : ''}`}
                            style={{
                                backgroundColor: activeTab === 'canceladas' ? '#CD5C5C' : 'transparent',
                                color: activeTab === 'canceladas' ? 'white' : '#6c757d',
                                border: 'none'
                            }}
                            onClick={() => setActiveTab('canceladas')}
                        >
                            Canceladas ({reservations.filter(r => r.reserva?.estado === 'cancelada').length})
                        </button>
                    </li>
                </ul>

                {filteredReservations.length === 0 ? (
                    <div className="text-center py-5">
                        <Home size={64} color="#CD5C5C" className="mb-3" />
                        <h4 className="text-muted">No tienes reservaciones {activeTab}</h4>
                        <p className="text-muted">Explora lugares increíbles para tu próximo viaje</p>
                        <button className="btn btn-lg mt-3 text-white" style={{ backgroundColor: '#CD5C5C' }}>
                            Explorar alojamientos
                        </button>
                    </div>
                ) : (
                    <div className="row g-4">
                        {filteredReservations.map((data) => {
                            const precioTotal = calcularPrecioTotal(
                                data.establecimiento?.precio_por_noche || 0,
                                data.reserva?.fecha_inicio,
                                data.reserva?.fecha_fin
                            );

                            return (
                                <div key={data.reserva?.id_reserva} className="col-12">
                                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                                        <div className="row g-0">
                                            <div className="col-md-4">
                                                <img
                                                    src={data.establecimiento?.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500'}
                                                    alt={data.establecimiento?.nombre}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '250px' }}
                                                />
                                            </div>

                                            <div className="col-md-8">
                                                <div className="card-body p-4">
                                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                                        <div>
                                                            <h5 className="fw-bold mb-1" style={{ color: '#CD5C5C' }}>
                                                                {data.establecimiento?.nombre}
                                                            </h5>
                                                            <p className="text-muted mb-0 d-flex align-items-center gap-1">
                                                                <MapPin size={16} />
                                                                {formatearDireccion(data.establecimiento?.direccion)}
                                                            </p>
                                                        </div>
                                                        {getStatusBadge(data.reserva?.estado)}
                                                    </div>

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

                                                    <div className="d-flex gap-4 mb-3">
                                                        <span className="text-muted">
                                                            <Clock size={16} className="me-1" />
                                                            {calcularNoches(data.reserva?.fecha_inicio, data.reserva?.fecha_fin)} noches
                                                        </span>
                                                        <span className="text-muted">
                                                            <User size={16} className="me-1" />
                                                            {data.reserva?.personas} huéspedes
                                                        </span>
                                                        <span className="fw-bold" style={{ color: '#CD5C5C' }}>
                                                            <DollarSign size={16} className="me-1" />
                                                            ${precioTotal.toLocaleString('es-MX')}
                                                        </span>
                                                    </div>

                                                    {data.anfitrion && (
                                                        <div className="border-top pt-3 mb-3">
                                                            <small className="text-muted d-block mb-2">Anfitrión</small>
                                                            <div className="d-flex gap-3 flex-wrap">
                                                                <span className="text-muted small">
                                                                    <User size={14} className="me-1" />
                                                                    {data.anfitrion.nombre}
                                                                </span>
                                                                {data.anfitrion.telefono && (
                                                                    <span className="text-muted small">
                                                                        <Phone size={14} className="me-1" />
                                                                        {data.anfitrion.telefono}
                                                                    </span>
                                                                )}
                                                                <span className="text-muted small">
                                                                    <Mail size={14} className="me-1" />
                                                                    {data.anfitrion.email}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="d-flex gap-2 flex-wrap">
                                                        {data.reserva?.estado === 'confirmada' && (
                                                            <>
                                                                {/* <button className="btn btn-outline-secondary btn-sm rounded-pill">Ver detalles</button> */}
                                                                <button
                                                                    className="btn btn-outline-secondary btn-sm rounded-pill"
                                                                    onClick={() => handleOpenChat(data.anfitrion, data.establecimiento)}
                                                                >
                                                                    Contactar anfitrion
                                                                </button>                                                                <button className="btn btn-outline-danger btn-sm rounded-pill">Cancelar reserva</button>
                                                            </>
                                                        )}
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