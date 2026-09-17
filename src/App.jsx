import { useState, useEffect } from "react";
import Navbar from "./components/NavBar";
import HeroSection from "./pages/HeroSection";
import HotelListings from "./components/AirbnbCard";
import ExperiencesSection from "./pages/TourismSection";

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) {
      document.body.classList.add("bg-dark", "text-light");
      document.body.classList.remove("bg-light", "text-dark");
    } else {
      document.body.classList.add("bg-light", "text-dark");
      document.body.classList.remove("bg-dark", "text-light");
    }
  }, [darkMode]);

  return (
    <div
      className={darkMode ? "bg-dark text-light" : "bg-light text-dark"}
      style={{ minHeight: "100vh" }}
    >
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div id="inicio">
        <HeroSection />
      </div>

      <div id="alojamientos" className={`shadow-sm border-bottom ${darkMode ? "bg-dark" : "bg-white"}`}>
        <div className="container py-5 text-center">
          <h2 className={`display-4 fw-bold mb-3 ${darkMode ? "text-light" : "text-dark"}`}>
            Alojamientos En Arroyo Seco
          </h2>
          <p className="lead text-muted fs-5">
            Descubre lugares únicos para tu estadía
          </p>
        </div>
      </div>

      <div className={`${darkMode ? "bg-dark" : "bg-light"}`}>
        <HotelListings darkMode={darkMode} />
      </div>

      <div id="experiencias">
        <ExperiencesSection darkMode={darkMode} />
      </div>
    </div>
  );
}