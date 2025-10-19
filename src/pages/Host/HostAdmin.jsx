import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, User, DollarSign, Phone, Mail, MessageCircle, X, ChevronRight, Sparkles } from "lucide-react";
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
    const [selectedReservation, setSelectedReservation] = useState(null);
    const navigate = useNavigate();

    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        } catch { return null; }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        const decoded = token ? parseJwt(token) : null;
        const currentUserId = decoded?.id_usuario;

        console.log('Current User ID:', currentUserId); // 🔍 Verifica esto

        if (currentUserId) setUserId(currentUserId);

        fetch('http://localhost:3000/api/booking/getBookings', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(result => {
                console.log('All reservations:', result.data); // 🔍 Verifica esto

                if (result.success && result.data) {
                    const hostReservations = result.data.filter(r => {
                        const isHosteleria = r.establecimiento && r.anfitrion?.id_usuario === currentUserId;
                        const isExperiencia = r.experiencia && r.experiencia.anfitrion?.id_usuario === currentUserId;

                        console.log('Checking reservation:', {
                            id: r.reserva?.id_reserva,
                            tipo: r.reserva?.tipo_reserva,
                            isHosteleria,
                            isExperiencia,
                            anfitrionId: r.anfitrion?.id_usuario || r.experiencia?.anfitrion?.id_usuario,
                            shouldInclude: isHosteleria || isExperiencia
                        });

                        return isHosteleria || isExperiencia;
                    });

                    console.log('Filtered host reservations:', hostReservations); // 🔍 Verifica esto
                    setReservations(hostReservations);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []); useEffect(() => {
        const token = localStorage.getItem("token");
        const decoded = token ? parseJwt(token) : null;
        const currentUserId = decoded?.id_usuario;

        console.log('Current User ID:', currentUserId); // 🔍 Verifica esto

        if (currentUserId) setUserId(currentUserId);

        fetch('http://localhost:3000/api/booking/getBookings', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(result => {
                console.log('All reservations:', result.data); // 🔍 Verifica esto

                if (result.success && result.data) {
                    const hostReservations = result.data.filter(r => {
                        const isHosteleria = r.establecimiento && r.anfitrion?.id_usuario === currentUserId;
                        const isExperiencia = r.experiencia && r.experiencia.anfitrion?.id_usuario === currentUserId;

                        console.log('Checking reservation:', {
                            id: r.reserva?.id_reserva,
                            tipo: r.reserva?.tipo_reserva,
                            isHosteleria,
                            isExperiencia,
                            anfitrionId: r.anfitrion?.id_usuario || r.experiencia?.anfitrion?.id_usuario,
                            shouldInclude: isHosteleria || isExperiencia
                        });

                        return isHosteleria || isExperiencia;
                    });

                    console.log('Filtered host reservations:', hostReservations); // 🔍 Verifica esto
                    setReservations(hostReservations);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const tabs = [
        { key: 'todas', label: 'Todas', estado: null },
        { key: 'pendientes', label: 'Pendientes', estado: 'pendiente' },
        { key: 'confirmadas', label: 'Confirmadas', estado: 'confirmada' },
        { key: 'completadas', label: 'Completadas', estado: 'completada' }
    ];

    const getFiltered = () => {
        if (activeTab === 'todas') return reservations;
        const tab = tabs.find(t => t.key === activeTab);
        return reservations.filter(r => r.reserva?.estado === tab.estado);
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

    const calcNights = (start, end) => end ? Math.ceil((new Date(end) - new Date(start)) / 86400000) : 1;

    const calcTotal = (data) => {
        const isExp = data.experiencia !== null;
        return isExp ? data.experiencia?.precio || 0 :
            (data.establecimiento?.precio_por_noche || 0) * calcNights(data.reserva?.fecha_inicio, data.reserva?.fecha_fin);
    };

    const formatDate = (date) => new Date(date).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="spinner-border text-dark" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    const filtered = getFiltered();
    const stats = tabs.reduce((acc, tab) => ({
        ...acc,
        [tab.key]: tab.estado === null ? reservations.length : reservations.filter(r => r.reserva?.estado === tab.estado).length
    }), {});


    const handleOpenChat = (data) => {
    const isExp = data.experiencia !== null;
    const anfitrion = isExp ? data.experiencia?.anfitrion : data.anfitrion;
    const property = isExp ? data.experiencia : data.establecimiento;
    
    const establecimientoData = {
        ...property,
        establecimientoId: isExp ? property?.id_experiencia : property?.id_hosteleria,
        tipo: isExp ? 'experiencia' : 'hosteleria'
    };
    
    setSelectedAnfitrion(anfitrion);
    setSelectedEstablecimiento(establecimientoData);
    setChatOpen(true);
};

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingTop: '7rem', paddingBottom: '3rem' }}>
            <div className="container">
                {/* Header */}
                <div className="mb-5">
                    <h1 className="display-5 fw-light mb-2">Reservas recibidas</h1>
                    <p className="text-muted">Gestiona las reservaciones de tus propiedades y experiencias</p>
                </div>



                {/* Tabs */}
                <ul className="nav nav-pills mb-4 gap-2">
                    {tabs.map(tab => (
                        <li key={tab.key} className="nav-item">
                            <button
                                className={`nav-link ${activeTab === tab.key ? 'active' : ''}`}
                                style={{
                                    backgroundColor: activeTab === tab.key ? '#212529' : 'white',
                                    color: activeTab === tab.key ? 'white' : '#6c757d',
                                    border: activeTab === tab.key ? 'none' : '1px solid #dee2e6',
                                    borderRadius: '50rem',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    transition: 'all 0.3s ease'
                                }}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.label} <span className="ms-1">({stats[tab.key]})</span>
                            </button>
                        </li>
                    ))}
                </ul>

                {/* Reservations List */}
                {filtered.length === 0 ? (
                    <div className="card border-0 shadow-sm text-center py-5">
                        <div className="card-body">
                            <div className="mb-3">
                                <Calendar size={48} color="#6c757d" />
                            </div>
                            <h5 className="fw-light mb-2">Sin reservaciones</h5>
                            <p className="text-muted mb-0">Las nuevas reservas aparecerán aquí</p>
                        </div>
                    </div>
                ) : (
                    <div className="row g-3">
                        {filtered.map(data => {
                            const isExp = data.experiencia !== null;
                            const property = isExp ? data.experiencia : data.establecimiento;
                            const total = calcTotal(data);

                            return (
                                <div key={data.reserva?.id_reserva} className="col-12">
                                    <div className="card border-0 shadow-sm overflow-hidden" style={{ transition: 'all 0.3s ease' }}>
                                        <div className="row g-0">
                                            {/* Image */}
                                            <div className="col-md-4 position-relative" style={{ minHeight: '250px' }}>
                                                <img
                                                    src={property?.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500'}
                                                    alt={property?.nombre || property?.titulo}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                                {isExp && (
                                                    <span className="position-absolute top-0 start-0 m-3 badge bg-purple text-white" style={{ backgroundColor: '#8b5cf6' }}>
                                                        <Sparkles size={12} className="me-1" />
                                                        Experiencia
                                                    </span>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="col-md-8">
                                                <div className="card-body p-4">
                                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                                        <div>
                                                            <h5 className="card-title mb-1">{property?.nombre || property?.titulo}</h5>
                                                            <p className="text-muted small mb-0">
                                                                {isExp ? (
                                                                    <><Calendar size={14} className="me-1" />{formatDate(data.experiencia?.fecha_experiencia)}</>
                                                                ) : (
                                                                    <><MapPin size={14} className="me-1" />{property?.direccion?.ciudad}, {property?.direccion?.estado}</>
                                                                )}
                                                            </p>
                                                        </div>
                                                        {getStatusBadge(data.reserva?.estado)}
                                                    </div>

                                                    {/* Guest Info */}
                                                    <div className="bg-light rounded p-3 mb-3">
                                                        <div className="d-flex align-items-center gap-2 mb-2">
                                                            <div className="bg-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                                <User size={18} className="text-muted" />
                                                            </div>
                                                            <div>
                                                                <div className="fw-semibold">{data.usuario?.nombre}</div>
                                                                <small className="text-muted">{data.usuario?.email}</small>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex flex-wrap gap-3 small text-muted">
                                                            <span>
                                                                <Calendar size={14} className="me-1" />
                                                                {formatDate(data.reserva?.fecha_inicio)}
                                                                {!isExp && ` - ${formatDate(data.reserva?.fecha_fin)}`}
                                                            </span>
                                                            {!isExp && (
                                                                <span>
                                                                    <Clock size={14} className="me-1" />
                                                                    {calcNights(data.reserva?.fecha_inicio, data.reserva?.fecha_fin)} noches
                                                                </span>
                                                            )}
                                                            <span>
                                                                <User size={14} className="me-1" />
                                                                {data.reserva?.personas} persona{data.reserva?.personas > 1 ? 's' : ''}
                                                            </span>
                                                            <span className="fw-bold text-dark">
                                                                <DollarSign size={14} className="me-1" />
                                                                ${total.toLocaleString('es-MX')}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="d-flex gap-2">
                                                        <button
                                                            onClick={() => setSelectedReservation(data)}
                                                            className="btn btn-dark btn-sm rounded-pill flex-fill"
                                                        >
                                                            Ver detalles <ChevronRight size={14} className="ms-1" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                handleOpenChat(data);
                                                            }}
                                                            className="btn btn-outline-secondary btn-sm rounded-pill"
                                                        >
                                                            <MessageCircle size={14} />
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

            {/* Details Modal */}
            {selectedReservation && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setSelectedReservation(null)}>
                    <div className="modal-dialog modal-dialog-centered modal-lg" onClick={e => e.stopPropagation()}>
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header border-0">
                                <div>
                                    <h5 className="modal-title fw-light mb-1">Detalles de reserva</h5>
                                    <small className="text-muted">ID: #{selectedReservation.reserva?.id_reserva}</small>
                                </div>
                                <button type="button" className="btn-close" onClick={() => setSelectedReservation(null)}></button>
                            </div>

                            <div className="modal-body">
                                {/* Property */}
                                <div className="mb-4">
                                    <div className="d-flex gap-3 align-items-center bg-light rounded p-3">
                                        <img
                                            src={(selectedReservation.experiencia || selectedReservation.establecimiento)?.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500'}
                                            alt="Property"
                                            className="rounded"
                                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                        />
                                        <div>
                                            <h6 className="mb-1">
                                                {(selectedReservation.experiencia || selectedReservation.establecimiento)?.nombre ||
                                                    (selectedReservation.experiencia || selectedReservation.establecimiento)?.titulo}
                                            </h6>
                                            <small className="text-muted">
                                                {selectedReservation.experiencia ? (
                                                    <><Sparkles size={12} className="me-1" />Experiencia</>
                                                ) : (
                                                    <><MapPin size={12} className="me-1" />Propiedad</>
                                                )}
                                            </small>
                                        </div>
                                    </div>
                                </div>

                                {/* Guest */}
                                <div className="mb-4">
                                    <h6 className="fw-semibold mb-3 small text-uppercase text-muted">Huésped</h6>
                                    <div className="bg-light rounded p-3">
                                        <div className="fw-semibold mb-2">{selectedReservation.usuario?.nombre}</div>
                                        <div className="small text-muted d-flex flex-column gap-1">
                                            <span><Mail size={14} className="me-2" />{selectedReservation.usuario?.email}</span>
                                            {selectedReservation.usuario?.telefono && (
                                                <span><Phone size={14} className="me-2" />{selectedReservation.usuario?.telefono}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Dates */}
                                <div className="mb-4">
                                    <h6 className="fw-semibold mb-3 small text-uppercase text-muted">Fechas</h6>
                                    <div className="row g-2">
                                        <div className="col-6">
                                            <div className="bg-light rounded p-3">
                                                <small className="text-muted d-block mb-1">Check-in</small>
                                                <strong>{formatDate(selectedReservation.reserva?.fecha_inicio)}</strong>
                                            </div>
                                        </div>
                                        {selectedReservation.reserva?.fecha_fin && (
                                            <div className="col-6">
                                                <div className="bg-light rounded p-3">
                                                    <small className="text-muted d-block mb-1">Check-out</small>
                                                    <strong>{formatDate(selectedReservation.reserva?.fecha_fin)}</strong>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Payment */}
                                <div className="mb-4">
                                    <h6 className="fw-semibold mb-3 small text-uppercase text-muted">Resumen de pago</h6>
                                    <div className="bg-light rounded p-3">
                                        <div className="d-flex justify-content-between text-muted mb-2 small">
                                            <span>Subtotal</span>
                                            <span>${calcTotal(selectedReservation).toLocaleString('es-MX')}</span>
                                        </div>
                                        <hr className="my-2" />
                                        <div className="d-flex justify-content-between fw-bold">
                                            <span>Total</span>
                                            <span>${calcTotal(selectedReservation).toLocaleString('es-MX')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer border-0 bg-light">
                                <button
                                    onClick={() => setSelectedReservation(null)}
                                    className="btn btn-dark rounded-pill px-4"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ChatModal
                isOpen={chatOpen}
                onClose={() => setChatOpen(false)}
                anfitrion={selectedAnfitrion}
                establecimiento={selectedEstablecimiento}
            />
        </div>
    );
}