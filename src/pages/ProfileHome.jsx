import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GATEWAY_URL } from "../const/Const";


export default function Profile() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [formData, setFormData] = useState({
        id_usuario: '',
        nombre: '',
        apellido_p: '',
        apellido_m: '',
        email: '',
        password: '',
        rol: '',
        telefono: '',
        direccion: '',
        foto: ''
    });

    useEffect(() => {
        cargarDatosUsuario();
    }, []);

    const cargarDatosUsuario = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${GATEWAY_URL}/api/adminProfile/getProfile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                setFormData({
                    ...data.data,
                    password: ''
                });
            }
        } catch (error) {
            showNotification('Error al cargar datos del perfil', 'error');
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nombre?.trim()) newErrors.nombre = "El nombre es requerido";
        if (!formData.email?.trim()) newErrors.email = "El email es requerido";
        if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido";
        if (formData.password && formData.password.length < 6) {
            newErrors.password = "Mínimo 6 caracteres";
        }
        if (formData.telefono && !/^\d{10}$/.test(formData.telefono.replace(/\D/g, ''))) {
            newErrors.telefono = "Formato inválido";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const updateData = {
                nombre: formData.nombre,
                apellido_p: formData.apellido_p,
                apellido_m: formData.apellido_m,
                email: formData.email,
                telefono: formData.telefono,
                direccion: formData.direccion,
                foto: formData.foto
            };

            if (formData.password) {
                updateData.password = formData.password;
            }

            const response = await fetch(`${GATEWAY_URL}/api/adminProfile/updateProfile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });

            const data = await response.json();

            if (data.success) {
                showNotification('Perfil actualizado correctamente', 'success');
                setFormData({ ...formData, password: '' });
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            showNotification('Error al actualizar el perfil', 'error');
        } finally {
            setLoading(false);
        }
    };

    const formatTelefono = (value) => {
        const cleaned = value.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        return match ? `${match[1]}-${match[2]}-${match[3]}` : value;
    };

    const handleTelefonoChange = (e) => {
        setFormData({ ...formData, telefono: formatTelefono(e.target.value) });
    };

    const handleVerPropiedades = () => {
        if (formData.rol === 'anfitrion') {
            navigate('/host/admin');
        } else {
            showNotification('Debes ser anfitrión para ver propiedades', 'error');
        }
    };

    const handleVerPublicaciones = () => {
        navigate('/host/publications');
    };
    const handleVerReservas = () => {
        navigate('/user/reservations');
    };

    return (
        <>
            <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css" rel="stylesheet" />

            <div style={{ minHeight: '100vh', backgroundColor: '#fafafa', padding: '2rem 0', marginTop: '2rem' }}>
                {notification.show && (
                    <div
                        className="position-fixed top-0 end-0 m-4"
                        style={{ zIndex: 9999, minWidth: '320px' }}
                    >
                        <div
                            className="alert alert-dismissible fade show shadow-sm border-0"
                            style={{
                                backgroundColor: notification.type === 'success' ? '#d4edda' : '#f8d7da',
                                color: notification.type === 'success' ? '#155724' : '#721c24'
                            }}
                        >
                            <i className={`bi bi-${notification.type === 'success' ? 'check-circle-fill' : 'exclamation-circle-fill'} me-2`}></i>
                            {notification.message}
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setNotification({ show: false, message: '', type: '' })}
                            ></button>
                        </div>
                    </div>
                )}

                <div className="container mt-5 mb-5">
                    <div className="row">
                        <div className="col-12">
                            <div className="mb-4">
                                <h1 className="h3 fw-bold mb-1" style={{ color: '#2c3e50' }}>
                                    Configuración del perfil
                                </h1>
                                <p className="text-muted mb-0">Administra tu información personal y preferencias</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="row g-4">
                            <div className="col-lg-4">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-body p-4">
                                        <h6 className="fw-semibold mb-4" style={{ color: '#2c3e50' }}>
                                            Foto de perfil
                                        </h6>
                                        <div className="text-center">
                                            <div className="position-relative d-inline-block mb-3">
                                                <img
                                                    src={formData.foto || 'https://ui-avatars.com/api/?name=Usuario&size=200&background=CD5C5C&color=fff'}
                                                    alt="Foto de perfil"
                                                    className="rounded-circle"
                                                    style={{
                                                        width: '160px',
                                                        height: '160px',
                                                        objectFit: 'cover',
                                                        border: '4px solid #f8f9fa',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                                <div
                                                    className="position-absolute bottom-0 end-0 text-white rounded-circle d-flex align-items-center justify-content-center"
                                                    style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        cursor: 'pointer',
                                                        backgroundColor: '#CD5C5C',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                                    }}
                                                >
                                                    <i className="bi bi-camera"></i>
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <input
                                                    type="url"
                                                    className="form-control form-control-sm"
                                                    name="foto"
                                                    value={formData.foto}
                                                    onChange={handleChange}
                                                    placeholder="URL de la imagen"
                                                    style={{
                                                        borderColor: '#e0e0e0',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    onFocus={(e) => e.target.style.borderColor = '#CD5C5C'}
                                                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                                                />
                                                <small className="text-muted d-block mt-2">
                                                    Ingresa la URL de tu foto de perfil
                                                </small>
                                            </div>

                                            {formData.rol === 'anfitrion' && (
                                                <div>
                                                <button
                                                    type="button"
                                                    className="btn w-100 text-white fw-semibold"
                                                    style={{
                                                        backgroundColor: '#CD5C5C',
                                                        border: 'none',
                                                        padding: '12px',
                                                        transition: 'all 0.3s ease',
                                                        boxShadow: '0 2px 8px rgba(205, 92, 92, 0.3)'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.backgroundColor = '#b54848';
                                                        e.target.style.transform = 'translateY(-2px)';
                                                        e.target.style.boxShadow = '0 4px 12px rgba(205, 92, 92, 0.4)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor = '#CD5C5C';
                                                        e.target.style.transform = 'translateY(0)';
                                                        e.target.style.boxShadow = '0 2px 8px rgba(205, 92, 92, 0.3)';
                                                    }}
                                                    onClick={handleVerPropiedades}
                                                >
                                                    <i className="bi bi-house-door me-2"></i>
                                                    Reservas Recibidas
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn w-100 text-white fw-semibold mt-5"
                                                    style={{
                                                        backgroundColor: '#4682B4',
                                                        border: 'none',
                                                        padding: '12px',
                                                        transition: 'all 0.3s ease',
                                                        boxShadow: '0 2px 8px rgba(70, 130, 180, 0.3)'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.backgroundColor = '#35648f';
                                                        e.target.style.transform = 'translateY(-2px)';
                                                        e.target.style.boxShadow = '0 4px 12px rgba(70, 130, 180, 0.4)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor = '#4682B4';
                                                        e.target.style.transform = 'translateY(0)';
                                                        e.target.style.boxShadow = '0 2px 8px rgba(70, 130, 180, 0.3)';
                                                    }}
                                                    onClick={handleVerPublicaciones}
                                                >
                                                    <i className="bi bi-house-door me-2"></i>
                                                    Mis Publicaciones
                                                </button>

                                                </div>
                                            )}

                                            {formData.rol === 'usuario' && (
                                                <button
                                                    type="button"
                                                    className="btn w-100 text-white fw-semibold"
                                                    style={{
                                                        backgroundColor: '#4682B4',
                                                        border: 'none',
                                                        padding: '12px',
                                                        transition: 'all 0.3s ease',
                                                        boxShadow: '0 2px 8px rgba(70, 130, 180, 0.3)'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.backgroundColor = '#35648f';
                                                        e.target.style.transform = 'translateY(-2px)';
                                                        e.target.style.boxShadow = '0 4px 12px rgba(70, 130, 180, 0.4)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor = '#4682B4';
                                                        e.target.style.transform = 'translateY(0)';
                                                        e.target.style.boxShadow = '0 2px 8px rgba(70, 130, 180, 0.3)';
                                                    }}
                                                    onClick={handleVerReservas}
                                                >
                                                    <i className="bi bi-calendar-check me-2"></i>
                                                    Ver mis reservas
                                                </button>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-8">
                                <div className="card border-0 shadow-sm">
                                    <div className="card-body p-4">
                                        <h6 className="fw-semibold mb-4" style={{ color: '#2c3e50' }}>
                                            Información personal
                                        </h6>

                                        <div className="row g-3 mb-4">
                                            <div className="col-md-4">
                                                <label className="form-label fw-medium small" style={{ color: '#495057' }}>
                                                    Nombre *
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                                                    name="nombre"
                                                    value={formData.nombre}
                                                    onChange={handleChange}
                                                    style={{
                                                        borderColor: errors.nombre ? '#dc3545' : '#e0e0e0',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    onFocus={(e) => !errors.nombre && (e.target.style.borderColor = '#CD5C5C')}
                                                    onBlur={(e) => !errors.nombre && (e.target.style.borderColor = '#e0e0e0')}
                                                />
                                                {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label fw-medium small" style={{ color: '#495057' }}>
                                                    Apellido Paterno
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="apellido_p"
                                                    value={formData.apellido_p}
                                                    onChange={handleChange}
                                                    style={{ borderColor: '#e0e0e0', transition: 'all 0.3s ease' }}
                                                    onFocus={(e) => e.target.style.borderColor = '#CD5C5C'}
                                                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label fw-medium small" style={{ color: '#495057' }}>
                                                    Apellido Materno
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="apellido_m"
                                                    value={formData.apellido_m}
                                                    onChange={handleChange}
                                                    style={{ borderColor: '#e0e0e0', transition: 'all 0.3s ease' }}
                                                    onFocus={(e) => e.target.style.borderColor = '#CD5C5C'}
                                                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                                                />
                                            </div>
                                        </div>

                                        <div className="row g-3 mb-4">
                                            <div className="col-md-6">
                                                <label className="form-label fw-medium small" style={{ color: '#495057' }}>
                                                    Correo electrónico *
                                                </label>
                                                <div className="input-group">
                                                    <span className="input-group-text" style={{
                                                        backgroundColor: '#f8f9fa',
                                                        borderColor: '#e0e0e0',
                                                        color: '#6c757d'
                                                    }}>
                                                        <i className="bi bi-envelope"></i>
                                                    </span>
                                                    <input
                                                        type="email"
                                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        style={{
                                                            borderColor: errors.email ? '#dc3545' : '#e0e0e0',
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                        onFocus={(e) => !errors.email && (e.target.style.borderColor = '#CD5C5C')}
                                                        onBlur={(e) => !errors.email && (e.target.style.borderColor = '#e0e0e0')}
                                                    />
                                                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-medium small" style={{ color: '#495057' }}>
                                                    Teléfono
                                                </label>
                                                <div className="input-group">
                                                    <span className="input-group-text" style={{
                                                        backgroundColor: '#f8f9fa',
                                                        borderColor: '#e0e0e0',
                                                        color: '#6c757d'
                                                    }}>
                                                        <i className="bi bi-telephone"></i>
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                                                        name="telefono"
                                                        value={formData.telefono}
                                                        onChange={handleTelefonoChange}
                                                        placeholder="442-123-4567"
                                                        maxLength="12"
                                                        style={{
                                                            borderColor: errors.telefono ? '#dc3545' : '#e0e0e0',
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                        onFocus={(e) => !errors.telefono && (e.target.style.borderColor = '#CD5C5C')}
                                                        onBlur={(e) => !errors.telefono && (e.target.style.borderColor = '#e0e0e0')}
                                                    />
                                                    {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-medium small" style={{ color: '#495057' }}>
                                                Dirección
                                            </label>
                                            <div className="input-group">
                                                <span className="input-group-text" style={{
                                                    backgroundColor: '#f8f9fa',
                                                    borderColor: '#e0e0e0',
                                                    color: '#6c757d'
                                                }}>
                                                    <i className="bi bi-geo-alt"></i>
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="direccion"
                                                    value={formData.direccion}
                                                    onChange={handleChange}
                                                    placeholder="Calle, número, colonia, ciudad"
                                                    style={{ borderColor: '#e0e0e0', transition: 'all 0.3s ease' }}
                                                    onFocus={(e) => e.target.style.borderColor = '#CD5C5C'}
                                                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                                                />
                                            </div>
                                        </div>

                                        <hr className="my-4" style={{ borderColor: '#e9ecef' }} />

                                        <h6 className="fw-semibold mb-4" style={{ color: '#2c3e50' }}>
                                            Seguridad
                                        </h6>

                                        <div className="row g-3 mb-4">
                                            <div className="col-md-6">
                                                <label className="form-label fw-medium small" style={{ color: '#495057' }}>
                                                    Nueva contraseña
                                                </label>
                                                <div className="input-group">
                                                    <span className="input-group-text" style={{
                                                        backgroundColor: '#f8f9fa',
                                                        borderColor: '#e0e0e0',
                                                        color: '#6c757d'
                                                    }}>
                                                        <i className="bi bi-lock"></i>
                                                    </span>
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        placeholder="Dejar vacío para no cambiar"
                                                        style={{
                                                            borderColor: errors.password ? '#dc3545' : '#e0e0e0',
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                        onFocus={(e) => !errors.password && (e.target.style.borderColor = '#CD5C5C')}
                                                        onBlur={(e) => !errors.password && (e.target.style.borderColor = '#e0e0e0')}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn"
                                                        style={{
                                                            borderColor: '#e0e0e0',
                                                            color: '#6c757d',
                                                            backgroundColor: '#f8f9fa'
                                                        }}
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                                                    </button>
                                                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                                </div>
                                                <small className="text-muted">Mínimo 6 caracteres</small>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-medium small" style={{ color: '#495057' }}>
                                                    Rol
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={formData.rol}
                                                    disabled
                                                    style={{
                                                        backgroundColor: '#f8f9fa',
                                                        borderColor: '#e0e0e0',
                                                        color: '#6c757d'
                                                    }}
                                                />
                                                <small className="text-muted">Este campo no se puede modificar</small>
                                            </div>
                                        </div>

                                        <div className="d-flex gap-3 justify-content-end pt-3 border-top" style={{ borderColor: '#e9ecef' }}>
                                            <button
                                                type="button"
                                                className="btn fw-semibold"
                                                disabled={loading}
                                                onClick={() => cargarDatosUsuario()}
                                                style={{
                                                    borderColor: '#e0e0e0',
                                                    color: '#6c757d',
                                                    backgroundColor: 'white',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.backgroundColor = '#f8f9fa';
                                                    e.target.style.borderColor = '#CD5C5C';
                                                    e.target.style.color = '#CD5C5C';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.backgroundColor = 'white';
                                                    e.target.style.borderColor = '#e0e0e0';
                                                    e.target.style.color = '#6c757d';
                                                }}
                                            >
                                                <i className="bi bi-arrow-counterclockwise me-2"></i>
                                                Restablecer
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn text-white fw-semibold"
                                                disabled={loading}
                                                style={{
                                                    backgroundColor: '#CD5C5C',
                                                    border: 'none',
                                                    transition: 'all 0.3s ease',
                                                    boxShadow: '0 2px 8px rgba(205, 92, 92, 0.3)'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.backgroundColor = '#b54848';
                                                    e.target.style.transform = 'translateY(-2px)';
                                                    e.target.style.boxShadow = '0 4px 12px rgba(205, 92, 92, 0.4)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.backgroundColor = '#CD5C5C';
                                                    e.target.style.transform = 'translateY(0)';
                                                    e.target.style.boxShadow = '0 2px 8px rgba(205, 92, 92, 0.3)';
                                                }}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                        Guardando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="bi bi-check-lg me-2"></i>
                                                        Guardar cambios
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}