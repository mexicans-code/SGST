import { useState } from "react";

export default function ProfileAdmin() {
    const [formData, setFormData] = useState({
        // Datos de Usuario
        id_usuario: 1,
        nombre: "Juan Pérez",
        email: "juanperez@email.com",
        password: "",
        rol: "Usuario",
        fecha_registro: "2025-09-27",

        // Datos de Perfil
        id_perfil: 1,
        telefono: "4421234567",
        direccion: "Av. Universidad 123, Querétaro",
        foto: "https://lh3.googleusercontent.com/a/ACg8ocL-OMXGn9z4-K8MRTfQMYNxRnACxg_EqNaBbabUhai6mz83DSk=s83-c-mo"
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [notification, setNotification] = useState('');

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido";
        if (!formData.email.trim()) newErrors.email = "El email es requerido";
        if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido";
        if (formData.password && formData.password.length < 6) {
            newErrors.password = "La contraseña debe tener al menos 6 caracteres";
        }
        if (formData.telefono && !/^\d{10}$/.test(formData.telefono.replace(/\D/g, ''))) {
            newErrors.telefono = "Teléfono debe tener 10 dígitos";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        setTimeout(() => {
            console.log("Datos guardados:", formData);
            setLoading(false);
            setNotification('✅ Datos actualizados con éxito');

            setTimeout(() => {
                setNotification('');
            }, 3000);
        }, 1500);
    };

    const formatTelefono = (value) => {
        const cleaned = value.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`;
        }
        return value;
    };

    const handleTelefonoChange = (e) => {
        const formatted = formatTelefono(e.target.value);
        setFormData({ ...formData, telefono: formatted });
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center py-4" style={{
            backgroundColor: '#f8fafc',
            fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif'
        }}>
            {/* Notificación */}
            {notification && (
                <div 
                    className="position-fixed top-0 start-50 translate-middle-x mt-4 px-4 py-3 rounded-pill shadow-lg animate-fade-in"
                    style={{ 
                        zIndex: 9999,
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                    }}
                >
                    {notification}
                </div>
            )}

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-11 col-md-10 col-lg-10 col-xl-9 col-xxl-8">
                        <div 
                            className="card border-0 shadow-sm"
                            style={{
                                borderRadius: '16px',
                                background: '#ffffff'
                            }}
                        >
                            <div 
                                className="text-white p-5 text-center position-relative overflow-hidden"
                                style={{
                                    borderRadius: '16px 16px 0 0'
                                }}
                            >
                                <div className="position-relative">
                                    <h2 className="mb-2 fw-bold text-dark">Editar Perfil</h2>
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="text-center mb-5">
                                    <div className="position-relative d-inline-block">
                                        <div 
                                            className="position-relative overflow-hidden"
                                            style={{
                                                width: '120px',
                                                height: '120px',
                                                borderRadius: '50%',
                                                background: '#e5e7eb',
                                                padding: '3px'
                                            }}
                                        >
                                            <img
                                                src={formData.foto}
                                                alt="Foto perfil"
                                                className="w-100 h-100 rounded-circle"
                                                style={{ objectFit: "cover" }}
                                            />
                                        </div>
                                        <div 
                                            className="position-absolute bottom-0 end-0 d-flex align-items-center justify-content-center text-white shadow-lg"
                                            style={{
                                                width: '36px',
                                                height: '36px',
                                                backgroundColor: '#374151',
                                                borderRadius: '50%',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                                            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                        >
                                            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <input
                                            type="url"
                                            className="form-control text-center border-2 border-light rounded-3 px-4"
                                            name="foto"
                                            value={formData.foto}
                                            onChange={handleChange}
                                            placeholder="URL de la foto de perfil"
                                            style={{ 
                                                maxWidth: '450px', 
                                                margin: '0 auto',
                                                fontSize: '0.9rem',
                                                backgroundColor: '#f9fafb'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Información Básica */}
                                    <div className="mb-5">
                                        <div className="d-flex align-items-center mb-4">
                                            <div 
                                                className="d-flex align-items-center justify-content-center text-white me-3"
                                                style={{
                                                    width: '44px',
                                                    height: '44px',
                                                    backgroundColor: '#3b82f6',
                                                    borderRadius: '12px'
                                                }}
                                            >
                                                <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                                </svg>
                                            </div>
                                            <h4 className="mb-0 fw-bold" style={{ color: '#1f2937' }}>Información Básica</h4>
                                        </div>

                                        <div className="row g-4">
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold mb-2" style={{ color: '#374151' }}>
                                                    Nombre Completo <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control border-2 rounded-3 px-4 py-3 ${errors.nombre ? 'is-invalid border-danger' : 'border-light'}`}
                                                    name="nombre"
                                                    value={formData.nombre}
                                                    onChange={handleChange}
                                                    style={{ 
                                                        fontSize: '1rem',
                                                        transition: 'all 0.3s ease',
                                                        backgroundColor: '#f9fafb'
                                                    }}
                                                    required
                                                />
                                                {errors.nombre && <div className="invalid-feedback fw-medium">{errors.nombre}</div>}
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold mb-2" style={{ color: '#374151' }}>
                                                    Correo Electrónico <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    className={`form-control border-2 rounded-3 px-4 py-3 ${errors.email ? 'is-invalid border-danger' : 'border-light'}`}
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    style={{ 
                                                        fontSize: '1rem',
                                                        transition: 'all 0.3s ease',
                                                        backgroundColor: '#f9fafb'
                                                    }}
                                                    required
                                                />
                                                {errors.email && <div className="invalid-feedback fw-medium">{errors.email}</div>}
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold mb-2" style={{ color: '#374151' }}>
                                                    Nueva Contraseña
                                                </label>
                                                <div className="input-group">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        className={`form-control border-2 rounded-start-3 px-4 py-3 ${errors.password ? 'is-invalid border-danger' : 'border-light'}`}
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        placeholder="Dejar vacío para mantener actual"
                                                        style={{ 
                                                            fontSize: '1rem',
                                                            backgroundColor: '#f9fafb'
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn border-2 border-start-0 border-light rounded-end-3 px-4"
                                                        style={{ backgroundColor: '#f9fafb' }}
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        <span style={{ fontSize: '1.2rem' }}>
                                                            {showPassword ? '🙈' : '👁️'}
                                                        </span>
                                                    </button>
                                                </div>
                                                {errors.password && <div className="invalid-feedback d-block fw-medium">{errors.password}</div>}
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold mb-2" style={{ color: '#374151' }}>
                                                    Rol de Usuario
                                                </label>
                                                <select
                                                    className="form-select border-2 border-light rounded-3 px-4 py-3"
                                                    name="rol"
                                                    value={formData.rol}
                                                    onChange={handleChange}
                                                    style={{ 
                                                        fontSize: '1rem',
                                                        backgroundColor: '#f9fafb'
                                                    }}
                                                >
                                                    <option value="Usuario">👤 Usuario</option>
                                                    <option value="Admin">⚡ Administrador</option>
                                                    <option value="Moderador">🛡️ Moderador</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Información de Contacto */}
                                    <div className="mb-5">
                                        <div className="d-flex align-items-center mb-4">
                                            <div 
                                                className="d-flex align-items-center justify-content-center text-white me-3"
                                                style={{
                                                    width: '44px',
                                                    height: '44px',
                                                    backgroundColor: '#10b981',
                                                    borderRadius: '12px'
                                                }}
                                            >
                                                <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                                </svg>
                                            </div>
                                            <h4 className="mb-0 fw-bold" style={{ color: '#1f2937' }}>Información de Contacto</h4>
                                        </div>

                                        <div className="row g-4">
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold mb-2" style={{ color: '#374151' }}>
                                                    Teléfono
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control border-2 rounded-3 px-4 py-3 ${errors.telefono ? 'is-invalid border-danger' : 'border-light'}`}
                                                    name="telefono"
                                                    value={formData.telefono}
                                                    onChange={handleTelefonoChange}
                                                    placeholder="442-123-4567"
                                                    maxLength="12"
                                                    style={{ 
                                                        fontSize: '1rem',
                                                        backgroundColor: '#f9fafb'
                                                    }}
                                                />
                                                {errors.telefono && <div className="invalid-feedback fw-medium">{errors.telefono}</div>}
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold mb-2" style={{ color: '#374151' }}>
                                                    Dirección
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control border-2 border-light rounded-3 px-4 py-3"
                                                    name="direccion"
                                                    value={formData.direccion}
                                                    onChange={handleChange}
                                                    placeholder="Calle, número, colonia, ciudad"
                                                    style={{ 
                                                        fontSize: '1rem',
                                                        backgroundColor: '#f9fafb'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botones de Acción */}
                                    <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center pt-4">
                                        <button
                                            type="button"
                                            className="btn btn-lg px-5 py-3 rounded-3 fw-semibold"
                                            style={{
                                                backgroundColor: '#f3f4f6',
                                                border: '2px solid #e5e7eb',
                                                color: '#6b7280',
                                                transition: 'all 0.3s ease'
                                            }}
                                            disabled={loading}
                            onMouseOver={(e) => {
                                                e.target.style.backgroundColor = '#e5e7eb';
                                                e.target.style.borderColor = '#d1d5db';
                                            }}
                                            onMouseOut={(e) => {
                                                e.target.style.backgroundColor = '#f3f4f6';
                                                e.target.style.borderColor = '#e5e7eb';
                                            }}
                                        >
                                            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" className="me-2">
                                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                            </svg>
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-lg px-5 py-3 rounded-3 fw-semibold text-white border-0 shadow-sm"
                                            style={{
                                                backgroundColor: '#1f2937',
                                                transition: 'all 0.3s ease'
                                            }}
                                            disabled={loading}
                                            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                                            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="spinner-border spinner-border-sm me-2" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                    Guardando...
                                                </>
                                            ) : (
                                                <>
                                                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" className="me-2">
                                                        <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
                                                    </svg>
                                                    Guardar Cambios
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Estilos CSS mejorados */}
            <style jsx>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    100% { transform: translateY(-20px); }
                }
                
                @keyframes fade-in {
                    0% { 
                        opacity: 0; 
                        transform: translateX(-50%) translateY(-20px); 
                    }
                    100% { 
                        opacity: 1; 
                        transform: translateX(-50%) translateY(0); 
                    }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out;
                }
                
                .form-control:focus,
                .form-select:focus {
                    border-color: #3b82f6 !important;
                    box-shadow: 0 0 0 0.25rem rgba(59, 130, 246, 0.15) !important;
                    background-color: #ffffff !important;
                }
                
                .form-control:hover,
                .form-select:hover {
                    border-color: #9ca3af !important;
                    background-color: #ffffff !important;
                }
                
                .btn:disabled {
                    transform: none !important;
                    opacity: 0.7;
                }
                
                .spinner-border-sm {
                    width: 1rem;
                    height: 1rem;
                }
                
                .card {
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
                }
                
                .input-group .form-control:focus {
                    z-index: 3;
                }
                
                /* Mejorar la apariencia en dispositivos móviles */
                @media (max-width: 768px) {
                    .card {
                        margin: 1rem;
                        border-radius: 20px !important;
                    }
                    
                    .p-5 {
                        padding: 2rem !important;
                    }
                    
                    h2 {
                        font-size: 1.5rem !important;
                    }
                    
                    h4 {
                        font-size: 1.25rem !important;
                    }
                }
            `}</style>
        </div>
    );
}