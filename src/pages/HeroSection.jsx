import { Heart, ChevronDown } from 'lucide-react';

export default function HeroSection() {
  const scrollToProperties = () => {
    document.getElementById('alojamientos')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <style>{`
        .hero-main {
          background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.2)), 
                      url("https://queretaro.travel/wp-content/uploads/2022/02/DJI_0480.jpg") center/cover;
          height: 100vh;
        }
        .title-gradient {
          background: linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 2px 2px 20px rgba(0,0,0,0.3);
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.8s ease-out; }
        .bounce { animation: bounce 2s infinite; }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
          60% { transform: translateY(-4px); }
        }
      `}</style>

      <div className="hero-main d-flex align-items-center justify-content-center position-relative">
        <div className="container px-2">

          <div className="text-center mb-5 fade-up bounce position-relative" style={{ top: '-50px' }}>
            <h1 className="display-1 fw-bold mb-3 title-gradient" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
              Arroyo Seco
              <Heart className="text-danger ms-3" size={60} fill="currentColor" />
            </h1>
            <p className="lead text-white mb-2" style={{ fontSize: '1.3rem', textShadow: '1px 1px 8px rgba(0,0,0,0.5)' }}>
              Sierra Gorda de Querétaro • Pueblo Mágico
            </p>
          </div>
        </div>

        <div className="position-absolute bottom-4 start-50 translate-middle-x text-center"
          style={{ cursor: 'pointer', bottom: '1.5rem' }} onClick={scrollToProperties}>
          <small className="text-white opacity-75 d-block mb-2">Explorar propiedades</small>
          <ChevronDown size={28} className="text-white opacity-75 bounce" />
        </div>
      </div>
    </>
  );
}