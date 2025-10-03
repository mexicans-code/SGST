import React, { useState, useEffect } from 'react';
import { Home, Users, Building, FileText, Settings } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

export default function DashboardSidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        nombre: '',
        apellido_p: '',
        apellido_m: '',
        email: '',
        rol: '',
        telefono: '',
        direccion: '',
        foto: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarDatosUsuario();
    }, []);

    const cargarDatosUsuario = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch('http://localhost:3000/api/adminProfile/getProfile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const data = await response.json();
            
            if (data.success) {
                setUser(data.data);
            } else {
                console.error('Error cargando perfil:', data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        try {
            // Limpiar todos los datos de sesión
            localStorage.clear(); // Esto elimina TODO del localStorage
            sessionStorage.clear();
            
            console.log('Sesión cerrada - localStorage limpiado');
            
            // Redirigir al login
            navigate('/login', { replace: true });
            
            // Forzar recarga de la página para asegurar que se limpie todo
            window.location.href = '/login';
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            // Intentar de todas formas
            window.location.href = '/login';
        }
    };

    const getInitials = () => {
        if (!user.nombre) return 'U';
        const firstInitial = user.nombre.charAt(0).toUpperCase();
        const lastInitial = user.apellido_p ? user.apellido_p.charAt(0).toUpperCase() : '';
        return firstInitial + lastInitial;
    };

    const getFullName = () => {
        return `${user.nombre}`.trim(); 
    };

    const getRolDisplay = () => {
        const roles = {
            'admin': 'Administrador',
            'user': 'Usuario',
            'moderator': 'Moderador'
        };
        return roles[user.rol] || user.rol;
    };

    const menuItems = [
        { name: 'Dashboard', icon: Home, href: '/dashboard' },
        { name: 'Gestión de usuarios', icon: Users, href: '/dashboard/users' },
        { name: 'Gestión de hospedajes', icon: Building, href: '/dashboard/hospitality' },
        { name: 'Gestión de reservas', icon: FileText, href: '/dashboard/bookings' },
    ];

    if (loading) {
        return (
            <div className="bg-white d-flex align-items-center justify-content-center" 
                 style={{ width: '280px', minHeight: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white d-flex flex-column shadow-sm" style={{ width: '280px', minHeight: '100vh', borderRight: '1px solid #e9ecef' }}>
            {/* Header */}
            <div className="p-4 pb-3">
                <div className="d-flex align-items-center">
                    <div className="nav-profile-image position-relative me-3 flex-shrink-0">
                        {user.foto ? (
                            <img
                                src={user.foto}
                                alt="profile"
                                className="rounded-circle"
                                style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                        ) : null}
                        <span className="position-absolute bg-success rounded-circle"
                            style={{
                                width: '12px',
                                height: '12px',
                                bottom: '0px',
                                right: '0px',
                                border: '2px solid white'
                            }}></span>
                    </div>
                    <div className="nav-profile-text d-flex flex-column flex-grow-1 overflow-hidden">
                        <span className="fw-bold text-dark mb-0 text-truncate" style={{ fontSize: '0.95rem', lineHeight: '1.3' }}>
                            {user.nombre || 'Usuario'}
                        </span>
                        <span className="text-muted text-truncate" style={{ fontSize: '0.8rem' }}>
                            {getRolDisplay()}
                        </span>
                    </div>
                    <div className="text-success flex-shrink-0 ms-2">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5C19,3.89 18.1,3 17,3Z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <div className="flex-grow-1 px-3 py-2">
                <div className="mb-3">
                    <h6 className="text-muted text-uppercase fw-semibold mb-3 px-2 " style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                        MENU PRINCIPAL
                    </h6>
                    <nav>
                        <ul className="list-unstyled m-0">
                            {menuItems.map((item) => {
                                const IconComponent = item.icon;
                                const isActive = location.pathname === item.href;

                                return (
                                    <li key={item.name} className="mb-1">
                                        <Link
                                            to={item.href}
                                            className={`d-flex align-items-center px-3 py-2 rounded-3 text-decoration-none position-relative ${
                                                isActive ? 'bg-primary text-white' : 'text-dark'
                                            }`}
                                            style={{
                                                transition: 'all 0.2s ease',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!isActive) {
                                                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isActive) {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                }
                                            }}
                                        >
                                            <IconComponent
                                                size={18}
                                                className={`me-3 flex-shrink-0 ${isActive ? 'text-white' : 'text-primary'}`}
                                            />
                                            <span className="fw-medium">{item.name}</span>
                                            {isActive && (
                                                <div className="ms-auto">
                                                    <div className="rounded-circle bg-white bg-opacity-25"
                                                        style={{ width: '6px', height: '6px' }}></div>
                                                </div>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>
            </div>

            <div className="p-3 mt-auto" style={{ borderTop: '1px solid #e9ecef' }}>
                <div className="d-flex align-items-center">
                    <div className="position-relative me-3 flex-shrink-0">
                        {user.foto ? (
                            <img
                                src={user.foto}
                                alt="profile"
                                className="rounded-circle"
                                style={{ width: '42px', height: '42px', objectFit: 'cover' }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                        ) : null}

                    </div>
                    <div className="flex-grow-1 overflow-hidden me-2">
                        <div className="text-dark fw-semibold text-truncate" style={{ fontSize: '0.9rem', lineHeight: '1.3' }}>
                            {getFullName() || 'Usuario'}
                        </div>
                        <small className="text-muted fw-medium d-block text-truncate" style={{ fontSize: '0.75rem' }}>{getRolDisplay()}</small>
                    </div>
                    <div className="dropdown flex-shrink-0">
                        <button className="btn btn-light border-0 p-2 rounded-3" data-bs-toggle="dropdown"
                            style={{ boxShadow: 'none', transition: 'all 0.2s ease' }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#e9ecef'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#f8f9fa'}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-muted">
                                <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                            </svg>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2"
                            style={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                            <li>
                                <Link className="dropdown-item py-2 px-3 rounded-2" to="/dashboard/profile">
                                    <span className="fw-medium">Perfil</span>
                                </Link>
                            </li>
                            <li><hr className="dropdown-divider my-2" /></li>
                            <li>
                                <button 
                                    className="dropdown-item py-2 px-3 rounded-2 text-danger w-100 text-start border-0 bg-transparent"
                                    onClick={handleLogout}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <span className="fw-medium">Cerrar Sesión</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}