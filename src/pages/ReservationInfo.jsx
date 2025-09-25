import React, { useState } from 'react';
import {
    MapPin,
    Star,
    Users,
    Calendar,
    MessageSquare,
    Check,
    Wifi,
    Car,
    Coffee,
    Tv,
    Wind,
    ArrowLeft,
    Shield,
    Clock,
    Phone,
    Mail,
    Edit3,
    Plus,
    Minus,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    X,
    Maximize2
} from 'lucide-react';

import { useNavigate } from "react-router-dom";

export default function ReservationInfo() {
    const navigate = useNavigate();
    const reservationData = {
        name: "Casa moderna en el centro",
        description: "Hermosa casa moderna ubicada en el corazón de la ciudad. Perfecta para familias o grupos de amigos que buscan comodidad y estilo.",
        price: 120,
        images: [
            "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6OTgzNjEwMjg4MDc1MTM0Mjg5/original/6530be09-e469-42eb-ad40-c24de66631e9.jpeg",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        amenities: ["WiFi gratuito", "Estacionamiento", "Cocina equipada", "TV con cable", "Aire acondicionado"],
        location: "Ciudad de México",
        rating: 4.8,
        reviews: 127,
        bedrooms: 2,
        bathrooms: 2,
        address: "Av. Reforma 123, Cuauhtémoc, Ciudad de México"
    };

    const [checkIn, setCheckIn] = useState("2024-03-15");
    const [checkOut, setCheckOut] = useState("2024-03-18");
    const [guests, setGuests] = useState(4);
    const [isEditingDates, setIsEditingDates] = useState(false);
    const [isEditingGuests, setIsEditingGuests] = useState(false);
    const [comments, setComments] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    // Estados para comentarios desplegables
    const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);

    // Estados para galería de fotos
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const subtotal = reservationData.price * nights;
    const serviceFee = Math.round(subtotal * 0.14);
    const taxes = Math.round(subtotal * 0.08);
    const total = subtotal + serviceFee + taxes;

    const getAmenityIcon = (amenity) => {
        if (amenity.toLowerCase().includes('wifi')) return <Wifi size={16} style={{ color: '#87CEEB' }} />;
        if (amenity.toLowerCase().includes('estacion')) return <Car size={16} style={{ color: '#87CEEB' }} />;
        if (amenity.toLowerCase().includes('cocina')) return <Coffee size={16} style={{ color: '#87CEEB' }} />;
        if (amenity.toLowerCase().includes('tv')) return <Tv size={16} style={{ color: '#87CEEB' }} />;
        if (amenity.toLowerCase().includes('aire')) return <Wind size={16} style={{ color: '#87CEEB' }} />;
        return <Star size={16} style={{ color: '#87CEEB' }} />;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const adjustGuests = (increment) => {
        const newGuests = guests + increment;
        if (newGuests >= 1 && newGuests <= 16) {
            setGuests(newGuests);
        }
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === reservationData.images.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? reservationData.images.length - 1 : prev - 1
        );
    };

    const handleConfirmReservation = () => {
        if (!agreedToTerms) {
            alert('Debes aceptar los términos y condiciones');
            return;
        }
        alert('¡Reserva confirmada! Procederás al pago en el siguiente paso.');
    };

    return (
        <div style={{ backgroundColor: '#FFFFFF' }} className="min-vh-100 py-4">
            <div className="container">
                {/* Header */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="d-flex align-items-center mb-3">
                            <button className="btn btn-light rounded-circle me-3" style={{ width: '48px', height: '48px' }}>
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="h2 fw-bold mb-1" style={{ color: '#2C3E50' }}>Confirmar reserva</h1>
                                <p className="text-muted mb-0">Revisa los detalles de tu reserva antes de continuar</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Galería de fotos mejorada */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-0 position-relative">
                                {/* Galería principal */}
                                <div className="row g-2">
                                    <div className="col-md-6">
                                        <div className="position-relative">
                                            <img
                                                src={reservationData.images[0]}
                                                className="img-fluid rounded-start cursor-pointer"
                                                alt={reservationData.name}
                                                style={{ height: '400px', width: '100%', objectFit: 'cover', cursor: 'pointer' }}
                                                onClick={() => {
                                                    setCurrentImageIndex(0);
                                                    setIsGalleryOpen(true);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="row g-2 h-100">
                                            {reservationData.images.slice(1, 5).map((image, index) => (
                                                <div key={index} className="col-6">
                                                    <div className="position-relative">
                                                        <img
                                                            src={image}
                                                            className="img-fluid rounded cursor-pointer"
                                                            alt={`${reservationData.name} ${index + 2}`}
                                                            style={{
                                                                height: '195px',
                                                                width: '100%',
                                                                objectFit: 'cover',
                                                                cursor: 'pointer'
                                                            }}
                                                            onClick={() => {
                                                                setCurrentImageIndex(index + 1);
                                                                setIsGalleryOpen(true);
                                                            }}
                                                        />
                                                        {index === 3 && reservationData.images.length > 5 && (
                                                            <div
                                                                className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center rounded"
                                                                style={{ backgroundColor: 'rgba(0,0,0,0.6)', cursor: 'pointer' }}
                                                                onClick={() => setIsGalleryOpen(true)}
                                                            >
                                                                <div className="text-white text-center">
                                                                    <Maximize2 size={24} className="mb-1" />
                                                                    <div className="fw-bold">Ver todas</div>
                                                                    <div className="small">{reservationData.images.length} fotos</div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Información del alojamiento superpuesta */}
                                <div className="p-4">
                                    <div className="row align-items-center">
                                        <div className="col-md-8">
                                            <h2 className="fw-bold mb-2" style={{ color: '#2C3E50' }}>{reservationData.name}</h2>
                                            <div className="d-flex align-items-center mb-2">
                                                <MapPin size={16} className="me-2 text-muted" />
                                                <span className="text-muted">{reservationData.location}</span>
                                            </div>
                                            <p className="text-muted mb-0">{reservationData.description}</p>
                                        </div>
                                        <div className="col-md-4 text-md-end">
                                            <div className="d-flex align-items-center justify-content-md-end mb-2">
                                                <Star size={16} className="text-warning me-1" fill="currentColor" />
                                                <span className="fw-semibold me-1">{reservationData.rating}</span>
                                                <span className="text-muted">({reservationData.reviews} reseñas)</span>
                                            </div>
                                            <div className="text-muted small">
                                                {reservationData.bedrooms} habitaciones • {reservationData.bathrooms} baños
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal de galería */}
                {isGalleryOpen && (
                    <div
                        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                        style={{ backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 9999 }}
                        onClick={() => setIsGalleryOpen(false)}
                    >
                        <div className="position-relative w-100 h-100" onClick={(e) => e.stopPropagation()}>
                            <button
                                className="btn btn-light rounded-circle position-absolute top-0 end-0 m-3"
                                style={{ zIndex: 10000 }}
                                onClick={() => setIsGalleryOpen(false)}
                            >
                                <X size={20} />
                            </button>

                            <div className="d-flex align-items-center justify-content-center h-100">
                                <button
                                    className="btn btn-light rounded-circle me-3"
                                    onClick={prevImage}
                                    disabled={currentImageIndex === 0}
                                >
                                    <ChevronLeft size={24} />
                                </button>

                                <img
                                    src={reservationData.images[currentImageIndex]}
                                    className="img-fluid"
                                    style={{ maxHeight: '80vh', maxWidth: '80vw', objectFit: 'contain' }}
                                    alt={`${reservationData.name} ${currentImageIndex + 1}`}
                                />

                                <button
                                    className="btn btn-light rounded-circle ms-3"
                                    onClick={nextImage}
                                    disabled={currentImageIndex === reservationData.images.length - 1}
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>

                            <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3 text-white">
                                {currentImageIndex + 1} / {reservationData.images.length}
                            </div>
                        </div>
                    </div>
                )}

                <div className="row g-4">
                    {/* Columna principal */}
                    <div className="col-lg-8">
                        {/* Información del viaje - Editable */}
                        <div className="card border-0 shadow-sm rounded-4 mb-4">
                            <div className="card-body p-4">
                                <h3 className="h4 fw-bold mb-4" style={{ color: '#2C3E50' }}>Tu viaje</h3>

                                <div className="row g-4">
                                    {/* Fechas */}
                                    <div className="col-md-6">
                                        <div className="d-flex align-items-start">
                                            <Calendar size={24} style={{ color: '#87CEEB' }} className="me-3 mt-1" />
                                            <div className="flex-grow-1">
                                                <div className="d-flex align-items-center justify-content-between mb-2">
                                                    <h6 className="fw-bold mb-0" style={{ color: '#2C3E50' }}>Fechas</h6>
                                                    <button
                                                        onClick={() => setIsEditingDates(!isEditingDates)}
                                                        className="btn btn-link p-1 text-decoration-none"
                                                        style={{ color: '#87CEEB' }}
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                </div>

                                                {isEditingDates ? (
                                                    <div>
                                                        <div className="mb-3">
                                                            <label className="form-label small fw-semibold text-muted">Check-in</label>
                                                            <input
                                                                type="date"
                                                                className="form-control form-control-sm"
                                                                value={checkIn}
                                                                onChange={(e) => setCheckIn(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="form-label small fw-semibold text-muted">Check-out</label>
                                                            <input
                                                                type="date"
                                                                className="form-control form-control-sm"
                                                                value={checkOut}
                                                                onChange={(e) => setCheckOut(e.target.value)}
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => setIsEditingDates(false)}
                                                            className="btn btn-sm btn-outline-primary"
                                                        >
                                                            Confirmar fechas
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <p className="text-muted mb-2 small">
                                                            {formatDate(checkIn)} - {formatDate(checkOut)}
                                                        </p>
                                                        <span className="badge bg-light text-dark">{nights} noche{nights > 1 ? 's' : ''}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Huéspedes */}
                                    <div className="col-md-6">
                                        <div className="d-flex align-items-start">
                                            <Users size={24} style={{ color: '#87CEEB' }} className="me-3 mt-1" />
                                            <div className="flex-grow-1">
                                                <div className="d-flex align-items-center justify-content-between mb-2">
                                                    <h6 className="fw-bold mb-0" style={{ color: '#2C3E50' }}>Huéspedes</h6>
                                                    <button
                                                        onClick={() => setIsEditingGuests(!isEditingGuests)}
                                                        className="btn btn-link p-1 text-decoration-none"
                                                        style={{ color: '#87CEEB' }}
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                </div>

                                                {isEditingGuests ? (
                                                    <div>
                                                        <div className="d-flex align-items-center mb-3">
                                                            <button
                                                                onClick={() => adjustGuests(-1)}
                                                                className="btn btn-outline-secondary btn-sm rounded-circle me-3"
                                                                style={{ width: '32px', height: '32px' }}
                                                                disabled={guests <= 1}
                                                            >
                                                                <Minus size={14} />
                                                            </button>
                                                            <span className="fw-bold fs-5 mx-3">{guests}</span>
                                                            <button
                                                                onClick={() => adjustGuests(1)}
                                                                className="btn btn-outline-secondary btn-sm rounded-circle ms-3"
                                                                style={{ width: '32px', height: '32px' }}
                                                                disabled={guests >= 16}
                                                            >
                                                                <Plus size={14} />
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={() => setIsEditingGuests(false)}
                                                            className="btn btn-sm btn-outline-primary"
                                                        >
                                                            Confirmar huéspedes
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <p className="text-muted mb-0">{guests} huéspedes</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Google Maps */}
                        <div className="card border-0 shadow-sm rounded-4 mb-4">
                            <div className="card-body p-4">
                                <h3 className="h4 fw-bold mb-3" style={{ color: '#2C3E50' }}>
                                    <MapPin size={24} style={{ color: '#87CEEB' }} className="me-2" />
                                    Ubicación
                                </h3>

                                <div className="mb-3">
                                    <p className="text-muted mb-2">{reservationData.address}</p>
                                    <p className="small text-muted">
                                        La ubicación exacta se proporcionará después de la reserva confirmada.
                                    </p>
                                </div>

                                <div className="rounded-3 overflow-hidden" style={{ height: '300px' }}>
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.634688892793!2d-99.16508518506987!3d19.432608086886067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1f92ad4c5f7ff%3A0x96a5b8c7e4e3df0!2sAv.%20Paseo%20de%20la%20Reforma%2C%20Cuauht%C3%A9moc%2C%20Ciudad%20de%20M%C3%A9xico%2C%20CDMX!5e0!3m2!1ses!2smx!4v1709834567890!5m2!1ses!2smx"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Ubicación de la propiedad"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Comentarios desplegables */}
                        <div className="card border-0 shadow-sm rounded-4 mb-4">
                            <div className="card-body p-4">
                                <div
                                    className="d-flex align-items-center justify-content-between cursor-pointer"
                                    onClick={() => setIsCommentsExpanded(!isCommentsExpanded)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <h3 className="h4 fw-bold mb-0 d-flex align-items-center" style={{ color: '#2C3E50' }}>
                                        <MessageSquare size={24} style={{ color: '#87CEEB' }} className="me-2" />
                                        Comentarios y solicitudes especiales
                                    </h3>
                                    <button className="btn btn-link p-0" style={{ color: '#87CEEB' }}>
                                        {isCommentsExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </button>
                                </div>

                                <p className="text-muted mb-0 mt-2 small">
                                    {isCommentsExpanded ?
                                        "Agrega cualquier solicitud especial para tu estadía" :
                                        "Haz clic para agregar comentarios o solicitudes especiales"
                                    }
                                </p>

                                {isCommentsExpanded && (
                                    <div className="mt-4">
                                        <div className="row g-2 mb-3">
                                            {[
                                                "Llegada tardía",
                                                "Celebración especial",
                                                "Cuna para bebé",
                                                "Accesibilidad",
                                                "Mascotas",
                                                "Silencioso"
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
                                            placeholder="Ejemplo: Llegaremos tarde, necesitamos cuna para bebé, celebramos un cumpleaños..."
                                            value={comments}
                                            onChange={(e) => setComments(e.target.value)}
                                            style={{ resize: 'vertical' }}
                                        />

                                        <div className="d-flex align-items-start">
                                            <Shield size={16} className="me-2 mt-1 text-muted" />
                                            <small className="text-muted">
                                                Las solicitudes especiales no están garantizadas, pero el anfitrión hará todo lo posible por cumplirlas.
                                            </small>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>


                        {/* Sección de reseñas mejorada */}
                        <div className="card border-0 shadow-sm rounded-4 mb-4">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center justify-content-between mb-4">
                                    <h3 className="h4 fw-bold mb-0 d-flex align-items-center" style={{ color: '#2C3E50' }}>
                                        <Star size={24} style={{ color: '#87CEEB' }} className="me-2" />
                                        Reseñas de huéspedes
                                    </h3>
                                    <div className="d-flex align-items-center">
                                        <div className="me-3 text-center">
                                            <div className="fw-bold fs-5" style={{ color: '#2C3E50' }}>{reservationData.rating}</div>
                                            <div className="d-flex">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Star key={star} size={12} className="text-warning me-1" fill="currentColor" />
                                                ))}
                                            </div>
                                        </div>
                                        <span className="text-muted small">{reservationData.reviews} reseñas</span>
                                    </div>
                                </div>

                                {/* Grid de reseñas */}
                                <div className="row g-3">
                                    {/* Reseña 1 */}
                                    <div className="col-md-6">
                                        <div className="border rounded-4 p-3 h-100" style={{ backgroundColor: '#f8f9fa' }}>
                                            <div className="d-flex align-items-center mb-3">
                                                <div
                                                    className="rounded-circle me-3 d-flex align-items-center justify-content-center fw-bold text-white"
                                                    style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        backgroundColor: '#FF6B6B',
                                                        fontSize: '16px'
                                                    }}
                                                >
                                                    R
                                                </div>
                                                <div className="flex-grow-1">
                                                    <div className="fw-bold" style={{ color: '#2C3E50' }}>Ricardo</div>
                                                    <div className="small text-muted">Marzo 2024</div>
                                                </div>
                                                <div className="d-flex">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <Star key={star} size={14} className="text-warning" fill="currentColor" />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="mb-2 small" style={{ lineHeight: '1.5' }}>
                                                "Excelente lugar para visitar la Ciudad de México. La ubicación es perfecta,
                                                muy cerca del metro y restaurantes. El anfitrión fue muy atento y la casa
                                                tenía todo lo necesario. ¡Definitivamente regresaría!"
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="border rounded-4 p-3 h-100" style={{ backgroundColor: '#f8f9fa' }}>
                                            <div className="d-flex align-items-center mb-3">
                                                <div
                                                    className="rounded-circle me-3 d-flex align-items-center justify-content-center fw-bold text-white"
                                                    style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        backgroundColor: '#4ECDC4',
                                                        fontSize: '16px'
                                                    }}
                                                >
                                                    J
                                                </div>
                                                <div className="flex-grow-1">
                                                    <div className="fw-bold" style={{ color: '#2C3E50' }}>Juan Carlos</div>
                                                    <div className="small text-muted">Febrero 2024</div>
                                                </div>
                                                <div className="d-flex">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <Star key={star} size={14} className="text-warning" fill="currentColor" />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="mb-2 small" style={{ lineHeight: '1.5' }}>
                                                "Casa muy acogedora y bien equipada. Nos encantó la cocina moderna y el
                                                aire acondicionado funcionó perfecto. El WiFi es rápido para trabajar.
                                                Excelente relación calidad-precio."
                                            </p>
                                        </div>
                                    </div>

                                    {/* Reseña 3 */}
                                    <div className="col-md-6">
                                        <div className="border rounded-4 p-3 h-100" style={{ backgroundColor: '#f8f9fa' }}>
                                            <div className="d-flex align-items-center mb-3">
                                                <div
                                                    className="rounded-circle me-3 d-flex align-items-center justify-content-center fw-bold text-white"
                                                    style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        backgroundColor: '#A8E6CF',
                                                        color: '#2C3E50',
                                                        fontSize: '16px'
                                                    }}
                                                >
                                                    A
                                                </div>
                                                <div className="flex-grow-1">
                                                    <div className="fw-bold" style={{ color: '#2C3E50' }}>Alondra</div>
                                                    <div className="small text-muted">Enero 2024</div>
                                                </div>
                                                <div className="d-flex">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <Star key={star} size={14} className="text-warning" fill="currentColor" />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="mb-2 small" style={{ lineHeight: '1.5' }}>
                                                "Perfecto para una escapada en pareja. La casa es tal como se ve en las
                                                fotos, muy limpia y cómoda. El estacionamiento es una gran ventaja.
                                                ¡Súper recomendado para explorar la ciudad!"
                                            </p>
                                        </div>
                                    </div>

                                    {/* Reseña 4 */}
                                    <div className="col-md-6">
                                        <div className="border rounded-4 p-3 h-100" style={{ backgroundColor: '#f8f9fa' }}>
                                            <div className="d-flex align-items-center mb-3">
                                                <div
                                                    className="rounded-circle me-3 d-flex align-items-center justify-content-center fw-bold text-white"
                                                    style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        backgroundColor: '#FFD93D',
                                                        color: '#2C3E50',
                                                        fontSize: '16px'
                                                    }}
                                                >
                                                    M
                                                </div>
                                                <div className="flex-grow-1">
                                                    <div className="fw-bold" style={{ color: '#2C3E50' }}>María Elena</div>
                                                    <div className="small text-muted">Diciembre 2023</div>
                                                </div>
                                                <div className="d-flex">
                                                    {[1, 2, 3, 4].map(star => (
                                                        <Star key={star} size={14} className="text-warning" fill="currentColor" />
                                                    ))}
                                                    <Star size={14} className="text-muted" />
                                                </div>
                                            </div>
                                            <p className="mb-2 small" style={{ lineHeight: '1.5' }}>
                                                "Muy buena estadía en general. La casa está bien ubicada y tiene las
                                                comodidades básicas. El check-in fue sencillo. Solo el ruido de la calle
                                                por las mañanas, pero nada grave."
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Botón ver más reseñas */}
                                <div className="text-center mt-4">
                                    <button className="btn btn-outline-primary rounded-3 px-4">
                                        Ver las {reservationData.reviews} reseñas
                                    </button>
                                </div>


                            </div>
                        </div>







                    </div>

                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm rounded-4 sticky-top" style={{ top: '20px' }}>
                            <div className="card-body p-4">
                                <div className="d-flex mb-4">
                                    <img
                                        src={reservationData.images[0]}
                                        className="rounded-3 me-3"
                                        alt={reservationData.name}
                                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                    />
                                    <div className="flex-grow-1">
                                        <h5 className="fw-bold mb-1" style={{ color: '#2C3E50' }}>{reservationData.name}</h5>
                                        <div className="d-flex align-items-center text-muted small mb-1">
                                            <MapPin size={14} className="me-1" />
                                            {reservationData.location}
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <Star size={14} className="text-warning me-1" fill="currentColor" />
                                            <span className="small fw-semibold">{reservationData.rating}</span>
                                            <span className="text-muted small ms-1">({reservationData.reviews})</span>
                                        </div>
                                    </div>
                                </div>

                                <hr />

                                <div className="mb-4">
                                    <h6 className="fw-bold mb-3" style={{ color: '#2C3E50' }}>Detalles del precio</h6>

                                    <div className="d-flex justify-content-between mb-2">
                                        <span>${reservationData.price} x {nights} noche{nights > 1 ? 's' : ''}</span>
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
                                    <h6 className="fw-bold mb-3" style={{ color: '#2C3E50' }}>Amenidades incluidas</h6>
                                    <div className="row g-2">
                                        {reservationData.amenities.slice(0, 4).map((amenity, index) => (
                                            <div key={index} className="col-12">
                                                <div className="d-flex align-items-center small">
                                                    {getAmenityIcon(amenity)}
                                                    <span className="ms-2 text-truncate">{amenity}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-3 p-3 bg-light">
                                    <div className="d-flex align-items-center mb-2">
                                        <Clock size={16} style={{ color: '#87CEEB' }} className="me-2" />
                                        <span className="small fw-semibold">Disponible 24/7</span>
                                    </div>
                                    <div className="d-flex align-items-center mb-2">
                                        <Phone size={16} style={{ color: '#87CEEB' }} className="me-2" />
                                        <span className="small">+52 55 1234 5678</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <Mail size={16} style={{ color: '#87CEEB' }} className="me-2" />
                                        <span className="small">soporte@airbnb.com</span>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-lg w-100 rounded-3 py-3 fw-bold text-white mt-4"
                                    onClick={() => navigate('/payment')}
                                    style={{
                                        backgroundColor: '#CD5C5C',
                                        borderColor: '#CD5C5C'
                                    }}
                                >
                                    Continuar al pago - ${total}
                                </button>



                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}