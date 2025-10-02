// App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import HeroSection from "./pages/AirbndHome";
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
import HostUploadPage from "./pages/HostPage";
import HostAdmin from "./pages/Host/HostAdmin";

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
  return (
    <>
      <Routes>
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={
                  <>
                    <HeroSection />
                    <div className="bg-white shadow-sm border-bottom">
                      <div className="container py-5">
                        <div className="text-center">
                          <h2 className="display-4 fw-bold text-dark mb-3">
                            Alojamientos En Arroyo Seco
                          </h2>
                          <p className="lead text-muted fs-5">
                            Descubre lugares únicos para tu estadía
                          </p>
                        </div>
                      </div>
                    </div>
                    <PropertiesPage />

                  </>
                } />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/propiedades" element={<PropertiesPage />} />
                <Route path="/reservation" element={<ReservationInfo />} />
                <Route path="/payment" element={<PaymentSummary />} />
                <Route path="/host/upload" element={<HostUploadPage />} />
                <Route path="/host/admin" element={<HostAdmin />} />
              </Routes>
            </>
          }
        />

        {/* Dashboard sin Navbar */}
        <Route path="/dashboard/*" element={<DashboardLayout />}>
          <Route path="users" element={<UserAdmin />} />
          <Route path="hospitality" element={<HospitalityAdmin />} />
          <Route path="bookings" element={<BookingAdmin />} />
          <Route path="reports" element={<ReportAdmin />} />
          <Route path="profile" element={<ProfileAdmin />} />
        </Route>
      </Routes>
    </>
  );
}