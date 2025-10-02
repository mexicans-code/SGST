import React, { useState } from "react";
import { Upload, MapPin, Home, DollarSign, Image, Plus, X } from "lucide-react";

export default function HostUploadPage() {
    const [step, setStep] = useState(1);
    const [images, setImages] = useState([]);

    const addImage = () => {
        if (images.length < 5) {
            setImages([...images, `Imagen ${images.length + 1}`]);
        }
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    return (
        <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
            {/* Header */}
            <header className="bg-white shadow-sm py-3 border">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center">
                        <img
                            src="https://blogger.googleusercontent.com/img/a/AVvXsEhjjv5anKGHGaRt5CNdVF8Hz9RdIHor9kmWhQwXqnJcHaOHhGEt4XyvIOymsgqvwJiJZCjkE15JavstMTSSnwD1meWD1ZW5dD6QTfDxkDiIJfS2MzP8E1XqzmmAqnSGwHjeab-B4tf5KI62qs8gLuYLOVzMam_veip1vVIvkPzZNccw1iuA1cNqeO6klNw"
                            style={{ width: "120px" }}
                            alt="logo"
                        />
                        <button
                            className="btn text-muted"
                            style={{ fontSize: "14px" }}
                        >
                            Guardar y salir
                        </button>
                    </div>
                </div>
            </header>

            {/* Progress Bar */}
            <div className="bg-white border-bottom">
                <div className="container py-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-semibold" style={{ color: "#000000" }}>Paso {step} de 4</span>
                        <span className="text-muted small">{Math.round((step / 4) * 100)}% completado</span>
                    </div>
                    <div className="progress" style={{ height: "6px" }}>
                        <div
                            className="progress-bar"
                            style={{
                                width: `${(step / 4) * 100}%`,
                                backgroundColor: "#CD5C5C"
                            }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4 p-md-5">
                                {/* Step 1: Información Básica */}
                                {step === 1 && (
                                    <div>
                                        <div className="text-center mb-5">
                                            <div className="mb-3">
                                                <Home size={48} color="#CD5C5C" />
                                            </div>
                                            <h2 className="fw-bold mb-2" style={{ color: "#CD5C5C" }}>
                                                Información Básica
                                            </h2>
                                            <p className="text-muted">Cuéntanos sobre tu espacio</p>
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                Nombre del lugar
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg py-3 px-4 rounded-3"
                                                placeholder="Ej: Casa acogedora en el centro"
                                                style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                Tipo de propiedad
                                            </label>
                                            <select
                                                className="form-select form-select-lg py-3 px-4 rounded-3"
                                                style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
                                            >
                                                <option>Selecciona un tipo</option>
                                                <option>Casa completa</option>
                                                <option>Departamento</option>
                                                <option>Habitación privada</option>
                                                <option>Habitación compartida</option>
                                                <option>Local comercial</option>
                                            </select>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-4 mb-4">
                                                <label className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                    Huéspedes
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control form-control-lg py-3 px-4 rounded-3"
                                                    placeholder="2"
                                                    min="1"
                                                    style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
                                                />
                                            </div>
                                            <div className="col-md-4 mb-4">
                                                <label className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                    Habitaciones
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control form-control-lg py-3 px-4 rounded-3"
                                                    placeholder="1"
                                                    min="1"
                                                    style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
                                                />
                                            </div>
                                            <div className="col-md-4 mb-4">
                                                <label className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                    Baños
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control form-control-lg py-3 px-4 rounded-3"
                                                    placeholder="1"
                                                    min="1"
                                                    style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                Descripción
                                            </label>
                                            <textarea
                                                className="form-control py-3 px-4 rounded-3"
                                                rows="4"
                                                placeholder="Describe tu espacio, lo que lo hace especial y lo que los huéspedes pueden esperar..."
                                                style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
                                            ></textarea>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Ubicación */}
                                {step === 2 && (
                                    <div>
                                        <div className="text-center mb-5">
                                            <div className="mb-3">
                                                <MapPin size={48} color="#CD5C5C" />
                                            </div>
                                            <h2 className="fw-bold mb-2" style={{ color: "#CD5C5C" }}>
                                                Ubicación
                                            </h2>
                                            <p className="text-muted">¿Dónde se encuentra tu propiedad?</p>
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                Dirección
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg py-3 px-4 rounded-3"
                                                placeholder="Calle y número"
                                                style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
                                            />
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 mb-4">
                                                <label className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                    Ciudad
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-lg py-3 px-4 rounded-3"
                                                    placeholder="Ciudad"
                                                    style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-4">
                                                <label className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                    Estado
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-lg py-3 px-4 rounded-3"
                                                    placeholder="Estado"
                                                    style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
                                                />
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 mb-4">
                                                <label className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                    Código Postal
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-lg py-3 px-4 rounded-3"
                                                    placeholder="12345"
                                                    style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-4">
                                                <label className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                    País
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-lg py-3 px-4 rounded-3"
                                                    placeholder="México"
                                                    style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
                                                />
                                            </div>
                                        </div>

                                        <div
                                            className="bg-light rounded-3 p-4 text-center"
                                            style={{ backgroundColor: "#F4EFEA", border: "2px dashed #e9ecef", minHeight: "200px" }}
                                        >
                                            <MapPin size={32} color="#999" className="mb-2" />
                                            <p className="text-muted mb-0">Vista previa del mapa</p>
                                            <small className="text-muted">Tu ubicación exacta se mostrará después de la reservación</small>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Fotos */}
                                {step === 3 && (
                                    <div>
                                        <div className="text-center mb-5">
                                            <div className="mb-3">
                                                <Image size={48} color="#CD5C5C" />
                                            </div>
                                            <h2 className="fw-bold mb-2" style={{ color: "#CD5C5C" }}>
                                                Fotos del lugar
                                            </h2>
                                            <p className="text-muted">Muestra lo mejor de tu espacio (mínimo 5 fotos)</p>
                                        </div>

                                        <div className="row g-3 mb-4">
                                            {images.map((img, index) => (
                                                <div key={index} className="col-md-4">
                                                    <div
                                                        className="position-relative rounded-3 overflow-hidden"
                                                        style={{ backgroundColor: "#F4EFEA", height: "150px", border: "2px solid #e9ecef" }}
                                                    >
                                                        <div className="d-flex align-items-center justify-content-center h-100">
                                                            <Image size={32} color="#999" />
                                                        </div>
                                                        <button
                                                            className="btn btn-sm position-absolute top-0 end-0 m-2"
                                                            style={{ backgroundColor: "#FFFFFF", border: "none" }}
                                                            onClick={() => removeImage(index)}
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                        <div className="position-absolute bottom-0 start-0 m-2">
                                                            <span className="badge" style={{ backgroundColor: "#CD5C5C" }}>
                                                                {index + 1}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {images.length < 5 && (
                                                <div className="col-md-4">
                                                    <button
                                                        className="w-100 h-100 border-0 rounded-3 d-flex flex-column align-items-center justify-content-center"
                                                        style={{
                                                            backgroundColor: "#F4EFEA",
                                                            minHeight: "150px",
                                                            border: "2px dashed #e9ecef"
                                                        }}
                                                        onClick={addImage}
                                                    >
                                                        <Plus size={32} color="#CD5C5C" className="mb-2" />
                                                        <span style={{ color: "#CD5C5C" }} className="fw-semibold">
                                                            Agregar foto
                                                        </span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="alert" style={{ backgroundColor: "#F4EFEA", border: "1px solid #e9ecef" }}>
                                            <h6 className="fw-semibold mb-2" style={{ color: "#000000" }}>
                                                Consejos para mejores fotos:
                                            </h6>
                                            <ul className="mb-0 text-muted small">
                                                <li>Usa luz natural cuando sea posible</li>
                                                <li>Limpia y organiza el espacio antes de fotografiar</li>
                                                <li>Muestra diferentes ángulos de cada habitación</li>
                                                <li>Incluye fotos de amenidades especiales</li>
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {/* Step 4: Precio */}
                                {step === 4 && (
                                    <div>
                                        <div className="text-center mb-5">
                                            <div className="mb-3">
                                                <DollarSign size={48} color="#CD5C5C" />
                                            </div>
                                            <h2 className="fw-bold mb-2" style={{ color: "#CD5C5C" }}>
                                                Precio y Disponibilidad
                                            </h2>
                                            <p className="text-muted">Establece tu tarifa por noche</p>
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                Precio por noche (MXN)
                                            </label>
                                            <div className="input-group input-group-lg">
                                                <span
                                                    className="input-group-text fw-bold rounded-start-3"
                                                    style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
                                                >
                                                    $
                                                </span>
                                                <input
                                                    type="number"
                                                    className="form-control py-3 px-4 rounded-end-3"
                                                    placeholder="500"
                                                    style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef", borderLeft: "none" }}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                Descuento por semana (opcional)
                                            </label>
                                            <div className="input-group input-group-lg">
                                                <input
                                                    type="number"
                                                    className="form-control py-3 px-4 rounded-start-3"
                                                    placeholder="10"
                                                    style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
                                                />
                                                <span
                                                    className="input-group-text fw-bold rounded-end-3"
                                                    style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
                                                >
                                                    %
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                Descuento por mes (opcional)
                                            </label>
                                            <div className="input-group input-group-lg">
                                                <input
                                                    type="number"
                                                    className="form-control py-3 px-4 rounded-start-3"
                                                    placeholder="20"
                                                    style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
                                                />
                                                <span
                                                    className="input-group-text fw-bold rounded-end-3"
                                                    style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
                                                >
                                                    %
                                                </span>
                                            </div>
                                        </div>

                                        <div className="card rounded-3" style={{ backgroundColor: "#F4EFEA", border: "none" }}>
                                            <div className="card-body p-4">
                                                <h6 className="fw-semibold mb-3" style={{ color: "#000000" }}>
                                                    Resumen de ganancias estimadas
                                                </h6>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="text-muted">1 noche</span>
                                                    <span className="fw-semibold">$500</span>
                                                </div>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="text-muted">1 semana (con 10% desc.)</span>
                                                    <span className="fw-semibold">$3,150</span>
                                                </div>
                                                <div className="d-flex justify-content-between">
                                                    <span className="text-muted">1 mes (con 20% desc.)</span>
                                                    <span className="fw-semibold">$12,000</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                <div className="d-flex justify-content-between mt-5 pt-4 border-top">
                                    {step > 1 && (
                                        <button
                                            className="btn btn-lg px-5 py-3 fw-semibold rounded-3"
                                            style={{
                                                backgroundColor: "#FFFFFF",
                                                border: "2px solid #e9ecef",
                                                color: "#000000"
                                            }}
                                            onClick={() => setStep(step - 1)}
                                        >
                                            Anterior
                                        </button>
                                    )}
                                    {step < 4 ? (
                                        <button
                                            className="btn btn-lg px-5 py-3 fw-semibold rounded-3 text-white ms-auto"
                                            style={{
                                                background: "linear-gradient(135deg, #CD5C5C 0%, #F4EFEA 100%)",
                                                border: "none"
                                            }}
                                            onClick={() => setStep(step + 1)}
                                        >
                                            Siguiente
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-lg px-5 py-3 fw-semibold rounded-3 text-white ms-auto"
                                            style={{
                                                background: "linear-gradient(135deg, #CD5C5C 0%, #F4EFEA 100%)",
                                                border: "none"
                                            }}
                                        >
                                            Publicar anuncio
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}