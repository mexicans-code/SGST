import { useEffect, useState } from 'react';
import {
  Github,
  Mail,
  MapPin,
  Phone,
  ExternalLink,
  ArrowDown,
  Code2,
  Rocket,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Building2,
  Globe,
  ShoppingCart,
  Users,
  CalendarDays,
  MessageSquare,
  CreditCard,
} from 'lucide-react';

const PROFILE = {
  name: "Ricardo Medina Hernández",
  role: "Desarrollador Full-Stack",
  location: "Querétaro, Qro.",
  email: "2023171035@uteq.edu.mx",
  phone: "442 819 6428",
  summary:
    "Ingeniero en Desarrollo y Gestión de Software Multiplataforma, con más de 1 año de experiencia liderando el desarrollo full-stack de aplicaciones web y móviles (React, Node.js, MongoDB/Supabase). Enfocado en construir soluciones completas de extremo a extremo, desde la arquitectura hasta la implementación.",
};

const PROJECTS = [
  {
    id: "sgst",
    title: "Arroyo Seco · SGST",
    subtitle: "Plataforma de Turismo y Reservas",
    description:
      "Plataforma tipo Airbnb para el Pueblo Mágico de Arroyo Seco y la Sierra Gorda de Querétaro. Conecta viajeros con alojamientos, experiencias y guías locales en una sola aplicación.",
    image:
      "https://queretaro.travel/wp-content/uploads/2022/02/DJI_0480.jpg",
    tags: ["React", "Node.js", "Express", "MongoDB", "Mercado Pago", "Socket.io", "Bootstrap"],
    features: [
      { icon: Building2, text: "Búsqueda y reserva de alojamientos" },
      { icon: CompassIcon, text: "Experiencias turísticas y guías locales" },
      { icon: MessageSquare, text: "Chat en tiempo real entre huésped y anfitrión" },
      { icon: CreditCard, text: "Pasarela de pagos Mercado Pago" },
      { icon: CalendarDays, text: "Gestión de reservas y reseñas" },
      { icon: Users, text: "Dashboards de administrador y anfitrión" },
    ],
    external: "https://mexicans-code.github.io/SGST/",
    internal: "/app",
    cta: "Explorar la plataforma",
    accent: "#8fb34a",
  },
  {
    id: "dematiq",
    title: "Dematiq Store",
    subtitle: "Plataforma de E-commerce",
    description:
      "Tienda en línea para productos de automatización industrial y controladores de DEMATIQ. Catálogo de productos con carrito, checkout y procesamiento de pagos en línea.",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=60",
    tags: ["React", "Node.js", "Supabase", "Mercado Pago", "Stripe", "Tailwind"],
    features: [
      { icon: ShoppingCart, text: "Catálogo de productos y carrito de compras" },
      { icon: CreditCard, text: "Checkout con Mercado Pago y Stripe" },
      { icon: Users, text: "Gestión de pedidos y usuarios" },
      { icon: Rocket, text: "Demo lista para vender en línea" },
    ],
    external: "https://tienda.dematiq.com.mx/",
    internal: null,
    cta: "Visitar la tienda",
    accent: "#38bdf8",
  },
];

function CompassIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

