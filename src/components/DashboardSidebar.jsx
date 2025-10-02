import React, { useState } from 'react';
import { Home, Users, Building, FileText, Settings } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function DashboardSidebar() {
    const [activeItem, setActiveItem] = useState('Dashboard');

    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', icon: Home, href: '/dashboard' },
        { name: 'Gestión de usuarios', icon: Users, href: '/dashboard/users' },
        { name: 'Gestión de hospedajes', icon: Building, href: '/dashboard/hospitality' },
        { name: 'Gestión de reservas', icon: FileText, href: '/dashboard/bookings' },
        { name: 'Gestión de Reportes', icon: FileText, href: '/dashboard/reports' },
        { name: 'Gestión de Perfil', icon: Settings, href: '/dashboard/profile' },
    ];

    return (
        <div className="bg-white d-flex flex-column shadow-sm" style={{ width: '280px', minHeight: '100vh', borderRight: '1px solid #e9ecef' }}>
            {/* Header */}
            <div className="p-4">
                <div className="d-flex align-items-center">
                    <div className="nav-profile-image position-relative me-3">
                        <img
                            src="https://lh3.googleusercontent.com/a/ACg8ocL-OMXGn9z4-K8MRTfQMYNxRnACxg_EqNaBbabUhai6mz83DSk=s83-c-mo"
                            alt="profile"
                            className="rounded-3"
                            style={{ width: '44px', height: '44px', objectFit: 'cover' }}
                        />
                        <span className="position-absolute bg-success rounded-circle"
                            style={{
                                width: '12px',
                                height: '12px',
                                bottom: '2px',
                                right: '2px',
                                border: '2px solid white'
                            }}></span>
                    </div>
                    <div className="nav-profile-text d-flex flex-column flex-grow-1">
                        <span className="fw-bold text-dark mb-1">Ricardo Medina</span>
                        <span className="text-muted" style={{ fontSize: '0.85rem' }}>Project Manager</span>
                    </div>
                    <div className="text-success">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5C19,3.89 18.1,3 17,3Z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <div className="flex-grow-1 p-4 pt-">
                <div className="mb-4">
                    <h6 className="text-muted text-uppercase fw-semibold mb-3" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                        Menu Principal
                    </h6>
                    <nav>
                        <ul className="list-unstyled">
                            {menuItems.map((item) => {
                                const IconComponent = item.icon;
                                const isActive = location.pathname === item.href;

                                return (
                                    <li key={item.name} className="mb-1">
                                        <Link
                                            to={item.href}
                                            className={`d-flex align-items-center p-3 rounded-3 text-decoration-none position-relative ${isActive
                                                    ? 'bg-primary text-white shadow-sm'
                                                    : 'text-dark'
                                                }`}
                                            style={{
                                                transition: 'all 0.3s ease',
                                                cursor: 'pointer',
                                                fontSize: '0.95rem'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!isActive) {
                                                    e.target.style.backgroundColor = '#f8f9fa';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isActive) {
                                                    e.target.style.backgroundColor = 'transparent';
                                                }
                                            }}
                                        >
                                            <IconComponent
                                                size={20}
                                                className={`me-3 ${isActive ? 'text-white' : 'text-primary'}`}
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

            {/* User Profile Footer */}
            <div className="p-4" style={{ borderTop: '1px solid #e9ecef' }}>
                <div className="d-flex align-items-center">
                    <div className="rounded-3 bg-success d-flex align-items-center justify-content-center me-3"
                        style={{ width: '44px', height: '44px' }}>
                        <span className="text-white fw-bold">RM</span>
                    </div>
                    <div className="flex-grow-1">
                        <div className="text-dark fw-semibold" style={{ fontSize: '0.95rem' }}>Ricardo Medina</div>
                        <small className="text-muted fw-medium">Administrator</small>
                    </div>
                    <div className="dropdown">
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
                            <li><a className="dropdown-item py-2 px-3 rounded-2" href="/dashboard/profile">
                                <span className="fw-medium">Perfil</span>
                            </a></li>
                            <li><hr className="dropdown-divider my-2" /></li>
                            <li><a className="dropdown-item py-2 px-3 rounded-2 text-danger" href="#">
                                <span className="fw-medium">Cerrar Sesión</span>
                            </a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}