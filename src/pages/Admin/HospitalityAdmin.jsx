import { useState, useEffect } from 'react';

export default function HospitalityAdmin() {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        id_anfitrion: '',
        nombre: '',
        descripcion: '',
        precio_por_noche: '',
        capacidad: '',
        ubicacion: '',
        image: '',
        estado: 'pendiente'
    });

    useEffect(() => {
        cargarHosteleria();
    }, []);

    const cargarHosteleria = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/hospitality/getHotelData');
            const data = await response.json();
            if (data.success) {
                setUsers(data.data);
            }
        } catch (error) {
            console.error('Error al cargar hostelería:', error);
            alert('Error al cargar los establecimientos');
        }
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
                id_anfitrion: user.id_anfitrion,
                nombre: user.nombre,
                descripcion: user.descripcion,
                precio_por_noche: user.precio_por_noche,
                capacidad: user.capacidad,
                ubicacion: user.ubicacion,
                image: user.image || '',
                estado: user.estado || 'pendiente'
            });
        } else {
            setEditingUser(null);
            setFormData({
                id_anfitrion: '',
                nombre: '',
                descripcion: '',
                precio_por_noche: '',
                capacidad: '',
                ubicacion: '',
                image: '',
                estado: 'pendiente'
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
                // Actualizar
                const response = await fetch(`http://localhost:3000/api/hospitality/updateHotel/${editingUser.id_hosteleria}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const data = await response.json();
                if (data.success) {
                    alert('Establecimiento actualizado correctamente');
                    cargarHosteleria();
                }
            } else {
                // Crear
                const response = await fetch('http://localhost:3000/api/hospitality/createHotel', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const data = await response.json();
                if (data.success) {
                    alert('Establecimiento creado correctamente');
                    cargarHosteleria();
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
                const response = await fetch(`http://localhost:3000/api/hospitality/deleteHotel/${id}`, {
                    method: 'DELETE'
                });
                const data = await response.json();
                if (data.success) {
                    alert('Establecimiento eliminado correctamente');
                    cargarHosteleria();
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al eliminar el establecimiento');
            }
        }
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
            `}</style>

            <div className="container-fluid p-4">
                <div className="main-container p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h1 className="h2 fw-bold text-dark mb-1">
                                <i className="bi bi-building-fill text-primary me-2"></i>
                                Gestión de Hostelería
                            </h1>
                            <p className="text-muted mb-0">Administra hoteles, hostales y establecimientos</p>
                        </div>
                        <button onClick={() => openModal()} className="btn btn-primary">
                            <i className="bi bi-plus-lg me-2"></i>Crear Establecimiento
                        </button>
                    </div>

                    <div className="row g-4 mb-4">
                        <div className="col-lg-3 col-md-6">
                            <div className="stats-card card text-center h-100">
                                <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-center mb-3">
                                        <div className="avatar">
                                            <i className="bi bi-building"></i>
                                        </div>
                                    </div>
                                    <h3 className="fw-bold text-primary">{users.length}</h3>
                                    <p className="text-muted mb-0">Total Establecimientos</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="stats-card card text-center h-100">
                                <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-center mb-3">
                                        <div className="avatar" style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' }}>
                                            <i className="bi bi-people-fill"></i>
                                        </div>
                                    </div>
                                    <h3 className="fw-bold text-success">{users.reduce((sum, u) => sum + u.capacidad, 0)}</h3>
                                    <p className="text-muted mb-0">Capacidad Total</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="stats-card card text-center h-100">
                                <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-center mb-3">
                                        <div className="avatar" style={{ background: 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)' }}>
                                            <i className="bi bi-currency-dollar"></i>
                                        </div>
                                    </div>
                                    <h3 className="fw-bold text-warning">${users.length > 0 ? (users.reduce((sum, u) => sum + u.precio_por_noche, 0) / users.length).toFixed(0) : 0}</h3>
                                    <p className="text-muted mb-0">Precio Promedio</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="stats-card card text-center h-100">
                                <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-center mb-3">
                                        <div className="avatar" style={{ background: 'linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%)' }}>
                                            <i className="bi bi-person-badge-fill"></i>
                                        </div>
                                    </div>
                                    <h3 className="fw-bold text-info">{new Set(users.map(u => u.id_anfitrion)).size}</h3>
                                    <p className="text-muted mb-0">Anfitriones</p>
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
                                        <th>Establecimiento</th>
                                        <th>Anfitrión</th>
                                        <th>Descripción</th>
                                        <th>Precio/Noche</th>
                                        <th>Capacidad</th>
                                        <th>Ubicación</th>
                                        <th>Estado</th>
                                        <th className="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id_hosteleria}>
                                            <td>
                                                <span className="badge bg-secondary rounded-pill px-3 py-2">
                                                    {user.id_hosteleria}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="fw-semibold">{user.nombre}</div>
                                            </td>
                                            <td>
                                                <span className="badge bg-primary rounded-pill px-3 py-2">
                                                    {user.id_anfitrion}
                                                </span>
                                            </td>
                                            <td>
                                                <small className="text-muted">{user.descripcion.substring(0, 50)}...</small>
                                            </td>
                                            <td>
                                                <span className="badge bg-success rounded-pill px-3 py-2">
                                                    ${user.precio_por_noche}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="badge bg-info rounded-pill px-3 py-2">
                                                    {user.capacidad}
                                                </span>
                                            </td>
                                            <td className="text-muted">
                                                {user.ubicacion}
                                            </td>
                                            <td>
                                                <span className={`badge ${user.estado === 'activo' ? 'bg-success' : 'bg-warning'} rounded-pill px-3 py-2`}>
                                                    <i className={`bi ${user.estado === 'activo' ? 'bi-check-circle-fill' : 'bi-pause-circle-fill'} me-1`}></i>
                                                    {user.estado ? user.estado.charAt(0).toUpperCase() + user.estado.slice(1) : 'Sin estado'}
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
                                                        onClick={() => handleDelete(user.id_hosteleria)}
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

                <div className={`modal fade ${showModal ? 'show' : ''}`}
                    style={{ display: showModal ? 'block' : 'none' }}
                    tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold">
                                    <i className={`bi ${editingUser ? 'bi-pencil-square' : 'bi-building-fill-add'} text-primary me-2`}></i>
                                    {editingUser ? 'Editar Establecimiento' : 'Nuevo Establecimiento'}
                                </h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold">ID Anfitrión</label>
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
                                            <label className="form-label fw-semibold">Precio por Noche ($)</label>
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
                                        <label className="form-label fw-semibold">Nombre del Establecimiento</label>
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
                                        <label className="form-label fw-semibold">Descripción</label>
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
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-semibold">Capacidad (personas)</label>
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
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-semibold">Ubicación</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="ubicacion"
                                                value={formData.ubicacion}
                                                onChange={handleInputChange}
                                                placeholder="Cancún, México"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-semibold">Estado</label>
                                            <select
                                                className="form-select"
                                                name="estado"
                                                value={formData.estado}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="activo">Activo</option>
                                                <option value="inactivo">Inactivo</option>
                                                <option value="pendiente">Pendiente</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">URL de Imagen</label>
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