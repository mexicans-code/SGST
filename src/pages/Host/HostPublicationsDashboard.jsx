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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import EditProperty from "../../components/EditProperty";
import Swal from "sweetalert2";

export default function HostProperties() {
  const [properties, setProperties] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("todas");
  const [typeTab, setTypeTab] = useState("hoteles"); // "hoteles" o "experiencias"
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
          fetch("http://localhost:3000/api/adminTouristExperiences/getTouristExperiences"),
          fetch("http://localhost:3000/api/hospitality/getHotelData"),
          fetch("http://localhost:3000/api/booking/getBookings"),
        ]);

        const [experiencesResult, hotelsResult, bookingsResult] = await Promise.all([
          experiencesRes.json(),
          hotelsRes.json(),
          bookingsRes.json(),
        ]);

        // Procesar experiencias turísticas
        if (experiencesResult.success && experiencesResult.data) {
          const userExperiences = experiencesResult.data.filter(
            (exp) => exp.id_anfitrion === currentUserId
          );
          setExperiences(userExperiences);
        }

        // Procesar hoteles
        let hotelsList = [];
        if (hotelsResult.success && hotelsResult.data) {
          const userHotels = hotelsResult.data.filter(
            (prop) => prop.id_anfitrion === currentUserId
          );
          hotelsList = userHotels;
        }

        // Validar reservas activas para hoteles
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
    const { ciudad, estado } = direccion;
    return `${ciudad || ""}, ${estado || ""}`.replace(/^,\s*|,\s*$/g, "").trim();
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
        ? `http://localhost:3000/api/adminTouristExperiences/deleteTouristExperience/${propertyId}`
        : `http://localhost:3000/api/hospitality/deleteHotel/${propertyId}`;

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
        // Verificar si es error de reservas asociadas
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
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", paddingTop: "10rem", paddingBottom: "3rem" }}>
      <div className="container-fluid px-4">
        {/* Header */}
        <div className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="fw-bold mb-1" style={{ fontSize: "2rem", color: "#1a1a1a" }}>
                Mis Propiedades y Experiencias
              </h1>
              <button
                onClick={() => navigate("/host/admin")}
                className="btn rounded-2 mb-4 mt-2 ms-2 me-2"
                style={{ backgroundColor: "#CD5C5C", color: "white", padding: "0.5rem 1.5rem" }}
              >
                <Plus size={18} className="me-2" />
                Ver Reservas
              </button>
              <p className="text-muted mb-0">Gestiona y monitorea todas tus propiedades y experiencias</p>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn rounded-2"
                onClick={() => navigate("/host/upload")}
                style={{ backgroundColor: "#CD5C5C", color: "white", padding: "0.75rem 1.5rem" }}
              >
                <Home size={18} className="me-2" />
                Nueva Propiedad
              </button>
              <button
                className="btn rounded-2"
                onClick={() => navigate("/host/upload/tourism")}
                style={{ backgroundColor: "#8B4789", color: "white", padding: "0.75rem 1.5rem" }}
              >
                <Compass size={18} className="me-2" />
                Nueva Experiencia
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${typeTab === "hoteles" ? "active" : ""}`}
                style={{
                  color: typeTab === "hoteles" ? "#CD5C5C" : "#6c757d",
                  borderBottom: typeTab === "hoteles" ? "3px solid #CD5C5C" : "none",
                  fontWeight: typeTab === "hoteles" ? "600" : "normal"
                }}
                onClick={() => setTypeTab("hoteles")}
              >
                <Home size={18} className="me-2" />
                Alojamientos ({properties.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${typeTab === "experiencias" ? "active" : ""}`}
                style={{
                  color: typeTab === "experiencias" ? "#8B4789" : "#6c757d",
                  borderBottom: typeTab === "experiencias" ? "3px solid #8B4789" : "none",
                  fontWeight: typeTab === "experiencias" ? "600" : "normal"
                }}
                onClick={() => setTypeTab("experiencias")}
              >
                <Compass size={18} className="me-2" />
                Experiencias ({experiences.length})
              </button>
            </li>
          </ul>
        </div>

        {/* Filtros y búsqueda */}
        <div className="card border-0 rounded-3 p-4 mb-4" style={{ backgroundColor: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text border-0" style={{ backgroundColor: "#f8f9fa" }}>
                  <Search size={18} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-0"
                  placeholder="Buscar por nombre o ubicación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ backgroundColor: "#f8f9fa" }}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex gap-2 justify-content-end">
                {["todas", "activas", "inactivas"].map((tab) => (
                  <button
                    key={tab}
                    className={`btn btn-sm rounded-2 px-3 ${activeTab === tab ? "text-white" : "btn-outline-secondary"}`}
                    style={activeTab === tab ? { backgroundColor: typeTab === "hoteles" ? "#CD5C5C" : "#8B4789", border: "none" } : {}}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)} (
                    {tab === "todas" ? stats.todas : tab === "activas" ? stats.activas : stats.inactivas})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="card border-0 rounded-3" style={{ backgroundColor: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          {filteredItems.length === 0 ? (
            <div className="p-5 text-center">
              {typeTab === "hoteles" ? <Home size={48} className="text-muted mb-3" /> : <Compass size={48} className="text-muted mb-3" />}
              <h5 className="text-muted">No hay {typeTab === "hoteles" ? "propiedades" : "experiencias"} para mostrar</h5>
              <p className="text-muted small">Intenta ajustar los filtros o crea una nueva {typeTab === "hoteles" ? "propiedad" : "experiencia"}</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #e9ecef" }}>
                  <tr>
                    <th className="px-4 py-3 fw-600 text-muted" style={{ color: "#495057" }}>
                      {typeTab === "hoteles" ? "Propiedad" : "Experiencia"}
                    </th>
                    <th className="px-4 py-3 fw-600 text-muted" style={{ color: "#495057" }}>
                      Ubicación
                    </th>
                    <th className="px-4 py-3 fw-600 text-muted" style={{ color: "#495057" }}>
                      Capacidad
                    </th>
                    {typeTab === "hoteles" ? (
                      <>
                        <th className="px-4 py-3 fw-600 text-muted" style={{ color: "#495057" }}>
                          Habitaciones
                        </th>
                        <th className="px-4 py-3 fw-600 text-muted" style={{ color: "#495057" }}>
                          Baños
                        </th>
                        <th className="px-4 py-3 fw-600 text-muted" style={{ color: "#495057" }}>
                          Precio/Noche
                        </th>
                      </>
                    ) : (
                      <>
                        <th className="px-4 py-3 fw-600 text-muted" style={{ color: "#495057" }}>
                          Fecha
                        </th>
                        <th className="px-4 py-3 fw-600 text-muted" style={{ color: "#495057" }}>
                          Duración
                        </th>
                        <th className="px-4 py-3 fw-600 text-muted" style={{ color: "#495057" }}>
                          Precio
                        </th>
                      </>
                    )}
                    <th className="px-4 py-3 fw-600 text-muted" style={{ color: "#495057" }}>
                      Estado
                    </th>
                    <th className="px-4 py-3 fw-600 text-muted" style={{ color: "#495057" }}>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedItems.map((item) => {
                    const isExperience = typeTab === "experiencias";
                    const id = isExperience ? item.id_experiencia : item.id_hosteleria;
                    const name = isExperience ? item.titulo : item.nombre;
                    const direccion = isExperience ? item.direcciones : item.direccion;

                    return (
                      <tr key={id} style={{ borderBottom: "1px solid #e9ecef" }}>
                        <td className="px-4 py-4">
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={item.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100"}
                              alt={name}
                              style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "8px",
                                objectFit: "cover",
                              }}
                            />
                            <div>
                              <p className="fw-600 mb-0" style={{ color: "#1a1a1a" }}>
                                {name}
                              </p>
                              <small className="text-muted">ID: {id}</small>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="d-flex align-items-center gap-2">
                            <MapPin size={16} className="text-muted" />
                            <span className="text-muted small">{formatearDireccion(direccion)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="d-flex align-items-center gap-2">
                            <Users size={16} style={{ color: isExperience ? "#8B4789" : "#CD5C5C" }} />
                            <span className="fw-500">{item.capacidad}</span>
                          </div>
                        </td>
                        {!isExperience ? (
                          <>
                            <td className="px-4 py-4">
                              <div className="d-flex align-items-center gap-2">
                                <Bed size={16} style={{ color: "#CD5C5C" }} />
                                <span className="fw-500">{item.habitaciones || "N/A"}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="d-flex align-items-center gap-2">
                                <Bath size={16} style={{ color: "#CD5C5C" }} />
                                <span className="fw-500">{item.banos || "N/A"}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className="fw-bold" style={{ color: "#CD5C5C", fontSize: "1.1rem" }}>
                                ${item.precio_por_noche?.toLocaleString("es-MX")}
                              </span>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-4">
                              <div className="d-flex align-items-center gap-2">
                                <Calendar size={16} style={{ color: "#8B4789" }} />
                                <span className="fw-500">
                                  {new Date(item.fecha_experiencia).toLocaleDateString("es-MX")}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="d-flex align-items-center gap-2">
                                <Clock size={16} style={{ color: "#8B4789" }} />
                                <span className="fw-500">{item.duracion || "N/A"} hrs</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className="fw-bold" style={{ color: "#8B4789", fontSize: "1.1rem" }}>
                                ${item.precio?.toLocaleString("es-MX")}
                              </span>
                            </td>
                          </>
                        )}
                        <td className="px-4 py-4">
                          <span
                            className={`badge rounded-pill px-3 py-2 ${item.estado === "activo"
                              ? "bg-success-subtle text-success"
                              : "bg-secondary-subtle text-secondary"
                              }`}
                          >
                            {item.estado === "activo" ? "Activa" : "Inactiva"}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-outline-secondary rounded-2 p-2"
                              onClick={() =>
                                handleToggleActive(id, item.estado === "activo", isExperience)
                              }
                              title={item.estado === "activo" ? "Desactivar" : "Activar"}
                              style={{
                                width: "36px",
                                height: "36px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {item.estado === "activo" ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                            <button
                              className="btn btn-sm btn-outline-primary rounded-2 p-2"
                              title="Editar"
                              style={{
                                width: "36px",
                                height: "36px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              onClick={() => handleEditProperty(item)}
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger rounded-2 p-2"
                              onClick={() => handleDeleteProperty(id, isExperience)}
                              title="Eliminar"
                              style={{
                                width: "36px",
                                height: "36px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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
    </div>
  );
}
