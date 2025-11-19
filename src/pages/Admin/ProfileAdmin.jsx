import { useState, useEffect } from "react";
import { GATEWAY_URL } from '../../const/Const';


export default function ProfileAdmin() {
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

    return (
        <>
            <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css" rel="stylesheet" />
            
            <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', padding: '2rem 0' }}>
                {notification.show && (
                    <div 
                        className="position-fixed top-0 end-0 m-4"
                        style={{ zIndex: 9999, minWidth: '320px' }}
                    >
                        <div className={`alert alert-${notification.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show shadow-sm`}>
                            <i className={`bi bi-${notification.type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2`}></i>
                            {notification.message}
                            <button type="button" className="btn-close" onClick={() => setNotification({ show: false, message: '', type: '' })}></button>
                        </div>
                    </div>
                )}

                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="mb-4">
                                <h1 className="h3 fw-bold text-dark mb-1">Configuración del perfil</h1>
                                <p className="text-muted mb-0">Administra tu información personal y preferencias</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="row g-4">
                            {/* Columna Izquierda - Foto */}
                            <div className="col-lg-4">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-body p-4">
                                        <h6 className="fw-semibold mb-4">Foto de perfil</h6>
                                        <div className="text-center">
                                            <div className="position-relative d-inline-block mb-3">
                                                <img
                                                    src={formData.foto || 'https://ui-avatars.com/api/?name=Usuario&size=200&background=f8f9fa&color=6c757d'}
                                                    alt="Foto de perfil"
                                                    className="rounded-circle border"
                                                    style={{ width: '160px', height: '160px', objectFit: 'cover' }}
                                                />
                                                <div 
                                                    className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                                    style={{ width: '40px', height: '40px', cursor: 'pointer' }}
                                                >
                                                    <i className="bi bi-camera"></i>
                                                </div>
                                            </div>
                                            <div>
                                                <input
                                                    type="url"
                                                    className="form-control form-control-sm"
                                                    name="foto"
                                                    value={formData.foto}
                                                    onChange={handleChange}
                                                    placeholder="URL de la imagen"
                                                />
                                                <small className="text-muted d-block mt-2">
                                                    Ingresa la URL de tu foto de perfil
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Columna Derecha - Formulario */}
                            <div className="col-lg-8">
                                <div className="card border-0 shadow-sm">
                                    <div className="card-body p-4">
                                        <h6 className="fw-semibold mb-4">Información personal</h6>
                                        
                                        <div className="row g-3 mb-4">
                                            <div className="col-md-4">
                                                <label className="form-label fw-medium small">Nombre *</label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                                                    name="nombre"
                                                    value={formData.nombre}
                                                    onChange={handleChange}
                                                />
                                                {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label fw-medium small">Apellido Paterno</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="apellido_p"
                                                    value={formData.apellido_p}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label fw-medium small">Apellido Materno</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="apellido_m"
                                                    value={formData.apellido_m}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="row g-3 mb-4">
                                            <div className="col-md-6">
                                                <label className="form-label fw-medium small">Correo electrónico *</label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-white">
                                                        <i className="bi bi-envelope"></i>
                                                    </span>
                                                    <input
                                                        type="email"
                                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-medium small">Teléfono</label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-white">
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
                                                    />
                                                    {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-medium small">Dirección</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-white">
                                                    <i className="bi bi-geo-alt"></i>
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="direccion"
                                                    value={formData.direccion}
                                                    onChange={handleChange}
                                                    placeholder="Calle, número, colonia, ciudad"
                                                />
                                            </div>
                                        </div>

                                        <hr className="my-4" />

                                        <h6 className="fw-semibold mb-4">Seguridad</h6>
                                        
                                        <div className="row g-3 mb-4">
                                            <div className="col-md-6">
                                                <label className="form-label fw-medium small">Nueva contraseña</label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-white">
                                                        <i className="bi bi-lock"></i>
                                                    </span>
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        placeholder="Dejar vacío para no cambiar"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                                                    </button>
                                                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                                </div>
                                                <small className="text-muted">Mínimo 6 caracteres</small>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-medium small">Rol</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={formData.rol}
                                                    disabled
                                                    style={{ backgroundColor: '#f8f9fa' }}
                                                />
                                                <small className="text-muted">Este campo no se puede modificar</small>
                                            </div>
                                        </div>

                                        <div className="d-flex gap-3 justify-content-end pt-3 border-top">
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                disabled={loading}
                                                onClick={() => cargarDatosUsuario()}
                                            >
                                                <i className="bi bi-arrow-counterclockwise me-2"></i>
                                                Restablecer
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                disabled={loading}
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