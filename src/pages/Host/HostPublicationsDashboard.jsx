import React, { useState, useEffect } from "react";
import {
  Home,
  MapPin,
  DollarSign,
  Users,
  Bed,
  Bath,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  ChevronDown,
  Search,
  Compass,
  Calendar,
  Clock,
  MoreVertical,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import EditProperty from "../../components/EditProperty";
import Swal from "sweetalert2";
import { GATEWAY_URL } from "../../const/Const";

export default function HostProperties() {
  const [properties, setProperties] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("todas");
  const [typeTab, setTypeTab] = useState("hoteles");
  const [userId, setUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "nombre", direction: "asc" });
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const navigate = useNavigate();

  function parseJwt(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    let currentUserId = null;

    if (token) {
      const decodedToken = parseJwt(token);
      if (decodedToken?.id_usuario) {
        currentUserId = decodedToken.id_usuario;
        setUserId(currentUserId);
      }
    }

    const fetchProperties = async () => {
      try {
        const [experiencesRes, hotelsRes, bookingsRes] = await Promise.all([
          fetch(`${GATEWAY_URL}/api/adminTouristExperiences/getTouristExperiences`),
          fetch(`${GATEWAY_URL}/api/hospitality/getHotelData`),
          fetch(`${GATEWAY_URL}/api/booking/getBookings`),
        ]);

        const [experiencesResult, hotelsResult, bookingsResult] = await Promise.all([
          experiencesRes.json(),
          hotelsRes.json(),
          bookingsRes.json(),
        ]);

        if (experiencesResult.success && experiencesResult.data) {
          const userExperiences = experiencesResult.data.filter(
            (exp) => exp.id_anfitrion === currentUserId
          );
          setExperiences(userExperiences);
        }

        let hotelsList = [];
        if (hotelsResult.success && hotelsResult.data) {
          const userHotels = hotelsResult.data.filter(
            (prop) => prop.id_anfitrion === currentUserId
          );
          hotelsList = userHotels;
        }

        if (bookingsResult.success && bookingsResult.data) {
          const reservas = bookingsResult.data;
          hotelsList = hotelsList.map((prop) => {
            const tieneReservaActiva = reservas.some((r) => {
              const est = r.establecimiento;
              return (
                est &&
                est.id_hosteleria === prop.id_hosteleria &&
                new Date(r.reserva.fecha_fin) >= new Date()
              );
            });
            return { ...prop, tieneReservaActiva };
          });
        }

        setProperties(hotelsList);
      } catch (error) {
        console.error("Error al obtener propiedades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const filterItems = (items) => {
    let filtered = items;
    if (activeTab === "activas") {
      filtered = filtered.filter((p) => p.estado === "activo");
    } else if (activeTab === "inactivas") {
      filtered = filtered.filter((p) => p.estado === "inactivo");
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          (p.nombre || p.titulo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.direccion?.ciudad || p.direcciones?.ciudad || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  };

  const sortItems = (items, keyOverride = null) => {
    const key = keyOverride || sortConfig.key;
    return [...items].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
    });
  };

  const formatearDireccion = (direccion) => {
    if (!direccion) return "Sin ubicación";
    const ciudad = direccion.ciudad || (direccion.direcciones && direccion.direcciones.ciudad) || "";
    const estado = direccion.estado || (direccion.direcciones && direccion.direcciones.estado) || "";
    if (!ciudad && !estado) return "Sin ubicación";
    return `${ciudad}, ${estado}`.replace(/^,\s*|,\s*$/g, "").trim();
  };

  const handleToggleActive = async (id, currentStatus, isExperience = false) => {
    const newStatus = currentStatus ? "inactivo" : "activo";
    try {
      if (isExperience) {
        setExperiences(
          experiences.map((e) => (e.id_experiencia === id ? { ...e, estado: newStatus } : e))
        );
      } else {
        setProperties(
          properties.map((p) => (p.id_hosteleria === id ? { ...p, estado: newStatus } : p))
        );
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  const handleDeleteProperty = async (propertyId, isExperience = false) => {
    if (!isExperience) {
      const property = properties.find((p) => p.id_hosteleria === propertyId);

      if (property?.tieneReservaActiva) {
        Swal.fire({
          icon: "warning",
          title: "No se puede eliminar",
          text: "Esta propiedad tiene reservas activas. No puedes eliminarla hasta que finalicen todas sus reservas.",
          confirmButtonColor: "#CD5C5C",
        });
        return;
      }
    }

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer. ¿Deseas eliminar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#CD5C5C",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const endpoint = isExperience
          ? `${GATEWAY_URL}/api/adminTouristExperiences/deleteTouristExperience/${propertyId}`
          : `${GATEWAY_URL}/api/hospitality/deleteHotel/${propertyId}`;

        const response = await fetch(endpoint, {
          method: "DELETE",
        });
        const data = await response.json();

        if (data.success) {
          Swal.fire({
            icon: "success",
            title: "Eliminado",
            text: `${isExperience ? "Experiencia" : "Propiedad"} eliminada correctamente.`,
            confirmButtonColor: "#CD5C5C",
          });

          if (isExperience) {
            setExperiences(experiences.filter((e) => e.id_experiencia !== propertyId));
          } else {
            setProperties(properties.filter((p) => p.id_hosteleria !== propertyId));
          }
        } else {
          if (data.code === 'HAS_BOOKINGS') {
            Swal.fire({
              icon: "warning",
              title: "No se puede eliminar",
              html: `
              <p><strong>Esta ${isExperience ? 'experiencia' : 'propiedad'} tiene reservas asociadas.</strong></p>
              <p class="text-muted mt-3">No puedes eliminarla hasta que todas las reservas hayan finalizado o sean canceladas.</p>
            `,
              confirmButtonText: "Entendido",
              confirmButtonColor: "#CD5C5C",
            });
          } else {
            throw new Error(data.message || "Error al eliminar");
          }
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Hubo un error al eliminar.",
          confirmButtonColor: "#CD5C5C",
        });
      }
    }
  };

  const handleEditProperty = (property) => {
    setSelectedProperty(property);
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setSelectedProperty(null);
    setIsEditOpen(false);
  };

  const handleSaveProperty = (updatedProperty) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id_hosteleria === updatedProperty.id_hosteleria ? updatedProperty : p
      )
    );
    handleCloseEdit();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  const currentItems = typeTab === "hoteles" ? properties : experiences;
  const filteredItems = filterItems(currentItems);
  const sortedItems = sortItems(filteredItems);

  const stats = {
    todas: currentItems.length,
    activas: currentItems.filter((p) => p.estado === "activo").length,
    inactivas: currentItems.filter((p) => p.estado === "inactivo").length,
  };

  return (
    <div className="bg-light min-vh-100 py-3 py-md-4">
      <div className="container-fluid px-3 px-md-4">
        {/* Header Section */}
        <div className="mb-3 mb-md-4">
          <div className="mb-3">
            <h1 className="fw-bold mb-2" style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)", color: "#1a1a1a" }}>
              Mis Propiedades y Experiencias
            </h1>
            <p className="text-muted mb-3 small">Gestiona y monitorea todas tus propiedades y experiencias</p>

            <div className="row g-2">
              <div className="col-6 col-md-3 col-lg-auto">
                <button
                  onClick={() => navigate("/host/admin")}
                  className="btn w-100 w-lg-auto btn-sm btn-danger d-flex align-items-center justify-content-center gap-1 px-lg-3"
                  style={{ minHeight: "44px", whiteSpace: "nowrap" }}
                >
                  <Plus size={16} />
                  <span className="d-none d-sm-inline">Ver Reservas</span>
                  <span className="d-inline d-sm-none">Reservas</span>
                </button>
              </div>
              <div className="col-6 col-md-3 col-lg-auto">
                <button
                  onClick={() => navigate("/host/upload")}
                  className="btn w-100 w-lg-auto btn-sm btn-danger d-flex align-items-center justify-content-center gap-1 px-lg-3"
                  style={{ minHeight: "44px", whiteSpace: "nowrap" }}
                >
                  <Home size={16} />
                  <span className="d-none d-sm-inline">Nueva Propiedad</span>
                  <span className="d-inline d-sm-none">Propiedad</span>
                </button>
              </div>
              <div className="col-6 col-md-3 col-lg-auto">
                <button
                  onClick={() => navigate("/host/report")}
                  className="btn w-100 w-lg-auto btn-sm d-flex align-items-center justify-content-center gap-1 px-lg-3"
                  style={{ backgroundColor: "#8B4789", color: "white", minHeight: "44px", whiteSpace: "nowrap" }}
                >
                  <Compass size={16} />
                  <span className="d-none d-sm-inline">Reportes</span>
                  <span className="d-inline d-sm-none">Reportes</span>
                </button>
              </div>
              <div className="col-6 col-md-3 col-lg-auto">
                <button
                  onClick={() => navigate("/host/upload/tourism")}
                  className="btn w-100 w-lg-auto btn-sm d-flex align-items-center justify-content-center gap-1 px-lg-3"
                  style={{ backgroundColor: "#8B4789", color: "white", minHeight: "44px", whiteSpace: "nowrap" }}
                >
                  <Compass size={16} />
                  <span className="d-none d-sm-inline">Nueva Experiencia</span>
                  <span className="d-inline d-sm-none">Experiencia</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <ul className="nav nav-tabs mb-3 border-0" style={{ flexWrap: "nowrap", overflowX: "auto" }}>
          <li className="nav-item">
            <button
              className={`nav-link ${typeTab === "hoteles" ? "active" : ""}`}
              onClick={() => setTypeTab("hoteles")}
              style={{
                whiteSpace: "nowrap",
                borderBottom: typeTab === "hoteles" ? "3px solid #CD5C5C" : "none",
                color: typeTab === "hoteles" ? "#CD5C5C" : "#6c757d"
              }}
            >
              <Home size={16} className="me-1" />
              <span className="d-none d-sm-inline">Alojamientos</span>
              <span className="d-inline d-sm-none">Hoteles</span> ({properties.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${typeTab === "experiencias" ? "active" : ""}`}
              onClick={() => setTypeTab("experiencias")}
              style={{
                whiteSpace: "nowrap",
                borderBottom: typeTab === "experiencias" ? "3px solid #8B4789" : "none",
                color: typeTab === "experiencias" ? "#8B4789" : "#6c757d"
              }}
            >
              <Compass size={16} className="me-1" />
              Experiencias ({experiences.length})
            </button>
          </li>
        </ul>

        {/* Filters and Search */}
        <div className="card border-0 rounded-3 p-3 mb-3 shadow-sm">
          <div className="row g-2 align-items-center">
            {/* Search Bar */}
            <div className="col-12 col-md-7 col-lg-8">
              <div className="input-group">
                <span className="input-group-text bg-light border-0">
                  <Search size={16} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-0 bg-light"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ fontSize: "0.9rem" }}
                />
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="col-12 col-md-5 col-lg-4">
              <div className="d-flex gap-1 justify-content-start justify-content-md-end flex-wrap">
                {["todas", "activas", "inactivas"].map((tab) => (
                  <button
                    key={tab}
                    className={`btn btn-sm px-2 px-md-3 ${activeTab === tab ? "text-white" : "btn-outline-secondary"
                      }`}
                    style={{
                      backgroundColor: activeTab === tab
                        ? (typeTab === "hoteles" ? "#CD5C5C" : "#8B4789")
                        : "transparent",
                      border: activeTab === tab ? "none" : "1px solid #dee2e6",
                      fontSize: "0.85rem",
                      minHeight: "38px"
                    }}
                    onClick={() => setActiveTab(tab)}
                  >
                    <span className="d-none d-sm-inline">
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </span>
                    <span className="d-inline d-sm-none">
                      {tab === "todas" ? "Todas" : tab === "activas" ? "Act" : "Inac"}
                    </span>
                    {" "}({tab === "todas" ? stats.todas : tab === "activas" ? stats.activas : stats.inactivas})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Table/Cards Container */}
        <div className="card border-0 rounded-3 shadow-sm overflow-hidden">
          {filteredItems.length === 0 ? (
            <div className="p-4 text-center">
              {typeTab === "hoteles" ? (
                <Home size={48} className="text-muted mb-3" />
              ) : (
                <Compass size={48} className="text-muted mb-3" />
              )}
              <h5 className="text-muted">No hay {typeTab === "hoteles" ? "propiedades" : "experiencias"} para mostrar</h5>
              <p className="text-muted small mb-0">Intenta ajustar los filtros o crea una nueva {typeTab === "hoteles" ? "propiedad" : "experiencia"}</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View - Hidden on Mobile */}
              <div className="d-none d-lg-block table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th style={{ minWidth: "200px" }}>Propiedad / Experiencia</th>
                      <th style={{ minWidth: "150px" }}>Ubicación</th>
                      <th>Capacidad</th>
                      {typeTab === "hoteles" ? (
                        <>
                          <th>Habitaciones</th>
                          <th>Baños</th>
                          <th>Precio/Noche</th>
                        </>
                      ) : (
                        <>
                          <th>Fecha</th>
                          <th>Duración</th>
                          <th>Precio</th>
                        </>
                      )}
                      <th>Estado</th>
                      <th style={{ width: "120px" }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedItems.map((item) => {
                      const isExperience = typeTab === "experiencias";
                      const id = isExperience ? item.id_experiencia : item.id_hosteleria;
                      const name = isExperience ? item.titulo : item.nombre;

                      return (
                        <tr key={id}>
                          <td className="align-middle">
                            <div className="d-flex align-items-center gap-2">
                              <img
                                src={item.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100"}
                                alt={name}
                                className="rounded"
                                style={{ width: "50px", height: "50px", objectFit: "cover" }}
                              />
                              <div>
                                <p className="mb-0 fw-semibold text-truncate" style={{ maxWidth: "180px" }}>
                                  {name}
                                </p>
                                <small className="text-muted">ID: {id}</small>
                              </div>
                            </div>
                          </td>
                          <td className="align-middle">
                            <div className="d-flex align-items-center gap-1">
                              <MapPin size={14} className="text-muted flex-shrink-0" />
                              <span className="text-muted small">{formatearDireccion(item.direccion ?? item.direcciones)}</span>
                            </div>
                          </td>
                          <td className="align-middle">{item.capacidad}</td>
                          {!isExperience ? (
                            <>
                              <td className="align-middle">{item.habitaciones || "N/A"}</td>
                              <td className="align-middle">{item.banos || "N/A"}</td>
                              <td className="align-middle">${item.precio_por_noche?.toLocaleString("es-MX")}</td>
                            </>
                          ) : (
                            <>
                              <td className="align-middle">
                                {new Date(item.fecha_experiencia).toLocaleDateString("es-MX")}
                              </td>
                              <td className="align-middle">{item.duracion || "N/A"} hrs</td>
                              <td className="align-middle">${item.precio?.toLocaleString("es-MX")}</td>
                            </>
                          )}
                          <td className="align-middle">
                            <span
                              className={`badge rounded-pill px-2 py-1 ${item.estado === "activo"
                                  ? "bg-success-subtle text-success"
                                  : "bg-secondary-subtle text-secondary"
                                }`}
                            >
                              {item.estado === "activo" ? "Activa" : "Inactiva"}
                            </span>
                          </td>
                          <td className="align-middle">
                            <div className="d-flex gap-1">
                              <button
                                className="btn btn-sm btn-outline-secondary p-1"
                                onClick={() => handleToggleActive(id, item.estado === "activo", isExperience)}
                                title={item.estado === "activo" ? "Desactivar" : "Activar"}
                              >
                                {item.estado === "activo" ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>
                              <button
                                className="btn btn-sm btn-outline-primary p-1"
                                onClick={() => handleEditProperty(item)}
                                title="Editar"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger p-1"
                                onClick={() => handleDeleteProperty(id, isExperience)}
                                title="Eliminar"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View - Hidden on Desktop */}
              <div className="d-lg-none">
                {sortedItems.map((item) => {
                  const isExperience = typeTab === "experiencias";
                  const id = isExperience ? item.id_experiencia : item.id_hosteleria;
                  const name = isExperience ? item.titulo : item.nombre;

                  return (
                    <div key={id} className="border-bottom p-3">
                      {/* Card Header with Image and Name */}
                      <div className="d-flex gap-2 mb-3">
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100"}
                          alt={name}
                          className="rounded"
                          style={{ width: "80px", height: "80px", objectFit: "cover", flexShrink: 0 }}
                        />
                        <div className="flex-grow-1 min-width-0">
                          <h6 className="fw-bold mb-1 text-truncate">{name}</h6>
                          <p className="text-muted small mb-1">
                            <MapPin size={12} className="me-1" />
                            {formatearDireccion(item.direccion ?? item.direcciones)}
                          </p>
                          <span
                            className={`badge rounded-pill px-2 py-1 ${item.estado === "activo"
                                ? "bg-success-subtle text-success"
                                : "bg-secondary-subtle text-secondary"
                              }`}
                            style={{ fontSize: "0.75rem" }}
                          >
                            {item.estado === "activo" ? "Activa" : "Inactiva"}
                          </span>
                        </div>
                      </div>

                      {/* Card Details */}
                      <div className="row g-2 mb-3">
                        <div className="col-6">
                          <div className="d-flex align-items-center gap-1">
                            <Users size={14} className="text-muted" />
                            <small className="text-muted">Capacidad:</small>
                          </div>
                          <div className="fw-semibold">{item.capacidad}</div>
                        </div>

                        {!isExperience ? (
                          <>
                            <div className="col-6">
                              <div className="d-flex align-items-center gap-1">
                                <Bed size={14} className="text-muted" />
                                <small className="text-muted">Habitaciones:</small>
                              </div>
                              <div className="fw-semibold">{item.habitaciones || "N/A"}</div>
                            </div>
                            <div className="col-6">
                              <div className="d-flex align-items-center gap-1">
                                <Bath size={14} className="text-muted" />
                                <small className="text-muted">Baños:</small>
                              </div>
                              <div className="fw-semibold">{item.banos || "N/A"}</div>
                            </div>
                            <div className="col-6">
                              <div className="d-flex align-items-center gap-1">
                                <DollarSign size={14} className="text-muted" />
                                <small className="text-muted">Precio/Noche:</small>
                              </div>
                              <div className="fw-semibold text-success">
                                ${item.precio_por_noche?.toLocaleString("es-MX")}
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="col-6">
                              <div className="d-flex align-items-center gap-1">
                                <Calendar size={14} className="text-muted" />
                                <small className="text-muted">Fecha:</small>
                              </div>
                              <div className="fw-semibold small">
                                {new Date(item.fecha_experiencia).toLocaleDateString("es-MX")}
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="d-flex align-items-center gap-1">
                                <Clock size={14} className="text-muted" />
                                <small className="text-muted">Duración:</small>
                              </div>
                              <div className="fw-semibold">{item.duracion || "N/A"} hrs</div>
                            </div>
                            <div className="col-6">
                              <div className="d-flex align-items-center gap-1">
                                <DollarSign size={14} className="text-muted" />
                                <small className="text-muted">Precio:</small>
                              </div>
                              <div className="fw-semibold text-success">
                                ${item.precio?.toLocaleString("es-MX")}
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-secondary flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                          onClick={() => handleToggleActive(id, item.estado === "activo", isExperience)}
                          style={{ minHeight: "44px" }}
                        >
                          {item.estado === "activo" ? (
                            <>
                              <EyeOff size={16} />
                              <span>Desactivar</span>
                            </>
                          ) : (
                            <>
                              <Eye size={16} />
                              <span>Activar</span>
                            </>
                          )}
                        </button>
                        <button
                          className="btn btn-sm btn-outline-primary flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                          onClick={() => handleEditProperty(item)}
                          style={{ minHeight: "44px" }}
                        >
                          <Edit size={16} />
                          <span>Editar</span>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center"
                          onClick={() => handleDeleteProperty(id, isExperience)}
                          style={{ minHeight: "44px", minWidth: "44px" }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {isEditOpen && (
        <EditProperty
          property={selectedProperty}
          isOpen={isEditOpen}
          onClose={handleCloseEdit}
          onSave={handleSaveProperty}
          isExperience={typeTab === "experiencias"}
        />
      )}

      <style jsx>{`
        .btn-danger {
          background-color: #CD5C5C;
          border-color: #CD5C5C;
          color: white;
        }
        .btn-danger:hover {
          background-color: #B84C4C;
          border-color: #B84C4C;
        }
        .btn-purple {
          background-color: #8B4789;
          border-color: #8B4789;
          color: white;
        }
        .btn-purple:hover {
          background-color: #7A3F78;
          border-color: #7A3F78;
        }
        .nav-tabs {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .nav-tabs::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 991.98px) {
          .table-responsive {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
        }
        .min-width-0 {
          min-width: 0;
        }
      `}</style>
    </div>
  );
}