const EXPERIENCE = [
  {
    period: "May 2026 — Ago 2026",
    company: "Dematiq",
    title: "Desarrollador E-commerce · Líder de proyecto",
    bullets: [
      "Lideré el desarrollo de una plataforma de e-commerce para productos de automatización y controladores, usando React, Node.js y Supabase.",
      "Coordiné la integración de la pasarela de pagos de Mercado Pago para el procesamiento de transacciones en línea.",
    ],
  },
  {
    period: "Ene 2026 — Abr 2026",
    company: "UTEQ",
    title: "Desarrollador de App de Rutas Interactivas",
    bullets: [
      "Desarrollé una app móvil de geolocalización para guiar a estudiantes por los edificios y áreas de la universidad.",
      "Implementé rutas dinámicas hacia maestros, direcciones y áreas administrativas con Google Maps API.",
      "Integré visualización de caminos y puntos de interés con JavaScript y React Native.",
    ],
  },
  {
    period: "Ago 2025 — Dic 2025",
    company: "Proyecto Académico",
    title: "Líder de Proyecto · Plataforma de Reservas de Alojamiento",
    bullets: [
      "Lideré el desarrollo de una plataforma de reservas de alojamiento estilo Airbnb con React, Node.js y MongoDB.",
      "Coordiné búsqueda de alojamientos, reservas, mapas, pagos simulados, reseñas y chat entre el equipo.",
    ],
  },
  {
    period: "Sep 2024 — Dic 2024",
    company: "Proyecto IoT · UTEQ Admisiones",
    title: "Desarrollador Full-Stack",
    bullets: [
      "Diseñé e implementé un servidor local en Raspberry Pi para el sistema de admisiones universitarias.",
      "Desarrollé una interfaz web con acceso por código QR para registrar datos de admisión (HTML, MySQL, JS, React).",
      "Contribuí a la digitalización del proceso, reduciendo el uso de formularios en papel.",
    ],
  },
];

const SKILLS = [
  {
    title: "Lenguajes",
    items: ["JavaScript", "PHP", "SQL", "Java"],
  },
  {
    title: "Frameworks y herramientas",
    items: [
      "React",
      "React Native",
      "Angular",
      "Spring Boot",
      "Node.js",
      "Express.js",
      "MySQL",
      "Firebase",
      "MongoDB",
      "Supabase",
    ],
  },
];

const EDUCATION = [
  {
    place: "Universidad Tecnológica de Querétaro (UTEQ)",
    period: "Mayo 2026",
    degree: "Ingeniería en Desarrollo y Gestión de Software Multiplataforma",
    extra: "Título previo: TSU en Desarrollo y Gestión de Software Multiplataforma",
  },
  {
    place: "Colegio de Bachilleres del Estado de Querétaro",
    period: "Agosto 2022",
    degree: "Técnico en Tecnología de la Información y la Comunicación",
  },
];

const roles = [
  "Desarrollador Full-Stack",
  "Líder de Proyecto",
  "Especialista en React & Node.js",
  "Creador de soluciones end-to-end",
];

