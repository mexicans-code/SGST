import React, { useState, useEffect } from "react";

export default function EditProperty({ property, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio_por_noche: 0,
    habitaciones: 0,
    banos: 0,
    capacidad: 0,
    estado: "activo",
    direccion: {
      calle: "",
      ciudad: "",
      estado: "",
      pais: "",
      colonia: "",
      numero_exterior: "",
      numero_interior: "",
    },
  });

  useEffect(() => {
    if (property) {
      setFormData({
        nombre: property.nombre || "",
        descripcion: property.descripcion || "",
        precio_por_noche: property.precio_por_noche || 0,
        habitaciones: property.habitaciones || 0,
        banos: property.banos || 0,
        capacidad: property.capacidad || 0,
        estado: property.estado || "activo",
        direccion: {
          calle: property.direccion?.calle || "",
          ciudad: property.direccion?.ciudad || "",
          estado: property.direccion?.estado || "",
          pais: property.direccion?.pais || "",
          colonia: property.direccion?.colonia || "",
          numero_exterior: property.direccion?.numero_exterior || "",
          numero_interior: property.direccion?.numero_interior || "",
        },
      });
    }
  }, [property]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "precio_por_noche" ||
        name === "habitaciones" ||
        name === "banos" ||
        name === "capacidad"
          ? Number(value)
          : value,
    }));
  };

  const handleDireccionChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      direccion: {
        ...prev.direccion,
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...property, ...formData });
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "12px" }}>
          {/* Header */}
          <div
            className="modal-header border-0 pb-0"
            style={{ backgroundColor: "#f8f9fa", borderRadius: "12px 12px 0 0" }}
          >
            <h4 className="modal-title fw-bold" style={{ color: "#1a1a1a" }}>
              Editar Propiedad
            </h4>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Cerrar"
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body p-4" style={{ maxHeight: "70vh", overflowY: "auto" }}>
            <form onSubmit={handleSubmit} id="editPropertyForm">
              {/* Información General */}
              <h5 className="fw-semibold mb-3" style={{ color: "#CD5C5C" }}>
                Información General
              </h5>
              <div className="row g-3 mb-4">
                {/* Nombre */}
                <div className="col-12">
                  <label className="form-label fw-semibold" style={{ color: "#495057" }}>
                    Nombre de la propiedad
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Ej: Casa en la playa"
                    required
                    style={{ borderRadius: "8px" }}
                  />
                </div>

                {/* Descripción */}
                <div className="col-12">
                  <label className="form-label fw-semibold" style={{ color: "#495057" }}>
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Describe tu propiedad..."
                    rows={4}
                    style={{ borderRadius: "8px" }}
                  />
                </div>

                {/* Precio */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: "#495057" }}>
                    Precio por noche ($)
                  </label>
                  <input
                    type="number"
                    name="precio_por_noche"
                    min="0"
                    value={formData.precio_por_noche}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="0"
                    required
                    style={{ borderRadius: "8px" }}
                  />
                </div>

                {/* Capacidad */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: "#495057" }}>
                    Capacidad (personas)
                  </label>
                  <input
                    type="number"
                    name="capacidad"
                    min="0"
                    value={formData.capacidad}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="0"
                    style={{ borderRadius: "8px" }}
                  />
                </div>

                {/* Habitaciones */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: "#495057" }}>
                    Habitaciones
                  </label>
                  <input
                    type="number"
                    name="habitaciones"
                    min="0"
                    value={formData.habitaciones}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="0"
                    style={{ borderRadius: "8px" }}
                  />
                </div>

                {/* Baños */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: "#495057" }}>
                    Baños
                  </label>
                  <input
                    type="number"
                    name="banos"
                    min="0"
                    value={formData.banos}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="0"
                    style={{ borderRadius: "8px" }}
                  />
                </div>

                {/* Estado */}
                <div className="col-12">
                  <label className="form-label fw-semibold" style={{ color: "#495057" }}>
                    Estado
                  </label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="form-select"
                    style={{ borderRadius: "8px" }}
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              {/* Dirección */}
              <h5 className="fw-semibold mb-3" style={{ color: "#CD5C5C" }}>
                Dirección
              </h5>
              <div className="row g-3">
                {/* Calle */}
                <div className="col-12">
                  <label className="form-label fw-semibold" style={{ color: "#495057" }}>
                    Calle
                  </label>
                  <input
                    type="text"
                    name="calle"
                    value={formData.direccion.calle}
                    onChange={handleDireccionChange}
                    className="form-control"
                    placeholder="Ej: Av. Reforma"
                    style={{ borderRadius: "8px" }}
                  />
                </div>

                {/* Número Exterior */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: "#495057" }}>
                    Número Exterior
                  </label>
                  <input
                    type="text"
                    name="numero_exterior"
                    value={formData.direccion.numero_exterior}
                    onChange={handleDireccionChange}
                    className="form-control"
                    placeholder="Ej: 123"
                    style={{ borderRadius: "8px" }}
                  />
                </div>

                {/* Número Interior */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: "#495057" }}>
                    Número Interior
                  </label>
                  <input
                    type="text"
                    name="numero_interior"
                    value={formData.direccion.numero_interior}
                    onChange={handleDireccionChange}
                    className="form-control"
                    placeholder="Ej: Apt 4B"
                    style={{ borderRadius: "8px" }}
                  />
                </div>

                {/* Colonia */}
                <div className="col-12">
                  <label className="form-label fw-semibold" style={{ color: "#495057" }}>
                    Colonia
                  </label>
                  <input
                    type="text"
                    name="colonia"
                    value={formData.direccion.colonia}
                    onChange={handleDireccionChange}
                    className="form-control"
                    placeholder="Ej: Centro"
                    style={{ borderRadius: "8px" }}
                  />
                </div>

                {/* Ciudad */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: "#495057" }}>
                    Ciudad
                  </label>
                  <input
                    type="text"
                    name="ciudad"
                    value={formData.direccion.ciudad}
                    onChange={handleDireccionChange}
                    className="form-control"
                    placeholder="Ej: Ciudad de México"
                    required
                    style={{ borderRadius: "8px" }}
                  />
                </div>

                {/* Estado */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: "#495057" }}>
                    Estado/Provincia
                  </label>
                  <input
                    type="text"
                    name="estado"
                    value={formData.direccion.estado}
                    onChange={handleDireccionChange}
                    className="form-control"
                    placeholder="Ej: CDMX"
                    required
                    style={{ borderRadius: "8px" }}
                  />
                </div>

                {/* País */}
                <div className="col-12">
                  <label className="form-label fw-semibold" style={{ color: "#495057" }}>
                    País
                  </label>
                  <input
                    type="text"
                    name="pais"
                    value={formData.direccion.pais}
                    onChange={handleDireccionChange}
                    className="form-control"
                    placeholder="Ej: México"
                    required
                    style={{ borderRadius: "8px" }}
                  />
                </div>
              </div>
            </form>
          </div>

          <div
            className="modal-footer border-0 pt-0"
            style={{ backgroundColor: "#f8f9fa", borderRadius: "0 0 12px 12px" }}
          >
            <button
              type="button"
              className="btn btn-outline-secondary rounded-pill px-4"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="editPropertyForm"
              className="btn rounded-pill px-4"
              style={{ backgroundColor: "#CD5C5C", color: "white" }}
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
