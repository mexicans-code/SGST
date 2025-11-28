import { useState, useEffect } from 'react';
import { GATEWAY_URL } from '../../const/Const';

export default function HospitalityAdmin() {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        id_anfitrion: '',
        nombre: '',
        descripcion: '',
        precio_por_noche: '',
        habitaciones: '',
        banos: '',
        capacidad: '',
        direccion: {
            calle: '',
            ciudad: '',
            estado: '',
            pais: '',
            colonia: '',
            numero_exterior: '',
            numero_interior: ''
        },
        image: '',
        estado: 'activo'
    });

    // Detectar móvil
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        cargarHosteleria();
    }, []);

    const cargarHosteleria = async () => {
        try {
            const response = await fetch(`${GATEWAY_URL}/api/hospitality/getHotelData`);
            const data = await response.json();
            
            if (data.success) {
                const normalizedData = data.data.map(hotel => ({
                    ...hotel,
                    direccion: hotel.direcciones || hotel.direccion
                }));
                
                setUsers(normalizedData);
            }
        } catch (error) {
            console.error('Error al cargar hostelería:', error);
            alert('Error al cargar los establecimientos');
        }
    };

    const filteredUsers = users.filter(user =>
        user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatearDireccion(user.direccion).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleDireccionChange = (e) => {
        setFormData({
            ...formData,
            direccion: {
                ...formData.direccion,
                [e.target.name]: e.target.value
            }
        });
    };

    const openModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                id_anfitrion: user.id_anfitrion || '',
                nombre: user.nombre || '',
                descripcion: user.descripcion || '',
                precio_por_noche: user.precio_por_noche || '',
                habitaciones: user.habitaciones || '',
                banos: user.banos || '',
                capacidad: user.capacidad || '',
                direccion: user.direccion || {
                    calle: '',
                    ciudad: '',
                    estado: '',
                    pais: '',
                    colonia: '',
                    numero_exterior: '',
                    numero_interior: ''
                },
                image: user.image || '',
                estado: user.estado || 'activo'
            });
        } else {
            setEditingUser(null);
            setFormData({
                id_anfitrion: '',
                nombre: '',
                descripcion: '',
                precio_por_noche: '',
                habitaciones: '',
                banos: '',
                capacidad: '',
                direccion: {
                    calle: '',
                    ciudad: '',
                    estado: '',
                    pais: '',
                    colonia: '',
                    numero_exterior: '',
                    numero_interior: ''
                },
                image: '',
                estado: 'activo'
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingUser(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (editingUser) {
                const response = await fetch(`${GATEWAY_URL}/api/hospitality/updateHotel/${editingUser.id_hosteleria}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const data = await response.json();
                if (data.success) {
                    alert('Establecimiento actualizado correctamente');
                    cargarHosteleria();
                } else {
                    alert(data.error || 'Error al actualizar');
                }
            } else {
                const response = await fetch(`${GATEWAY_URL}/api/hospitality/createHotel`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const data = await response.json();
                if (data.success) {
                    alert('Establecimiento creado correctamente');
                    cargarHosteleria();
                } else {
                    alert(data.error || 'Error al crear');
                }
            }
            closeModal();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al guardar el establecimiento');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('¿Eliminar este establecimiento?')) {
            try {
                const response = await fetch(`${GATEWAY_URL}/api/hospitality/deleteHotel/${id}`, {
                    method: 'DELETE'
                });
                const data = await response.json();
                if (data.success) {
                    alert('Establecimiento eliminado correctamente');
                    cargarHosteleria();
                } else {
                    alert(data.message || 'Error al eliminar');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al eliminar el establecimiento');
            }
        }
    };

    const formatearDireccion = (direccion) => {
        if (!direccion) return 'Sin dirección';
        return `${direccion.ciudad || ''}, ${direccion.estado || ''}`.trim() || 'Sin dirección';
    };

    return (
        <>
            <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css" rel="stylesheet" />

            <style>{`
                body { 
                    min-height: 100vh;
                    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                }
                .main-container {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                    border-radius: 20px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
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
                    border: none;
                }
                .table th {
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    border: none;
                    font-weight: 600;
                    color: #495057;
                    padding: 1rem;
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
                .avatar {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 600;
                    font-size: 16px;
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
                    background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
                }
                .search-input {
                    border: 2px solid #e9ecef;
                    border-radius: 12px;
                    padding: 12px 20px;
                    transition: all 0.3s ease;
                    background: rgba(255, 255, 255, 0.9);
                }
                .search-input:focus {
                    border-color: #667eea;
                    box-shadow: 0 0 20px rgba(102, 126, 234, 0.2);
                    background: white;
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
                
                /* Hotel Card for Mobile */
                .hotel-card {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    margin-bottom: 1rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                    transition: all 0.3s ease;
                }
                .hotel-card:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
                    transform: translateY(-2px);
                }
                .hotel-card-img {
                    width: 100%;
                    height: 180px;
                    object-fit: cover;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }
                .hotel-card-body {
                    padding: 1rem;
                }
                
                /* Responsive Styles */
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
                                <i className="bi bi-building-fill text-primary me-2"></i>
                                {isMobile ? 'Hostelería' : 'Gestión de Hostelería'}
                            </h1>
                            <p className="text-muted mb-0 small">
                                {isMobile ? 'Administra establecimientos' : 'Administra hoteles, hostales y establecimientos'}
                            </p>
                        </div>
                        {/* <button onClick={() => openModal()} className="btn btn-primary w-100 w-md-auto">
                            <i className="bi bi-plus-lg me-2"></i>
                            {isMobile ? 'Crear' : 'Crear Establecimiento'}
                        </button> */}
                    </div>

                    {/* Stats Cards */}
                    <div className="row g-2 g-md-4 mb-3 mb-md-4">
                        {[
                            { icon: 'bi-building', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', value: users.length, label: 'Total', fullLabel: 'Total Establecimientos', textColor: 'text-primary' },
                            { icon: 'bi-people-fill', color: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', value: users.reduce((sum, u) => sum + (u.capacidad || 0), 0), label: 'Capacidad', fullLabel: 'Capacidad Total', textColor: 'text-success' },
                            { icon: 'bi-currency-dollar', color: 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)', value: `$${users.length > 0 ? (users.reduce((sum, u) => sum + (u.precio_por_noche || 0), 0) / users.length).toFixed(0) : 0}`, label: 'Promedio', fullLabel: 'Precio Promedio', textColor: 'text-warning' },
                            { icon: 'bi-person-badge-fill', color: 'linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%)', value: new Set(users.map(u => u.id_anfitrion)).size, label: 'Anfitriones', fullLabel: 'Anfitriones', textColor: 'text-info' }
                        ].map((stat, idx) => (
                            <div className="col-6 col-md-3" key={idx}>
                                <div className="stats-card card text-center h-100">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center justify-content-center mb-2 mb-md-3">
                                            <div className="avatar" style={{ background: stat.color, width: isMobile ? '40px' : '45px', height: isMobile ? '40px' : '45px' }}>
                                                <i className={`bi ${stat.icon}`} style={{ fontSize: isMobile ? '1rem' : '1.2rem' }}></i>
                                            </div>
                                        </div>
                                        <h3 className={`fw-bold ${stat.textColor}`}>{stat.value}</h3>
                                        <p className="text-muted mb-0 small">
                                            <span className="d-none d-md-inline">{stat.fullLabel}</span>
                                            <span className="d-inline d-md-none">{stat.label}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="mb-3 mb-md-4">
                        <div className="position-relative">
                            <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                            <input
                                type="text"
                                className="form-control search-input ps-5"
                                placeholder={isMobile ? "Buscar..." : "Buscar por nombre o ubicación..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Desktop Table View */}
                    <div className="user-table d-none d-lg-block">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Establecimiento</th>
                                        <th>Anfitrión</th>
                                        <th>Precio/Noche</th>
                                        <th>Hab/Baños</th>
                                        <th>Capacidad</th>
                                        <th>Ubicación</th>
                                        <th>Estado</th>
                                        <th className="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id_hosteleria}>
                                            <td>
                                                <span className="badge bg-secondary rounded-pill px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                                    {user.id_hosteleria}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="fw-semibold">{user.nombre}</div>
                                            </td>
                                            <td>
                                                <span className="badge bg-primary rounded-pill px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                                    {user.id_anfitrion}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="badge bg-success rounded-pill px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                                    ${user.precio_por_noche}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="badge bg-info rounded-pill px-2 py-1 me-1" style={{ fontSize: '0.75rem' }}>
                                                    {user.habitaciones || 0}
                                                </span>
                                                <span className="badge bg-info rounded-pill px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                                    {user.banos || 0}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="badge bg-info rounded-pill px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                                    {user.capacidad}
                                                </span>
                                            </td>
                                            <td className="text-muted small">
                                                {formatearDireccion(user.direccion)}
                                            </td>
                                            <td>
                                                <span className={`badge ${user.estado === 'activo' ? 'bg-success' : 'bg-warning'} rounded-pill px-2 py-1`} style={{ fontSize: '0.75rem' }}>
                                                    {user.estado ? user.estado.charAt(0).toUpperCase() + user.estado.slice(1) : 'Sin estado'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="d-flex gap-1 justify-content-center">
                                                        <button
                                                            onClick={() => openModal(user)}
                                                            className="btn btn-outline-primary btn-sm"
                                                            title="Editar"
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </button>
                                                    {/* <button
                                                        onClick={() => handleDelete(user.id_hosteleria)}
                                                        className="btn btn-outline-danger btn-sm"
                                                        title="Eliminar"
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button> */}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredUsers.length === 0 && (
                                        <tr>
                                            <td colSpan="9" className="text-center py-5">
                                                <div className="text-muted">
                                                    <i className="bi bi-inbox display-1 mb-3 d-block"></i>
                                                    <h5>No se encontraron establecimientos</h5>
                                                    <p>Intenta con otros términos de búsqueda</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="d-lg-none">
                        {filteredUsers.map((user) => (
                            <div key={user.id_hosteleria} className="hotel-card">
                                {user.image && (
                                    <img src={user.image} alt={user.nombre} className="hotel-card-img" />
                                )}
                                {!user.image && (
                                    <div className="hotel-card-img d-flex align-items-center justify-content-center">
                                        <i className="bi bi-building text-white" style={{ fontSize: '3rem' }}></i>
                                    </div>
                                )}
                                <div className="hotel-card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h6 className="fw-bold mb-1">{user.nombre}</h6>
                                        <span className={`badge ${user.estado === 'activo' ? 'bg-success' : 'bg-warning'}`}>
                                            {user.estado}
                                        </span>
                                    </div>
                                    <p className="text-muted small mb-2">
                                        <i className="bi bi-geo-alt me-1"></i>
                                        {formatearDireccion(user.direccion)}
                                    </p>
                                    <div className="d-flex gap-2 flex-wrap mb-3">
                                        <span className="badge bg-success">
                                            <i className="bi bi-currency-dollar me-1"></i>
                                            ${user.precio_por_noche}
                                        </span>
                                        <span className="badge bg-info">
                                            <i className="bi bi-door-closed me-1"></i>
                                            {user.habitaciones || 0} hab
                                        </span>
                                        <span className="badge bg-info">
                                            <i className="bi bi-droplet me-1"></i>
                                            {user.banos || 0} baños
                                        </span>
                                        <span className="badge bg-info">
                                            <i className="bi bi-people me-1"></i>
                                            {user.capacidad} personas
                                        </span>
                                        <span className="badge bg-primary">
                                            <i className="bi bi-person me-1"></i>
                                            Anf: {user.id_anfitrion}
                                        </span>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button
                                            onClick={() => openModal(user)}
                                            className="btn btn-outline-primary btn-sm flex-grow-1"
                                        >
                                            <i className="bi bi-pencil me-1"></i>Editar
                                        </button>
                                        {/* <button
                                            onClick={() => handleDelete(user.id_hosteleria)}
                                            className="btn btn-outline-danger btn-sm"
                                            style={{ minWidth: '44px' }}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button> */}
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {filteredUsers.length === 0 && (
                            <div className="text-center py-5">
                                <i className="bi bi-inbox display-4 text-muted mb-3 d-block"></i>
                                <h6 className="text-muted">No se encontraron establecimientos</h6>
                                <p className="text-muted small">Intenta con otros términos de búsqueda</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* MODAL */}
                <div className={`modal fade ${showModal ? 'show' : ''}`}
                    style={{ display: showModal ? 'block' : 'none' }}
                    tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                        <div className="modal-content">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold" style={{ fontSize: isMobile ? '1rem' : '1.25rem' }}>
                                    <i className={`bi ${editingUser ? 'bi-pencil-square' : 'bi-building-fill-add'} text-primary me-2`}></i>
                                    {editingUser ? 'Editar Establecimiento' : 'Nuevo Establecimiento'}
                                </h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold small">ID Anfitrión</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="id_anfitrion"
                                                value={formData.id_anfitrion}
                                                onChange={handleInputChange}
                                                placeholder="24"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold small">Precio por Noche ($)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="form-control"
                                                name="precio_por_noche"
                                                value={formData.precio_por_noche}
                                                onChange={handleInputChange}
                                                placeholder="120.50"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold small">Nombre del Establecimiento</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleInputChange}
                                            placeholder="Casa Playa Azul"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold small">Descripción</label>
                                        <textarea
                                            className="form-control"
                                            name="descripcion"
                                            rows="3"
                                            value={formData.descripcion}
                                            onChange={handleInputChange}
                                            placeholder="Hermosa casa frente al mar con 3 habitaciones..."
                                            required
                                        ></textarea>
                                    </div>

                                    <div className="row">
                                        <div className="col-6 col-md-3 mb-3">
                                            <label className="form-label fw-semibold small">Capacidad</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="capacidad"
                                                value={formData.capacidad}
                                                onChange={handleInputChange}
                                                placeholder="6"
                                                required
                                            />
                                        </div>
                                        <div className="col-6 col-md-3 mb-3">
                                            <label className="form-label fw-semibold small">Habitaciones</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="habitaciones"
                                                value={formData.habitaciones}
                                                onChange={handleInputChange}
                                                placeholder="3"
                                                required
                                            />
                                        </div>
                                        <div className="col-6 col-md-3 mb-3">
                                            <label className="form-label fw-semibold small">Baños</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="banos"
                                                value={formData.banos}
                                                onChange={handleInputChange}
                                                placeholder="2"
                                                required
                                            />
                                        </div>
                                        <div className="col-6 col-md-3 mb-3">
                                            <label className="form-label fw-semibold small">Estado</label>
                                            <select
                                                className="form-select"
                                                name="estado"
                                                value={formData.estado}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="activo">Activo</option>
                                                <option value="pendiente">Pendiente</option>
                                                <option value="inactivo">Inactivo</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* SECCIÓN DE DIRECCIÓN */}
                                    <div className="card bg-light border-0 p-3 mb-3">
                                        <h6 className="fw-bold mb-3 small">
                                            <i className="bi bi-geo-alt-fill me-2"></i>Dirección
                                        </h6>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label small">Calle</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="calle"
                                                    value={formData.direccion.calle}
                                                    onChange={handleDireccionChange}
                                                    placeholder="Av. Revolución"
                                                    required
                                                />
                                            </div>
                                            <div className="col-6 col-md-3 mb-3">
                                                <label className="form-label small">No. Ext</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="numero_exterior"
                                                    value={formData.direccion.numero_exterior}
                                                    onChange={handleDireccionChange}
                                                    placeholder="123"
                                                />
                                            </div>
                                            <div className="col-6 col-md-3 mb-3">
                                                <label className="form-label small">No. Int</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="numero_interior"
                                                    value={formData.direccion.numero_interior}
                                                    onChange={handleDireccionChange}
                                                    placeholder="A"
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label small">Colonia</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="colonia"
                                                    value={formData.direccion.colonia}
                                                    onChange={handleDireccionChange}
                                                    placeholder="Centro"
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label small">Ciudad</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="ciudad"
                                                    value={formData.direccion.ciudad}
                                                    onChange={handleDireccionChange}
                                                    placeholder="Cancún"
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label className="form-label small">Estado</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="estado"
                                                    value={formData.direccion.estado}
                                                    onChange={handleDireccionChange}
                                                    placeholder="Quintana Roo"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12 mb-3">
                                                <label className="form-label small">País</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="pais"
                                                    value={formData.direccion.pais}
                                                    onChange={handleDireccionChange}
                                                    placeholder="México"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold small">URL de Imagen</label>
                                        <input
                                            type="url"
                                            className="form-control"
                                            name="image"
                                            value={formData.image}
                                            onChange={handleInputChange}
                                            placeholder="https://ejemplo.com/imagen.jpg"
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer border-0 pt-0">
                                    <button type="button" className="btn btn-light btn-sm" onClick={closeModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary btn-sm">
                                        <i className={`bi ${editingUser ? 'bi-check-lg' : 'bi-plus-lg'} me-2`}></i>
                                        {editingUser ? 'Actualizar' : 'Crear'}
                                    </button>
                                </div>
                            </form>
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
