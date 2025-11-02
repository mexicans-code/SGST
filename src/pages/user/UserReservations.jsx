import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  MapPin,
  Compass,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import ChatModal from "../../components/Chat";
import { useNavigate } from "react-router-dom";
import ReviewUsers from "../../components/ReviewUsers";
import ReservationDetailsModal from "../../components/ReservationDetailsModal";
import Swal from "sweetalert2";

const STATUS_BADGES = {
  confirmada: { bg: "success", text: "Confirmada" },
  pendiente: { bg: "warning", text: "Pendiente" },
  completada: { bg: "secondary", text: "Completada" },
  cancelada: { bg: "danger", text: "Cancelada" },
};

export default function UserReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("todas");
  const [userId, setUserId] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedAnfitrion, setSelectedAnfitrion] = useState(null);
  const [selectedEstablecimiento, setSelectedEstablecimiento] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const navigate = useNavigate();

  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(
            (c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
          )
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

const fetchReservations = useCallback(async (currentUserId) => {
  setLoading(true);
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "http://localhost:3000/api/booking/getBookings",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (result.success && result.data) {
      // Filtrar solo reservas del usuario Y que estén confirmadas
      const userReservations = result.data.filter(
        (reserva) => 
          reserva.usuario?.id_usuario === currentUserId &&
          reserva.reserva?.estado === "confirmada"
      );
      
      setReservations(userReservations);

      // Mostrar alerta solo si no hay reservas confirmadas
      if (userReservations.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'Sin reservaciones',
          text: 'No tienes reservaciones confirmadas en este momento.',
          confirmButtonColor: '#CD5C5C'
        });
      }
    }
  } catch (error) {
    console.error("Error al obtener reservaciones:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar las reservaciones.',
      confirmButtonColor: '#CD5C5C'
    });
  } finally {
    setLoading(false);
  }
}, []);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = parseJwt(token);
      if (decodedToken?.id_usuario) {
        setUserId(decodedToken.id_usuario);
        fetchReservations(decodedToken.id_usuario);
      }
    } else {
      setLoading(false);
    }
  }, [fetchReservations]);

  const getReservationInfo = (data) => {
    const isExperiencia = data.reserva?.tipo_reserva === "experiencia";

    if (isExperiencia) {
      return {
        tipo: "experiencia",
        nombre: data.experiencia?.titulo || "Experiencia sin título",
        imagen:
          data.experiencia?.image ||
          "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500",
        precio: data.experiencia?.precio || 0,
        anfitrion: data.experiencia?.anfitrion,
        ubicacion: null,
        fechaUnica: data.experiencia?.fecha_experiencia,
      };
    } else {
      return {
        tipo: "hosteleria",
        nombre: data.establecimiento?.nombre || "Alojamiento",
        imagen:
          data.establecimiento?.image ||
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500",
        precio: data.establecimiento?.precio_por_noche || 0,
        anfitrion: data.anfitrion,
        ubicacion: data.establecimiento?.direccion,
        fechaUnica: null,
      };
    }
  };

  const filterReservations = () => {
    switch (activeTab) {
      case "todas":
        return reservations;
      case "proximas":
        return reservations.filter(
          (r) =>
            r.reserva?.estado === "confirmada" &&
            new Date(r.reserva?.fecha_inicio) > new Date()
        );
      case "pendientes":
        return reservations.filter((r) => r.reserva?.estado === "pendiente");
      case "completadas":
        return reservations.filter((r) => r.reserva?.estado === "completada");
      case "canceladas":
        return reservations.filter((r) => r.reserva?.estado === "cancelada");
      default:
        return reservations;
    }
  };

  const getStatusBadge = (estado) => {
    const badge = STATUS_BADGES[estado] || STATUS_BADGES.pendiente;
    return (
      <span className={`badge bg-${badge.bg}`} aria-label={`Estado ${badge.text}`}>
        {badge.text}
      </span>
    );
  };

  const calcularNoches = (inicio, fin) => {
    if (!fin) return 1;
    const start = new Date(inicio);
    const end = new Date(fin);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const calcularPrecioTotal = (data) => {
    const info = getReservationInfo(data);
    if (info.tipo === "experiencia") {
      return info.precio * data.reserva?.personas;
    } else {
      const noches = calcularNoches(data.reserva?.fecha_inicio, data.reserva?.fecha_fin);
      return info.precio * noches;
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatearDireccion = (direccion) => {
    if (!direccion) return "Sin ubicación";
    return `${direccion.ciudad || ""}, ${direccion.estado || ""}`.trim();
  };

const handleCancelReservation = async (reservaId) => {
  const result = await Swal.fire({
    title: '¿Cancelar reservación?',
    text: "Esta acción no se puede deshacer. Se cancelará tu reserva definitivamente.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#CD5C5C',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, cancelar',
    cancelButtonText: 'No, mantener'
  });

  if (result.isConfirmed) {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(
        `http://localhost:3000/api/booking/cancelBooking/${reservaId}`, 
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        // Mostrar mensaje de éxito
        await Swal.fire({
          icon: 'success',
          title: 'Reservación cancelada',
          text: 'Tu reservación ha sido cancelada exitosamente.',
          confirmButtonColor: '#CD5C5C'
        });

        // Cerrar el modal de detalles
        setDetailsModalOpen(false);

        // Recargar las reservaciones
        await fetchReservations(userId);
      } else {
        // Mostrar error específico del servidor
        await Swal.fire({
          icon: 'error',
          title: 'No se pudo cancelar',
          text: data.message || 'Error al cancelar la reservación',
          confirmButtonColor: '#CD5C5C'
        });
      }
    } catch (error) {
      console.error("Error al cancelar reservación:", error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al cancelar la reservación. Intenta nuevamente.',
        confirmButtonColor: '#CD5C5C'
      });
    } finally {
      setLoading(false);
    }
  }
};


  const handleOpenDetails = (data) => {
    setSelectedReservation(data);
    setDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedReservation(null);
    setDetailsModalOpen(false);
  };

  const handleOpenChat = (anfitrion, item, tipo) => {
    setSelectedAnfitrion(anfitrion);
    setSelectedEstablecimiento({
      ...item,
      tipo: tipo,
      nombre: tipo === "experiencia" ? item?.titulo : item?.nombre,
    });
    setChatOpen(true);
  };

  const handleCloseChat = () => {
    setSelectedAnfitrion(null);
    setSelectedEstablecimiento(null);
    setChatOpen(false);
  };

  const handleOpenReview = (data) => {
    setSelectedProperty(data);
    setIsReviewModalOpen(true);
  };

  const handleCloseReview = () => {
    setSelectedProperty(null);
    setIsReviewModalOpen(false);
  };

  const filteredReservations = filterReservations();

  const stats = {
    todas: reservations.length,
    proximas: reservations.filter(
      (r) =>
        r.reserva?.estado === "confirmada" &&
        new Date(r.reserva?.fecha_inicio) > new Date()
    ).length,
    pendientes: reservations.filter((r) => r.reserva?.estado === "pendiente").length,
    completadas: reservations.filter((r) => r.reserva?.estado === "completada").length,
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
        role="status"
        aria-live="polite"
      >
        <div className="spinner-border text-danger" aria-hidden="true"></div>
        <span className="visually-hidden">Cargando...</span>
      </div>
    );
  }

  return (
    <div
      style={{ backgroundColor: "#fff", minHeight: "100vh", paddingTop: "7rem", paddingBottom: "3rem" }}
      aria-label="Mis viajes: administracion de reservaciones y próximos viajes"
    >
      <div className="container">
        <div className="mb-4 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div>
            <h1 className="fw-bold mb-2" style={{ color: "#CD5C5C" }}>
              Mis Viajes
            </h1>
            <p className="text-muted">Administra tus reservaciones y próximos viajes</p>
          </div>
          <button
            className="btn btn-outline-secondary btn-sm rounded-pill"
            onClick={() => navigate("/search")}
            aria-label="Buscar alojamientos"
          >
            Buscar alojamientos <ArrowRight size={16} />
          </button>
        </div>

        <div className="mb-4 d-flex gap-3 flex-wrap">
          {[
            { key: "todas", label: `Todas (${stats.todas})` },
            { key: "proximas", label: `Próximas (${stats.proximas})` },
            { key: "pendientes", label: `Pendientes (${stats.pendientes})` },
            { key: "completadas", label: `Completadas (${stats.completadas})` },
            { key: "canceladas", label: "Canceladas" },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={`btn btn-sm rounded-pill ${
                activeTab === key ? "btn-danger" : "btn-outline-secondary"
              }`}
              onClick={() => setActiveTab(key)}
              aria-pressed={activeTab === key}
            >
              {label}
            </button>
          ))}
        </div>

        <ChatModal
          isOpen={chatOpen}
          onClose={handleCloseChat}
          anfitrion={selectedAnfitrion}
          establecimiento={selectedEstablecimiento}
        />

        <ReservationDetailsModal
          isOpen={detailsModalOpen}
          onClose={handleCloseDetails}
          reservation={selectedReservation}
          onCancelReservation={handleCancelReservation}
          onOpenChat={handleOpenChat}
        />

        {filteredReservations.length === 0 ? (
          <div className="text-center py-5" role="region" aria-live="polite" aria-label="No hay reservaciones">
            <Calendar size={64} color="#CD5C5C" className="mb-3" />
            <h4 className="text-muted">No tienes reservaciones {activeTab}</h4>
            <p className="text-muted">¿Listo para tu próxima aventura?</p>
            <button
              className="btn rounded-pill px-4 mt-3"
              style={{ backgroundColor: "#CD5C5C", color: "white" }}
              onClick={() => navigate("/search")}
            >
              Explorar alojamientos
            </button>
          </div>
        ) : (
          <div className="row g-4" aria-label="Listado de reservaciones filtradas">
            {filteredReservations.map((data) => {
              const info = getReservationInfo(data);
              const precioTotal = calcularPrecioTotal(data);  

              return (
                <article
                  key={data.reserva?.id_reserva}
                  className="col-12"
                  tabIndex={0}
                  aria-labelledby={`titulo-reserva-${data.reserva?.id_reserva}`}
                  aria-describedby={`desc-reserva-${data.reserva?.id_reserva}`}
                >
                  <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="row g-0">
                      <div className="col-md-4 position-relative">
                        <img
                          src={info.imagen}
                          alt={info.nombre}
                          style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: "250px" }}
                        />
                        {info.tipo === "experiencia" && (
                          <span
                            className="position-absolute top-0 start-0 m-3 badge"
                            style={{ backgroundColor: "#CD5C5C" }}
                          >
                            <Compass size={14} className="me-1" />
                            Experiencia
                          </span>
                        )}
                      </div>

                      <div className="col-md-8">
                        <div className="card-body p-4">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                              <h5
                                id={`titulo-reserva-${data.reserva?.id_reserva}`}
                                className="fw-bold mb-1"
                                style={{ color: "#CD5C5C" }}
                              >
                                {info.nombre}
                              </h5>
                              {info.ubicacion && (
                                <p
                                  id={`desc-reserva-${data.reserva?.id_reserva}`}
                                  className="text-muted mb-0 d-flex align-items-center gap-1"
                                >
                                  <MapPin size={16} />
                                  {formatearDireccion(info.ubicacion)}
                                </p>
                              )}
                            </div>
                            {getStatusBadge(data.reserva?.estado)}
                          </div>

                          {info.tipo === "experiencia" ? (
                            <section
                              className="mb-3"
                              aria-label="Fecha programada de experiencia"
                            >
                              <div
                                className="d-flex align-items-center gap-2 p-3 rounded-3"
                                style={{ backgroundColor: "#F4EFEA" }}
                              >
                                <Calendar size={20} color="#CD5C5C" />
                                <div>
                                  <small className="text-muted d-block">Fecha programada</small>
                                  <strong>{formatearFecha(info.fechaUnica || data.reserva?.fecha_inicio)}</strong>
                                </div>
                              </div>
                            </section>
                          ) : (
                            <section
                              className="row g-3 mb-3"
                              aria-label="Fechas de check-in y check-out"
                            >
                              <div className="col-md-6">
                                <div
                                  className="d-flex align-items-center gap-2 p-3 rounded-3"
                                  style={{ backgroundColor: "#F4EFEA" }}
                                >
                                  <Calendar size={20} color="#CD5C5C" />
                                  <div>
                                    <small className="text-muted d-block">Check-in</small>
                                    <strong>{formatearFecha(data.reserva?.fecha_inicio)}</strong>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div
                                  className="d-flex align-items-center gap-2 p-3 rounded-3"
                                  style={{ backgroundColor: "#F4EFEA" }}
                                >
                                  <Calendar size={20} color="#CD5C5C" />
                                  <div>
                                    <small className="text-muted d-block">Check-out</small>
                                    <strong>{formatearFecha(data.reserva?.fecha_fin)}</strong>
                                  </div>
                                </div>
                              </div>
                            </section>
                          )}

                          <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
                            <div>
                              <strong>Total: </strong>
                              <span style={{ color: "#CD5C5C" }}>
                                ${precioTotal.toLocaleString("es-MX")}
                              </span>
                            </div>

                            <div className="d-flex align-items-center gap-2">
                              <strong>Personas: </strong>
                              <span style={{ color: "#CD5C5C" }}>{data.reserva?.personas}</span>
                            </div>

                            <div className="d-flex align-items-center gap-2">
                              <strong>Anfitrión: </strong>
                              <span style={{ color: "#CD5C5C" }}>{info.anfitrion?.nombre}</span>
                            </div>

                            <div className="d-flex gap-2 flex-wrap">
                              <button
                                className="btn btn-outline-secondary rounded-pill btn-sm"
                                onClick={() =>
                                  handleOpenChat(
                                    info.anfitrion,
                                    info.tipo === "experiencia" ? data.experiencia : data.establecimiento,
                                    info.tipo
                                  )
                                }
                                aria-label={`Contactar con ${info.anfitrion?.nombre}`}
                              >
                                <MessageCircle size={14} className="me-1" />
                                Contactar
                              </button>
                              <button
                                className="btn btn-danger rounded-pill btn-sm"
                                onClick={() => handleOpenDetails(data)}
                                aria-label={`Ver detalles de reserva ${info.nombre}`}
                              >
                                Ver detalles
                              </button>

                              <button
                                className="btn btn-outline-primary rounded-pill btn-sm"
                                onClick={() => handleOpenReview(data)}
                                aria-label={`Agregar reseña a reserva ${info.nombre}`}
                              >
                                Agregar reseña
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {selectedProperty && (
          <ReviewUsers
            isOpen={isReviewModalOpen}
            onClose={handleCloseReview}
            data={selectedProperty}
            propertyId={selectedProperty.reserva?.id_reserva}
          />
        )}
      </div>
    </div>
  );
}
