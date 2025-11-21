import React, { useState, useEffect } from "react";
import { Upload, MapPin, Compass, DollarSign, Image, Plus, X, Calendar, Users } from "lucide-react";
import Swal from "sweetalert2";
import { GATEWAY_URL } from "../../const/Const";


import { useNavigate } from "react-router-dom";

export default function CreateTouristExperience() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        fecha_experiencia: '',
        capacidad: '',
        duracion: '',
        incluye: '',
        no_incluye: '',
        requisitos: '',
        idiomas: '',
        direccion: '',
        ciudad: '',
        estado: '',
        codigo_postal: '',
        pais: 'México',
        precio: '',
        tipo_experiencia: ''
    });

    function parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken = parseJwt(token);
            if (decodedToken?.id_usuario) {
                setUserId(decodedToken.id_usuario);
            }
        }
    }, []);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            alert('La imagen no debe superar 10MB');
            return;
        }

        if (!file.type.startsWith('image/')) {
            alert('Solo se permiten imágenes');
            return;
        }

        setUploadingImage(true);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(`https://hospitality-production-72f9.up.railway.app/uploadImage`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                setImages(prev => [...prev, {
                    url: result.imageUrl,
                    publicId: result.publicId
                }]);
            } else {
                alert('Error al subir imagen: ' + result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al subir la imagen');
        } finally {
            setUploadingImage(false);
        }
    };

    const removeImage = async (index) => {
        const imageToRemove = images[index];

        try {
            const publicId = encodeURIComponent(imageToRemove.publicId);
            await fetch(`https://hospitality-production-72f9.up.railway.app/deleteImage/${publicId}`, {
                method: 'DELETE'
            });

            setImages(images.filter((_, i) => i !== index));
        } catch (error) {
            console.error('Error al eliminar imagen:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        if (!formData.titulo || !formData.precio || !formData.capacidad || !formData.fecha_experiencia) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor completa los campos obligatorios',
                confirmButtonColor: '#CD5C5C'
            });
            return;
        }

        if (!userId) {
            alert('Error: No se pudo obtener la información del usuario');
            return;
        }

        if (images.length === 0) {
            alert('Por favor sube al menos una imagen');
            return;
        }

        setLoading(true);

        const payload = {
            id_anfitrion: userId,
            titulo: formData.titulo,
            descripcion: formData.descripcion,
            fecha_experiencia: formData.fecha_experiencia,
            capacidad: formData.capacidad,
            duracion: formData.duracion,
            incluye: formData.incluye,
            no_incluye: formData.no_incluye,
            requisitos: formData.requisitos,
            idiomas: formData.idiomas,
            tipo_experiencia: formData.tipo_experiencia,
            precio: formData.precio,
            estado: 'activo',
            direccion: JSON.stringify({
                calle: formData.direccion,
                ciudad: formData.ciudad,
                estado: formData.estado,
                codigo_postal: formData.codigo_postal,
                pais: formData.pais
            }),
            image: images[0].url
        };

        console.log('📤 Enviando payload:', payload);

        try {
            const response = await fetch(`${GATEWAY_URL}/api/adminTouristExperiences/createTouristExperience`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Experiencia publicada!',
                    text: 'Tu experiencia turística ha sido creada exitosamente',
                    confirmButtonColor: '#CD5C5C'
                }).then(() => {
                    navigate('/host/publications');
                });
            } else {
                alert('Error al publicar: ' + result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
            <header className="bg-white shadow-sm py-3 border">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center">
                        <img
                            src="https://blogger.googleusercontent.com/img/a/AVvXsEhjjv5anKGHGaRt5CNdVF8Hz9RdIHor9kmWhQwXqnJcHaOHhGEt4XyvIOymsgqvwJiJZCjkE15JavstMTSSnwD1meWD1ZW5dD6QTfDxkDiIJfS2MzP8E1XqzmmAqnSGwHjeab-B4tf5KI62qs8gLuYLOVzMam_veip1vVIvkPzZNccw1iuA1cNqeO6klNw"
                            style={{ width: "120px" }}
                            alt="logo"
                        />
                        <button className="btn text-muted" style={{ fontSize: "14px" }} onClick={() => navigate(-1)}>
                            Guardar y salir
                        </button>
                    </div>
                </div>
            </header>

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

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4 p-md-5">
                                {/* STEP 1: Información Básica */}
                                {step === 1 && (
                                    <div>
                                        <div className="text-center mb-5">
                                            <div className="mb-3">
                                                <Compass size={48} color="#CD5C5C" />
                                            </div>
                                            <h2 className="fw-bold mb-2" style={{ color: "#CD5C5C" }}>
                                                Información de la Experiencia
                                            </h2>
                                            <p className="text-muted">Cuéntanos sobre la experiencia que ofreces</p>
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                Título de la experiencia *
                                            </label>
                                            <input
                                                type="text"
                                                name="titulo"
                                                value={formData.titulo}
                                                onChange={handleInputChange}
                                                className="form-control form-control-lg py-3 px-4 rounded-3"
                                                placeholder="Ej: Tour guiado por la ciudad colonial"
                                                style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                Tipo de experiencia *
                                            </label>
                                            <select
                                                name="tipo_experiencia"
                                                value={formData.tipo_experiencia}
                                                onChange={handleInputChange}
                                                className="form-select form-select-lg py-3 px-4 rounded-3"
                                                style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
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

                                        <div className="row">
                                            <div className="col-md-6 mb-4">
                                                <label className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                    Fecha de experiencia *
                                                </label>
                                                <input
                                                    type="date"
                                                    name="fecha_experiencia"
                                                    value={formData.fecha_experiencia}
                                                    onChange={handleInputChange}
                                                    className="form-control form-control-lg py-3 px-4 rounded-3"
                                                    style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-4">
                                                <label className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                    Duración (horas)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="duracion"
                                                    value={formData.duracion}
                                                    onChange={handleInputChange}
                                                    className="form-control form-control-lg py-3 px-4 rounded-3"
                                                    placeholder="3"
                                                    min="1"
                                                    style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                Capacidad máxima *
                                            </label>
                                            <input
                                                type="number"
                                                name="capacidad"
                                                value={formData.capacidad}
                                                onChange={handleInputChange}
                                                className="form-control form-control-lg py-3 px-4 rounded-3"
                                                placeholder="10"
                                                min="1"
                                                style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                Descripción *
                                            </label>
                                            <textarea
                                                name="descripcion"
                                                value={formData.descripcion}
                                                onChange={handleInputChange}
                                                className="form-control py-3 px-4 rounded-3"
                                                rows="4"
                                                placeholder="Describe la experiencia, qué incluye, qué harán los participantes..."
                                                style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
                                            ></textarea>
                                        </div>

                                        {/* <div className="row">
                                            <div className="col-md-6 mb-4">
                                                <label className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                    ¿Qué incluye?
                                                </label>
                                                <textarea
                                                    name="incluye"
                                                    value={formData.incluye}
                                                    onChange={handleInputChange}
                                                    className="form-control py-3 px-4 rounded-3"
                                                    rows="3"
                                                    placeholder="Transporte, comida, equipo..."
                                                    style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
                                                ></textarea>
                                            </div>
                                            <div className="col-md-6 mb-4">
                                                <label className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                    ¿Qué NO incluye?
                                                </label>
                                                <textarea
                                                    name="no_incluye"
                                                    value={formData.no_incluye}
                                                    onChange={handleInputChange}
                                                    className="form-control py-3 px-4 rounded-3"
                                                    rows="3"
                                                    placeholder="Propinas, bebidas, souvenirs..."
                                                    style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 mb-4">
                                                <label className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                    Requisitos
                                                </label>
                                                <textarea
                                                    name="requisitos"
                                                    value={formData.requisitos}
                                                    onChange={handleInputChange}
                                                    className="form-control py-3 px-4 rounded-3"
                                                    rows="3"
                                                    placeholder="Edad mínima, condición física..."
                                                    style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
                                                ></textarea>
                                            </div>
                                            <div className="col-md-6 mb-4">
                                                <label className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                    Idiomas disponibles
                                                </label>
                                                <input
                                                    type="text"
                                                    name="idiomas"
                                                    value={formData.idiomas}
                                                    onChange={handleInputChange}
                                                    className="form-control form-control-lg py-3 px-4 rounded-3"
                                                    placeholder="Español, Inglés"
                                                    style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
                                                />
                                            </div>
                                        </div> */}
                                    </div>
                                )}

                                {step === 2 && (
                                    <div>
                                        <div className="text-center mb-5">
                                            <div className="mb-3">
                                                <MapPin size={48} color="#CD5C5C" />
                                            </div>
                                            <h2 className="fw-bold mb-2" style={{ color: "#CD5C5C" }}>
                                                Ubicación
                                            </h2>
                                            <p className="text-muted">¿Dónde se realiza la experiencia?</p>
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                Dirección / Punto de encuentro
                                            </label>
                                            <input
                                                type="text"
                                                name="direccion"
                                                value={formData.direccion}
                                                onChange={handleInputChange}
                                                className="form-control form-control-lg py-3 px-4 rounded-3"
                                                placeholder="Calle y número o punto de referencia"
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
                                                    name="ciudad"
                                                    value={formData.ciudad}
                                                    onChange={handleInputChange}
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
                                                    name="estado"
                                                    value={formData.estado}
                                                    onChange={handleInputChange}
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
                                                    name="codigo_postal"
                                                    value={formData.codigo_postal}
                                                    onChange={handleInputChange}
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
                                                    name="pais"
                                                    value={formData.pais}
                                                    onChange={handleInputChange}
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
                                            <small className="text-muted">La ubicación exacta se compartirá después de la reservación</small>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 3: Fotos */}
                                {step === 3 && (
                                    <div>
                                        <div className="text-center mb-5">
                                            <div className="mb-3">
                                                <Image size={48} color="#CD5C5C" />
                                            </div>
                                            <h2 className="fw-bold mb-2" style={{ color: "#CD5C5C" }}>
                                                Fotos de la experiencia
                                            </h2>
                                            <p className="text-muted">Muestra lo que vivirán los participantes (mínimo 3 fotos)</p>
                                        </div>

                                        <div className="row g-3 mb-4">
                                            {images.map((img, index) => (
                                                <div key={index} className="col-md-4">
                                                    <div
                                                        className="position-relative rounded-3 overflow-hidden"
                                                        style={{ backgroundColor: "#F4EFEA", height: "150px", border: "2px solid #e9ecef" }}
                                                    >
                                                        <img
                                                            src={img.url}
                                                            alt={`Upload ${index + 1}`}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
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
                                                    <label
                                                        className="w-100 h-100 border-0 rounded-3 d-flex flex-column align-items-center justify-content-center"
                                                        style={{
                                                            backgroundColor: "#F4EFEA",
                                                            minHeight: "150px",
                                                            border: "2px dashed #e9ecef",
                                                            cursor: uploadingImage ? 'not-allowed' : 'pointer',
                                                            opacity: uploadingImage ? 0.6 : 1
                                                        }}
                                                    >
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleImageUpload}
                                                            disabled={uploadingImage}
                                                            style={{ display: 'none' }}
                                                        />
                                                        {uploadingImage ? (
                                                            <>
                                                                <Upload size={32} color="#CD5C5C" className="mb-2" />
                                                                <span style={{ color: "#CD5C5C" }} className="fw-semibold">
                                                                    Subiendo...
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Plus size={32} color="#CD5C5C" className="mb-2" />
                                                                <span style={{ color: "#CD5C5C" }} className="fw-semibold">
                                                                    Agregar foto
                                                                </span>
                                                            </>
                                                        )}
                                                    </label>
                                                </div>
                                            )}
                                        </div>

                                        <div className="alert" style={{ backgroundColor: "#F4EFEA", border: "1px solid #e9ecef" }}>
                                            <h6 className="fw-semibold mb-2" style={{ color: "#000000" }}>
                                                Consejos para mejores fotos:
                                            </h6>
                                            <ul className="mb-0 text-muted small">
                                                <li>Muestra momentos reales de la experiencia</li>
                                                <li>Incluye fotos de los lugares que visitarán</li>
                                                <li>Captura la emoción y diversión de los participantes</li>
                                                <li>Usa luz natural cuando sea posible</li>
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 4: Precio */}
                                {step === 4 && (
                                    <div>
                                        <div className="text-center mb-5">
                                            <div className="mb-3">
                                                <DollarSign size={48} color="#CD5C5C" />
                                            </div>
                                            <h2 className="fw-bold mb-2" style={{ color: "#CD5C5C" }}>
                                                Precio por persona
                                            </h2>
                                            <p className="text-muted">Establece tu tarifa por participante</p>
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                Precio por persona (MXN) *
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
                                                    name="precio"
                                                    value={formData.precio}
                                                    onChange={handleInputChange}
                                                    className="form-control py-3 px-4 rounded-end-3"
                                                    placeholder="500"
                                                    style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef", borderLeft: "none" }}
                                                />
                                            </div>
                                        </div>

                                        <div className="card rounded-3" style={{ backgroundColor: "#F4EFEA", border: "none" }}>
                                            <div className="card-body p-4">
                                                <h6 className="fw-semibold mb-3" style={{ color: "#000000" }}>
                                                    Resumen de ganancias estimadas
                                                </h6>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="text-muted">1 persona</span>
                                                    <span className="fw-semibold">${formData.precio || 0}</span>
                                                </div>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="text-muted">
                                                        Grupo completo ({formData.capacidad || 10} personas)
                                                    </span>
                                                    <span className="fw-semibold">
                                                        ${((formData.precio || 0) * (formData.capacidad || 10)).toLocaleString('es-MX')}
                                                    </span>
                                                </div>
                                                <hr />
                                                <small className="text-muted d-block">
                                                    *Las ganancias son aproximadas. Se aplicarán las comisiones de la plataforma.
                                                </small>
                                            </div>
                                        </div>

                                        <div className="alert mt-4" style={{ backgroundColor: "#F4EFEA", border: "1px solid #e9ecef" }}>
                                            <h6 className="fw-semibold mb-2" style={{ color: "#000000" }}>
                                                <Users size={18} className="me-2" />
                                                Recuerda:
                                            </h6>
                                            <ul className="mb-0 text-muted small">
                                                <li>El precio debe ser competitivo pero justo para tu experiencia</li>
                                                <li>Considera todos los costos (transporte, materiales, alimentación)</li>
                                                <li>Puedes actualizar el precio en cualquier momento</li>
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {/* Botones de navegación */}
                                <div className="d-flex justify-content-between mt-5">
                                    <button
                                        className="btn btn-outline-secondary rounded-pill px-4"
                                        onClick={() => setStep(Math.max(1, step - 1))}
                                        disabled={step === 1}
                                    >
                                        Anterior
                                    </button>

                                    {step < 4 ? (
                                        <button
                                            className="btn rounded-pill px-4"
                                            style={{ backgroundColor: "#CD5C5C", color: "white" }}
                                            onClick={() => setStep(step + 1)}
                                        >
                                            Siguiente
                                        </button>
                                    ) : (
                                        <button
                                            className="btn rounded-pill px-5"
                                            style={{ backgroundColor: "#CD5C5C", color: "white" }}
                                            onClick={handleSubmit}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Publicando...
                                                </>
                                            ) : (
                                                'Publicar Experiencia'
                                            )}
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
