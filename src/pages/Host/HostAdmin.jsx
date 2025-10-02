import { useState } from 'react';
import { Home, Edit, Trash2, Eye, Plus, Search, Calendar, DollarSign, Users, MapPin, X } from 'lucide-react';

export default function HostAdmin() {
    const [properties, setProperties] = useState([
        {
            id: 1,
            name: "Casa acogedora en el centro",
            type: "Casa completa",
            location: "Arroyo Seco, Querétaro",
            price: 500,
            guests: 4,
            rooms: 2,
            baths: 1,
            status: "Activo",
            image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop"
        },
        {
            id: 2,
            name: "Cabaña con vista a la montaña",
            type: "Cabaña",
            location: "Sierra Gorda, Querétaro",
            price: 800,
            guests: 6,
            rooms: 3,
            baths: 2,
            status: "Activo",
            image: "https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?w=400&h=300&fit=crop"
        },
        {
            id: 3,
            name: "Departamento moderno centro histórico",
            type: "Departamento",
            location: "Centro, Querétaro",
            price: 650,
            guests: 3,
            rooms: 1,
            baths: 1,
            status: "Pausado",
            image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop"
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('view');
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        location: '',
        price: '',
        guests: '',
        rooms: '',
        baths: '',
        status: 'Activo'
    });

    const filteredProperties = properties.filter(prop => {
        const matchesSearch = prop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            prop.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || prop.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const openModal = (mode, property = null) => {
        setModalMode(mode);
        setSelectedProperty(property);
        if (property && mode === 'edit') {
            setFormData({
                name: property.name,
                type: property.type,
                location: property.location,
                price: property.price,
                guests: property.guests,
                rooms: property.rooms,
                baths: property.baths,
                status: property.status
            });
        } else if (mode === 'create') {
            setFormData({
                name: '',
                type: '',
                location: '',
                price: '',
                guests: '',
                rooms: '',
                baths: '',
                status: 'Activo'
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedProperty(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta propiedad?')) {
            setProperties(properties.filter(p => p.id !== id));
        }
    };

    const handleSubmit = () => {
        if (modalMode === 'create') {
            const newProperty = {
                ...formData,
                id: Math.max(...properties.map(p => p.id)) + 1,
                image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop"
            };
            setProperties([...properties, newProperty]);
        } else if (modalMode === 'edit') {
            setProperties(properties.map(p => 
                p.id === selectedProperty.id ? { ...p, ...formData } : p
            ));
        }
        closeModal();
    };

    const getStatusBadge = (status) => {
        const colors = {
            'Activo': 'success',
            'Pausado': 'warning',
            'Inactivo': 'secondary'
        };
        return colors[status] || 'secondary';
    };

    return (
        <>
            <style>{`
                .page-bg {
                    min-height: 100vh;
                    padding-top: 2rem;
                    padding-bottom: 3rem;
                }
                .stats-card {
                    background: white;
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
                    transition: all 0.3s ease;
                }
                .stats-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
                }
                .property-card {
                    background: white;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
                    transition: all 0.3s ease;
                }
                .property-card:hover {
                    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
                }
                .property-image {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                }
                .btn-action {
                    width: 36px;
                    height: 36px;
                    border-radius: 8px;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    cursor: pointer;
                }
                .btn-action:hover {
                    transform: scale(1.1);
                }
                .btn-view { background: #E0F2FE; color: #0369A1; }
                .btn-view:hover { background: #BAE6FD; }
                .btn-edit { background: #FEF3C7; color: #A16207; }
                .btn-edit:hover { background: #FDE68A; }
                .btn-delete { background: #FEE2E2; color: #B91C1C; }
                .btn-delete:hover { background: #FECACA; }
                .search-input {
                    border: 2px solid #E8E4E0;
                    border-radius: 12px;
                    padding: 0.75rem 1rem;
                    transition: all 0.3s ease;
                }
                .search-input:focus {
                    outline: none;
                    border-color: #CD5C5C;
                    box-shadow: 0 0 0 4px rgba(205,92,92,0.1);
                }
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1050;
                    animation: fadeIn 0.2s ease;
                }
                .modal-content-custom {
                    background: white;
                    border-radius: 20px;
                    max-width: 600px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    animation: slideUp 0.3s ease;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .form-control-custom {
                    border: 2px solid #E8E4E0;
                    border-radius: 10px;
                    padding: 0.75rem 1rem;
                    transition: all 0.3s ease;
                }
                .form-control-custom:focus {
                    outline: none;
                    border-color: #CD5C5C;
                    box-shadow: 0 0 0 4px rgba(205,92,92,0.1);
                }
            `}</style>

            <div className="page-bg" style={{marginTop: '100px'}}>
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                        <div>
                            <h1 className="fw-bold mb-2" style={{ color: '#1F2937' }}>Mis Propiedades</h1>
                            <p className="text-muted mb-0">Gestiona tus alojamientos y reservaciones</p>
                        </div>
                        <button
                            className="btn text-white fw-semibold px-4 py-3 rounded-3"
                            style={{ background: 'linear-gradient(135deg, #CD5C5C 0%, #B85252 100%)' }}
                            onClick={() => openModal('create')}
                        >
                            <Plus size={20} className="me-2" />
                            Nueva Propiedad
                        </button>
                    </div>

                    <div className="row g-3 mb-4">
                        <div className="col-md-3 col-sm-6">
                            <div className="stats-card">
                                <div className="d-flex align-items-center mb-2">
                                    <div className="p-2 rounded-circle me-3" style={{ background: '#E0F2FE' }}>
                                        <Home size={20} color="#0369A1" />
                                    </div>
                                    <div>
                                        <h6 className="text-muted small mb-0">Propiedades</h6>
                                        <h3 className="fw-bold mb-0">{properties.length}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                            <div className="stats-card">
                                <div className="d-flex align-items-center mb-2">
                                    <div className="p-2 rounded-circle me-3" style={{ background: '#D1FAE5' }}>
                                        <Calendar size={20} color="#059669" />
                                    </div>
                                    <div>
                                        <h6 className="text-muted small mb-0">Reservas</h6>
                                        <h3 className="fw-bold mb-0">12</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                            <div className="stats-card">
                                <div className="d-flex align-items-center mb-2">
                                    <div className="p-2 rounded-circle me-3" style={{ background: '#FEF3C7' }}>
                                        <DollarSign size={20} color="#A16207" />
                                    </div>
                                    <div>
                                        <h6 className="text-muted small mb-0">Ingresos</h6>
                                        <h3 className="fw-bold mb-0">$8,400</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6">
                            <div className="stats-card">
                                <div className="d-flex align-items-center mb-2">
                                    <div className="p-2 rounded-circle me-3" style={{ background: '#E9D5FF' }}>
                                        <Users size={20} color="#7C3AED" />
                                    </div>
                                    <div>
                                        <h6 className="text-muted small mb-0">Huéspedes</h6>
                                        <h3 className="fw-bold mb-0">34</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row g-3 mb-4">
                        <div className="col-md-8">
                            <div className="position-relative">
                                <Search className="position-absolute" style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} size={20} />
                                <input
                                    type="text"
                                    className="form-control search-input ps-5"
                                    placeholder="Buscar por nombre o ubicación..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <select
                                className="form-select search-input"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">Todos los estados</option>
                                <option value="Activo">Activo</option>
                                <option value="Pausado">Pausado</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>
                        </div>
                    </div>

                    <div className="row g-4">
                        {filteredProperties.map((property) => (
                            <div key={property.id} className="col-md-6 col-lg-4">
                                <div className="property-card">
                                    <img src={property.image} alt={property.name} className="property-image" />
                                    <div className="p-3">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h5 className="fw-bold mb-0" style={{ fontSize: '1.1rem' }}>{property.name}</h5>
                                            <span className={`badge bg-${getStatusBadge(property.status)} rounded-pill`}>
                                                {property.status}
                                            </span>
                                        </div>
                                        <div className="d-flex align-items-center text-muted mb-3">
                                            <MapPin size={14} className="me-1" />
                                            <small>{property.location}</small>
                                        </div>
                                        <div className="row g-2 mb-3">
                                            <div className="col-4">
                                                <small className="text-muted d-block">Tipo</small>
                                                <small className="fw-semibold">{property.type}</small>
                                            </div>
                                            <div className="col-4">
                                                <small className="text-muted d-block">Precio</small>
                                                <small className="fw-semibold">${property.price}/noche</small>
                                            </div>
                                            <div className="col-4">
                                                <small className="text-muted d-block">Capacidad</small>
                                                <small className="fw-semibold">{property.guests} personas</small>
                                            </div>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn-action btn-view"
                                                onClick={() => openModal('view', property)}
                                                title="Ver detalles"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                className="btn-action btn-edit"
                                                onClick={() => openModal('edit', property)}
                                                title="Editar"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                className="btn-action btn-delete"
                                                onClick={() => handleDelete(property.id)}
                                                title="Eliminar"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredProperties.length === 0 && (
                        <div className="text-center py-5">
                            <Home size={64} color="#9CA3AF" className="mb-3" />
                            <h5 className="text-muted">No se encontraron propiedades</h5>
                            <p className="text-muted">Intenta ajustar tus filtros de búsqueda</p>
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
                        <div className="p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4 className="fw-bold mb-0">
                                    {modalMode === 'view' && 'Detalles de la Propiedad'}
                                    {modalMode === 'edit' && 'Editar Propiedad'}
                                    {modalMode === 'create' && 'Nueva Propiedad'}
                                </h4>
                                <button
                                    className="btn btn-sm btn-light rounded-circle"
                                    style={{ width: '36px', height: '36px' }}
                                    onClick={closeModal}
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {modalMode === 'view' && selectedProperty && (
                                <div>
                                    <img src={selectedProperty.image} alt={selectedProperty.name} className="w-100 rounded-3 mb-3" style={{ height: '250px', objectFit: 'cover' }} />
                                    <h5 className="fw-bold mb-3">{selectedProperty.name}</h5>
                                    <div className="row g-3">
                                        <div className="col-6">
                                            <small className="text-muted d-block mb-1">Tipo</small>
                                            <p className="mb-0 fw-semibold">{selectedProperty.type}</p>
                                        </div>
                                        <div className="col-6">
                                            <small className="text-muted d-block mb-1">Ubicación</small>
                                            <p className="mb-0 fw-semibold">{selectedProperty.location}</p>
                                        </div>
                                        <div className="col-6">
                                            <small className="text-muted d-block mb-1">Precio por noche</small>
                                            <p className="mb-0 fw-semibold">${selectedProperty.price}</p>
                                        </div>
                                        <div className="col-6">
                                            <small className="text-muted d-block mb-1">Capacidad</small>
                                            <p className="mb-0 fw-semibold">{selectedProperty.guests} huéspedes</p>
                                        </div>
                                        <div className="col-4">
                                            <small className="text-muted d-block mb-1">Habitaciones</small>
                                            <p className="mb-0 fw-semibold">{selectedProperty.rooms}</p>
                                        </div>
                                        <div className="col-4">
                                            <small className="text-muted d-block mb-1">Baños</small>
                                            <p className="mb-0 fw-semibold">{selectedProperty.baths}</p>
                                        </div>
                                        <div className="col-4">
                                            <small className="text-muted d-block mb-1">Estado</small>
                                            <span className={`badge bg-${getStatusBadge(selectedProperty.status)}`}>
                                                {selectedProperty.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(modalMode === 'edit' || modalMode === 'create') && (
                                <div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Nombre</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-custom"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        />
                                    </div>
                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <label className="form-label fw-semibold">Tipo</label>
                                            <select
                                                className="form-select form-control-custom"
                                                value={formData.type}
                                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                            >
                                                <option value="">Seleccionar</option>
                                                <option>Casa completa</option>
                                                <option>Departamento</option>
                                                <option>Cabaña</option>
                                                <option>Habitación privada</option>
                                            </select>
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label fw-semibold">Estado</label>
                                            <select
                                                className="form-select form-control-custom"
                                                value={formData.status}
                                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                                            >
                                                <option>Activo</option>
                                                <option>Pausado</option>
                                                <option>Inactivo</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Ubicación</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-custom"
                                            value={formData.location}
                                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        />
                                    </div>
                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <label className="form-label fw-semibold">Precio/noche</label>
                                            <input
                                                type="number"
                                                className="form-control form-control-custom"
                                                value={formData.price}
                                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label fw-semibold">Huéspedes</label>
                                            <input
                                                type="number"
                                                className="form-control form-control-custom"
                                                value={formData.guests}
                                                onChange={(e) => setFormData({...formData, guests: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="row g-3 mb-4">
                                        <div className="col-6">
                                            <label className="form-label fw-semibold">Habitaciones</label>
                                            <input
                                                type="number"
                                                className="form-control form-control-custom"
                                                value={formData.rooms}
                                                onChange={(e) => setFormData({...formData, rooms: e.target.value})}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label fw-semibold">Baños</label>
                                            <input
                                                type="number"
                                                className="form-control form-control-custom"
                                                value={formData.baths}
                                                onChange={(e) => setFormData({...formData, baths: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-light flex-fill rounded-3 py-2" onClick={closeModal}>
                                            Cancelar
                                        </button>
                                        <button className="btn text-white flex-fill rounded-3 py-2" style={{ background: 'linear-gradient(135deg, #CD5C5C 0%, #B85252 100%)' }} onClick={handleSubmit}>
                                            {modalMode === 'create' ? 'Crear' : 'Guardar'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}