import { useState, useEffect } from 'react';
import axios from 'axios';
import { GATEWAY_URL } from '../../const/Const';

export default function UserAdmin() {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        apellido_p: '',
        apellido_m: '',
        email: '',
        password: '',
        rol: 'usuario',
        estado: 'activo'
    });

    // Detectar móvil
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const filteredUsers = users.filter(user =>
        `${user.nombre} ${user.apellido_p} ${user.apellido_m}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        try {
            const response = await axios.get(`${GATEWAY_URL}/api/adminUser/getUsers`);
            if (response.data.success) {
                setUsers(response.data.data);
            }
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            mostrarAlerta('Error al cargar usuarios', 'error');
        }
    };

    const mostrarAlerta = (mensaje, tipo = 'success') => {
        alert(mensaje);
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const openModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                nombre: user.nombre,
                apellido_p: user.apellido_p,
                apellido_m: user.apellido_m,
                email: user.email,
                password: '',
                rol: user.rol,
                estado: user.estado
            });
        } else {
            setEditingUser(null);
            setFormData({
                nombre: '',
                apellido_p: '',
                apellido_m: '',
                email: '',
                password: '',
                rol: 'usuario',
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
                const dataToUpdate = { ...formData };
                if (!dataToUpdate.password) {
                    delete dataToUpdate.password;
                }
                await axios.put(`${GATEWAY_URL}/api/adminUser/updateUser/${editingUser.id_usuario}`, dataToUpdate);
                mostrarAlerta('Usuario actualizado correctamente', 'success');
            } else {
                await axios.post(`${GATEWAY_URL}/api/adminUser/createUser`, formData);
                mostrarAlerta('Usuario creado correctamente', 'success');
            }

            cargarUsuarios();
            closeModal();
        } catch (error) {
            console.error('Error al guardar usuario:', error);
            mostrarAlerta(error.response?.data?.message || 'Error al guardar usuario', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('¿Estás seguro de eliminar este usuario?')) {
            try {
                await axios.delete(`${GATEWAY_URL}/api/adminUser/deleteUser/${id}`);
                mostrarAlerta('Usuario eliminado correctamente', 'success');
                cargarUsuarios();
            } catch (error) {
                console.error('Error al eliminar usuario:', error);
                mostrarAlerta('Error al eliminar usuario', 'error');
            }
        }
    };

    const getInitials = (user) => {
        const nombre = user.nombre || '';
        const apellidoP = user.apellido_p || '';
        return `${nombre.charAt(0)}${apellidoP.charAt(0)}`.toUpperCase();
    };

    const getNombreCompleto = (user) => {
        return `${user.nombre} ${user.apellido_p} ${user.apellido_m}`.trim();
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
                
                /* User Card for Mobile */
                .user-card {
                    background: white;
                    border-radius: 12px;
                    padding: 1rem;
                    margin-bottom: 0.75rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                    transition: all 0.3s ease;
                }
                .user-card:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
                    transform: translateY(-2px);
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
                    .avatar {
                        width: 40px;
                        height: 40px;
                        font-size: 14px;
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
                                <i className="bi bi-people-fill text-primary me-2"></i>
                                {isMobile ? 'Usuarios' : 'Gestión de Usuarios'}
                            </h1>
                            <p className="text-muted mb-0 small">
                                {isMobile ? 'Administra usuarios' : 'Administra y controla los usuarios del sistema'}
                            </p>
                        </div>
                        <button onClick={() => openModal()} className="btn btn-primary w-100 w-md-auto">
                            <i className="bi bi-plus-lg me-2"></i>
                            {isMobile ? 'Crear' : 'Crear Usuario'}
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="row g-2 g-md-4 mb-3 mb-md-4">
                        {[
                            { icon: 'bi-people', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', value: users.length, label: 'Total', fullLabel: 'Total de Usuarios', textColor: 'text-primary' },
                            { icon: 'bi-check-circle-fill', color: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', value: users.filter(u => u.estado === 'activo').length, label: 'Activos', fullLabel: 'Usuarios Activos', textColor: 'text-success' },
                            { icon: 'bi-pause-circle-fill', color: 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)', value: users.filter(u => u.estado === 'inactivo').length, label: 'Inactivos', fullLabel: 'Usuarios Inactivos', textColor: 'text-warning' },
                            { icon: 'bi-shield-fill-check', color: 'linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%)', value: users.filter(u => u.rol === 'admin').length, label: 'Admins', fullLabel: 'Administradores', textColor: 'text-info' }
                        ].map((stat, idx) => (
                            <div className="col-6 col-md-3" key={idx}>
                                <div className="stats-card card text-center h-100">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center justify-content-center mb-2 mb-md-3">
                                            <div className="avatar" style={{ background: stat.color }}>
                                                <i className={`bi ${stat.icon}`}></i>
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
                                placeholder={isMobile ? "Buscar..." : "Buscar usuarios por nombre o email..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Desktop Table View */}
                    <div className="user-table d-none d-md-block">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>Usuario</th>
                                        <th>Email</th>
                                        <th>Rol</th>
                                        <th>Estado</th>
                                        <th className="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id_usuario}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar me-3">
                                                        {getInitials(user)}
                                                    </div>
                                                    <div>
                                                        <div className="fw-semibold">{getNombreCompleto(user)}</div>
                                                        <small className="text-muted">ID: {user.id_usuario}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-muted">{user.email}</td>
                                            <td>
                                                <span className={`badge ${user.rol === 'admin' ? 'bg-primary' : 'bg-secondary'} rounded-pill px-3 py-2`}>
                                                    <i className={`bi ${user.rol === 'admin' ? 'bi-shield-fill' : 'bi-person-fill'} me-1`}></i>
                                                    {user.rol.charAt(0).toUpperCase() + user.rol.slice(1)}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge ${user.estado === 'activo' ? 'bg-success' : 'bg-warning'} rounded-pill px-3 py-2`}>
                                                    <i className={`bi ${user.estado === 'activo' ? 'bi-check-circle-fill' : 'bi-pause-circle-fill'} me-1`}></i>
                                                    {user.estado.charAt(0).toUpperCase() + user.estado.slice(1)}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="d-flex gap-2 justify-content-center">
                                                    <button
                                                        onClick={() => openModal(user)}
                                                        className="btn btn-outline-primary btn-sm"
                                                        title="Editar"
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id_usuario)}
                                                        className="btn btn-outline-danger btn-sm"
                                                        title="Eliminar"
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredUsers.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="text-center py-5">
                                                <div className="text-muted">
                                                    <i className="bi bi-inbox display-1 mb-3 d-block"></i>
                                                    <h5>No se encontraron usuarios</h5>
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
                    <div className="d-md-none">
                        {filteredUsers.map((user) => (
                            <div key={user.id_usuario} className="user-card">
                                <div className="d-flex align-items-start gap-3 mb-3">
                                    <div className="avatar flex-shrink-0">
                                        {getInitials(user)}
                                    </div>
                                    <div className="flex-grow-1 min-width-0">
                                        <h6 className="fw-bold mb-1 text-truncate">{getNombreCompleto(user)}</h6>
                                        <p className="text-muted small mb-2 text-truncate">{user.email}</p>
                                        <div className="d-flex gap-2 flex-wrap">
                                            <span className={`badge ${user.rol === 'admin' ? 'bg-primary' : 'bg-secondary'} rounded-pill`}>
                                                <i className={`bi ${user.rol === 'admin' ? 'bi-shield-fill' : 'bi-person-fill'} me-1`}></i>
                                                {user.rol.charAt(0).toUpperCase() + user.rol.slice(1)}
                                            </span>
                                            <span className={`badge ${user.estado === 'activo' ? 'bg-success' : 'bg-warning'} rounded-pill`}>
                                                {user.estado.charAt(0).toUpperCase() + user.estado.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <button
                                        onClick={() => openModal(user)}
                                        className="btn btn-outline-primary btn-sm flex-grow-1"
                                    >
                                        <i className="bi bi-pencil me-1"></i>Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id_usuario)}
                                        className="btn btn-outline-danger btn-sm"
                                        style={{ minWidth: '44px' }}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                        
                        {filteredUsers.length === 0 && (
                            <div className="text-center py-5">
                                <i className="bi bi-inbox display-4 text-muted mb-3 d-block"></i>
                                <h6 className="text-muted">No se encontraron usuarios</h6>
                                <p className="text-muted small">Intenta con otros términos de búsqueda</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal */}
                <div className={`modal fade ${showModal ? 'show' : ''}`}
                    style={{ display: showModal ? 'block' : 'none' }}
                    tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold" style={{ fontSize: isMobile ? '1rem' : '1.25rem' }}>
                                    <i className={`bi ${editingUser ? 'bi-pencil-square' : 'bi-person-plus-fill'} text-primary me-2`}></i>
                                    {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                                </h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold small">Nombre</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleInputChange}
                                            placeholder="Ingresa el nombre"
                                            required
                                        />
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold small">Apellido Paterno</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="apellido_p"
                                                value={formData.apellido_p}
                                                onChange={handleInputChange}
                                                placeholder="Apellido paterno"
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold small">Apellido Materno</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="apellido_m"
                                                value={formData.apellido_m}
                                                onChange={handleInputChange}
                                                placeholder="Apellido materno"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold small">Correo electrónico</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="ejemplo@email.com"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold small">
                                            Contraseña {editingUser && <small className="text-muted">(Dejar vacío para mantener la actual)</small>}
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="Contraseña"
                                            required={!editingUser}
                                        />
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold small">Rol</label>
                                            <select
                                                className="form-select"
                                                name="rol"
                                                value={formData.rol}
                                                onChange={handleInputChange}
                                            >
                                                <option value="usuario">Usuario</option>
                                                <option value="invitado">Anfitrion</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold small">Estado</label>
                                            <select
                                                className="form-select"
                                                name="estado"
                                                value={formData.estado}
                                                onChange={handleInputChange}
                                            >
                                                <option value="activo">Activo</option>
                                                <option value="inactivo">Inactivo</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-0 pt-0">
                                    <button type="button" className="btn btn-light" onClick={closeModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary">
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