export default function Portfolio() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setRoleIndex((i) => (i + 1) % roles.length), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="portfolio">
      <style>{`
        .portfolio {
          --bg: #070b09;
          --bg-soft: #0c1310;
          --card: rgba(255, 255, 255, 0.03);
          --border: rgba(255, 255, 255, 0.08);
          --text: #e8f0ea;
          --muted: #9db0a3;
          --accent: #34d399;
          --accent-2: #8fb34a;
          --accent-blue: #38bdf8;
          position: relative;
          background: var(--bg);
          color: var(--text);
          font-family: 'Inter', 'Montserrat', sans-serif;
          overflow-x: hidden;
        }
        .portfolio .pf-wrap { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        .portfolio h1, .portfolio h2, .portfolio h3, .portfolio .pf-brand {
          font-family: 'Poppins', 'Montserrat', sans-serif;
        }
        .portfolio a { text-decoration: none; }

        /* NAV */
        .pf-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 50;
          backdrop-filter: blur(14px);
          background: rgba(7, 11, 9, 0.75);
          border-bottom: 1px solid var(--border);
          transition: all .3s ease;
        }
        .pf-nav.scrolled { background: rgba(7, 11, 9, 0.92); }
        .pf-brand { font-weight: 700; letter-spacing: .2px; }
        .pf-brand span { color: var(--accent); }
        .pf-nav-link {
          color: var(--muted); font-weight: 500; font-size: .92rem;
          transition: color .2s; padding: 6px 10px; border-radius: 8px;
        }
        .pf-nav-link:hover { color: var(--text); }
        .pf-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 20px; border-radius: 12px; font-weight: 600;
          font-size: .95rem; border: none; cursor: pointer;
          transition: transform .2s, box-shadow .2s, background .2s;
          font-family: 'Poppins', sans-serif;
        }
        .pf-btn-green {
          background: linear-gradient(135deg, var(--accent), var(--accent-2));
          color: #070b09;
        }
        .pf-btn-green:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(52, 211, 153, .3); }
        .pf-btn-ghost {
          background: transparent; color: var(--text);
          border: 1px solid var(--border);
        }
        .pf-btn-ghost:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-2px); }

        /* HERO */
        .pf-hero {
          min-height: 100vh; display: flex; align-items: center;
          position: relative; padding: 120px 0 80px;
        }
        .pf-hero::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(600px 400px at 80% 15%, rgba(143, 179, 74, .18), transparent 65%),
            radial-gradient(700px 500px at 15% 80%, rgba(52, 211, 153, .14), transparent 65%),
            radial-gradient(500px 400px at 50% 110%, rgba(56, 189, 248, .08), transparent 70%);
        }
        .pf-grid-bg {
          position: absolute; inset: 0; pointer-events: none; opacity: .5;
          background-image:
            linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px);
          background-size: 52px 52px;
          -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%);
                  mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%);
        }
        .pf-avatar {
          width: 96px; height: 96px; border-radius: 24px;
          display: flex; align-items: center; justify-content: center;
          font-size: 2.4rem; font-weight: 700; color: #070b09;
          background: linear-gradient(135deg, var(--accent), var(--accent-2));
          box-shadow: 0 12px 40px rgba(52, 211, 153, .3);
          font-family: 'Poppins', sans-serif;
        }
        .pf-role {
          font-family: 'Poppins', sans-serif; font-weight: 600;
          background: linear-gradient(90deg, var(--accent), var(--accent-2), var(--accent-blue));
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
        }
        .pf-hero-title {
          font-size: clamp(2.4rem, 6vw, 4rem); font-weight: 700; line-height: 1.08;
        }
        .typo-cursor { animation: blink 1s step-end infinite; color: var(--accent); }
        @keyframes blink { 50% { opacity: 0; } }

        /* SECTION COMMON */
        .pf-section { padding: 96px 0; position: relative; }
        .pf-section-title { font-size: 1.1rem; font-weight: 600; color: var(--accent); letter-spacing: 2px; text-transform: uppercase; }
        .pf-section-heading { font-size: clamp(1.8rem, 3.4vw, 2.6rem); font-weight: 700; }
        [data-reveal] {
          opacity: 0;
          animation: pfFadeUp .8s ease forwards;
        }
        @keyframes pfFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: none; }
        }

        /* CARDS */
        .pf-card {
          background: var(--card); border: 1px solid var(--border);
          border-radius: 20px; backdrop-filter: blur(8px);
        }

        /* PROJECTS */
        .pf-project {
          border-radius: 24px; overflow: hidden; background: var(--card);
          border: 1px solid var(--border); transition: transform .3s, box-shadow .3s, border-color .3s;
        }
        .pf-project:hover { transform: translateY(-6px); box-shadow: 0 30px 60px rgba(0,0,0,.4); border-color: rgba(52,211,153,.35); }
        .pf-project-img { height: 240px; background-size: cover; background-position: center; position: relative; }
        .pf-project-img::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 30%, #0b110e 100%);
        }
        .pf-badge { font-size: .72rem; font-weight: 600; padding: 4px 10px; border-radius: 999px; background: rgba(0,0,0,.5); border: 1px solid rgba(255,255,255,.15); color: #eef; }
        .pf-follow { display: inline-flex; align-items: center; gap: 6px; font-size: .82rem; color: var(--muted); }
        .pf-tag { font-size: .76rem; padding: 5px 10px; border-radius: 8px; background: rgba(255,255,255,.05); border: 1px solid var(--border); color: var(--muted); }
        .pf-feature { display: flex; gap: 10px; align-items: flex-start; color: var(--muted); font-size: .9rem; }
        .pf-feature svg { flex-shrink: 0; margin-top: 3px; color: var(--accent); }

        /* TIMELINE */
        .pf-timeline { position: relative; padding-left: 32px; }
        .pf-timeline::before {
          content: ''; position: absolute; left: 8px; top: 6px; bottom: 6px; width: 2px;
          background: linear-gradient(180deg, var(--accent), var(--accent-2), transparent);
        }
        .pf-timeline-item { position: relative; margin-bottom: 36px; }
        .pf-timeline-item::before {
          content: ''; position: absolute; left: -31px; top: 6px; width: 12px; height: 12px;
          border-radius: 50%; background: var(--bg); border: 3px solid var(--accent);
          box-shadow: 0 0 0 4px rgba(52,211,153,.15);
        }
        .pf-company { color: var(--accent); font-weight: 600; }

        /* SKILLS */
        .pf-skill-chip {
          display: inline-flex; align-items: center; gap: 7px; padding: 8px 14px; font-size: .86rem;
          border-radius: 10px; background: var(--card); border: 1px solid var(--border);
          color: var(--muted); transition: .2s;
        }
        .pf-skill-chip:hover { border-color: var(--accent); color: var(--text); transform: translateY(-2px); }

        /* CONTACT */
        .pf-contact-item {
          display: flex; align-items: center; gap: 14px; padding: 18px; border-radius: 16px;
          background: var(--card); border: 1px solid var(--border); transition: .2s;
        }
        .pf-contact-item:hover { border-color: var(--accent); transform: translateY(-2px); }
        .pf-contact-icon {
          width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(52,211,153,.12); color: var(--accent);
        }

        .pf-divider { height: 1px; background: var(--border); }

        .pf-link-inline { color: var(--accent); font-weight: 500; }
        .pf-link-inline:hover { color: var(--accent-2); }

        @media (max-width: 768px) {
          .pf-section { padding: 72px 0; }
        }
      `}</style>

      {/* NAV */}
      <nav className={`pf-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="pf-wrap d-flex align-items-center justify-content-between py-3">
          <a href="#inicio" className="pf-brand">RM<span>.</span>dev</a>
          <div className="d-none d-md-flex align-items-center gap-1">
            <a className="pf-nav-link" href="#sobre-mi">Sobre mí</a>
            <a className="pf-nav-link" href="#proyectos">Proyectos</a>
            <a className="pf-nav-link" href="#experiencia">Experiencia</a>
            <a className="pf-nav-link" href="#habilidades">Habilidades</a>
            <a className="pf-nav-link" href="#contacto">Contacto</a>
          </div>
          <a className="pf-btn pf-btn-green" style={{ padding: '8px 16px', fontSize: '.86rem' }} href="/app" target="_blank" rel="noreferrer">
            App SGST <ExternalLink size={14} />
          </a>
        </div>
      </nav>

      {/* HERO */}
      <header id="inicio" className="pf-hero">
        <div className="pf-grid-bg" />
        <div className="pf-wrap position-relative w-100">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div data-reveal="hero1">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="pf-avatar">RM</div>
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <MapPin size={15} className="text-muted" />
                      <span style={{ color: 'var(--muted)' }}>{PROFILE.location}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <Sparkles size={15} style={{ color: 'var(--accent)' }} />
                      <span style={{ color: 'var(--muted)' }}>Disponible para proyectos</span>
                    </div>
                  </div>
                </div>

                <h1 className="pf-hero-title mb-3">
                  Hola, soy <span className="pf-role">Ricardo Medina</span>
                </h1>

                <p className="mb-4" style={{ fontSize: '1.15rem', color: 'var(--muted)' }}>
                  <span className="pf-role" style={{ fontSize: '1.35rem' }}>{roles[roleIndex]}</span>
                  <span className="typo-cursor">|</span>
                  <br />
                  <span className="d-inline-block mt-2">
                    Construyo plataformas web y móviles de extremo a extremo: arquitectura, producto e implementación.
                  </span>
                </p>

                <div className="d-flex flex-wrap gap-3 mt-4">
                  <a className="pf-btn pf-btn-green" href="#proyectos">
                    <Rocket size={17} /> Ver mis proyectos
                  </a>
                  <a className="pf-btn pf-btn-ghost" href="#contacto">
                    <Mail size={17} /> Contáctame
                  </a>
                </div>

                <div className="d-flex align-items-center gap-4 mt-5" style={{ color: 'var(--muted)' }}>
                  <a className="pf-follow" href="mailto:2023171035@uteq.edu.mx"><Mail size={16} /> {PROFILE.email}</a>
                  <a className="pf-follow" href="https://github.com/mexicans-code" target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a>
                </div>
              </div>
            </div>

            <div className="col-lg-6 d-none d-lg-flex justify-content-center">
              <div data-reveal="hero2" style={{ width: '100%', maxWidth: 320 }}>
                <ProjectsMini />
              </div>
            </div>
          </div>

          <div className="text-center mt-5 pt-4">
            <ArrowDown size={22} style={{ color: 'var(--muted)' }} />
          </div>
        </div>
      </header>

      {/* SOBRE MÍ */}
      <section id="sobre-mi" className="pf-section" style={{ background: 'var(--bg-soft)' }}>
        <div className="pf-wrap">
          <div className="row g-5 align-items-center">
            <div className="col-lg-7" data-reveal="about">
              <h3 className="pf-section-title mb-2">Sobre mí</h3>
              <h2 className="pf-section-heading mb-4">Ingeniero de software que entrega soluciones completas</h2>
              <p style={{ color: 'var(--muted)', fontSize: '1.02rem', lineHeight: 1.8 }}>
                {PROFILE.summary}
              </p>
              <div className="row g-3 mt-3">
                <div className="col-sm-6 d-flex align-items-center gap-3">
                  <div className="pf-contact-icon"><GraduationCap size={20} /></div>
                  <div>
                    <div style={{ fontWeight: 600 }}>UTEQ</div>
                    <div style={{ color: 'var(--muted)', fontSize: '.85rem' }}>Ing. Software Multiplataforma</div>
                  </div>
                </div>
                <div className="col-sm-6 d-flex align-items-center gap-3">
                  <div className="pf-contact-icon"><Code2 size={20} /></div>
                  <div>
                    <div style={{ fontWeight: 600 }}>Full-Stack</div>
                    <div style={{ color: 'var(--muted)', fontSize: '.85rem' }}>React · Node.js · Supabase</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5" data-reveal="about2">
              <div className="pf-card p-4">
                <h4 className="mb-3 fw-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Mis pilares</h4>
                <div className="d-grid gap-3">
                  {[
                    { icon: Rocket, t: 'De la idea al deployment', d: 'Arquitectura, implementación y publicación.' },
                    { icon: Users, t: 'Liderazgo de equipo', d: 'Coordiné equipos como líder de proyecto.' },
                    { icon: Globe, t: 'Soluciones reales', d: 'Aplicaciones en producción para negocios.' },
                  ].map((p, i) => (
                    <div key={i} className="d-flex gap-3">
                      <div className="pf-contact-icon"><p.icon size={19} /></div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{p.t}</div>
                        <div style={{ color: 'var(--muted)', fontSize: '.88rem' }}>{p.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROYECTOS */}
      <section id="proyectos" className="pf-section">
        <div className="pf-wrap">
          <div className="text-center mb-5">
            <h3 className="pf-section-title mb-2">Portafolio</h3>
            <h2 className="pf-section-heading">Proyectos destacados</h2>
            <p className="mt-2" style={{ color: 'var(--muted)' }}>Plataformas completas que he liderado de principio a fin.</p>
          </div>

          <div className="row g-5">
            {PROJECTS.map((p, i) => (
              <div key={p.id} className="col-lg-6">
                <article data-reveal={`proj${i}`} className="pf-project h-100 d-flex flex-column">
                  <div className="pf-project-img" style={{ backgroundImage: `url("${p.image}")` }} onError={(e) => { e.currentTarget.style.backgroundImage = 'none'; e.currentTarget.style.background = `linear-gradient(135deg, ${p.accent}55, transparent)`; }}>
                    <div className="position-absolute top-0 start-0 m-3 pf-badge">{p.subtitle}</div>
                  </div>
                  <div className="p-4 d-flex flex-column flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h3 className="fw-bold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>{p.title}</h3>
                        <div style={{ color: 'var(--accent)', fontWeight: 500 }}>{p.subtitle}</div>
                      </div>
                      <a href={p.external} target="_blank" rel="noreferrer" style={{ color: p.accent }} className="pf-btn pf-btn-ghost" aria-label={`Abrir ${p.title}`}>
                        <ExternalLink size={18} />
                      </a>
                    </div>

                    <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>{p.description}</p>

                    <div className="d-flex flex-wrap gap-2 mb-4">
                      {p.tags.map((t) => (
                        <span key={t} className="pf-tag">{t}</span>
                      ))}
                    </div>

                    <div className="d-grid gap-2 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))' }}>
                      {p.features.map((f, j) => (
                        <div key={j} className="pf-feature" style={{ fontSize: '.86rem' }}>
                          <f.icon size={16} />
                          <span>{f.text}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto d-flex flex-wrap gap-3">
                      <a className="pf-btn pf-btn-green" href={p.external} target="_blank" rel="noreferrer">
                        <Globe size={16} /> {p.cta}
                      </a>
                      {p.internal && (
                        <a className="pf-btn pf-btn-ghost" href={p.internal}>
                          Probar demo <ChevronRight size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCIA */}
      <section id="experiencia" className="pf-section" style={{ background: 'var(--bg-soft)' }}>
        <div className="pf-wrap">
          <div className="row g-5">
            <div className="col-lg-4">
              <h3 className="pf-section-title mb-2">Trayectoria</h3>
              <h2 className="pf-section-heading mb-3">Experiencia y proyectos</h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
                Más de un año construyendo productos digitales completos, liderando equipos e integrando pasarelas de pago reales.
              </p>
            </div>
            <div className="col-lg-8">
              <div data-reveal="exp">
                <div className="pf-timeline">
                  {EXPERIENCE.map((e, i) => (
                    <div key={i} className="pf-timeline-item">
                      <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                        <span className="pf-company">{e.company}</span>
                        <span style={{ color: 'var(--muted)', fontSize: '.82rem' }}>{e.period}</span>
                      </div>
                      <h5 className="fw-semibold mb-2">{e.title}</h5>
                      <ul className="mb-0" style={{ color: 'var(--muted)', fontSize: '.93rem', lineHeight: 1.7 }}>
                        {e.bullets.map((b, j) => (
                          <li key={j} className="mb-1">{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HABILIDADES + EDUCACIÓN */}
      <section id="habilidades" className="pf-section">
        <div className="pf-wrap">
          <div className="text-center mb-5">
            <h3 className="pf-section-title mb-2">Stack</h3>
            <h2 className="pf-section-heading">Habilidades y formación</h2>
          </div>

          <div className="row g-4">
            {SKILLS.map((s, i) => (
              <div key={i} className="col-lg-6" data-reveal={`skill${i}`}>
                <div className="pf-card h-100 p-4">
                  <h4 className="fw-semibold mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>{s.title}</h4>
                  <div className="d-flex flex-wrap gap-2">
                    {s.items.map((item) => (
                      <span key={item} className="pf-skill-chip">
                        <Sparkles size={13} style={{ color: 'var(--accent)' }} /> {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-4 mt-2">
            {EDUCATION.map((ed, i) => (
              <div key={i} className="col-lg-6" data-reveal={`edu${i}`}>
                <div className="pf-card h-100 p-4 d-flex gap-3">
                  <div className="pf-contact-icon"><GraduationCap size={20} /></div>
                  <div>
                    <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                      <span className="fw-semibold">{ed.place}</span>
                      <span style={{ color: 'var(--muted)', fontSize: '.82rem' }}>{ed.period}</span>
                    </div>
                    <div style={{ color: 'var(--accent)', fontWeight: 500, fontSize: '.93rem' }}>{ed.degree}</div>
                    {ed.extra && <div style={{ color: 'var(--muted)', fontSize: '.86rem', marginTop: 4 }}>{ed.extra}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-3 mt-3">
            <div className="col-12">
              <div className="pf-card p-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="pf-contact-icon" style={{ background: 'rgba(56,189,248,.12)', color: 'var(--accent-blue)' }}><Globe size={20} /></div>
                    <div>
                      <div className="fw-semibold">Idiomas e intereses</div>
                      <div style={{ color: 'var(--muted)', fontSize: '.9rem' }}>Español (nativo) · Inglés (B1)</div>
                    </div>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    <span className="pf-skill-chip"><Sparkles size={13} style={{ color: 'var(--accent)' }} /> Lectura</span>
                    <span className="pf-skill-chip"><Sparkles size={13} style={{ color: 'var(--accent)' }} /> Innovación tecnológica</span>
                    <span className="pf-skill-chip"><Sparkles size={13} style={{ color: 'var(--accent)' }} /> Enseñanza y aprendizaje</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="pf-section" style={{ background: 'var(--bg-soft)' }}>
        <div className="pf-wrap">
          <div className="text-center mb-5">
            <h3 className="pf-section-title mb-2">Contacto</h3>
            <h2 className="pf-section-heading">Trabajemos juntos</h2>
            <p className="mt-2" style={{ color: 'var(--muted)' }}>Tengo una idea o proyecto en mente · hablemos.</p>
          </div>

          <div className="row g-4 justify-content-center">
            <div className="col-md-6 col-lg-4">
              <a className="pf-contact-item" href="mailto:2023171035@uteq.edu.mx">
                <div className="pf-contact-icon"><Mail size={20} /></div>
                <div className="min-width-0">
                  <div className="fw-semibold">Email</div>
                  <div style={{ color: 'var(--muted)', fontSize: '.87rem', overflowWrap: 'anywhere' }}>{PROFILE.email}</div>
                </div>
              </a>
            </div>
            <div className="col-md-6 col-lg-4">
              <a className="pf-contact-item" href="tel:4428196428">
                <div className="pf-contact-icon"><Phone size={20} /></div>
                <div>
                  <div className="fw-semibold">Teléfono</div>
                  <div style={{ color: 'var(--muted)', fontSize: '.87rem' }}>{PROFILE.phone}</div>
                </div>
              </a>
            </div>
            <div className="col-md-6 col-lg-4">
              <a className="pf-contact-item" href="https://github.com/mexicans-code" target="_blank" rel="noreferrer">
                <div className="pf-contact-icon"><Github size={20} /></div>
                <div>
                  <div className="fw-semibold">GitHub</div>
                  <div style={{ color: 'var(--muted)', fontSize: '.87rem' }}>github.com/mexicans-code</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pb-5 pt-4">
        <div className="pf-divider mb-4" />
        <div className="pf-wrap d-flex flex-wrap justify-content-between align-items-center gap-3" style={{ color: 'var(--muted)', fontSize: '.88rem' }}>
          <div>
            <a href="#inicio" className="pf-brand">RM<span>.</span>dev</a>
          </div>
          <div>© {new Date().getFullYear()} Ricardo Medina · Hecho en Querétaro</div>
          <div className="d-flex gap-3">
            <a className="pf-follow" href="#inicio">Arriba</a>
            <a className="pf-follow" href="/app">App SGST</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProjectsMini() {
  const mini = PROJECTS.map((p) => ({
    ...p,
    image: p.image.replace('w=1200', 'w=300'),
  }));
  return (
    <div className="d-grid gap-3" style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', inset: -20, background: 'radial-gradient(300px 200px at 50% 50%, rgba(143,179,74,.12), transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />
      {mini.map((p, i) => (
        <a
          key={p.id}
          href={p.external}
          target="_blank"
          rel="noreferrer"
          className="pf-card d-flex align-items-center gap-3 p-2"
          style={{ position: 'relative', zIndex: 1, transform: i === 0 ? 'rotate(-2deg)' : 'rotate(1.5deg)' }}
        >
          <div
            style={{ width: 64, height: 64, borderRadius: 14, backgroundImage: `url("${p.image}")`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0, background: 'linear-gradient(135deg, ' + p.accent + '55, transparent)' }}
            onError={(e) => { e.currentTarget.style.background = `linear-gradient(135deg, ${p.accent}88, transparent)`; e.currentTarget.style.backgroundImage = 'none'; }}
          />
          <div>
            <div className="fw-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>{p.title}</div>
            <div style={{ color: 'var(--muted)', fontSize: '.8rem' }}>{p.subtitle}</div>
          </div>
          <ExternalLink size={15} style={{ color: 'var(--muted)', marginLeft: 'auto' }} />
        </a>
      ))}
    </div>
  );
}