import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, MapPin, Package, Globe, User, Menu, Sun, Moon } from 'lucide-react';

export default function Navbar({ darkMode, setDarkMode }) {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const navigate = useNavigate();
    const userMenuRef = useRef(null);

    const navItems = [
        { name: 'Alojamientos', icon: MapPin, link: '/' },
        { name: 'Experiencias', icon: Star, link: '/experiencias' },
        { name: 'Aventuras', icon: Heart, link: '/aventuras' },
        { name: 'Paquetes', icon: Package, link: '/paquetes' },
    ];

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('bg-dark', 'text-light');
            document.body.classList.remove('bg-light', 'text-dark');
        } else {
            document.body.classList.add('bg-light', 'text-dark');
            document.body.classList.remove('bg-dark', 'text-light');
        }
    }, [darkMode]);

    // Cierra el menú de usuario si se da clic afuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const linkColor = darkMode ? '#E5E7EB' : '#374151';
    const hoverBg = darkMode ? '#374151' : '#FEE2E2';
    const hoverColor = darkMode ? '#F87171' : '#B91C1C';
    const dropdownBg = darkMode ? '#1f2937' : '#fff';
    const dropdownColor = darkMode ? '#E5E7EB' : '#374151';
    const btnBg = darkMode ? '#374151' : '#f8f9fa';
    const btnBorder = darkMode ? '#4b5563' : '#d1d5db';

    return (
        <nav
            className={`navbar navbar-expand-lg fixed-top w-100 shadow-sm ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light'}`}
            style={{
                zIndex: 1000,
                backdropFilter: 'blur(10px)',
                background: darkMode ? 'rgba(33,33,33,0.95)' : 'rgba(255,255,255,0.95)',
            }}
        >
            <div className="container d-flex justify-content-between align-items-center">
                {/* Logo */}
                <a
                    className={`navbar-brand fw-bold d-flex align-items-center ${darkMode ? 'text-white' : 'text-danger'}`}
                    onClick={() => navigate("/")}
                    style={{ cursor: 'pointer' }}
                >
                    <img
                        className="rounded-circle"
                        src="https://blogger.googleusercontent.com/img/a/AVvXsEhjjv5anKGHGaRt5CNdVF8Hz9RdIHor9kmWhQwXqnJcHaOHhGEt4XyvIOymsgqvwJiJZCjkE15JavstMTSSnwD1meWD1ZW5dD6QTfDxkDiIJfS2MzP8E1XqzmmAqnSGwHjeab-B4tf5KI62qs8gLuYLOVzMam_veip1vVIvkPzZNccw1iuA1cNqeO6klNw"
                        alt="Logo"
                        style={{ width: '200px', height: '70px', objectFit: 'cover' }}
                    />
                </a>

                {/* Botón mobile */}
                <button
                    className="navbar-toggler border-0"
                    type="button"
                    aria-expanded={isNavOpen}
                    onClick={() => setIsNavOpen(!isNavOpen)}
                >
                    <Menu size={24} color={darkMode ? '#fff' : '#000'} />
                </button>

                {/* Links principales */}
                <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`}>
                    <ul className="navbar-nav mx-auto d-flex flex-wrap justify-content-center gap-2 mb-2 mb-lg-0">
                        {navItems.map((item) => (
                            <li className="nav-item" key={item.name}>
                                <span
                                    role="button"
                                    className="nav-link d-flex align-items-center gap-1 px-3 py-2 rounded-3 transition-all"
                                    style={{ color: linkColor, cursor: 'pointer' }}
                                    onClick={() => navigate(item.link)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = hoverBg;
                                        e.currentTarget.style.color = hoverColor;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = linkColor;
                                    }}
                                >
                                    <item.icon size={16} color={linkColor} /> {item.name}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* Botones derecha */}
                    <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0">
                        {/* Botón darkmode */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="btn d-flex justify-content-center align-items-center rounded-circle border shadow-sm"
                            style={{
                                width: '36px',
                                height: '36px',
                                backgroundColor: btnBg,
                                borderColor: btnBorder,
                                padding: 0,
                            }}
                        >
                            {darkMode ? <Sun size={18} color="#fff" /> : <Moon size={18} color="#374151" />}
                        </button>

                        {/* Dropdown usuario */}
                        <div className="dropdown" ref={userMenuRef}>
                            <button
                                className="btn rounded-pill d-flex align-items-center px-3 py-2 shadow-sm gap-2"
                                style={{
                                    backgroundColor: btnBg,
                                    border: `1px solid ${btnBorder}`,
                                    color: '#000000ff',
                                }}
                                type="button"
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            >
                                <Menu size={16} color="#000000ff" />
                                <div
                                    className="rounded-circle d-flex justify-content-center align-items-center"
                                    style={{ width: '28px', height: '28px', backgroundColor: '#6B7280' }}
                                >
                                    <User size={14} color="#fff" />
                                </div>
                            </button>

                            {isUserMenuOpen && (
                                <ul
                                    className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 mt-2 show"
                                    style={{ backgroundColor: dropdownBg, color: dropdownColor, left: '50%', transform: 'translateX(-50%)   ' }}
                                >
                                    <li>
                                        <button
                                            className="dropdown-item d-flex align-items-center gap-2 py-2"
                                            style={{ color: dropdownColor }}
                                            onClick={() => navigate("/register")}
                                        >
                                            <User size={16} color={dropdownColor} /> Registrarse
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            className="dropdown-item d-flex align-items-center gap-2 py-2"
                                            style={{ color: dropdownColor }}
                                            onClick={() => navigate("/login")}
                                        >
                                            <User size={16} color={dropdownColor} /> Iniciar sesión
                                        </button>
                                    </li>
                                    <li><hr className="dropdown-divider " style={{ borderColor: darkMode ? '#374151' : '#dee2e6'  }} /></li>
                                    <li><span className="dropdown-item d-flex align-items-center gap-2 py-2"><Heart size={16} color={dropdownColor} /> Pon tu espacio en Airbnb</span></li>
                                    <li><span className="dropdown-item d-flex align-items-center gap-2 py-2"><Star size={16} color={dropdownColor} /> Organiza una experiencia</span></li>
                                    <li><span className="dropdown-item d-flex align-items-center gap-2 py-2"><Globe size={16} color={dropdownColor} /> Centro de ayuda</span></li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
