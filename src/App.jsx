// App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import HeroSection from "./pages/AirbndHome";
import AirbnbCard from "./components/AirbnbCard";
import TourismSection from "./pages/TourismSection";
import ExperiencesSection from "./pages/TourismSection"; // Nueva importación
import ReservationInfo from "./pages/ReservationInfo";
import PaymentSummary from "./pages/PaymentSummary";

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
  {
    name: "Casa acogedora en el centro",
    price: 140,
    rating: 4.9,
    reviews: 156,
    location: "Playa del Carmen, Quintana Roo",
    imageSrc: "https://a0.muscache.com/im/pictures/01eceb36-328c-49e8-bfea-cf9a80b61f27.jpg?im_w=1200",
    isGuest: true,
    isSuperhost: true
  },
];

function PropertiesPage() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center g-5">
        {properties.map((property, index) => (
          <div key={index} className="col-xl-3 col-lg-4 col-md-6 col-12 mb-4">
            <AirbnbCard {...property} />
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-end mt-4">
        <nav aria-label="Page navigation">
          <ul className="pagination">
            <li className="page-item disabled bg-secondary">
              <a className="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">«</span>
              </a>
            </li>
            <li className="page-item active bg-secondary">
              <a className="page-link" href="#">1</a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">2</a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">3</a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">»</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection />

              <div className="bg-white shadow-sm border-bottom">
                <div className="container py-5">
                  <div className="text-center">
                    <h2 className="display-4 fw-bold text-dark mb-3">
                      Alojamientos En Arroyo Seco
                    </h2>
                    <p className="lead text-muted fs-5">
                      Vive aventuras inolvidables en la Sierra Gorda
                    </p>
                  </div>
                </div>
              </div>
              <PropertiesPage />

              
              <div className="bg-white shadow-sm border-bottom">
                <div className="container py-5">
                  <div className="text-center">
                    <h2 className="display-4 fw-bold text-dark mb-3">
                      Experiencias en Arroyo Seco
                    </h2>
                    <p className="lead text-muted fs-5">
                      Vive aventuras inolvidables en la Sierra Gorda
                    </p>
                  </div>
                </div>
              </div>

              <TourismSection />
            </>
          }
        />

        <Route path="/propiedades" element={<PropertiesPage />} />

        <Route path="/turismo" element={<TourismSection />} />

        <Route path="/experiencias" element={<ExperiencesSection />} />

        <Route path="/reservation" element={<ReservationInfo />} />

        <Route path="/payment" element={<PaymentSummary />} />
      </Routes>
    </>
  );
}