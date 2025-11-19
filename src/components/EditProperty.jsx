import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

import { GATEWAY_URL } from "../const/Const";

export default function EditProperty({ property, isOpen, onClose, onSave, isExperience = false }) {
  const [formData, setFormData] = useState({
    // Campos comunes
    nombre: "",
    titulo: "",
    descripcion: "",
    capacidad: 0,
    estado: "activo",
    
    // Campos de hotel
    precio_por_noche: 0,
    habitaciones: 0,
    banos: 0,
    
    // Campos de experiencia
    precio: 0,
    fecha_experiencia: "",
    duracion: 0,
    incluye: "",
    no_incluye: "",
    requisitos: "",
    idiomas: "",
    tipo_experiencia: "",
    
    // Dirección
    direccion: {
      calle: "",
      ciudad: "",
      estado: "",
      pais: "",
      colonia: "",
      numero_exterior: "",
      numero_interior: "",
      codigo_postal: "",
    },
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (property) {
      const direccionData = property.direccion || property.direcciones || {};
      
      if (isExperience) {
        setFormData({
          titulo: property.titulo || "",
          descripcion: property.descripcion || "",
          capacidad: property.capacidad || 0,
          estado: property.estado || "activo",
          precio: property.precio || 0,
          fecha_experiencia: property.fecha_experiencia || "",
          duracion: property.duracion || 0,
          incluye: property.incluye || "",
          no_incluye: property.no_incluye || "",
          requisitos: property.requisitos || "",
          idiomas: property.idiomas || "",
          tipo_experiencia: property.tipo_experiencia || "",
          direccion: {
            calle: direccionData.calle || "",
            ciudad: direccionData.ciudad || "",
            estado: direccionData.estado || "",
            pais: direccionData.pais || "",
            colonia: direccionData.colonia || "",
            numero_exterior: direccionData.numero_exterior || "",
            numero_interior: direccionData.numero_interior || "",
            codigo_postal: direccionData.codigo_postal || "",
          },
        });
      } else {
        setFormData({
          nombre: property.nombre || "",
          descripcion: property.descripcion || "",
          precio_por_noche: property.precio_por_noche || 0,
          habitaciones: property.habitaciones || 0,
          banos: property.banos || 0,
          capacidad: property.capacidad || 0,
          estado: property.estado || "activo",
          direccion: {
            calle: direccionData.calle || "",
            ciudad: direccionData.ciudad || "",
            estado: direccionData.estado || "",
            pais: direccionData.pais || "",
            colonia: direccionData.colonia || "",
            numero_exterior: direccionData.numero_exterior || "",
            numero_interior: direccionData.numero_interior || "",
            codigo_postal: direccionData.codigo_postal || "",
          },
        });
      }
    }
  }, [property, isExperience]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = [
      "precio_por_noche", "habitaciones", "banos", "capacidad", "precio", "duracion"
    ];
    
    setFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      let payload;

      if (isExperience) {
        // Actualizar experiencia turística
        const id = property.id_experiencia;
        
        payload = {
          titulo: formData.titulo,
          descripcion: formData.descripcion,
          fecha_experiencia: formData.fecha_experiencia,
          precio: formData.precio,
          capacidad: formData.capacidad,
          duracion: formData.duracion,
          incluye: formData.incluye,
          no_incluye: formData.no_incluye,
          requisitos: formData.requisitos,
          idiomas: formData.idiomas,
          tipo_experiencia: formData.tipo_experiencia,
          estado: formData.estado,
          direccion: JSON.stringify(formData.direccion)
        };

        response = await fetch(
          `${GATEWAY_URL}/api/adminTouristExperiences/updateExperience/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
      } else {
        // Actualizar hotel
        const id = property.id_hosteleria;
        
        payload = {
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          precio_por_noche: formData.precio_por_noche,
          capacidad: formData.capacidad,
          habitaciones: formData.habitaciones,
          banos: formData.banos,
          estado: formData.estado,
          direccion: JSON.stringify(formData.direccion)
        };

        response = await fetch(
          `${GATEWAY_URL}/api/hospitality/updateHotel/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
      }

      const result = await response.json();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "¡Actualizado!",
          text: `${isExperience ? "Experiencia" : "Propiedad"} actualizada correctamente.`,
          confirmButtonColor: isExperience ? "#8B4789" : "#CD5C5C",
        });

        // Actualizar el estado local con los datos del servidor
        const updatedProperty = {
          ...property,
          ...formData,
          ...(result.data || {}),
        };
        
        onSave(updatedProperty);
        onClose();
      } else {
        throw new Error(result.error || "Error al actualizar");
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Hubo un error al actualizar ${isExperience ? "la experiencia" : "la propiedad"}.`,
        confirmButtonColor: "#CD5C5C",
      });
    } finally {
      setLoading(false);
    }
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
              Editar {isExperience ? "Experiencia" : "Propiedad"}
            </h4>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Cerrar"
              disabled={loading}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body p-4" style={{ maxHeight: "70vh", overflowY: "auto" }}>
            <form onSubmit={handleSubmit} id="editPropertyForm">
              {/* Información General */}
              <h5 className="fw-semibold mb-3" style={{ color: isExperience ? "#8B4789" : "#CD5C5C" }}>
                Información General
              </h5>
              <div className="row g-3 mb-4">
                {/* Nombre/Título */}
                <div className="col-12">
                  <label className="form-label fw-semibold" style={{ color: "#495057" }}>
                    {isExperience ? "Título de la experiencia" : "Nombre de la propiedad"}
                  </label>
                  <input
                    type="text"
                    name={isExperience ? "titulo" : "nombre"}
                    value={isExperience ? formData.titulo : formData.nombre}
                    onChange={handleChange}
                    className="form-control"
                    placeholder={isExperience ? "Ej: Tour por la ciudad" : "Ej: Casa en la playa"}
                    required
                    disabled={loading}
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
                    placeholder={isExperience ? "Describe la experiencia..." : "Describe tu propiedad..."}
                    rows={4}
                    disabled={loading}
                    style={{ borderRadius: "8px" }}
                  />
                </div>

                {/* Campos específicos de EXPERIENCIA */}
                {isExperience ? (
                  <>
                    {/* Tipo de experiencia */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold" style={{ color: "#495057" }}>
                        Tipo de experiencia
                      </label>
                      <select
                        name="tipo_experiencia"
                        value={formData.tipo_experiencia}
                        onChange={handleChange}
                        className="form-select"
                        disabled={loading}
                        style={{ borderRadius: "8px" }}
                      >
                        <option value="">Selecciona un tipo</option>
                        <option value="Aventura">Aventura</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Gastronómica">Gastronómica</option>
                        <option value="Naturaleza">Naturaleza</option>
                        <option value="Deportiva">Deportiva</option>
                        <option value="Artística">Artística</option>
                      </select>
                    </div>

                    {/* Fecha */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold" style={{ color: "#495057" }}>
                        Fecha de experiencia
                      </label>
                      <input
                        type="date"
                        name="fecha_experiencia"
                        value={formData.fecha_experiencia}
                        onChange={handleChange}
                        className="form-control"
                        disabled={loading}
                        style={{ borderRadius: "8px" }}
                      />
                    </div>

                    {/* Precio */}
                    <div className="col-md-4">
                      <label className="form-label fw-semibold" style={{ color: "#495057" }}>
                        Precio por persona ($)
                      </label>
                      <input
                        type="number"
                        name="precio"
                        min="0"
                        value={formData.precio}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="0"
                        required
                        disabled={loading}
                        style={{ borderRadius: "8px" }}
                      />
                    </div>

                    {/* Duración */}
                    <div className="col-md-4">
                      <label className="form-label fw-semibold" style={{ color: "#495057" }}>
                        Duración (horas)
                      </label>
                      <input
                        type="number"
                        name="duracion"
                        min="0"
                        value={formData.duracion}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="0"
                        disabled={loading}
                        style={{ borderRadius: "8px" }}
                      />
                    </div>

                    {/* Capacidad */}
                    <div className="col-md-4">
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
                        disabled={loading}
                        style={{ borderRadius: "8px" }}
                      />
                    </div>
                  </>
                ) : (
                  /* Campos específicos de HOTEL */
                  <>
                    {/* Precio por noche */}
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
                        disabled={loading}
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
                        disabled={loading}
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
                        disabled={loading}
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
                        disabled={loading}
                        style={{ borderRadius: "8px" }}
                      />
                    </div>
                  </>
                )}

                {/* Estado (común para ambos) */}
                <div className="col-12">
                  <label className="form-label fw-semibold" style={{ color: "#495057" }}>
                    Estado
                  </label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="form-select"
                    disabled={loading}
                    style={{ borderRadius: "8px" }}
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              {/* Dirección */}
              <h5 className="fw-semibold mb-3" style={{ color: isExperience ? "#8B4789" : "#CD5C5C" }}>
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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
                    style={{ borderRadius: "8px" }}
                  />
                </div>

                {/* Código Postal */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: "#495057" }}>
                    Código Postal
                  </label>
                  <input
                    type="text"
                    name="codigo_postal"
                    value={formData.direccion.codigo_postal}
                    onChange={handleDireccionChange}
                    className="form-control"
                    placeholder="Ej: 12345"
                    disabled={loading}
                    style={{ borderRadius: "8px" }}
                  />
                </div>

                {/* País */}
                <div className="col-md-6">
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
                    disabled={loading}
                    style={{ borderRadius: "8px" }}
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div
            className="modal-footer border-0 pt-0"
            style={{ backgroundColor: "#f8f9fa", borderRadius: "0 0 12px 12px" }}
          >
            <button
              type="button"
              className="btn btn-outline-secondary rounded-pill px-4"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="editPropertyForm"
              className="btn rounded-pill px-4"
              style={{ backgroundColor: isExperience ? "#8B4789" : "#CD5C5C", color: "white" }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Guardando...
                </>
              ) : (
                "Guardar cambios"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
