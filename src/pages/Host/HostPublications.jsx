import React, { useState, useEffect } from "react";
import {
  Home, MapPin, DollarSign, Users, Bed, Bath, Edit, Trash2, Eye, EyeOff, Plus, ChevronDown, Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HostProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("todas");
  const [userId, setUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "nombre", direction: "asc" });
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
          fetch("http://localhost:3000/api/booking/getExperiences"),
          fetch("http://localhost:3000/api/hospitality/getHotelData"),
          fetch("http://localhost:3000/api/booking/getBookings"),
        ]);

        const [experiencesResult, hotelsResult, bookingsResult] = await Promise.all([
          experiencesRes.json(),
          hotelsRes.json(),
          bookingsRes.json(),
        ]);

        let combined = [];

        if (experiencesResult.success && experiencesResult.data) {
          const userExperiences = experiencesResult.data.filter(
            (prop) => prop.id_anfitrion === currentUserId
          );
          combined = [
            ...combined,
            ...userExperiences.map((e) => ({
              ...e,
              tipo: "experiencia",
              direccion: e.direcciones || {},
            })),
          ];
        }

        if (hotelsResult.success && hotelsResult.data) {
          const userHotels = hotelsResult.data.filter(
            (prop) => prop.id_anfitrion === currentUserId
          );
          combined = [
            ...combined,
            ...userHotels.map((h) => ({
              ...h,
              tipo: "hotel",
              direccion: h.direcciones || {},
            })),
          ];
        }

        if (bookingsResult.success && bookingsResult.data) {
          const reservas = bookingsResult.data;
          combined = combined.map((prop) => {
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

        setProperties(combined);
      } catch (error) {
        console.error("Error al obtener propiedades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const filterProperties = () => {
    let filtered = properties;
    if (activeTab === "activas") {
      filtered = filtered.filter((p) => p.estado === "activo");
    } else if (activeTab === "inactivas") {
      filtered = filtered.filter((p) => p.estado === "inactivo");
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.direccion?.ciudad || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  };

  const sortProperties = (properties) => {
    return [...properties].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
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

  const handleToggleActive = async (propertyId, currentStatus) => {
    const newStatus = currentStatus ? "inactivo" : "activo";
    try {
      setProperties(
        properties.map((p) => (p.id_hosteleria === propertyId ? { ...p, estado: newStatus } : p))
      );
    } catch (error) {
      console.error("Error al actualizar propiedad:", error);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta propiedad?")) {
      try {
        setProperties(properties.filter((p) => p.id_hosteleria !== propertyId));
      } catch (error) {
        console.error("Error al eliminar propiedad:", error);
      }
    }
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

  const filteredProperties = filterProperties();
  const sortedProperties = sortProperties(filteredProperties);
  const stats = {
    todas: properties.length,
    activas: properties.filter((p) => p.estado === "activo").length,
    inactivas: properties.filter((p) => p.estado === "inactivo").length,
  };

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", paddingTop: "10rem", paddingBottom: "3rem" }}>
      <div className="container-fluid px-4">
        {/* Header */}
        <div className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="fw-bold mb-1" style={{ fontSize: "2rem", color: "#1a1a1a" }}>
                Mis Propiedades
              </h1>
              <p className="text-muted mb-0">Gestiona y monitorea todas tus propiedades</p>
            </div>
            <button
              className="btn rounded-2"
              onClick={() => navigate("/host/upload")}
              style={{ backgroundColor: "#CD5C5C", color: "white", padding: "0.75rem 1.5rem" }}
            >
              <Plus size={18} className="me-2" />
              Nueva Propiedad
            </button>
          </div>
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
                    style={activeTab === tab ? { backgroundColor: "#CD5C5C", border: "none" } : {}}
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
        {/* Tabla de propiedades */}
        <div className="card border-0 rounded-3" style={{ backgroundColor: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          {filteredProperties.length === 0 ? (
            <div className="p-5 text-center">
              <Home size={48} className="text-muted mb-3" />
              <h5 className="text-muted">No hay propiedades para mostrar</h5>
              <p className="text-muted small">Intenta ajustar los filtros o crea una nueva propiedad</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #e9ecef" }}>
                  <tr>
                    <th className="px-4 py-3 fw-600 text-muted" onClick={() => handleSort("nombre")} style={{ cursor: "pointer", color: "#495057" }}>
                      <div className="d-flex align-items-center gap-2">
                        Propiedad <ChevronDown size={14} />
                      </div>
                    </th>
                    <th className="px-4 py-3 fw-600 text-muted" style={{ color: "#495057" }}>
                      Ubicación
                    </th>
                    <th className="px-4 py-3 fw-600 text-muted" style={{ color: "#495057" }}>
                      <div className="d-flex align-items-center gap-2">
                        Capacidad <ChevronDown size={14} />
                      </div>
                    </th>
                    <th className="px-4 py-3 fw-600 text-muted" style={{ color: "#495057" }}>
                      Habitaciones
                    </th>
                    <th className="px-4 py-3 fw-600 text-muted" style={{ color: "#495057" }}>
                      Baños
                    </th>
                    <th className="px-4 py-3 fw-600 text-muted" onClick={() => handleSort("precio_por_noche")} style={{ cursor: "pointer", color: "#495057" }}>
                      <div className="d-flex align-items-center gap-2">
                        Precio/Noche <ChevronDown size={14} />
                      </div>
                    </th>
                    <th className="px-4 py-3 fw-600 text-muted" style={{ color: "#495057" }}>
                      Estado
                    </th>
                    <th className="px-4 py-3 fw-600 text-muted" style={{ color: "#495057" }}>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProperties.map((property) => (
                    <tr key={property.id_hosteleria} style={{ borderBottom: "1px solid #e9ecef" }}>
                      <td className="px-4 py-4">
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={property.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100"}
                            alt={property.nombre}
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "8px",
                              objectFit: "cover",
                            }}
                          />
                          <div>
                            <p className="fw-600 mb-0" style={{ color: "#1a1a1a" }}>
                              {property.nombre}
                            </p>
                            <small className="text-muted">ID: {property.id_hosteleria}</small>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="d-flex align-items-center gap-2">
                          <MapPin size={16} className="text-muted" />
                          <span className="text-muted small">{formatearDireccion(property.direccion)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="d-flex align-items-center gap-2">
                          <Users size={16} style={{ color: "#CD5C5C" }} />
                          <span className="fw-500">{property.capacidad}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="d-flex align-items-center gap-2">
                          <Bed size={16} style={{ color: "#CD5C5C" }} />
                          <span className="fw-500">{property.habitaciones || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="d-flex align-items-center gap-2">
                          <Bath size={16} style={{ color: "#CD5C5C" }} />
                          <span className="fw-500">{property.banos || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="fw-bold" style={{ color: "#CD5C5C", fontSize: "1.1rem" }}>
                          ${property.precio_por_noche?.toLocaleString("es-MX")}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`badge rounded-pill px-3 py-2 ${
                            property.estado === "activo"
                              ? "bg-success-subtle text-success"
                              : "bg-secondary-subtle text-secondary"
                          }`}
                        >
                          {property.estado === "activo" ? "Activa" : "Inactiva"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-secondary rounded-2 p-2"
                            onClick={() =>
                              handleToggleActive(property.id_hosteleria, property.estado === "activo")
                            }
                            title={property.estado === "activo" ? "Desactivar" : "Activar"}
                            style={{
                              width: "36px",
                              height: "36px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {property.estado === "activo" ? <EyeOff size={16} /> : <Eye size={16} />}
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
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger rounded-2 p-2"
                            onClick={() => handleDeleteProperty(property.id_hosteleria)}
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
