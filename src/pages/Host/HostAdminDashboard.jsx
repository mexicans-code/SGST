import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  User,
  DollarSign,
  Phone,
  Mail,
  MessageCircle,
  ChevronRight,
  Sparkles,
  Plus,
  ArrowRight,
  ArrowLeft,
  Home,
  Compass,
} from "lucide-react";
import ChatModal from "../../components/Chat";
import { useNavigate } from "react-router-dom";

export default function HostReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("todas");
  const [userId, setUserId] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedAnfitrion, setSelectedAnfitrion] = useState(null);
  const [selectedEstablecimiento, setSelectedEstablecimiento] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const navigate = useNavigate();

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = token ? parseJwt(token) : null;
    const currentUserId = decoded?.id_usuario;

    if (currentUserId) setUserId(currentUserId);

    fetch("http://localhost:3000/api/booking/getBookings", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success && result.data) {
          const hostReservations = result.data.filter((r) => {
            const isHosteleria = r.establecimiento && r.anfitrion?.id_usuario === currentUserId;
            const isExperiencia = r.experiencia && r.experiencia.anfitrion?.id_usuario === currentUserId;
            return isHosteleria || isExperiencia;
          });
          setReservations(hostReservations);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const tabs = [
    { key: "todas", label: "Todas", estado: null },
    { key: "pendientes", label: "Pendientes", estado: "pendiente" },
    { key: "confirmadas", label: "Confirmadas", estado: "confirmada" },
    { key: "completadas", label: "Completadas", estado: "completada" },
  ];

  const getFiltered = () => {
    if (activeTab === "todas") return reservations;
    const tab = tabs.find((t) => t.key === activeTab);
    return reservations.filter((r) => r.reserva?.estado === tab.estado);
  };

  const getStatusBadge = (estado) => {
    const badges = {
      confirmada: { bg: "success", text: "Confirmada" },
      pendiente: { bg: "warning", text: "Pendiente" },
      completada: { bg: "secondary", text: "Completada" },
      cancelada: { bg: "danger", text: "Cancelada" },
    };
    const badge = badges[estado] || badges.pendiente;
    return (
      <span className={`badge bg-${badge.bg} rounded-pill px-3 py-1 fw-semibold`}>
        {badge.text}
      </span>
    );
  };

  const calcNights = (start, end) => (end ? Math.ceil((new Date(end) - new Date(start)) / 86400000) : 1);

  const calcTotal = (data) => {
    const isExp = data.experiencia !== null;
    return isExp
      ? data.experiencia?.precio || 0
      : (data.establecimiento?.precio_por_noche || 0) * calcNights(data.reserva?.fecha_inicio, data.reserva?.fecha_fin);
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });

  const handleOpenChat = (data) => {
    const isExp = data.experiencia !== null;
    const anfitrion = isExp ? data.experiencia?.anfitrion : data.anfitrion;
    const property = isExp ? data.experiencia : data.establecimiento;

    const establecimientoData = {
      ...property,
      establecimientoId: isExp ? property?.id_experiencia : property?.id_hosteleria,
      tipo: isExp ? "experiencia" : "hosteleria",
    };

    setSelectedAnfitrion(anfitrion);
    setSelectedEstablecimiento(establecimientoData);
    setChatOpen(true);
  };

  const handleOpenEdit = (property) => {
    setSelectedProperty(property);
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setSelectedProperty(null);
    setIsEditOpen(false);
  };

  const handleSaveProperty = (updatedProperty) => {
    setReservations((prev) =>
      prev.map((r) =>
        r.establecimiento?.id_hosteleria === updatedProperty.id_hosteleria
          ? { ...r, establecimiento: updatedProperty }
          : r
      )
    );
    handleCloseEdit();
  };

  const onClose = () => {
    setChatOpen(false);
    setSelectedAnfitrion(null);
    setSelectedEstablecimiento(null);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  const filtered = getFiltered();
  const stats = tabs.reduce(
    (acc, tab) => ({
      ...acc,
      [tab.key]:
        tab.estado === null
          ? reservations.length
          : reservations.filter((r) => r.reserva?.estado === tab.estado).length,
    }),
    {}
  );

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", paddingTop: "7rem", paddingBottom: "3rem" }}>
      <div className="container">
        {/* Header */}
        <div className="mb-5 text-center">
          <h1 className="display-5 fw-light mb-2">Reservas Recibidas</h1>
          <p className="text-muted">Gestiona las reservaciones de tus propiedades y experiencias</p>
        </div>

        {/* Tabs */}
        <ul className="nav nav-pills justify-content-center mb-4 gap-3" role="tablist">
          {tabs.map((tab) => (
            <li key={tab.key} className="nav-item" role="presentation">
              <button
                className={`nav-link px-4 rounded-pill ${activeTab === tab.key ? "active" : "text-dark"}`}
                style={{ borderRadius: "50rem", fontWeight: 600, fontSize: "0.9rem" }}
                onClick={() => setActiveTab(tab.key)}
                role="tab"
                aria-selected={activeTab === tab.key}
                aria-controls={`tab-panel-${tab.key}`}
                id={`tab-${tab.key}`}
              >
                {tab.label}{" "}
                <span className="badge bg-secondary ms-2" aria-label={`${tab.label} cantidad`}>
                  {stats[tab.key]}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {/* Reservations List */}
        {filtered.length === 0 ? (
          <div className="card border-0 shadow-sm p-5 text-center">
            <Calendar size={56} className="mb-3 text-muted" />
            <h5 className="fw-light mb-2">Sin reservaciones</h5>
            <p className="text-muted mb-0">Las nuevas reservas aparecerán aquí.</p>
          </div>
        ) : (
          <div className="row g-4">
            {filtered.map((data) => {
              const isExp = data.experiencia !== null;
              const property = isExp ? data.experiencia : data.establecimiento;
              const total = calcTotal(data);

              return (
                <article
                  key={data.reserva?.id_reserva}
                  className="col-12 col-md-6 col-xl-4"
                  tabIndex={0}
                  aria-labelledby={`reserva-titulo-${data.reserva?.id_reserva}`}
                >
                  <div className="card shadow-sm rounded-4 overflow-hidden h-100 border-0">
                    <div className="position-relative">
                      <img
                        src={
                          property?.image ||
                          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500"
                        }
                        alt={property?.nombre || property?.titulo}
                        className="card-img-top object-fit-cover"
                        style={{ height: "220px" }}
                      />
                      {isExp && (
                        <span className="badge bg-purple position-absolute top-2 start-2 fs-6 d-flex align-items-center gap-1">
                          <Sparkles size={16} /> Experiencia
                        </span>
                      )}
                    </div>

                    <div className="card-body d-flex flex-column justify-content-between h-100">
                      <div>
                        <h5
                          id={`reserva-titulo-${data.reserva?.id_reserva}`}
                          className="card-title fw-bold mb-1"
                        >
                          {property?.nombre || property?.titulo}
                        </h5>
                        <p className="text-muted small mb-2 d-flex align-items-center gap-2">
                          {isExp ? (
                            <>
                              <Calendar size={16} /> {formatDate(data.experiencia?.fecha_experiencia)}
                            </>
                          ) : (
                            <>
                              <MapPin size={16} /> {property?.direccion?.ciudad}, {property?.direccion?.estado}
                            </>
                          )}
                        </p>
                        {getStatusBadge(data.reserva?.estado)}
                      </div>

                      <div className="bg-light rounded-3 p-3 mt-3 d-flex flex-wrap gap-3 justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-3">
                          <User size={20} className="text-muted" />
                          <div>
                            <div className="fw-semibold">{data.usuario?.nombre}</div>
                            <small className="text-muted">{data.usuario?.email}</small>
                          </div>
                        </div>

                        <div className="text-muted small d-flex flex-wrap gap-3 align-items-center">
                          <span className="d-flex align-items-center gap-1">
                            <Calendar size={16} /> {formatDate(data.reserva?.fecha_inicio)}
                            {!isExp && ` - ${formatDate(data.reserva?.fecha_fin)}`}
                          </span>
                          {!isExp && (
                            <span className="d-flex align-items-center gap-1">
                              <Clock size={16} />{" "}
                              {calcNights(data.reserva?.fecha_inicio, data.reserva?.fecha_fin)} noches
                            </span>
                          )}
                          <span className="fw-semibold text-dark d-flex align-items-center gap-1">
                            <DollarSign size={16} /> ${total.toLocaleString("es-MX")}
                          </span>
                        </div>

                        <button
                          className="btn btn-outline-secondary rounded-pill mt-3 mt-md-0"
                          onClick={() => setSelectedReservation(data)}
                        >
                          Ver detalles <ChevronRight size={16} />
                        </button>
                        <button
                          className="btn btn-outline-primary rounded-pill mt-3 mt-md-0"
                          onClick={() => {
                            handleOpenChat(data);
                          }}
                          title="Contactar usuario"
                        >
                          <MessageCircle size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {selectedReservation && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setSelectedReservation(null)}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-header border-0 pb-0" style={{ backgroundColor: "#F4EFEA" }}>
                  <div>
                    <h4 className="modal-title fw-bold mb-1" style={{ color: "#CD5C5C" }}>
                      Detalles de la Reservación
                    </h4>
                    <p className="text-muted small mb-0">
                      ID: #{selectedReservation.reserva?.id_reserva} •{" "}
                      {selectedReservation.experiencia !== null ? "Experiencia" : "Alojamiento"}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedReservation(null)}
                  ></button>
                </div>

                <div className="modal-body p-4">
                  <div className="mb-4 text-center">{getStatusBadge(selectedReservation.reserva?.estado)}</div>

                  {/* Info del servicio */}
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3" style={{ color: "#CD5C5C" }}>
                      {selectedReservation.experiencia !== null ? (
                        <>
                          <Compass size={18} className="me-2" />
                          Experiencia
                        </>
                      ) : (
                        <>
                          <Home size={18} className="me-2" />
                          Alojamiento
                        </>
                      )}
                    </h6>
                    <div
                      className="d-flex gap-3 align-items-center p-3 rounded-3"
                      style={{ backgroundColor: "#F8F9FA" }}
                    >
                      <img
                        src={
                          selectedReservation.experiencia?.image ||
                          selectedReservation.establecimiento?.image ||
                          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500"
                        }
                        alt={
                          selectedReservation.experiencia?.titulo || selectedReservation.establecimiento?.nombre
                        }
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                      <div>
                        <h6 className="fw-bold mb-1">
                          {selectedReservation.experiencia?.titulo || selectedReservation.establecimiento?.nombre}
                        </h6>
                        {(selectedReservation.establecimiento?.direccion ||
                          selectedReservation.experiencia?.ubicacion) && (
                          <p className="text-muted mb-0 small">
                            <MapPin size={14} className="me-1" />
                            {selectedReservation.establecimiento
                              ? `${selectedReservation.establecimiento.direccion?.ciudad}, ${selectedReservation.establecimiento.direccion?.estado}`
                              : selectedReservation.experiencia?.ubicacion}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Fechas */}
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3" style={{ color: "#CD5C5C" }}>
                      <Calendar size={18} className="me-2" />
                      {selectedReservation.experiencia !== null
                        ? "Fecha de la experiencia"
                        : "Fechas de estancia"}
                    </h6>

                    {selectedReservation.experiencia !== null ? (
                      <div className="p-3 rounded-3" style={{ backgroundColor: "#F8F9FA" }}>
                        <small className="text-muted d-block mb-1">Fecha programada</small>
                        <strong>
                          {formatDate(selectedReservation.experiencia?.fecha_experiencia) ||
                            formatDate(selectedReservation.reserva?.fecha_inicio)}
                        </strong>
                        <div className="mt-2 text-muted small">
                          <User size={14} className="me-1" />
                          {selectedReservation.reserva?.personas} persona(s)
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <div className="p-3 rounded-3" style={{ backgroundColor: "#F8F9FA" }}>
                              <small className="text-muted d-block mb-1">Check-in</small>
                              <strong>{formatDate(selectedReservation.reserva?.fecha_inicio)}</strong>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="p-3 rounded-3" style={{ backgroundColor: "#F8F9FA" }}>
                              <small className="text-muted d-block mb-1">Check-out</small>
                              <strong>{formatDate(selectedReservation.reserva?.fecha_fin)}</strong>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 text-muted small">
                          <Clock size={14} className="me-1" />
                          {calcNights(
                            selectedReservation.reserva?.fecha_inicio,
                            selectedReservation.reserva?.fecha_fin
                          )}{" "}
                          noches • {selectedReservation.reserva?.personas} huésped(es)
                        </div>
                      </>
                    )}
                  </div>

                  {/* Usuario que reservó */}
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3" style={{ color: "#CD5C5C" }}>
                      <User size={18} className="me-2" />
                      Usuario
                    </h6>
                    <div className="p-3 rounded-3" style={{ backgroundColor: "#F8F9FA" }}>
                      <div className="mb-2">
                        <strong>{selectedReservation.usuario?.nombre || "No disponible"}</strong>
                      </div>
                      <div className="d-flex flex-column gap-2">
                        <span className="text-muted small">
                          <Mail size={14} className="me-2" />
                          {selectedReservation.usuario?.email || "No disponible"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Resumen de pago */}
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3" style={{ color: "#CD5C5C" }}>
                      <DollarSign size={18} className="me-2" />
                      Resumen de pago
                    </h6>
                    <div className="p-3 rounded-3" style={{ backgroundColor: "#F8F9FA" }}>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">
                          {selectedReservation.experiencia !== null
                            ? `$${selectedReservation.experiencia?.precio.toLocaleString(
                                "es-MX"
                              )} × ${selectedReservation.reserva?.personas} persona(s)`
                            : `$${selectedReservation.establecimiento?.precio_por_noche.toLocaleString(
                                "es-MX"
                              )} × ${calcNights(
                                selectedReservation.reserva?.fecha_inicio,
                                selectedReservation.reserva?.fecha_fin
                              )} noches`}
                        </span>
                        <span>${calcTotal(selectedReservation).toLocaleString("es-MX")}</span>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <strong>Total pagado</strong>
                        <strong style={{ color: "#CD5C5C" }}>
                          ${calcTotal(selectedReservation).toLocaleString("es-MX")}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="modal-footer border-0" style={{ backgroundColor: "#F8F9FA" }}>
                  {(selectedReservation.reserva?.estado === "confirmada" ||
                    selectedReservation.reserva?.estado === "pendiente") && (
                    <button
                      className="btn btn-outline-secondary rounded-pill px-4"
                      onClick={() => handleOpenChat(selectedReservation)}
                    >
                      <MessageCircle size={16} className="me-2" />
                      Contactar Usuario
                    </button>
                  )}
                  <button
                    className="btn rounded-pill px-4"
                    style={{ backgroundColor: "#CD5C5C", color: "white" }}
                    onClick={() => setSelectedReservation(null)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <ChatModal
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
          anfitrion={selectedAnfitrion}
          establecimiento={selectedEstablecimiento}
        />
      </div>
    </div>
  );
}
