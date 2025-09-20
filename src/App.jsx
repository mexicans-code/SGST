import HeroSection from "./AirbndHome";

import AirbnbCard from "./AirbnbCard";
import Navbar from "./NavBar";
import TourismSection from "./tourismSection";

const properties = [
  {
    name: "Casa moderna en el centro",
    price: 85,
    rating: 4.8,
    reviews: 127,
    location: "Ciudad de México",
    imageSrc: "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6OTgzNjEwMjg4MDc1MTM0Mjg5/original/6530be09-e469-42eb-ad40-c24de66631e9.jpeg",
    isGuest: false,
    isSuperhost: false
  },
  {
    name: "Loft industrial con vista panorámica",
    price: 120,
    rating: 4.9,
    reviews: 89,
    location: "Polanco, Ciudad de México",
    imageSrc: "https://a0.muscache.com/im/pictures/hosting/Hosting-938498994931574806/original/e23cb3a9-8704-4cf6-8edc-60cb3493bec6.jpeg?im_w=1200",
    isGuest: true,
    isSuperhost: true
  },
  {
    name: "Cabaña rústica en las montañas",
    price: 65,
    rating: 4.6,
    reviews: 203,
    location: "Valle de Bravo, México",
    imageSrc: "https://a0.muscache.com/im/pictures/01eceb36-328c-49e8-bfea-cf9a80b61f27.jpg?im_w=1200",
    isGuest: false,
    isSuperhost: false
  },
  {
    name: "Penthouse de lujo frente al mar",
    price: 170,
    rating: 4.95,
    reviews: 156,
    location: "Playa del Carmen, Quintana Roo",
    imageSrc: "https://a0.muscache.com/im/pictures/hosting/Hosting-1203728580797801322/original/70afea5d-a348-4dd6-ba7e-c1e1e9d88836.jpeg?im_w=1200",
    isGuest: true,
    isSuperhost: true
  },
  {
    name: "Casa de lujo frente al mar",
    price: 80,
    rating: 4.9,
    reviews: 156,
    location: "Playa del Carmen, Quintana Roo",
    imageSrc: "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTM2MjY4NTQzNzUxNDA1MDQ3NQ==/original/cf7a7b5e-c2a0-44c2-bc26-0662287b9a37.jpeg?im_w=1200",
    isGuest: true,
    isSuperhost: true
  },
  {
    name: "Casa acogedora en el centro",
    price: 140,
    rating: 4.9,
    reviews: 156,
    location: "Playa del Carmen, Quintana Roo",
    imageSrc: "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTQ1NDk4ODM2MDg3NjIyNjc5OQ==/original/64c35083-1732-4ca8-87e5-7eba0de222a6.jpeg?im_w=1200",
    isGuest: true,
    isSuperhost: true
  },



];

export default function App() {
  return (
    <div className="min-vh-100">
      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0) translateX(-50%);
          }
          40% {
            transform: translateY(-10px) translateX(-50%);
          }
          60% {
            transform: translateY(-5px) translateX(-50%);
          }
        }
        
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
        
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .tracking-wide {
          letter-spacing: 0.025em;
        }
        
        .cursor-pointer {
          cursor: pointer;
        }
        
        .form-control:focus,
        .form-select:focus {
          border-color: #dc2626 !important;
          box-shadow: 0 0 0 0.2rem rgba(220, 38, 38, 0.25) !important;
        }
      `}</style>

      <Navbar />
      <HeroSection />
      
      <div id="propiedades" className="bg-light">
        <div className="bg-white shadow-sm border-bottom">
          <div className="container py-5">
            <div className="text-center">
              <h2 className="display-4 fw-bold text-dark mb-3">
                Alojamientos Disponibles
              </h2>
              <p className="lead text-muted fs-5">
                Descubre lugares únicos para quedarte 🏡
              </p>
            </div>
          </div>
        </div>

        <div className="container py-5">
          <div className="row justify-content-center g-4">
            {properties.map((property, index) => (
              <div key={`${property.name}-${index}`} className="col-auto">
                <AirbnbCard {...property} />
              </div>
            ))}
          </div>
        </div>

        <TourismSection />

        <footer className="bg-white border-top mt-5">
          <div className="container py-4">
            <div className="text-center text-muted">
              <p className="mb-1 fw-medium">Encuentra tu próximo destino perfecto</p>
              <p className="small mb-0">© 2024 AirbnbClone - Arroyo Seco, Querétaro</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}