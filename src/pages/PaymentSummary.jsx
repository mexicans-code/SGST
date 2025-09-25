import React, { useState } from 'react';
import {
    MapPin,
    Star,
    Wifi,
    Car,
    Coffee,
    Tv,
    Wind,
    ArrowLeft,
    Clock,
    Phone,
    Mail,
    CreditCard,
    Store,
    Shield
} from 'lucide-react';

export default function PaymentSummary() {
    const reservationData = {
        name: "Casa moderna en el centro",
        description: "Hermosa casa moderna ubicada en el corazón de la ciudad. Perfecta para familias o grupos de amigos que buscan comodidad y estilo.",
        price: 120,
        images: [
            "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6OTgzNjEwMjg4MDc1MTM0Mjg5/original/6530be09-e469-42eb-ad40-c24de66631e9.jpeg"
        ],
        amenities: ["WiFi gratuito", "Estacionamiento", "Cocina equipada", "TV con cable", "Aire acondicionado"],
        location: "Ciudad de México",
        rating: 4.8,
        reviews: 127
    };

    const [checkIn] = useState("2024-03-15");
    const [checkOut] = useState("2024-03-18");
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardName, setCardName] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    
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

    const handleGoBack = () => {
        window.history.back();
    };

    const handlePayment = (e) => {
        e.preventDefault();
        if (!agreedToTerms) {
            alert('Debes aceptar los términos y condiciones');
            return;
        }
        alert('¡Pago procesado exitosamente! Recibirás un email de confirmación.');
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
                                onClick={handleGoBack}
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="h2 fw-bold mb-1" style={{ color: '#2C3E50' }}>Procesar pago</h1>
                                <p className="text-muted mb-0">Completa tu reserva</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    {/* Columna izquierda - Métodos de pago */}
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4">
                                <h3 className="h4 fw-bold mb-4" style={{ color: '#2C3E50' }}>
                                    <CreditCard size={24} style={{ color: '#87CEEB' }} className="me-2" />
                                    Método de pago
                                </h3>

                                {/* Opciones de pago */}
                                <div className="mb-4">
                                    {/* Tarjeta de crédito/débito */}
                                    <div className={`form-check mb-3 p-3 border rounded-3 ${paymentMethod === 'card' ? 'border-primary bg-light' : ''}`}>
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="card"
                                            checked={paymentMethod === 'card'}
                                            onChange={() => setPaymentMethod('card')}
                                        />
                                        <label className="form-check-label fw-semibold d-flex align-items-center" htmlFor="card">
                                            <CreditCard size={20} className="me-2" />
                                            Tarjeta de crédito o débito
                                        </label>
                                    </div>

                                    {/* PayPal */}
                                    <div className={`form-check mb-3 p-3 border rounded-3 ${paymentMethod === 'paypal' ? 'border-primary bg-light' : ''}`}>
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="paypal"
                                            checked={paymentMethod === 'paypal'}
                                            onChange={() => setPaymentMethod('paypal')}
                                        />
                                        <label className="form-check-label fw-semibold d-flex align-items-center" htmlFor="paypal">
                                            <div 
                                                className="rounded me-2 d-flex align-items-center justify-content-center"
                                                style={{ 
                                                    width: '20px', 
                                                    height: '20px', 
                                                    backgroundColor: '#0070ba',
                                                    fontSize: '10px',
                                                    color: 'white',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                PP
                                            </div>
                                            PayPal
                                        </label>
                                    </div>

                                    {/* OXXO Pay */}
                                    <div className={`form-check mb-3 p-3 border rounded-3 ${paymentMethod === 'oxxo' ? 'border-primary bg-light' : ''}`}>
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="oxxo"
                                            checked={paymentMethod === 'oxxo'}
                                            onChange={() => setPaymentMethod('oxxo')}
                                        />
                                        <label className="form-check-label fw-semibold d-flex align-items-center" htmlFor="oxxo">
                                            <Store size={20} className="me-2" style={{ color: '#CD5C5C' }} />
                                            OXXO Pay
                                        </label>
                                    </div>
                                </div>

                                {/* Formulario de tarjeta */}
                                {paymentMethod === 'card' && (
                                    <div className="border rounded-3 p-4 bg-light mb-4">
                                        <div className="row g-3">
                                            <div className="col-12">
                                                <label className="form-label fw-semibold">Número de tarjeta</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="1234 5678 9012 3456"
                                                    value={cardNumber}
                                                    onChange={(e) => setCardNumber(e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">Vencimiento</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="MM/AA"
                                                    value={expiryDate}
                                                    onChange={(e) => setExpiryDate(e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">CVV</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="123"
                                                    value={cvv}
                                                    onChange={(e) => setCvv(e.target.value)}
                                                />
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label fw-semibold">Nombre del titular</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Nombre completo"
                                                    value={cardName}
                                                    onChange={(e) => setCardName(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Términos y condiciones */}
                                <div className="form-check mb-4">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="terms"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="terms">
                                        Acepto los <a href="#" style={{ color: '#87CEEB' }}>términos y condiciones</a>
                                    </label>
                                </div>

                                {/* Botón de pago */}
                                <button
                                    onClick={handlePayment}
                                    className="btn btn-lg w-100 rounded-3 py-3 fw-bold text-white"
                                    style={{ 
                                        backgroundColor: agreedToTerms ? '#CD5C5C' : '#6c757d',
                                        borderColor: agreedToTerms ? '#CD5C5C' : '#6c757d'
                                    }}
                                    disabled={!agreedToTerms}
                                >
                                    {paymentMethod === 'paypal' && 'Pagar con PayPal'}
                                    {paymentMethod === 'oxxo' && 'Generar código OXXO'}
                                    {paymentMethod === 'card' && 'Procesar pago'}
                                    {' - '}${total}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Columna derecha - Desglose del pago */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm rounded-4 sticky-top" style={{ top: '20px' }}>
                            <div className="card-body p-4">
                                {/* Información de la propiedad */}
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

                                {/* Detalles del precio */}
                                <div className="mb-4">
                                    <h6 className="fw-bold mb-3" style={{ color: '#2C3E50' }}>Desglose del precio</h6>

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

                                {/* Amenidades incluidas */}
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

                                {/* Contacto de soporte */}
                                <div className="rounded-3 p-3 bg-light">
                                    <div className="d-flex align-items-center mb-2">
                                        <Clock size={16} style={{ color: '#87CEEB' }} className="me-2" />
                                        <span className="small fw-semibold">Soporte 24/7</span>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}