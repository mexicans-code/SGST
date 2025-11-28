// App.jsx
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import ReservationInfo from "./pages/ReservationInfo";
import PaymentSummary from "./pages/PaymentSummary";
import AirbnbCard from "./components/AirbnbCard";
import DashboardLayout from "./components/DashboardLayout";
import UserAdmin from "./pages/Admin/UserAdmin";
import HospitalityAdmin from "./pages/Admin/HospitalityAdmin";
import BookingAdmin from "./pages/Admin/BookingAdmin";
import ReportAdmin from "./pages/Admin/ReportAdmin";
import ProfileAdmin from "./pages/Admin/ProfileAdmin";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import HostUploadPage from "./pages/Host/HostPageUploadHotel";
import HostAdmin from "./pages/Host/HostAdminDashboard";
import Dashboard from "./pages/Admin/Dashboard";
import HostInformation from "./pages/HostInformation";
import ExperiencesSection from "./pages/TourismSection";
import Profile from "./pages/ProfileHome";
import ReservationUser from "./pages/ReservationUser";
import HostPublications from "./pages/Host/HostPublicationsDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import HeroSection from "./pages/HeroSection";
import TourismReservationInfo from "./pages/TourismReservationInfo";
import UserReservations from "./pages/user/UserReservations";
import ReviewUsers from "./components/ReviewUsers";
import Reviews from "./components/Reviews";
import CreateTouristExperience from "./pages/Host/HostPageUploadTourism";
import HostReport from "./pages/Host/HostReport";
import PublicRoute from "./components/PublicRoute";

import NotFoundPage from "./components/NotFoundPage";


function PropertiesPage() {
  return (
    <div className="container py-5">
      <AirbnbCard />

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

      <Routes>

        <Route
          path="/*"
          element={
            <>
              <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <HeroSection />

                      {/* SECCIÓN ALOJAMIENTOS */}
                      <div className={`shadow-sm border-bottom ${darkMode ? "bg-dark" : "bg-white"}`}>
                        <div className="container py-5 text-center">
                          <h2 className={`display-4 fw-bold mb-3 ${darkMode ? "text-light" : "text-dark"}`}>
                            Alojamientos En Arroyo Seco
                          </h2>
                          <p className="lead text-muted fs-5">
                            Descubre lugares únicos para tu estadía
                          </p>
                        </div>
                      </div>

                      <PropertiesPage />
                      <ExperiencesSection />
                    </>
                  }
                />

                <Route
                  path="/experiencias"
                  element={
                    <>
                      <div className={`shadow-sm border-bottom ${darkMode ? "bg-dark" : "bg-white"}`}>
                        <div className="container py-5 text-center">
                          <h2 className={`display-4 fw-bold mb-3 ${darkMode ? "text-light" : "text-dark"}`}>
                            Experiencias en Arroyo Seco
                          </h2>
                          <p className="lead text-muted fs-5">
                            Descubre actividades únicas e inolvidables
                          </p>
                        </div>
                      </div>

                      <ExperiencesSection />
                    </>
                  }
                />

                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <LoginPage />
                    </PublicRoute>
                  }
                />

                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <RegisterPage />
                    </PublicRoute>
                  }
                />

                {/* RUTA 404 CORREGIDA */}
                <Route path="/404" element={<NotFoundPage />} />

                {/* OTRAS RUTAS */}
                <Route path="/propiedades" element={<PropertiesPage />} />
                <Route path="/reservation" element={<ReservationInfo />} />
                <Route path="/reservation/tourism" element={<TourismReservationInfo />} />
                <Route path="/payment" element={<PaymentSummary />} />

                {/* RUTAS HOST */}
                <Route
                  path="/host/upload"
                  element={
                    <ProtectedRoute allowedRoles={["anfitrion"]}>
                      <HostUploadPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/host/publications"
                  element={
                    <ProtectedRoute allowedRoles={["anfitrion"]}>
                      <HostPublications />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/host/report"
                  element={
                    <ProtectedRoute allowedRoles={["anfitrion"]}>
                      <HostReport />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/host/upload/tourism"
                  element={
                    <ProtectedRoute allowedRoles={["anfitrion"]}>
                      <CreateTouristExperience />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/host/admin"
                  element={
                    <ProtectedRoute allowedRoles={["anfitrion"]}>
                      <HostAdmin />
                    </ProtectedRoute>
                  }
                />

                <Route path="/host/information" element={<HostInformation />} />

                <Route path="/perfil" element={<Profile />} />
                <Route path="/reservation/user" element={<ReservationUser />} />
                <Route path="/user/reservations" element={<UserReservations />} />

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </>
          }
        />

        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserAdmin />} />
          <Route path="hospitality" element={<HospitalityAdmin />} />
          <Route path="bookings" element={<BookingAdmin />} />
          <Route path="reports" element={<ReportAdmin />} />
          <Route path="profile" element={<ProfileAdmin />} />
        </Route>

      </Routes>
    </div>
  );
}
