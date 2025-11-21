import { useState, useEffect } from 'react';
import { MapPin, Star, Users, Calendar, MessageSquare, Check, ArrowLeft, Shield, Clock, Phone, Mail, Edit3, Plus, Minus, ChevronDown, ChevronUp, X, Maximize2, ChevronLeft, ChevronRight, Compass, Languages, Award, Camera } from 'lucide-react';

import { useNavigate } from "react-router-dom";
import Reviews from '../components/Reviews';

import { GATEWAY_URL } from '../const/Const';

export default function TourismReservationInfo() {
    // Estado para los datos de la experiencia
    const [experienceData, setExperienceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [isEditingParticipants, setIsEditingParticipants] = useState(false);
    const [comments, setComments] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);

    // Estados para galería
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    // Cargar datos desde localStorage al montar
    useEffect(() => {
        const experienceId = localStorage.getItem('experienceId');

        if (!experienceId) {
            console.warn("No se encontró el ID de la experiencia en localStorage");
            setExperienceData(null);
            setLoading(false);
            return;
        }

        const fetchExperience = async () => {
            try {
                setLoading(true);
                const response = await fetch(`https://valiant-cooperation-production.up.railway.app/getTouristExperience/${experienceId}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const result = await response.json();

                if (result.success && result.data) {
                    // Mapea los datos según lo que necesitas
                    const data = result.data;
                    const completeData = {
                        id: data.id_experiencia,
                        name: data.titulo,
                        description: data.descripcion || "",
                        location: data.direcciones ? `${data.direcciones.ciudad}, ${data.direcciones.estado}` : 'Ubicación no disponible',
                        pricePerPerson: data.precio,
                        rating: data.calificacion ?? 4.5,
                        reviews: data.reviews || [],
                        images: data.image ? [data.image] : [],
                        category: data.tipo_experiencia,
                        duration: data.duracion,
                        minParticipants: 1,
                        language: data.idioma || "Español",
                        difficulty: data.dificultad || "Básico",
                        maxParticipants: data.capacidad,
                        meetingPoint: data.punto_encuentro || "",
                        includes: data.incluye || [],
                        id_anfitrion: data.id_anfitrion || null,
                        fechaExperiencia: data.fecha_experiencia,
                        reviews: data.reviews ? data.reviews.length : 0
                    };
                    setExperienceData(completeData);
                } else {
                    throw new Error("Experiencia no encontrada");
                }
            } catch (error) {
                console.error("Error al cargar la experiencia:", error);
                setExperienceData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchExperience();
    }, []);

    const [participants, setParticipants] = useState(
        experienceData ? experienceData.minParticipants : 1 // si no existe experienceData aún, inicia en 1
    );

    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <div className="spinner-border" style={{ width: '3rem', height: '3rem', color: '#87CEEB' }}>
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-3">Cargando información de la experiencia...</p>
                </div>
            </div>
        );
    }

    if (!experienceData) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <Compass size={48} className="text-muted mb-3" />
                    <p className="text-muted">No se encontró información de la experiencia</p>
                </div>
            </div>
        );
    }

    // Cálculos de precio
    const subtotal = experienceData.pricePerPerson * participants;
    const serviceFee = Math.round(subtotal * 0.12);
    const taxes = Math.round(subtotal * 0.08);
    const total = subtotal + serviceFee + taxes;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const adjustParticipants = (increment) => {
        const newParticipants = participants + increment;
        if (newParticipants >= experienceData.minParticipants && newParticipants <= experienceData.maxParticipants) {
            setParticipants(newParticipants);
        }
    };

    const handleConfirmReservation = () => {
        if (!agreedToTerms) {
            alert('Debes aceptar los términos y condiciones');
            return;
        }

        const reservationData = {
            id: experienceData.id,
            id_experiencia: experienceData.id,
            id_anfitrion: experienceData.id_anfitrion,
            name: experienceData.name,
            description: experienceData.description,
            location: experienceData.location,
            rating: experienceData.rating,
            images: experienceData.images,
            category: experienceData.category,
            participants,
            fechaExperiencia: experienceData.fechaExperiencia,

            // Pricing
            pricePerPerson: experienceData.pricePerPerson,
            price: experienceData.pricePerPerson, // Para compatibilidad
            subtotal,
            serviceFee,
            taxes,
            total,

            // Detalles adicionales
            comments,
            duration: experienceData.duration,
            meetingPoint: experienceData.meetingPoint,
            includes: experienceData.includes,

            reservationType: 'tourism'
        };

        localStorage.setItem('reservationData', JSON.stringify(reservationData));

        navigate('/payment');

        console.log('Reserva confirmada:', reservationData);
    };

    const getIncludeIcon = (item) => {
        if (item.toLowerCase().includes('guía')) return <Award size={16} style={{ color: '#87CEEB' }} />;
        if (item.toLowerCase().includes('transporte')) return <Compass size={16} style={{ color: '#87CEEB' }} />;
        if (item.toLowerCase().includes('comida')) return <Users size={16} style={{ color: '#87CEEB' }} />;
        if (item.toLowerCase().includes('equipo')) return <Shield size={16} style={{ color: '#87CEEB' }} />;
        if (item.toLowerCase().includes('seguro')) return <Shield size={16} style={{ color: '#87CEEB' }} />;
        return <Check size={16} style={{ color: '#87CEEB' }} />;
    };

    return (
        <div style={{ backgroundColor: '#FFFFFF' }} className="min-vh-100 py-4">
            <div className="container">
                {/* Header */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="d-flex align-items-center mb-3">
                            <button
                                className="btn btn-light rounded-circle me-3"
                                style={{ width: '48px', height: '48px' }}
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="h2 fw-bold mb-1" style={{ color: '#2C3E50' }}>
                                    Confirmar experiencia
                                </h1>
                                <p className="text-muted mb-0">
                                    Revisa los detalles de tu aventura antes de continuar
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Galería de fotos */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-0 position-relative">
                                <div className="row g-2">
                                    <div className="col-md-6">
                                        <div className="position-relative">
                                            <img
                                                src={experienceData.images[0]}
                                                className="img-fluid rounded-start"
                                                alt={experienceData.name}
                                                style={{
                                                    height: '400px',
                                                    width: '100%',
                                                    objectFit: 'cover',
                                                    cursor: 'pointer'
                                                }}
                                            />
                                            <div
                                                className="position-absolute top-0 end-0 m-3 badge"
                                                style={{ backgroundColor: '#87CEEB' }}
                                            >
                                                <Camera size={14} className="me-1" />
                                                {experienceData.images.length} fotos
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="row g-2 h-100">
                                            {experienceData.images.slice(1, 5).map((image, index) => (
                                                <div key={index} className="col-6">
                                                    <img
                                                        src={image}
                                                        className="img-fluid rounded"
                                                        alt={`${experienceData.name} ${index + 2}`}
                                                        style={{
                                                            height: '195px',
                                                            width: '100%',
                                                            objectFit: 'cover',
                                                            cursor: 'pointer'
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="row align-items-start">
                                        <div className="col-md-8">
                                            <div className="badge bg-light text-dark mb-2">
                                                {experienceData.category}
                                            </div>
                                            <h2 className="fw-bold mb-2" style={{ color: '#2C3E50' }}>
                                                {experienceData.name}
                                            </h2>
                                            <div className="d-flex align-items-center mb-2">
                                                <MapPin size={16} className="me-2 text-muted" />
                                                <span className="text-muted">{experienceData.location}</span>
                                            </div>
                                            <p className="text-muted mb-3">{experienceData.description}</p>

                                            <div className="d-flex flex-wrap gap-3 mb-3">
                                                <div className="d-flex align-items-center">
                                                    <Clock size={16} className="me-2" style={{ color: '#87CEEB' }} />
                                                    <span className="small">{experienceData.duration} horas</span>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <Languages size={16} className="me-2" style={{ color: '#87CEEB' }} />
                                                    <span className="small">{experienceData.language}</span>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <Award size={16} className="me-2" style={{ color: '#87CEEB' }} />
                                                    <span className="small">Dificultad: {experienceData.difficulty}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="d-flex align-items-center mb-2">
                                                <Star size={16} className="text-warning me-1" fill="currentColor" />
                                                <span className="fw-semibold me-1">{experienceData.rating}</span>
                                                <span className="text-muted">({experienceData.reviews} reseñas)</span>
                                            </div>
                                            <div className="small text-muted">
                                                Grupo: {experienceData.minParticipants}-{experienceData.maxParticipants} personas
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-lg-8">
                        {/* Detalles de la reserva */}
                        <div className="card border-0 shadow-sm rounded-4 mb-4">
                            <div className="card-body p-4">
                                <h3 className="h4 fw-bold mb-4" style={{ color: '#2C3E50' }}>
                                    Detalles de tu experiencia
                                </h3>

                                <div className="row g-4">
                                    {/* Fecha de la experiencia */}
                                    <div className="col-md-6">
                                        <div className="d-flex align-items-start">
                                            <Calendar size={24} style={{ color: '#87CEEB' }} className="me-3 mt-1" />
                                            <div className="flex-grow-1">
                                                <div className="d-flex align-items-center justify-content-between mb-2">
                                                    <h6 className="fw-bold mb-0" style={{ color: '#2C3E50' }}>
                                                        Fecha de la experiencia
                                                    </h6>
                                                </div>
                                                <div className="small text-muted">
                                                    {experienceData.fechaExperiencia ? formatDate(experienceData.fechaExperiencia) : 'Fecha no disponible'}
                                                </div>

                                            </div>
                                        </div>
                                    </div>


                                    {/* Participantes */}
                                    <div className="col-md-6">
                                        <div className="d-flex align-items-start">
                                            <Users size={24} style={{ color: '#87CEEB' }} className="me-3 mt-1" />
                                            <div className="flex-grow-1">
                                                <div className="d-flex align-items-center justify-content-between mb-2">
                                                    <h6 className="fw-bold mb-0" style={{ color: '#2C3E50' }}>
                                                        Participantes
                                                    </h6>
                                                    <button
                                                        onClick={() => setIsEditingParticipants(!isEditingParticipants)}
                                                        className="btn btn-link p-1 text-decoration-none"
                                                        style={{ color: '#87CEEB' }}
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                </div>

                                                {isEditingParticipants ? (
                                                    <div>
                                                        <div className="d-flex align-items-center mb-3">
                                                            <button
                                                                onClick={() => adjustParticipants(-1)}
                                                                className="btn btn-outline-secondary btn-sm rounded-circle me-3"
                                                                style={{ width: '32px', height: '32px' }}
                                                                disabled={participants <= experienceData.minParticipants} // No deja pasar del mínimo
                                                            >
                                                                <Minus size={14} />
                                                            </button>
                                                            <span className="fw-bold fs-5 mx-3">{participants}</span>
                                                            <button
                                                                onClick={() => adjustParticipants(1)}
                                                                className="btn btn-outline-secondary btn-sm rounded-circle ms-3"
                                                                style={{ width: '32px', height: '32px' }}
                                                                disabled={participants >= experienceData.maxParticipants} // No deja pasar del máximo
                                                            >
                                                                <Plus size={14} />
                                                            </button>
                                                        </div>
                                                        <small className="text-muted">
                                                            Mínimo: {experienceData.minParticipants} • Máximo: {experienceData.maxParticipants}
                                                        </small>
                                                        <div className="mt-2">
                                                            <button
                                                                onClick={() => setIsEditingParticipants(false)}
                                                                className="btn btn-sm"
                                                                style={{
                                                                    backgroundColor: '#87CEEB',
                                                                    color: 'white',
                                                                    border: 'none'
                                                                }}
                                                            >
                                                                Confirmar participantes
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-muted mb-0">
                                                        {participants} {participants === 1 ? 'persona' : 'personas'}
                                                    </p>
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
{/* 
                        <div className="card border-0 shadow-sm rounded-4 mb-4">
                            <div className="card-body p-4">
                                <h3 className="h4 fw-bold mb-3" style={{ color: '#2C3E50' }}>
                                    <MapPin size={24} style={{ color: '#87CEEB' }} className="me-2" />
                                    Punto de encuentro
                                </h3>

                                <div className="mb-3">
                                    <p className="fw-semibold mb-2">{experienceData.meetingPoint}</p>
                                    <p className="small text-muted mb-2">
                                        Te enviaremos las instrucciones detalladas después de confirmar tu reserva.
                                    </p>
                                    <div className="alert alert-info mb-0" role="alert">
                                        <Clock size={16} className="me-2" />
                                        <small>Por favor llega 15 minutos antes de la hora programada</small>
                                    </div>
                                </div>

                                <div className="rounded-3 overflow-hidden" style={{ height: '300px' }}>
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29682.458547391442!2d-99.47293774677246!3d21.214782487722707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d44fc00ad6c7d9%3A0x50bcc7f9e8ad0b2a!2sJalpan%20de%20Serra%2C%20Qro.!5e0!3m2!1ses!2smx!4v1709834567890!5m2!1ses!2smx"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Punto de encuentro"
                                    />
                                </div>
                            </div>
                        </div> */}


                        <div className="col-12 card border-0 shadow-sm rounded-4">
                            <Reviews />
                        </div>


                        {/* Comentarios
                        <div className="card border-0 shadow-sm rounded-4 mb-4">
                            <div className="card-body p-4">
                                <div
                                    className="d-flex align-items-center justify-content-between cursor-pointer"
                                    onClick={() => setIsCommentsExpanded(!isCommentsExpanded)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <h3 className="h4 fw-bold mb-0 d-flex align-items-center" style={{ color: '#2C3E50' }}>
                                        <MessageSquare size={24} style={{ color: '#87CEEB' }} className="me-2" />
                                        Comentarios o solicitudes especiales
                                    </h3>
                                    <button className="btn btn-link p-0" style={{ color: '#87CEEB' }}>
                                        {isCommentsExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </button>
                                </div>

                                <p className="text-muted mb-0 mt-2 small">
                                    {isCommentsExpanded ?
                                        "Agrega cualquier información relevante para tu experiencia" :
                                        "Haz clic para agregar comentarios o solicitudes"
                                    }
                                </p>

                                {isCommentsExpanded && (
                                    <div className="mt-4">
                                        <div className="row g-2 mb-3">
                                            {[
                                                "Restricciones alimenticias",
                                                "Necesidades especiales",
                                                "Nivel de experiencia",
                                                "Celebración especial",
                                                "Preferencia de idioma",
                                                "Otros"
                                            ].map((tag, index) => (
                                                <div className="col-6" key={index}>
                                                    <button
                                                        onClick={() => setComments(comments + (comments ? ', ' : '') + tag.toLowerCase())}
                                                        className="btn btn-outline-secondary btn-sm w-100 text-start"
                                                    >
                                                        {tag}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        <textarea
                                            className="form-control border-2 mb-3"
                                            rows="4"
                                            placeholder="Ejemplo: Soy vegetariano, primera vez en senderismo, celebramos aniversario..."
                                            value={comments}
                                            onChange={(e) => setComments(e.target.value)}
                                            style={{ resize: 'vertical' }}
                                        />

                                        <div className="d-flex align-items-start">
                                            <Shield size={16} className="me-2 mt-1 text-muted" />
                                            <small className="text-muted">
                                                El guía considerará tus comentarios para adaptar la experiencia.
                                            </small>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div> */}
                    </div>

                    {/* Panel lateral de resumen */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm rounded-4 sticky-top" style={{ top: '20px' }}>
                            <div className="card-body p-4">
                                <div className="d-flex mb-4">
                                    <img
                                        src={experienceData.images[0]}
                                        className="rounded-3 me-3"
                                        alt={experienceData.name}
                                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                    />
                                    <div className="flex-grow-1">
                                        <h5 className="fw-bold mb-1" style={{ color: '#2C3E50' }}>
                                            {experienceData.name}
                                        </h5>
                                        <div className="d-flex align-items-center text-muted small mb-1">
                                            <MapPin size={14} className="me-1" />
                                            {experienceData.location}
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <Star size={14} className="text-warning me-1" fill="currentColor" />
                                            <span className="small fw-semibold">{experienceData.rating}</span>
                                            <span className="text-muted small ms-1">({experienceData.reviews} Reseñas) </span>
                                        </div>
                                    </div>
                                </div>

                                <hr />

                                <div className="mb-4">
                                    <h6 className="fw-bold mb-3" style={{ color: '#2C3E50' }}>
                                        Detalles del precio
                                    </h6>

                                    <div className="d-flex justify-content-between mb-2">
                                        <span>${experienceData.pricePerPerson} x {participants} {participants === 1 ? 'persona' : 'personas'}</span>
                                        <span>${subtotal}</span>
                                    </div>

                                    <div className="d-flex justify-content-between mb-2 text-muted">
                                        <span>Tarifa de servicio</span>
                                        <span>${serviceFee}</span>
                                    </div>

                                    <div className="d-flex justify-content-between mb-3 text-muted">
                                        <span>Impuestos</span>
                                        <span>${taxes}</span>
                                    </div>

                                    <hr />

                                    <div className="d-flex justify-content-between fw-bold fs-5" style={{ color: '#2C3E50' }}>
                                        <span>Total</span>
                                        <span>${total}</span>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h6 className="fw-bold mb-3" style={{ color: '#2C3E50' }}>
                                        La experiencia incluye
                                    </h6>
                                    <div className="row g-2">
                                        {experienceData.includes.map((item, index) => (
                                            <div key={index} className="col-12">
                                                <div className="d-flex align-items-center small">
                                                    {getIncludeIcon(item)}
                                                    <span className="ms-2">{item}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-3 p-3 bg-light mb-4">
                                    <div className="d-flex align-items-center mb-2">
                                        <Shield size={16} style={{ color: '#87CEEB' }} className="me-2" />
                                        <span className="small fw-semibold">Cancelación flexible</span>
                                    </div>
                                    <p className="small text-muted mb-2">
                                        Cancela hasta 24 horas antes del inicio para obtener reembolso completo
                                    </p>
                                    <div className="d-flex align-items-center mb-2">
                                        <Phone size={16} style={{ color: '#87CEEB' }} className="me-2" />
                                        <span className="small">+52 442 123 4567</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <Mail size={16} style={{ color: '#87CEEB' }} className="me-2" />
                                        <span className="small">tours@sierragorda.com</span>
                                    </div>
                                </div>

                                <div className="form-check mb-4">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="terms"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    />
                                    <label className="form-check-label small" htmlFor="terms">
                                        Acepto los términos y condiciones de la experiencia y las políticas de cancelación
                                    </label>
                                </div>

                                <button
                                    className="btn btn-lg w-100 rounded-3 py-3 fw-bold text-white"
                                    onClick={handleConfirmReservation}
                                    style={{
                                        backgroundColor: '#87CEEB',
                                        border: 'none'
                                    }}
                                    disabled={!agreedToTerms}
                                >
                                    Continuar al pago - ${total}
                                </button>

                                <div className="text-center mt-3">
                                    <small className="text-muted">
                                        No se realizará ningún cargo hasta que confirmes
                                    </small>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {isGalleryOpen && (
                    <div
                        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                        style={{
                            backgroundColor: 'rgba(0,0,0,0.9)',
                            zIndex: 9999
                        }}
                        onClick={() => setIsGalleryOpen(false)}
                    >
                        <button
                            className="btn btn-light rounded-circle position-absolute"
                            style={{ top: '20px', right: '20px', width: '48px', height: '48px' }}
                            onClick={() => setIsGalleryOpen(false)}
                        >
                            <X size={24} />
                        </button>

                        <button
                            className="btn btn-light rounded-circle position-absolute"
                            style={{ left: '20px', top: '50%', transform: 'translateY(-50%)', width: '48px', height: '48px' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImageIndex((prev) =>
                                    prev === 0 ? experienceData.images.length - 1 : prev - 1
                                );
                            }}
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <div className="text-center" onClick={(e) => e.stopPropagation()}>
                            <img
                                src={experienceData.images[currentImageIndex]}
                                alt={`${experienceData.name} ${currentImageIndex + 1}`}
                                style={{
                                    maxWidth: '90vw',
                                    maxHeight: '90vh',
                                    objectFit: 'contain'
                                }}
                            />
                            <div className="text-white mt-3">
                                {currentImageIndex + 1} / {experienceData.images.length}
                            </div>
                        </div>

                        <button
                            className="btn btn-light rounded-circle position-absolute"
                            style={{ right: '20px', top: '50%', transform: 'translateY(-50%)', width: '48px', height: '48px' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImageIndex((prev) =>
                                    prev === experienceData.images.length - 1 ? 0 : prev + 1
                                );
                            }}
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}