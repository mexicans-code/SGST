import React, { useState, useEffect } from 'react';
import { Home, Users, Building, FileText, Settings, ChevronLeft, ChevronRight, Menu, X, LogOut } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { GATEWAY_URL } from '../const/Const';

export default function DashboardSidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
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

    // Detectar tamaño de pantalla
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) {
                setIsCollapsed(false);
            }
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Cerrar sidebar móvil al cambiar de ruta
    useEffect(() => {
        if (isMobile) {
            setIsMobileOpen(false);
        }
    }, [location.pathname, isMobile]);

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

            const response = await fetch(`${GATEWAY_URL}/api/adminProfile/getProfile`, {
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
            localStorage.clear();
            sessionStorage.clear();
            console.log('Sesión cerrada - localStorage limpiado');
            navigate('/login', { replace: true });
            window.location.href = '/login';
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
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
        return `${user.nombre} ${user.apellido_p || ''}`.trim(); 
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
                 style={{ width: isCollapsed && !isMobile ? '80px' : '280px', minHeight: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <style>{`
                .sidebar-collapsed {
                    width: 80px !important;
                }
                
                .sidebar-expanded {
                    width: 280px !important;
                }
                
                .sidebar-item-text {
                    opacity: 1;
                    transition: opacity 0.2s ease;
                }
                
                .sidebar-collapsed .sidebar-item-text {
                    opacity: 0;
                    width: 0;
                    overflow: hidden;
                }
                
                .sidebar-collapsed .menu-section-title {
                    opacity: 0;
                    height: 0;
                    margin: 0;
                    overflow: hidden;
                }
                
                .sidebar-user-info {
                    transition: all 0.3s ease;
                }
                
                .sidebar-collapsed .sidebar-user-info {
                    opacity: 0;
                    width: 0;
                    overflow: hidden;
                }
                
                @media (max-width: 767.98px) {
                    .sidebar-container {
                        position: fixed !important;
                        left: -280px;
                        transition: left 0.3s ease;
                        z-index: 1050;
                    }
                    
                    .sidebar-container.mobile-open {
                        left: 0 !important;
                    }
                    
                    .sidebar-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.5);
                        z-index: 1040;
                    }
                    
                    .hamburger-btn {
                        position: fixed;
                        top: 1rem;
                        left: 1rem;
                        z-index: 1100;
                        background: white;
                        border: 1px solid #e0e0e0;
                        border-radius: 8px;
                        padding: 0.5rem;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    }
                }
            `}</style>

            {/* Hamburger Button - Solo móvil */}
            {isMobile && (
                <button
                    className="hamburger-btn btn"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            )}

            {/* Overlay para móvil */}
            {isMobile && isMobileOpen && (
                <div className="sidebar-overlay" onClick={() => setIsMobileOpen(false)} />
            )}

            {/* SIDEBAR */}
            <div 
                className={`sidebar-container bg-white d-flex flex-column shadow-sm ${
                    isCollapsed && !isMobile ? 'sidebar-collapsed' : 'sidebar-expanded'
                } ${isMobileOpen ? 'mobile-open' : ''}`}
                style={{ 
                    minHeight: '100vh', 
                    borderRight: '1px solid #e9ecef',
                    transition: 'all 0.3s ease',
                    position: isMobile ? 'fixed' : 'relative'
                }}
            >
                {/* Header con foto y toggle */}
                <div className="p-4 pb-3" style={{ borderBottom: '1px solid #e9ecef' }}>
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center flex-grow-1 overflow-hidden">
                            <div className="nav-profile-image position-relative me-3 flex-shrink-0">
                                {user.foto ? (
                                    <img
                                        src={user.foto}
                                        alt="profile"
                                        className="rounded-circle"
                                        style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div 
                                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                                        style={{ width: '48px', height: '48px', fontSize: '1.2rem' }}
                                    >
                                        {getInitials()}
                                    </div>
                                )}
                                <span className="position-absolute bg-success rounded-circle"
                                    style={{
                                        width: '12px',
                                        height: '12px',
                                        bottom: '0px',
                                        right: '0px',
                                        border: '2px solid white'
                                    }}></span>
                            </div>
                            <div className="nav-profile-text d-flex flex-column flex-grow-1 overflow-hidden sidebar-user-info">
                                <span className="fw-bold text-dark mb-0 text-truncate" style={{ fontSize: '0.95rem', lineHeight: '1.3' }}>
                                    {user.nombre || 'Usuario'}
                                </span>
                                <span className="text-muted text-truncate" style={{ fontSize: '0.8rem' }}>
                                    {getRolDisplay()}
                                </span>
                            </div>
                        </div>

                        {/* Botón colapsar - Solo desktop */}
                        {!isMobile && (
                            <button
                                className="btn btn-link p-1 ms-2 flex-shrink-0"
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                style={{ color: '#667eea', minWidth: 'auto' }}
                                aria-label={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
                                title={isCollapsed ? 'Expandir' : 'Colapsar'}
                            >
                                {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                            </button>
                        )}
                    </div>
                </div>

                {/* Navigation Menu */}
                <div className="flex-grow-1 px-3 py-3">
                    <div className="mb-3">
                        <h6 className="text-muted text-uppercase fw-semibold mb-3 px-2 menu-section-title" 
                            style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
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
                                                    fontSize: '0.9rem',
                                                    justifyContent: isCollapsed && !isMobile ? 'center' : 'flex-start'
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
                                                title={isCollapsed && !isMobile ? item.name : ''}
                                            >
                                                <IconComponent
                                                    size={20}
                                                    className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-primary'} ${
                                                        !isCollapsed || isMobile ? 'me-3' : ''
                                                    }`}
                                                />
                                                <span className="fw-medium sidebar-item-text">{item.name}</span>
                                                {isActive && (!isCollapsed || isMobile) && (
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

                {/* Footer con perfil y logout */}
                <div className="p-3 mt-auto" style={{ borderTop: '1px solid #e9ecef' }}>
                    {isCollapsed && !isMobile ? (
                        // Versión colapsada - Solo botón de logout
                        <div className="d-flex flex-column align-items-center">
                            <button
                                onClick={handleLogout}
                                className="btn btn-light border-0 p-2 rounded-3 w-100"
                                style={{ boxShadow: 'none', transition: 'all 0.2s ease' }}
                                title="Cerrar sesión"
                            >
                                <LogOut size={20} className="text-danger" />
                            </button>
                        </div>
                    ) : (
                        // Versión expandida - Perfil completo con dropdown
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
                                        }}
                                    />
                                ) : (
                                    <div 
                                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                                        style={{ width: '42px', height: '42px', fontSize: '1rem' }}
                                    >
                                        {getInitials()}
                                    </div>
                                )}
                            </div>
                            <div className="flex-grow-1 overflow-hidden me-2">
                                <div className="text-dark fw-semibold text-truncate" style={{ fontSize: '0.9rem', lineHeight: '1.3' }}>
                                    {getFullName() || 'Usuario'}
                                </div>
                                <small className="text-muted fw-medium d-block text-truncate" style={{ fontSize: '0.75rem' }}>
                                    {getRolDisplay()}
                                </small>
                            </div>
                            <div className="dropdown flex-shrink-0">
                                <button 
                                    className="btn btn-light border-0 p-2 rounded-3" 
                                    data-bs-toggle="dropdown"
                                    style={{ boxShadow: 'none', transition: 'all 0.2s ease' }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#e9ecef'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-muted">
                                        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                                    </svg>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2"
                                    style={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                                    <li>
                                        <Link className="dropdown-item py-2 px-3 rounded-2" to="/dashboard/profile">
                                            <Settings size={16} className="me-2" />
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
                                            <LogOut size={16} className="me-2" />
                                            <span className="fw-medium">Cerrar Sesión</span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
