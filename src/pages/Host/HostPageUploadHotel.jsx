import React, { useState, useEffect } from "react";
import { Upload, MapPin, Home, DollarSign, Image, Plus, X } from "lucide-react";
import { GATEWAY_URL } from '../../const/Const';


import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function HostUploadPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [id_anfitrion, setIdAnfitrion] = useState(null);

    const [formData, setFormData] = useState({
        nombre: '',
        tipo_propiedad: '',
        huespedes: '',
        habitaciones: '',
        banos: '',
        descripcion: '',
        direccion: '',
        ciudad: '',
        estado: '',
        codigo_postal: '',
        pais: 'México',
        precio_por_noche: '',
        descuento_semanal: '',
        descuento_mensual: ''
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

            const response = await fetch(`${GATEWAY_URL}/uploadImage`, {
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
            await fetch(`${GATEWAY_URL}/deleteImage/${publicId}`, {
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

    const calcularGanancias = () => {
        console.log(formData);
        const precio = parseFloat(formData.precio_por_noche) || 0;
        const descSemanal = parseFloat(formData.descuento_semanal) || 0;
        const descMensual = parseFloat(formData.descuento_mensual) || 0;

        return {
            noche: precio,
            semana: (precio * 7 * (1 - descSemanal / 100)).toFixed(2),
            mes: (precio * 30 * (1 - descMensual / 100)).toFixed(2)
        };
    };

    const handleSubmit = async () => {
        if (!formData.nombre || !formData.precio_por_noche || !formData.huespedes) {
            alert('Por favor completa los campos obligatorios');
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
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            precio_por_noche: formData.precio_por_noche,
            capacidad: formData.huespedes,
            habitaciones: formData.habitaciones || '1',
            banos: formData.banos || '1',
            tipo_propiedad: formData.tipo_propiedad,
            estado: 'pendiente',
            descuento_semanal: formData.descuento_semanal || null,
            descuento_mensual: formData.descuento_mensual || null,
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
            const response = await fetch(`${GATEWAY_URL}/createHotel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(payload)
            });
    
            const result = await response.json();
    
            if (result.success) {
                
                setFormData({
                    nombre: '',
                    tipo_propiedad: '',
                    huespedes: '',
                    habitaciones: '',
                    banos: '',
                    descripcion: '',
                    direccion: '',
                    ciudad: '',
                    estado: '',
                    codigo_postal: '',
                    pais: 'México',
                    precio_por_noche: '',
                    descuento_semanal: '',
                    descuento_mensual: ''
                });
                setImages([]);
                navigate('/host/publications');
                setStep(1);
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
    const ganancias = calcularGanancias();

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
                        <button className="btn text-muted" style={{ fontSize: "14px" }}>
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
                                                name="nombre"
                                                value={formData.nombre}
                                                onChange={handleInputChange}
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
                                                name="tipo_propiedad"
                                                value={formData.tipo_propiedad}
                                                onChange={handleInputChange}
                                                className="form-select form-select-lg py-3 px-4 rounded-3"
                                                style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
                                            >
                                                <option value="">Selecciona un tipo</option>
                                                <option value="Casa completa">Casa completa</option>
                                                <option value="Departamento">Departamento</option>
                                                <option value="Habitación privada">Habitación privada</option>
                                                <option value="Habitación compartida">Habitación compartida</option>
                                                <option value="Local comercial">Local comercial</option>
                                            </select>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-4 mb-4">
                                                <label className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                    Huéspedes
                                                </label>
                                                <input
                                                    type="number"
                                                    name="huespedes"
                                                    value={formData.huespedes}
                                                    onChange={handleInputChange}
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
                                                    name="habitaciones"
                                                    value={formData.habitaciones}
                                                    onChange={handleInputChange}
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
                                                    name="banos"
                                                    value={formData.banos}
                                                    onChange={handleInputChange}
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
                                                name="descripcion"
                                                value={formData.descripcion}
                                                onChange={handleInputChange}
                                                className="form-control py-3 px-4 rounded-3"
                                                rows="4"
                                                placeholder="Describe tu espacio, lo que lo hace especial y lo que los huéspedes pueden esperar..."
                                                style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
                                            ></textarea>
                                        </div>
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
                                            <p className="text-muted">¿Dónde se encuentra tu propiedad?</p>
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                Dirección
                                            </label>
                                            <input
                                                type="text"
                                                name="direccion"
                                                value={formData.direccion}
                                                onChange={handleInputChange}
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
                                            <small className="text-muted">Tu ubicación exacta se mostrará después de la reservación</small>
                                        </div>
                                    </div>
                                )}

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
                                                <li>Usa luz natural cuando sea posible</li>
                                                <li>Limpia y organiza el espacio antes de fotografiar</li>
                                                <li>Muestra diferentes ángulos de cada habitación</li>
                                                <li>Incluye fotos de amenidades especiales</li>
                                            </ul>
                                        </div>
                                    </div>
                                )}

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
                                                    name="precio_por_noche"
                                                    value={formData.precio_por_noche}
                                                    onChange={handleInputChange}
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
                                                    name="descuento_semanal"
                                                    value={formData.descuento_semanal}
                                                    onChange={handleInputChange}
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
                                                    name="descuento_mensual"
                                                    value={formData.descuento_mensual}
                                                    onChange={handleInputChange}
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
                                                    <span className="fw-semibold">${ganancias.noche}</span>
                                                </div>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="text-muted">1 semana (con {formData.descuento_semanal || 0}% desc.)</span>
                                                    <span className="fw-semibold">${ganancias.semana}</span>
                                                </div>
                                                <div className="d-flex justify-content-between">
                                                    <span className="text-muted">1 mes (con {formData.descuento_mensual || 0}% desc.)</span>
                                                    <span className="fw-semibold">${ganancias.mes}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

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
                                            disabled={loading}
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
                                                background: loading ? "#999" : "linear-gradient(135deg, #CD5C5C 0%, #F4EFEA 100%)",
                                                border: "none"
                                            }}
                                            onClick={handleSubmit}
                                            disabled={loading}
                                        >
                                            {loading ? 'Publicando...' : 'Publicar anuncio'}
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