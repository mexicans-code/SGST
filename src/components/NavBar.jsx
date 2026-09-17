import { useState } from 'react';
import { Menu, Sun, Moon, Heart } from 'lucide-react';
import logo from '../assets/logo.jpg';

const NAV_ITEMS = [
  { name: 'Inicio', target: 'inicio' },
  { name: 'Alojamientos', target: 'alojamientos' },
  { name: 'Experiencias', target: 'experiencias' },
];

export default function Navbar({ darkMode, setDarkMode }) {
    const [isNavOpen, setIsNavOpen] = useState(false);

    const scrollTo = (target) => {
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        setIsNavOpen(false);
    };

    const linkColor = darkMode ? '#E5E7EB' : '#374151';
    const hoverBg = darkMode ? '#374151' : '#FEE2E2';
    const hoverColor = darkMode ? '#F87171' : '#B91C1C';
    const btnBg = darkMode ? '#374151' : '#f8f9fa';
    const btnBorder = darkMode ? '#4b5563' : '#d1d5db';

    return (
        <nav
            className={`navbar navbar-expand-lg fixed-top w-100 shadow-sm ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light'}`}
            style={{
                zIndex: 1000,
                backdropFilter: 'blur(10px)',
                background: darkMode ? 'rgba(33,33,33,0.95)' : 'rgb(255, 255, 255)',
            }}
        >
            <div className="container d-flex justify-content-between align-items-center">
                <a
                    className={`navbar-brand fw-bold d-flex align-items-center ${darkMode ? 'text-white' : 'text-danger'}`}
                    onClick={() => scrollTo('inicio')}
                    style={{ cursor: 'pointer' }}
                >
                    <img
                        src={logo}
                        alt="Logo"
                        style={{ width: '200px', height: '60px', objectFit: 'cover' }}
                    />
                </a>

                <button
                    className="navbar-toggler border-0"
                    type="button"
                    aria-expanded={isNavOpen}
                    onClick={() => setIsNavOpen(!isNavOpen)}
                >
                    <Menu size={24} color={darkMode ? '#fff' : '#000'} />
                </button>

                <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`}>
                    <ul className="navbar-nav mx-auto d-flex flex-wrap justify-content-center gap-2 mb-2 mb-lg-0">
                        {NAV_ITEMS.map((item) => (
                            <li className="nav-item" key={item.name}>
                                <span
                                    role="button"
                                    className="nav-link d-flex align-items-center gap-1 px-3 py-2 rounded-3"
                                    style={{ color: linkColor, cursor: 'pointer' }}
                                    onClick={() => scrollTo(item.target)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = hoverBg;
                                        e.currentTarget.style.color = hoverColor;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = linkColor;
                                    }}
                                >
                                    {item.name}
                                </span>
                            </li>
                        ))}
                    </ul>

                    <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0">
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

                        <a
                            className="btn rounded-pill d-flex align-items-center px-3 py-2 shadow-sm gap-2 fw-semibold"
                            style={{
                                backgroundColor: 'rgb(85, 107, 47)',
                                border: 'none',
                                color: '#ffffff',
                            }}
                            href="#experiencias"
                            onClick={() => setIsNavOpen(false)}
                        >
                            <Heart size={16} color="#fff" />
                            Explorar
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}