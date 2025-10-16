import React, { useState, useEffect } from "react";
import { Home, MapPin, DollarSign, Users, Bed, Bath, Star, Edit, Trash2, Eye, EyeOff, Plus, Calendar, MessageCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function HostProperties() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('todas');
    const [userId, setUserId] = useState(null);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
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

        const fetchProperties = async () => {
            try {
                const response = await fetch('http://localhost:3001/getHotelData');

                const result = await response.json();

                if (result.success && result.data) {
                    // Filtrar solo las propiedades del usuario actual
                    const userProperties = result.data.filter(
                        prop => prop.id_anfitrion === currentUserId
                    );
                    setProperties(userProperties);
                }
            } catch (error) {
                console.error('Error al obtener propiedades:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    const filterProperties = () => {
        if (activeTab === 'todas') {
            return properties;
        } else if (activeTab === 'activas') {
            return properties.filter(p => p.estado === 'activo');
        } else {
            return properties.filter(p => p.estado === 'inactivo');
        }
    };

    const formatearDireccion = (direccion) => {
        if (!direccion) return 'Sin ubicación';
        const { calle, ciudad, estado } = direccion;
        return `${calle || ''}, ${ciudad || ''}, ${estado || ''}`.replace(/^,\s*|,\s*$/g, '').replace(/,\s*,/g, ',').trim();
    };

    const handleToggleActive = async (propertyId, currentStatus) => {
        const action = currentStatus ? 'desactivar' : 'activar';
        const newStatus = currentStatus ? 'inactivo' : 'activo';
        
        if (window.confirm(`¿Estás seguro de que deseas ${action} esta propiedad?`)) {
            try {
                const response = await fetch(`http://localhost:3001/updateHotel/${propertyId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        estado: newStatus
                    })
                });

                const result = await response.json();

                if (result.success) {
                    alert(`Propiedad ${action}da exitosamente`);
                    // Actualizar el estado local
                    setProperties(properties.map(p => 
                        p.id_hosteleria === propertyId 
                            ? { ...p, estado: newStatus }
                            : p
                    ));
                } else {
                    alert('Error al actualizar la propiedad');
                }
            } catch (error) {
                console.error('Error al actualizar propiedad:', error);
                alert('Error al actualizar la propiedad');
            }
        }
    };

    const handleDeleteProperty = async (propertyId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta propiedad? Esta acción no se puede deshacer.')) {
            try {
                const response = await fetch(`http://localhost:3001/deleteHotel/${propertyId}`, {
                    method: 'DELETE'
                });

                const result = await response.json();

                if (result.success) {
                    alert('Propiedad eliminada exitosamente');
                    setProperties(properties.filter(p => p.id_hosteleria !== propertyId));
                    setDetailsModalOpen(false);
                } else {
                    alert('Error al eliminar la propiedad');
                }
            } catch (error) {
                console.error('Error al eliminar propiedad:', error);
                alert('Error al eliminar la propiedad');
            }
        }
    };

    const handleEditProperty = (propertyId) => {
        alert(`Redirigir a editar propiedad ID: ${propertyId}`);
    };

    const handleOpenDetails = (property) => {
        setSelectedProperty(property);
        setDetailsModalOpen(true);
    };

    const handleCloseDetails = () => {
        setSelectedProperty(null);
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

    const filteredProperties = filterProperties();

    const stats = {
        todas: properties.length,
        activas: properties.filter(p => p.estado === 'activo').length,
        inactivas: properties.filter(p => p.estado === 'inactivo').length
    };

    return (
        <div style={{ backgroundColor: '#fff', minHeight: '100vh', paddingTop: '7rem', paddingBottom: '3rem' }}>
            <div className="container">
                <div className="mb-4 d-flex justify-content-between align-items-center">
                    <div>
                        <h1 className="fw-bold mb-2" style={{ color: '#CD5C5C' }}>Mis Propiedades</h1>
                        <p className="text-muted">Gestiona tus publicaciones y propiedades</p>
                        <button className="btn btn-outline-secondary btn-sm rounded-pill" onClick={() => navigate('/host/admin')}>Mis reservaciones <ArrowRight /></button>
                    </div>
                    <button className="btn rounded-pill px-4 py-2" style={{ backgroundColor: '#CD5C5C', color: 'white' }}>
                        <Plus size={20} className="me-2" />
                        Nueva Propiedad
                    </button>
                </div>

                {/* Modal de Detalles */}
                {detailsModalOpen && selectedProperty && (
                    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={handleCloseDetails}>
                        <div className="modal-dialog modal-dialog-centered modal-xl" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-content rounded-4 border-0 shadow-lg">
                                <div className="modal-header border-0" style={{ backgroundColor: '#F4EFEA' }}>
                                    <div>
                                        <h4 className="modal-title fw-bold mb-1" style={{ color: '#CD5C5C' }}>
                                            {selectedProperty.nombre}
                                        </h4>
                                        <p className="text-muted small mb-0">
                                            <MapPin size={14} className="me-1" />
                                            {formatearDireccion(selectedProperty.direccion)}
                                        </p>
                                    </div>
                                    <button type="button" className="btn-close" onClick={handleCloseDetails}></button>
                                </div>

                                <div className="modal-body p-4">
                                    {/* Imágenes */}
                                    <div className="mb-4">
                                        <img
                                            src={selectedProperty.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'}
                                            alt={selectedProperty.nombre}
                                            style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '12px' }}
                                        />
                                    </div>

                                    {/* Estado */}
                                    <div className="mb-4 text-center">
                                        <span className={`badge ${selectedProperty.estado === 'activo' ? 'bg-success' : 'bg-secondary'} px-3 py-2`}>
                                            {selectedProperty.estado === 'activo' ? 'Activa' : 'Inactiva'}
                                        </span>
                                    </div>

                                    {/* Información básica */}
                                    <div className="row g-4 mb-4">
                                        <div className="col-md-3">
                                            <div className="text-center p-3 rounded-3" style={{ backgroundColor: '#F8F9FA' }}>
                                                <DollarSign size={24} style={{ color: '#CD5C5C' }} className="mb-2" />
                                                <div className="fw-bold">${selectedProperty.precio_por_noche?.toLocaleString('es-MX')}</div>
                                                <small className="text-muted">por noche</small>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="text-center p-3 rounded-3" style={{ backgroundColor: '#F8F9FA' }}>
                                                <Users size={24} style={{ color: '#CD5C5C' }} className="mb-2" />
                                                <div className="fw-bold">{selectedProperty.capacidad}</div>
                                                <small className="text-muted">huéspedes</small>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="text-center p-3 rounded-3" style={{ backgroundColor: '#F8F9FA' }}>
                                                <Bed size={24} style={{ color: '#CD5C5C' }} className="mb-2" />
                                                <div className="fw-bold">{selectedProperty.habitaciones || 'N/A'}</div>
                                                <small className="text-muted">habitaciones</small>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="text-center p-3 rounded-3" style={{ backgroundColor: '#F8F9FA' }}>
                                                <Bath size={24} style={{ color: '#CD5C5C' }} className="mb-2" />
                                                <div className="fw-bold">{selectedProperty.banos || 'N/A'}</div>
                                                <small className="text-muted">baños</small>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Descripción */}
                                    <div className="mb-4">
                                        <h6 className="fw-bold mb-3" style={{ color: '#CD5C5C' }}>Descripción</h6>
                                        <p className="text-muted">{selectedProperty.descripcion || 'Sin descripción'}</p>
                                    </div>

                                    {/* Servicios */}
                                    {selectedProperty.servicios && selectedProperty.servicios.length > 0 && (
                                        <div className="mb-4">
                                            <h6 className="fw-bold mb-3" style={{ color: '#CD5C5C' }}>Servicios</h6>
                                            <div className="d-flex flex-wrap gap-2">
                                                {selectedProperty.servicios.map((servicio, idx) => (
                                                    <span key={idx} className="badge bg-light text-dark border px-3 py-2">
                                                        {servicio}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Acciones */}
                                    <div className="border-top pt-4 mt-4">
                                        <div className="d-flex gap-2 flex-wrap justify-content-between">
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-outline-primary rounded-pill"
                                                    onClick={() => handleEditProperty(selectedProperty.id_hosteleria)}
                                                >
                                                    <Edit size={16} className="me-2" />
                                                    Editar
                                                </button>
                                                <button
                                                    className={`btn ${selectedProperty.estado === 'activo' ? 'btn-outline-warning' : 'btn-outline-success'} rounded-pill`}
                                                    onClick={() => handleToggleActive(selectedProperty.id_hosteleria, selectedProperty.estado === 'activo')}
                                                >
                                                    {selectedProperty.estado === 'activo' ? <EyeOff size={16} className="me-2" /> : <Eye size={16} className="me-2" />}
                                                    {selectedProperty.estado === 'activo' ? 'Desactivar' : 'Activar'}
                                                </button>
                                            </div>
                                            <button
                                                className="btn btn-danger rounded-pill"
                                                onClick={() => handleDeleteProperty(selectedProperty.id_hosteleria)}
                                            >
                                                <Trash2 size={16} className="me-2" />
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-footer border-0" style={{ backgroundColor: '#F8F9FA' }}>
                                    <button className="btn rounded-pill px-4" style={{ backgroundColor: '#CD5C5C', color: 'white' }} onClick={handleCloseDetails}>
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Estadísticas */}
                <div className="row g-3 mb-4">
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm rounded-3 p-3">
                            <div className="d-flex align-items-center">
                                <div className="p-2 rounded-circle me-3" style={{ backgroundColor: '#E0F2FE' }}>
                                    <Home size={20} style={{ color: '#0369A1' }} />
                                </div>
                                <div>
                                    <small className="text-muted">Total Propiedades</small>
                                    <h4 className="fw-bold mb-0">{stats.todas}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm rounded-3 p-3">
                            <div className="d-flex align-items-center">
                                <div className="p-2 rounded-circle me-3" style={{ backgroundColor: '#D1FAE5' }}>
                                    <Eye size={20} style={{ color: '#059669' }} />
                                </div>
                                <div>
                                    <small className="text-muted">Activas</small>
                                    <h4 className="fw-bold mb-0">{stats.activas}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm rounded-3 p-3">
                            <div className="d-flex align-items-center">
                                <div className="p-2 rounded-circle me-3" style={{ backgroundColor: '#FEE2E2' }}>
                                    <EyeOff size={20} style={{ color: '#DC2626' }} />
                                </div>
                                <div>
                                    <small className="text-muted">Inactivas</small>
                                    <h4 className="fw-bold mb-0">{stats.inactivas}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
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
                            className={`nav-link ${activeTab === 'activas' ? 'active' : ''}`}
                            style={{
                                backgroundColor: activeTab === 'activas' ? '#CD5C5C' : 'transparent',
                                color: activeTab === 'activas' ? 'white' : '#6c757d',
                                border: 'none'
                            }}
                            onClick={() => setActiveTab('activas')}
                        >
                            Activas ({stats.activas})
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'inactivas' ? 'active' : ''}`}
                            style={{
                                backgroundColor: activeTab === 'inactivas' ? '#CD5C5C' : 'transparent',
                                color: activeTab === 'inactivas' ? 'white' : '#6c757d',
                                border: 'none'
                            }}
                            onClick={() => setActiveTab('inactivas')}
                        >
                            Inactivas ({stats.inactivas})
                        </button>
                    </li>
                </ul>

                {/* Lista de propiedades */}
                {filteredProperties.length === 0 ? (
                    <div className="text-center py-5">
                        <Home size={64} color="#CD5C5C" className="mb-3" />
                        <h4 className="text-muted">No tienes propiedades {activeTab}</h4>
                        <p className="text-muted">Comienza publicando tu primera propiedad</p>
                        <button className="btn rounded-pill px-4 mt-3" style={{ backgroundColor: '#CD5C5C', color: 'white' }}>
                            <Plus size={20} className="me-2" />
                            Agregar Propiedad
                        </button>
                    </div>
                ) : (
                    <div className="row g-4">
                        {filteredProperties.map((property) => (
                            <div key={property.id_establecimiento} className="col-md-6 col-lg-4">
                                <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                                    <div className="position-relative">
                                        <img
                                            src={property.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500'}
                                            alt={property.nombre}
                                            style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                                        />
                                        <span className={`badge position-absolute top-0 end-0 m-3 ${property.estado === 'activo' ? 'bg-success' : 'bg-secondary'}`}>
                                            {property.estado === 'activo' ? 'Activa' : 'Inactiva'}
                                        </span>
                                    </div>

                                    <div className="card-body p-3">
                                        <h5 className="fw-bold mb-2" style={{ color: '#CD5C5C' }}>
                                            {property.nombre}
                                        </h5>
                                        <p className="text-muted small mb-2 d-flex align-items-start gap-1">
                                            <MapPin size={14} className="mt-1 flex-shrink-0" />
                                            <span className="text-truncate">
                                                {formatearDireccion(property.direccion)}
                                            </span>
                                        </p>

                                        <div className="d-flex gap-3 mb-3 text-muted small">
                                            <span>
                                                <Users size={14} className="me-1" />
                                                {property.capacidad}
                                            </span>
                                            <span>
                                                <Bed size={14} className="me-1" />
                                                {property.habitaciones || 'N/A'}
                                            </span>
                                            <span>
                                                <Bath size={14} className="me-1" />
                                                {property.banos || 'N/A'}
                                            </span>
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <span className="fw-bold" style={{ color: '#CD5C5C', fontSize: '1.25rem' }}>
                                                ${property.precio_por_noche?.toLocaleString('es-MX')}
                                                <small className="text-muted" style={{ fontSize: '0.75rem' }}> /noche</small>
                                            </span>
                                        </div>

                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-sm btn-outline-secondary rounded-pill flex-grow-1"
                                                onClick={() => handleOpenDetails(property)}
                                            >
                                                Ver detalles
                                            </button>
                                            <button
                                                className="btn btn-sm rounded-pill"
                                                style={{ backgroundColor: '#CD5C5C', color: 'white' }}
                                                onClick={() => handleEditProperty(property.id_hosteleria)}
                                            >
                                                <Edit size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}