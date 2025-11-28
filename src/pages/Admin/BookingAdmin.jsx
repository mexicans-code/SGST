import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { GATEWAY_URL } from '../../const/Const';

export default function BookingAdmin() {
    const [bookings, setBookings] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEstado, setFilterEstado] = useState('todas');
    const [formData, setFormData] = useState({
        id_usuario: '',
        id_hosteleria: '',
        fecha_inicio: '',
        fecha_fin: '',
        personas: '',
        precio_total: '',
        estado: 'pendiente'
    });

    // Detectar móvil
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        cargarReservas();
    }, []);

    const cargarReservas = async () => {
        try {
            const response = await fetch(`${GATEWAY_URL}/api/booking/getBookings`);
            const data = await response.json();
            
            if (data.success) {
                setBookings(data.data);
            }
        } catch (error) {
            console.error('Error al cargar reservas:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al cargar las reservas',
                text: 'Por favor, intenta de nuevo más tarde.',
            });
        }
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = 
            booking.usuario?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            getNombreEstablecimiento(booking).toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.reserva.id_reserva.toString().includes(searchTerm);
        
        const matchesEstado = filterEstado === 'todas' || booking.reserva?.estado === filterEstado;
        
        return matchesSearch && matchesEstado;
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const openModal = (booking = null) => {
        if (booking) {
            setEditingBooking(booking);
            setFormData({
                fecha_inicio: booking.reserva.fecha_inicio,
                fecha_fin: booking.reserva.fecha_fin,
                personas: booking.reserva.personas,
                estado: booking.reserva.estado
            });
        } else {
            setEditingBooking(null);
            setFormData({
                id_usuario: '',
                id_hosteleria: '',
                fecha_inicio: '',
                fecha_fin: '',
                personas: '',
                precio_total: '',
                estado: 'pendiente'
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingBooking(null);
    };

    const handleSubmit = async () => {
        try {
            if (editingBooking) {
                const updateData = {
                    fecha_inicio: formData.fecha_inicio,
                    fecha_fin: formData.fecha_fin,
                    personas: parseInt(formData.personas),
                    estado: formData.estado
                };
                
                const response = await fetch(
                    `${GATEWAY_URL}/api/booking/updateBooking/${editingBooking.reserva.id_reserva}`,
                    {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updateData)
                    }
                );
                
                const data = await response.json();
                
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Reserva actualizada',
                        text: 'La reserva ha sido actualizada correctamente.',
                        timer: 2000
                    });
                    cargarReservas();
                    closeModal();
                } else {
                    throw new Error(data.error);
                }
            } else {
                const createData = {
                    id_usuario: parseInt(formData.id_usuario),
                    id_hosteleria: parseInt(formData.id_hosteleria),
                    fecha_inicio: formData.fecha_inicio,
                    fecha_fin: formData.fecha_fin,
                    personas: parseInt(formData.personas),
                    precio_total: parseFloat(formData.precio_total),
                    estado: formData.estado
                };
                
                const response = await fetch(
                    `${GATEWAY_URL}/api/booking/createBooking`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(createData)
                    }
                );
                
                const data = await response.json();
                
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Reserva creada',
                        text: 'La reserva ha sido creada correctamente.',
                        timer: 2000
                    });
                    cargarReservas();
                    closeModal();
                } else {
                    throw new Error(data.error);
                }
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Ocurrió un error al procesar la reserva.',
            });
        }
    };

    const handleCancel = async (id, estado) => {
        if (estado === 'cancelada') {
            Swal.fire({
                icon: 'warning',
                title: 'Reserva ya cancelada',
                text: 'Esta reserva ya ha sido cancelada.',
            });
            return;
        }

        const result = await Swal.fire({
            title: '¿Cancelar reserva?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(
                    `${GATEWAY_URL}/api/booking/cancelBooking/${id}`,
                    { method: 'PUT' }
                );
                
                const data = await response.json();
                
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Reserva cancelada',
                        text: 'La reserva ha sido cancelada correctamente.',
                        timer: 2000
                    });
                    cargarReservas();
                } else {
                    throw new Error(data.message || data.error);
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'No se pudo cancelar la reserva.',
                });
            }
        }
    };

    const handleDelete = async (id, estado) => {
        if (estado === 'confirmada' || estado === 'completada') {
            Swal.fire({
                icon: 'error',
                title: 'No se puede eliminar',
                text: 'No se pueden eliminar reservas confirmadas o completadas. Considere cancelarla primero.',
            });
            return;
        }

        const result = await Swal.fire({
            title: '¿Eliminar reserva?',
            text: "Esta acción es permanente y no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(
                    `${GATEWAY_URL}/api/booking/deleteBooking/${id}`,
                    { method: 'DELETE' }
                );
                
                const data = await response.json();
                
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Reserva eliminada',
                        text: 'La reserva ha sido eliminada correctamente.',
                        timer: 2000
                    });
                    cargarReservas();
                } else {
                    throw new Error(data.error);
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'No se pudo eliminar la reserva.',
                });
            }
        }
    };

    const getNombreEstablecimiento = (booking) => {
        if (booking.reserva.tipo_reserva === 'experiencia') {
            return booking.experiencia?.titulo || 'Experiencia N/A';
        } else {
            return booking.establecimiento?.nombre || 'Hotel N/A';
        }
    };

    const getUbicacion = (booking) => {
        if (booking.reserva.tipo_reserva === 'experiencia') {
            return 'Experiencia turística';
        } else {
            const dir = booking.establecimiento?.direccion;
            return dir ? `${dir.ciudad}, ${dir.estado}` : 'N/A';
        }
    };

    const formatFecha = (fecha) => {
        if (!fecha) return 'N/A';
        const date = new Date(fecha);
        return date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <>
            <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css" rel="stylesheet" />

            <style>{`
                body { 
                    min-height: 100vh;
                }
                .main-container {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                    border-radius: 20px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                }
                .stats-card {
                    background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
                    border: none;
                    border-radius: 16px;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                }
                .stats-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                }
                .user-table {
                    background: white;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                }
                .table th {
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    border: none;
                    font-weight: 600;
                    padding: 0.75rem;
                    font-size: 0.85rem;
                }
                .table td {
                    border: none;
                    padding: 0.75rem;
                    vertical-align: middle;
                    border-bottom: 1px solid #f8f9fa;
                    font-size: 0.85rem;
                }
                .table tbody tr:hover {
                    background: rgba(102, 126, 234, 0.05);
                }
                .btn-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    border-radius: 12px;
                    padding: 12px 24px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }
                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
                }
                .search-input {
                    border: 2px solid #e9ecef;
                    border-radius: 12px;
                    padding: 12px 20px;
                    transition: all 0.3s ease;
                }
                .search-input:focus {
                    border-color: #667eea;
                    box-shadow: 0 0 20px rgba(102, 126, 234, 0.2);
                }
                .modal-content {
                    border: none;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                }
                .form-control, .form-select {
                    border: 2px solid #e9ecef;
                    border-radius: 12px;
                    padding: 12px 16px;
                    transition: all 0.3s ease;
                }
                .form-control:focus, .form-select:focus {
                    border-color: #667eea;
                    box-shadow: 0 0 15px rgba(102, 126, 234, 0.15);
                }
                .form-control:disabled {
                    background-color: #f8f9fa;
                    cursor: not-allowed;
                }
                
                /* Booking Card for Mobile */
                .booking-card {
                    background: white;
                    border-radius: 12px;
                    padding: 1rem;
                    margin-bottom: 1rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                    transition: all 0.3s ease;
                    border-left: 4px solid #667eea;
                }
                .booking-card:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
                    transform: translateY(-2px);
                }
                .booking-card.confirmada {
                    border-left-color: #28a745;
                }
                .booking-card.pendiente {
                    border-left-color: #ffc107;
                }
                .booking-card.cancelada {
                    border-left-color: #dc3545;
                }
                .booking-card.completada {
                    border-left-color: #17a2b8;
                }
                .bg-purple {
                    background-color: #8B4789 !important;
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    .main-container {
                        border-radius: 12px;
                        padding: 1rem !important;
                    }
                    .stats-card {
                        margin-bottom: 0.75rem;
                    }
                    .stats-card .card-body {
                        padding: 1rem;
                    }
                    .stats-card h3 {
                        font-size: 1.5rem;
                    }
                    .btn-primary {
                        padding: 10px 16px;
                        font-size: 0.9rem;
                    }
                    .search-input {
                        padding: 10px 16px;
                        font-size: 0.9rem;
                    }
                }
                
                @media (max-width: 576px) {
                    .stats-card h3 {
                        font-size: 1.25rem;
                    }
                    .stats-card p {
                        font-size: 0.85rem;
                    }
                }
            `}</style>

            <div className="container-fluid p-2 p-md-4">
                <div className="main-container p-3 p-md-4">
                    {/* Header */}
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 mb-md-4 gap-2">
                        <div>
                            <h1 className="fw-bold text-dark mb-1" style={{ fontSize: isMobile ? '1.5rem' : '2rem' }}>
                                <i className="bi bi-calendar-check-fill text-primary me-2"></i>
                                {isMobile ? 'Reservas' : 'Gestión de Reservas'}
                            </h1>
                            <p className="text-muted mb-0 small">
                                {isMobile ? 'Administra reservas' : 'Administra las reservas de hospedaje'}
                            </p>
                        </div>
                        <button onClick={() => openModal()} className="btn btn-primary w-100 w-md-auto">
                            <i className="bi bi-plus-lg me-2"></i>
                            {isMobile ? 'Crear' : 'Crear Reserva'}
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="row g-2 g-md-4 mb-3 mb-md-4">
                        {[
                            { value: bookings.length, label: 'Total', fullLabel: 'Total Reservas', color: 'text-primary' },
                            { value: bookings.filter(b => b.reserva?.estado === 'confirmada').length, label: 'Confirmadas', fullLabel: 'Confirmadas', color: 'text-success' },
                            { value: bookings.filter(b => b.reserva?.estado === 'pendiente').length, label: 'Pendientes', fullLabel: 'Pendientes', color: 'text-warning' },
                            { value: bookings.filter(b => b.reserva?.estado === 'cancelada').length, label: 'Canceladas', fullLabel: 'Canceladas', color: 'text-danger' }
                        ].map((stat, idx) => (
                            <div className="col-6 col-md-3" key={idx}>
                                <div className="stats-card card text-center h-100">
                                    <div className="card-body">
                                        <h3 className={`fw-bold ${stat.color}`}>{stat.value}</h3>
                                        <p className="text-muted mb-0 small">
                                            <span className="d-none d-md-inline">{stat.fullLabel}</span>
                                            <span className="d-inline d-md-none">{stat.label}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Search and Filters */}
                    <div className="row g-2 mb-3 mb-md-4">
                        <div className="col-12 col-md-8">
                            <div className="position-relative">
                                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                                <input
                                    type="text"
                                    className="form-control search-input ps-5"
                                    placeholder={isMobile ? "Buscar..." : "Buscar por ID, usuario o establecimiento..."}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <select
                                className="form-select search-input"
                                value={filterEstado}
                                onChange={(e) => setFilterEstado(e.target.value)}
                            >
                                <option value="todas">Todos los estados</option>
                                <option value="confirmada">Confirmadas</option>
                                <option value="pendiente">Pendientes</option>
                                <option value="cancelada">Canceladas</option>
                                <option value="completada">Completadas</option>
                            </select>
                        </div>
                    </div>

                    {/* Desktop Table View */}
                    <div className="user-table d-none d-lg-block">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Usuario</th>
                                        <th>Establecimiento</th>
                                        <th>Tipo</th>
                                        <th>Fechas</th>
                                        <th>Personas</th>
                                        <th>Estado</th>
                                        <th className="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBookings.map((booking) => (
                                        <tr key={booking.reserva.id_reserva}>
                                            <td>
                                                <span className="badge bg-secondary rounded-pill px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                                    #{booking.reserva.id_reserva}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <i className="bi bi-person-fill text-primary me-2" style={{ fontSize: '1rem' }}></i>
                                                    <div>
                                                        <div className="fw-semibold">{booking.usuario?.nombre || 'N/A'}</div>
                                                        <small className="text-muted">{booking.usuario?.email || ''}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <i className={`bi ${booking.reserva.tipo_reserva === 'experiencia' ? 'bi-compass-fill' : 'bi-building-fill'} text-info me-2`}></i>
                                                    <div>
                                                        <div className="fw-semibold">{getNombreEstablecimiento(booking)}</div>
                                                        <small className="text-muted">{getUbicacion(booking)}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge ${booking.reserva.tipo_reserva === 'experiencia' ? 'bg-purple' : 'bg-info'} rounded-pill px-2 py-1`} style={{ fontSize: '0.75rem' }}>
                                                    {booking.reserva.tipo_reserva === 'experiencia' ? 'Experiencia' : 'Hospedaje'}
                                                </span>
                                            </td>
                                            <td>
                                                <small className="text-muted">
                                                    <div>{formatFecha(booking.reserva.fecha_inicio)}</div>
                                                    {booking.reserva.fecha_fin && (
                                                        <div>→ {formatFecha(booking.reserva.fecha_fin)}</div>
                                                    )}
                                                </small>
                                            </td>
                                            <td>
                                                <span className="badge bg-dark rounded-pill px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                                    <i className="bi bi-people-fill me-1"></i>
                                                    {booking.reserva.personas}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge ${
                                                    booking.reserva.estado === 'confirmada' ? 'bg-success' :
                                                    booking.reserva.estado === 'pendiente' ? 'bg-warning' :
                                                    booking.reserva.estado === 'completada' ? 'bg-info' :
                                                    'bg-danger'
                                                } rounded-pill px-2 py-1`} style={{ fontSize: '0.75rem' }}>
                                                    {booking.reserva.estado}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="d-flex gap-1 justify-content-center">
                                                    <button
                                                        onClick={() => openModal(booking)}
                                                        className="btn btn-outline-primary btn-sm"
                                                        title="Editar"
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancel(booking.reserva.id_reserva, booking.reserva.estado)}
                                                        className="btn btn-outline-warning btn-sm"
                                                        title="Cancelar"
                                                        disabled={booking.reserva.estado === 'cancelada'}
                                                    >
                                                        <i className="bi bi-x-circle"></i>
                                                    </button>
                                                    {/* <button
                                                        onClick={() => handleDelete(booking.reserva.id_reserva, booking.reserva.estado)}
                                                        className="btn btn-outline-danger btn-sm"
                                                        title="Eliminar"
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button> */}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredBookings.length === 0 && (
                                        <tr>
                                            <td colSpan="8" className="text-center py-5">
                                                <i className="bi bi-inbox display-4 text-muted mb-3 d-block"></i>
                                                <h6 className="text-muted">No se encontraron reservas</h6>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="d-lg-none">
                        {filteredBookings.map((booking) => (
                            <div key={booking.reserva.id_reserva} className={`booking-card ${booking.reserva.estado}`}>
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <div>
                                        <span className="badge bg-secondary mb-1">#{booking.reserva.id_reserva}</span>
                                        <h6 className="fw-bold mb-1">{getNombreEstablecimiento(booking)}</h6>
                                        <p className="text-muted small mb-0">
                                            <i className="bi bi-person me-1"></i>
                                            {booking.usuario?.nombre || 'N/A'}
                                        </p>
                                    </div>
                                    <span className={`badge ${
                                        booking.reserva.estado === 'confirmada' ? 'bg-success' :
                                        booking.reserva.estado === 'pendiente' ? 'bg-warning' :
                                        booking.reserva.estado === 'completada' ? 'bg-info' :
                                        'bg-danger'
                                    }`}>
                                        {booking.reserva.estado}
                                    </span>
                                </div>

                                <div className="row g-2 mb-3">
                                    <div className="col-6">
                                        <small className="text-muted d-block">Fecha inicio</small>
                                        <span className="fw-semibold small">{formatFecha(booking.reserva.fecha_inicio)}</span>
                                    </div>
                                    <div className="col-6">
                                        <small className="text-muted d-block">Fecha fin</small>
                                        <span className="fw-semibold small">{formatFecha(booking.reserva.fecha_fin)}</span>
                                    </div>
                                    <div className="col-6">
                                        <small className="text-muted d-block">Personas</small>
                                        <span className="fw-semibold small">
                                            <i className="bi bi-people-fill me-1"></i>
                                            {booking.reserva.personas}
                                        </span>
                                    </div>
                                    <div className="col-6">
                                        <small className="text-muted d-block">Tipo</small>
                                        <span className={`badge ${booking.reserva.tipo_reserva === 'experiencia' ? 'bg-purple' : 'bg-info'}`}>
                                            {booking.reserva.tipo_reserva === 'experiencia' ? 'Experiencia' : 'Hospedaje'}
                                        </span>
                                    </div>
                                </div>

                                <div className="d-flex gap-2">
                                    <button
                                        onClick={() => openModal(booking)}
                                        className="btn btn-outline-primary btn-sm flex-grow-1"
                                    >
                                        <i className="bi bi-pencil me-1"></i>Editar
                                    </button>
                                    <button
                                        onClick={() => handleCancel(booking.reserva.id_reserva, booking.reserva.estado)}
                                        className="btn btn-outline-warning btn-sm"
                                        style={{ minWidth: '44px' }}
                                        disabled={booking.reserva.estado === 'cancelada'}
                                    >
                                        <i className="bi bi-x-circle"></i>
                                    </button>
                                    {/* <button
                                        onClick={() => handleDelete(booking.reserva.id_reserva, booking.reserva.estado)}
                                        className="btn btn-outline-danger btn-sm"
                                        style={{ minWidth: '44px' }}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button> */}
                                </div>
                            </div>
                        ))}
                        
                        {filteredBookings.length === 0 && (
                            <div className="text-center py-5">
                                <i className="bi bi-inbox display-4 text-muted mb-3 d-block"></i>
                                <h6 className="text-muted">No se encontraron reservas</h6>
                                <p className="text-muted small">Intenta ajustar los filtros de búsqueda</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* MODAL */}
                <div className={`modal fade ${showModal ? 'show' : ''}`}
                    style={{ display: showModal ? 'block' : 'none' }}
                    tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold" style={{ fontSize: isMobile ? '1rem' : '1.25rem' }}>
                                    <i className={`bi ${editingBooking ? 'bi-pencil-square' : 'bi-calendar-plus'} text-primary me-2`}></i>
                                    {editingBooking ? 'Editar Reserva' : 'Nueva Reserva'}
                                </h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                {!editingBooking && (
                                    <div className="alert alert-info small">
                                        <i className="bi bi-info-circle me-2"></i>
                                        Todos los campos son obligatorios para crear una reserva
                                    </div>
                                )}
                                {editingBooking && (
                                    <div className="alert alert-warning small">
                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                        Solo puedes editar: fechas, personas y estado
                                    </div>
                                )}
                                
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold small">ID Usuario</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="id_usuario"
                                            value={formData.id_usuario}
                                            onChange={handleInputChange}
                                            disabled={!!editingBooking}
                                            required={!editingBooking}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold small">ID Hostelería</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="id_hosteleria"
                                            value={formData.id_hosteleria}
                                            onChange={handleInputChange}
                                            disabled={!!editingBooking}
                                            required={!editingBooking}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold small">Fecha Inicio</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="fecha_inicio"
                                            value={formData.fecha_inicio}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold small">Fecha Fin</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="fecha_fin"
                                            value={formData.fecha_fin}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold small">Personas</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="personas"
                                            value={formData.personas}
                                            onChange={handleInputChange}
                                            min="1"
                                            required
                                        />
                                    </div>
                                    {!editingBooking && (
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold small">Precio Total</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="precio_total"
                                                value={formData.precio_total}
                                                onChange={handleInputChange}
                                                step="0.01"
                                                required
                                            />
                                        </div>
                                    )}
                                    <div className={editingBooking ? "col-md-6" : "col-12"}>
                                        <label className="form-label fw-semibold small">Estado</label>
                                        <select
                                            className="form-select"
                                            name="estado"
                                            value={formData.estado}
                                            onChange={handleInputChange}
                                        >
                                            <option value="pendiente">Pendiente</option>
                                            <option value="confirmada">Confirmada</option>
                                            <option value="cancelada">Cancelada</option>
                                            <option value="completada">Completada</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-0 pt-0">
                                <button type="button" className="btn btn-light btn-sm" onClick={closeModal}>
                                    Cancelar
                                </button>
                                <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit}>
                                    <i className={`bi ${editingBooking ? 'bi-check-lg' : 'bi-plus-lg'} me-2`}></i>
                                    {editingBooking ? 'Actualizar' : 'Crear'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {showModal && (
                    <div className="modal-backdrop fade show" onClick={closeModal}></div>
                )}
            </div>
        </>
    );
}
