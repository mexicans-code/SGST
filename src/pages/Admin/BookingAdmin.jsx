import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function BookingAdmin() {
    const [bookings, setBookings] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);
    const [formData, setFormData] = useState({
        id_usuario: '',
        id_hosteleria: '',
        fecha_inicio: '',
        fecha_fin: '',
        personas: '',
        precio_total: '',
        estado: 'pendiente'
    });

    useEffect(() => {
        cargarReservas();
    }, []);

    const cargarReservas = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/booking/getBookings');
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
                    `http://localhost:3000/api/booking/updateBooking/${editingBooking.reserva.id_reserva}`,
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
                    'http://localhost:3000/api/booking/createBooking',
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
                    `http://localhost:3000/api/booking/cancelBooking/${id}`,
                    { method: 'PUT' } // Cambié de PATCH a PUT
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
                    `http://localhost:3000/api/booking/deleteBooking/${id}`,
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

    // Función auxiliar para obtener el nombre del establecimiento
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
                    padding: 1rem;
                }
                .table td {
                    border: none;
                    padding: 1rem;
                    vertical-align: middle;
                    border-bottom: 1px solid #f8f9fa;
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
            `}</style>

            <div className="container-fluid p-4">
                <div className="main-container p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h1 className="h2 fw-bold text-dark mb-1">
                                <i className="bi bi-calendar-check-fill text-primary me-2"></i>
                                Gestión de Reservas
                            </h1>
                            <p className="text-muted mb-0">Administra las reservas de hospedaje</p>
                        </div>
                        <button onClick={() => openModal()} className="btn btn-primary">
                            <i className="bi bi-plus-lg me-2"></i>Crear Reserva
                        </button>
                    </div>

                    <div className="row g-4 mb-4">
                        <div className="col-lg-3 col-md-6">
                            <div className="stats-card card text-center h-100">
                                <div className="card-body">
                                    <h3 className="fw-bold text-primary">{bookings.length}</h3>
                                    <p className="text-muted mb-0">Total Reservas</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="stats-card card text-center h-100">
                                <div className="card-body">
                                    <h3 className="fw-bold text-success">
                                        {bookings.filter(b => b.reserva?.estado === 'confirmada').length}
                                    </h3>
                                    <p className="text-muted mb-0">Confirmadas</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="stats-card card text-center h-100">
                                <div className="card-body">
                                    <h3 className="fw-bold text-warning">
                                        {bookings.filter(b => b.reserva?.estado === 'pendiente').length}
                                    </h3>
                                    <p className="text-muted mb-0">Pendientes</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="stats-card card text-center h-100">
                                <div className="card-body">
                                    <h3 className="fw-bold text-danger">
                                        {bookings.filter(b => b.reserva?.estado === 'cancelada').length}
                                    </h3>
                                    <p className="text-muted mb-0">Canceladas</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="user-table">
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
                                    {bookings.map((booking) => (
                                        <tr key={booking.reserva.id_reserva}>
                                            <td>
                                                <span className="badge bg-secondary rounded-pill px-3 py-2">
                                                    #{booking.reserva.id_reserva}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <i className="bi bi-person-fill text-primary me-2"></i>
                                                    <div>
                                                        <div className="fw-semibold text-truncate" style={{ maxWidth: '200px' }}>{booking.usuario?.nombre || 'N/A'}</div>
                                                        <small className="text-muted">{booking.usuario?.email || ''}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <i className={`bi ${booking.reserva.tipo_reserva === 'experiencia' ? 'bi-compass-fill' : 'bi-building-fill'} text-info me-2`}></i>
                                                    <div>
                                                        <div className="fw-semibold text-truncate">{getNombreEstablecimiento(booking)}</div>
                                                        <small className="text-muted">{getUbicacion(booking)}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge ${booking.reserva.tipo_reserva === 'experiencia' ? 'bg-purple' : 'bg-info'} rounded-pill px-3 py-2`}>
                                                    {booking.reserva.tipo_reserva === 'experiencia' ? 'Experiencia' : 'Hospedaje'}
                                                </span>
                                            </td>
                                            <td>
                                                <small className="text-muted">
                                                    <div>{booking.reserva.fecha_inicio}</div>
                                                    {booking.reserva.fecha_fin && (
                                                        <div>→ {booking.reserva.fecha_fin}</div>
                                                    )}
                                                </small>
                                            </td>
                                            <td>
                                                <span className="badge bg-dark rounded-pill px-3 py-2">
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
                                                } rounded-pill px-3 py-2`}>
                                                    {booking.reserva.estado}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="d-flex gap-2 justify-content-center">
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
                                                    <button
                                                        onClick={() => handleDelete(booking.reserva.id_reserva, booking.reserva.estado)}
                                                        className="btn btn-outline-danger btn-sm"
                                                        title="Eliminar"
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* MODAL - Igual que antes pero con las rutas corregidas */}
                <div className={`modal fade ${showModal ? 'show' : ''}`}
                    style={{ display: showModal ? 'block' : 'none' }}
                    tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold">
                                    <i className={`bi ${editingBooking ? 'bi-pencil-square' : 'bi-calendar-plus'} text-primary me-2`}></i>
                                    {editingBooking ? 'Editar Reserva' : 'Nueva Reserva'}
                                </h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                {!editingBooking && (
                                    <div className="alert alert-info">
                                        <i className="bi bi-info-circle me-2"></i>
                                        Todos los campos son obligatorios para crear una reserva
                                    </div>
                                )}
                                {editingBooking && (
                                    <div className="alert alert-warning">
                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                        Solo puedes editar: fechas, personas y estado
                                    </div>
                                )}
                                
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">ID Usuario</label>
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
                                        <label className="form-label fw-semibold">ID Hostelería</label>
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
                                        <label className="form-label fw-semibold">Fecha Inicio</label>
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
                                        <label className="form-label fw-semibold">Fecha Fin</label>
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
                                        <label className="form-label fw-semibold">Personas</label>
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
                                            <label className="form-label fw-semibold">Precio Total</label>
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
                                        <label className="form-label fw-semibold">Estado</label>
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
                                <button type="button" className="btn btn-light" onClick={closeModal}>
                                    Cancelar
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleSubmit}>
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
