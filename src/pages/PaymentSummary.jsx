import React, { useState, useEffect } from 'react';
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

import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react';

const MERCADOPAGO_PUBLIC_KEY = 'TEST-f6336aad-6b41-408e-bacf-bd3263a24f01';

// Esta api es para producción const MERCADOPAGO_PUBLIC_KEY = 'APP_USR-9979abe7-f266-42d9-a9f3-c0182c66e148';

initMercadoPago(MERCADOPAGO_PUBLIC_KEY);


export default function PaymentSummary({
    reservationData = null,
    initialCheckIn = null,
    initialCheckOut = null,
    serviceFeePercentage = 0.14,
    taxPercentage = 0.08,
    onPaymentSuccess = null,
    onGoBack = null,
    supportInfo = null
}) {
    const [checkIn, setCheckIn] = useState(initialCheckIn || '');
    const [checkOut, setCheckOut] = useState(initialCheckOut || '');
    const [paymentMethod, setPaymentMethod] = useState('mercadopago');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardName, setCardName] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [purchaseCompleted, setPurchaseCompleted] = useState(false);
    const [showMPBrick, setShowMPBrick] = useState(false);
    const navigate = useNavigate();

    const [priceBreakdown, setPriceBreakdown] = useState({
        nights: 0,
        subtotal: 0,
        serviceFee: 0,
        taxes: 0,
        total: 0
    });

    useEffect(() => {
        const currentData = getCurrentReservationData();

        if (currentData?.reservationType === 'tourism') {
            // Cálculo para experiencias de turismo
            const participants = currentData.participants || 1;
            const pricePerPerson = currentData.pricePerPerson || currentData.price || 0;

            const subtotal = pricePerPerson * participants;
            const serviceFee = Math.round(subtotal * serviceFeePercentage);
            const taxes = Math.round(subtotal * taxPercentage);
            const total = subtotal + serviceFee + taxes;

            setPriceBreakdown({
                nights: 0,
                participants,
                subtotal,
                serviceFee,
                taxes,
                total
            });
        } else if (checkIn && checkOut && currentData?.price) {
            const checkInDate = new Date(checkIn);
            const checkOutDate = new Date(checkOut);
            const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

            if (nights > 0) {
                const subtotal = currentData.price * nights;
                const serviceFee = Math.round(subtotal * serviceFeePercentage);
                const taxes = Math.round(subtotal * taxPercentage);
                const total = subtotal + serviceFee + taxes;

                setPriceBreakdown({
                    nights,
                    subtotal,
                    serviceFee,
                    taxes,
                    total
                });
            }
        }
    }, [checkIn, checkOut, serviceFeePercentage, taxPercentage]);

    useEffect(() => {
        const loadReservationData = () => {
            try {
                const storedData = localStorage.getItem('reservationData');
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    console.log('Datos cargados desde localStorage:', parsedData);
                    console.log("id de la propiedad: ", parsedData.id);

                    if (!reservationData) {
                        setCheckIn(parsedData.checkIn || '');
                        setCheckOut(parsedData.checkOut || '');
                    }

                    return parsedData;
                }
            } catch (error) {
                console.error('Error cargando datos de reserva:', error);
            }
            return null;
        };

        const savedData = loadReservationData();
        if (savedData && !reservationData) {
            setPriceBreakdown({
                nights: savedData.nights || 0,
                subtotal: savedData.subtotal || 0,
                serviceFee: savedData.serviceFee || 0,
                taxes: savedData.taxes || 0,
                total: savedData.total || 0
            });
        }
    }, []);

    const getReservationType = (data) => {
        return data?.reservationType || (data?.id_experiencia ? 'tourism' : 'hosteleria');
    };

    // Modificar getCurrentReservationData:
    const getCurrentReservationData = () => {
        if (reservationData) {
            return reservationData;
        }

        try {
            const storedData = localStorage.getItem('reservationData');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                const reservationType = getReservationType(parsedData);

                console.log("Tipo de reserva:", reservationType);
                console.log("Datos parseados:", parsedData);

                // Retornar datos adaptados según el tipo
                if (reservationType === 'tourism') {
                    return {
                        id: parsedData.id_experiencia || parsedData.id,
                        id_anfitrion: parsedData.id_anfitrion || parsedData.id_anfitrion || null,
                        id_experiencia: parsedData.id_experiencia || parsedData.id,
                        name: parsedData.name || "Experiencia no disponible",
                        description: parsedData.description || "Sin descripción",
                        price: parsedData.pricePerPerson || parsedData.price || 0,
                        pricePerPerson: parsedData.pricePerPerson || parsedData.price || 0,
                        images: parsedData.images || ["https://via.placeholder.com/300x200?text=Sin+Imagen"],
                        amenities: parsedData.includes || [], // Los "includes" son como amenities
                        location: parsedData.location || "Ubicación no especificada",
                        rating: parsedData.rating || 0,
                        reviews: parsedData.reviews || 0,
                        guests: parsedData.participants || 1,
                        participants: parsedData.participants || 1,
                        // Datos específicos de turismo
                        selectedDate: parsedData.selectedDate,
                        selectedTime: parsedData.selectedTime,
                        duration: parsedData.duration,
                        comments: parsedData.comments,
                        category: parsedData.category,
                        meetingPoint: parsedData.meetingPoint,
                        reservationType: 'tourism'
                    };
                } else {
                    return {
                        id_hosteleria: parsedData.id || null,
                        id: parsedData.id || 1,
                        name: parsedData.name || "Propiedad no disponible",
                        description: parsedData.description || "Sin descripción",
                        price: parsedData.price || 0,
                        images: parsedData.images || ["https://via.placeholder.com/300x200?text=Sin+Imagen"],
                        amenities: parsedData.amenities || [],
                        location: parsedData.location || "Ubicación no especificada",
                        rating: parsedData.rating || 0,
                        reviews: parsedData.reviews || 0,
                        guests: parsedData.guests || 1,
                        bedrooms: parsedData.bedrooms || 1,
                        bathrooms: parsedData.bathrooms || 1,
                        reservationType: 'hosteleria'
                    };
                }
            }
        } catch (error) {
            console.error('Error cargando datos:', error);
        }

        return null;
    };
    const defaultSupportInfo = {
        phone: "+52 55 1234 5678",
        email: "soporte@ejemplo.com",
        available: "24/7"
    };

    const currentReservationData = getCurrentReservationData();
    const currentSupportInfo = supportInfo || defaultSupportInfo;

    // 🔹 Configuración de Mercado Pago Brick
    const initialization = {
        amount: priceBreakdown.total,
        payer: {
            email: JSON.parse(localStorage.getItem("usuario") || '{}').email || ''
        }
    };

    const customization = {
        paymentMethods: {
            maxInstallments: 12,
            minInstallments: 1
        },
        visual: {
            style: {
                theme: 'default'
            }
        }
    };

    // 🔹 Callback cuando se envía el pago desde Mercado Pago
    const onSubmitMP = async (formData) => {
        setIsLoading(true);
        const usuarioData = JSON.parse(localStorage.getItem("usuario"));

        try {
            const purchaseData = {
                reservationId: 'RES-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                token: formData.token,
                issuer_id: formData.issuer_id,
                payment_method_id: formData.payment_method_id,
                transaction_amount: priceBreakdown.total,
                installments: formData.installments,
                payer: {
                    email: formData.payer.email,
                    identification: formData.payer.identification
                },
                reserva: {
                    id_usuario: usuarioData.id_usuario,
                    id_hosteleria: currentReservationData.id_hosteleria,
                    fecha_inicio: checkIn,
                    fecha_fin: checkOut,
                    personas: currentReservationData.guests,
                    estado: 'confirmada'
                },
                usuarioData: {
                    id_usuario: usuarioData.id_usuario,
                    nombre: usuarioData.nombre,
                    email: usuarioData.email
                },
                hosteleria: {
                    nombre: currentReservationData.name,
                    ubicacion: currentReservationData.location,
                    precio_por_noche: currentReservationData.price
                },
                pricing: priceBreakdown,
                timestamp: new Date().toISOString()
            };

            console.log('📤 Enviando pago a Mercado Pago:', purchaseData);

            const response = await fetch('http://localhost:3000/api/pay/mercadopago', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(purchaseData)
            });

            if (!response.ok) {
                throw new Error('Error al procesar el pago con Mercado Pago');
            }

            const data = await response.json();
            console.log('✅ Pago procesado:', data);

            if (data.status === 'approved') {
                setPurchaseCompleted(true);

                await Swal.fire({
                    icon: 'success',
                    title: '¡Pago Aprobado!',
                    html: `
                        <p><strong>ID de Pago:</strong> ${data.payment_id}</p>
                        <p><strong>Código de reserva:</strong> ${purchaseData.reservationId}</p>
                        <p><strong>Total pagado:</strong> $${priceBreakdown.total} MXN</p>
                        <p class="text-muted mt-3">Se ha enviado un correo de confirmación a<br><strong>${usuarioData.email}</strong></p>
                    `,
                    confirmButtonText: 'Ir a inicio',
                    confirmButtonColor: '#009ee3',
                    allowOutsideClick: false
                });

                if (onPaymentSuccess) {
                    onPaymentSuccess(data);
                }
                navigate('/');
            } else {
                throw new Error(data.status_detail || 'Pago rechazado');
            }

        } catch (error) {
            console.error('❌ Error al procesar pago:', error);

            Swal.fire({
                icon: 'error',
                title: 'Error al procesar el pago',
                text: error.message || 'Hubo un problema. Por favor, intenta nuevamente.',
                confirmButtonText: 'Reintentar',
                confirmButtonColor: '#dc3545'
            });

            setPurchaseCompleted(false);
        } finally {
            setIsLoading(false);
        }
    };

    const onErrorMP = async (error) => {
        console.error('❌ Error de Mercado Pago:', error);
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al procesar tu tarjeta. Verifica los datos.',
            confirmButtonColor: '#dc3545'
        });
    };

    const onReadyMP = async () => {
        console.log('✅ Mercado Pago Brick listo');
    };

    const handlePaymentClick = async () => {
        const usuarioData = JSON.parse(localStorage.getItem("usuario"));

        if (currentReservationData?.reservationType === 'tourism') {
            if (!currentReservationData?.id_experiencia) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se encontró el ID de la experiencia. Por favor, vuelve a seleccionar la experiencia.',
                });
                return;
            }
        } else {
            if (!currentReservationData?.id_hosteleria) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se encontró el ID de la hostelería. Por favor, vuelve a seleccionar la propiedad.',
                });
                return;
            }
        }

        if (!agreedToTerms) {
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: 'Debes aceptar los términos y condiciones para continuar',
            });
            return;
        }

        if (priceBreakdown.total === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error en el precio',
                text: currentReservationData?.reservationType === 'tourism'
                    ? 'Verifica la cantidad de participantes.'
                    : 'Verifica las fechas seleccionadas.',
            });
            return;
        }

        // Si selecciona Mercado Pago, mostrar el brick
        if (paymentMethod === 'mercadopago') {
            setShowMPBrick(true);
            return;
        }

        // Validación para otros métodos de pago
        if (paymentMethod === 'card') {
            if (!cardNumber || !expiryDate || !cvv || !cardName) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos incompletos',
                    text: 'Por favor completa todos los campos de la tarjeta',
                });
                return;
            }
        }

        setIsLoading(true);

        try {
            const reservationId = 'RES-' + Math.random().toString(36).substr(2, 9).toUpperCase();

            const purchaseData = currentReservationData.reservationType === 'tourism' ? {
                reservationId,
                tipo: 'tourism',
                reserva: {
                    id_usuario: usuarioData.id_usuario,
                    id_experiencia: currentReservationData.id_experiencia,
                    id_anfitrion: currentReservationData.id_anfitrion,
                    fecha: currentReservationData.selectedDate,
                    hora: currentReservationData.selectedTime,
                    participantes: currentReservationData.participants,
                    estado: 'confirmada',
                    comentarios: currentReservationData.comments || ''
                },
                pago: {
                    monto: priceBreakdown.total,
                    metodo: paymentMethod,
                    fecha_pago: new Date().toISOString(),
                    estado: 'completado',
                    detalles: paymentMethod === 'card' ? {
                        lastFour: cardNumber.slice(-4),
                        cardholderName: cardName
                    } : { method: paymentMethod }
                },
                usuarioData: {
                    id_usuario: usuarioData.id_usuario,
                    nombre: usuarioData.nombre,
                    email: usuarioData.email
                },
                experiencia: {
                    nombre: currentReservationData.name,
                    ubicacion: currentReservationData.location,
                    precio_por_persona: currentReservationData.pricePerPerson,
                    duracion: currentReservationData.duration,
                    punto_encuentro: currentReservationData.meetingPoint,
                    categoria: currentReservationData.category,
                    incluye: currentReservationData.includes || []
                },
                pricing: {
                    ...priceBreakdown,
                    participantes: currentReservationData.participants,
                    precio_por_persona: currentReservationData.pricePerPerson
                },
                timestamp: new Date().toISOString()
            } : {
                reservationId,
                tipo: 'hosteleria',
                reserva: {
                    id_usuario: usuarioData.id_usuario,
                    id_hosteleria: currentReservationData.id_hosteleria,
                    fecha_inicio: checkIn,
                    fecha_fin: checkOut,
                    personas: currentReservationData.guests,
                    estado: 'confirmada'
                },
                pago: {
                    monto: priceBreakdown.total,
                    metodo: paymentMethod,
                    fecha_pago: new Date().toISOString(),
                    estado: 'completado',
                    detalles: paymentMethod === 'card' ? {
                        lastFour: cardNumber.slice(-4),
                        cardholderName: cardName
                    } : { method: paymentMethod }
                },
                usuarioData: {
                    id_usuario: usuarioData.id_usuario,
                    nombre: usuarioData.nombre,
                    email: usuarioData.email
                },
                hosteleria: {
                    nombre: currentReservationData.name,
                    ubicacion: currentReservationData.location,
                    precio_por_noche: currentReservationData.price
                },
                pricing: priceBreakdown,
                timestamp: new Date().toISOString()
            };

            console.log('Datos a enviar:', purchaseData);

            const response = await fetch('http://localhost:3000/api/pay/purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(purchaseData)
            });

            if (!response.ok) {
                throw new Error('Error al procesar la compra');
            }

            const data = await response.json();
            console.log('Compra procesada exitosamente:', data);

            setPurchaseCompleted(true);

            // Mensaje personalizado según el tipo de reserva
            const successMessage = currentReservationData.reservationType === 'tourism' ? {
                title: '¡Experiencia Reservada!',
                details: `
                        <p><strong>Código de reserva:</strong> ${purchaseData.reservationId}</p>
                        <p><strong>Experiencia:</strong> ${currentReservationData.name}</p>
                        <p><strong>Fecha:</strong> ${new Date(currentReservationData.selectedDate).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}</p>
                        <p><strong>Hora:</strong> ${currentReservationData.selectedTime} hrs</p>
                        <p><strong>Participantes:</strong> ${currentReservationData.participants} persona${currentReservationData.participants > 1 ? 's' : ''}</p>
                        <p><strong>Punto de encuentro:</strong> ${currentReservationData.meetingPoint}</p>
                        <p><strong>Total pagado:</strong> $${purchaseData.pricing.total} MXN</p>
                        <p class="text-muted mt-3">Se ha enviado un correo de confirmación con todos los detalles a<br><strong>${usuarioData.email}</strong></p>
                        <p class="text-info mt-2"><small>💡 Recuerda llegar 15 minutos antes</small></p>
                    `
            } : {
                title: '¡Reserva Confirmada!',
                details: `
                        <p><strong>Código de reserva:</strong> ${purchaseData.reservationId}</p>
                        <p><strong>Check-in:</strong> ${new Date(checkIn).toLocaleDateString('es-ES')}</p>
                        <p><strong>Check-out:</strong> ${new Date(checkOut).toLocaleDateString('es-ES')}</p>
                        <p><strong>Noches:</strong> ${priceBreakdown.nights}</p>
                        <p><strong>Total pagado:</strong> $${purchaseData.pricing.total} MXN</p>
                        <p class="text-muted mt-3">Se ha enviado un correo de confirmación a<br><strong>${usuarioData.email}</strong></p>
                    `
            };

            await Swal.fire({
                icon: 'success',
                title: successMessage.title,
                html: successMessage.details,
                confirmButtonText: 'Ir a inicio',
                confirmButtonColor: currentReservationData.reservationType === 'tourism' ? '#87CEEB' : '#667eea',
                allowOutsideClick: false,
                customClass: {
                    popup: 'animated fadeInDown'
                }
            });

            if (onPaymentSuccess) {
                onPaymentSuccess(data);
            }

            // Limpiar localStorage después de la compra exitosa
            localStorage.removeItem('reservationData');

            navigate('/');

        } catch (error) {
            console.error('Error al procesar compra:', error);

            Swal.fire({
                icon: 'error',
                title: 'Error al procesar el pago',
                text: error.message || 'Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.',
                confirmButtonText: 'Reintentar',
                confirmButtonColor: '#dc3545'
            });

            setPurchaseCompleted(false);
        } finally {
            setIsLoading(false);
        }
    };

    const getAmenityIcon = (amenity) => {
        const amenityLower = amenity.toLowerCase();
        if (amenityLower.includes('wifi')) return <Wifi size={16} style={{ color: '#87CEEB' }} />;
        if (amenityLower.includes('estacion') || amenityLower.includes('parking')) return <Car size={16} style={{ color: '#87CEEB' }} />;
        if (amenityLower.includes('cocina') || amenityLower.includes('kitchen')) return <Coffee size={16} style={{ color: '#87CEEB' }} />;
        if (amenityLower.includes('tv')) return <Tv size={16} style={{ color: '#87CEEB' }} />;
        if (amenityLower.includes('aire') || amenityLower.includes('air')) return <Wind size={16} style={{ color: '#87CEEB' }} />;
        return <Star size={16} style={{ color: '#87CEEB' }} />;
    };

    const handleGoBack = () => {
        if (onGoBack) {
            onGoBack();
        } else {
            window.history.back();
        }
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const formatExpiryDate = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
    };

    const isPaymentReady = () => {
        if (!agreedToTerms) return false;
        if (priceBreakdown.total === 0) return false;
        if (paymentMethod === 'card') {
            if (!cardNumber || !expiryDate || !cvv || !cardName) return false;
        }
        return true;
    };

    return (
        <div style={{ backgroundColor: '#FFFFFF' }} className="min-vh-100 py-4">
            <div className="container">
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
                                <h1 className="h2 fw-bold mb-1" style={{ color: '#2C3E50' }}>
                                    {purchaseCompleted ? 'Compra Completada' : 'Procesar pago'}
                                </h1>
                                <p className="text-muted mb-0">
                                    {purchaseCompleted ? 'Tu reserva ha sido confirmada' : 'Completa tu reserva'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4">
                                <h3 className="h4 fw-bold mb-4" style={{ color: '#2C3E50' }}>
                                    <CreditCard size={24} style={{ color: '#87CEEB' }} className="me-2" />
                                    Método de pago
                                </h3>

                                <div className="mb-4">
                                    <div className={`form-check mb-3 p-3 border rounded-3 ${paymentMethod === 'mercadopago' ? 'border-primary bg-light' : ''}`}>
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="mercadopago"
                                            checked={paymentMethod === 'mercadopago'}
                                            onChange={() => {
                                                setPaymentMethod('mercadopago');
                                                setShowMPBrick(false);
                                            }}
                                            disabled={purchaseCompleted || isLoading}
                                        />
                                        <label className="form-check-label fw-semibold d-flex align-items-center" htmlFor="mercadopago">
                                            <div
                                                className="rounded me-2 d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: '24px',
                                                    height: '24px',
                                                    backgroundColor: '#009ee3',
                                                    fontSize: '10px',
                                                    color: 'white',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                MP
                                            </div>
                                            Mercado Pago (Tarjetas de crédito/débito)
                                        </label>
                                    </div>

                                    <div className={`form-check mb-3 p-3 border rounded-3 ${paymentMethod === 'card' ? 'border-primary bg-light' : ''}`}>
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="card"
                                            checked={paymentMethod === 'card'}
                                            onChange={() => {
                                                setPaymentMethod('card');
                                                setShowMPBrick(false);
                                            }}
                                            disabled={purchaseCompleted || isLoading}
                                        />
                                        <label className="form-check-label fw-semibold d-flex align-items-center" htmlFor="card">
                                            <CreditCard size={20} className="me-2" />
                                            Tarjeta de crédito o débito (Manual)
                                        </label>
                                    </div>

                                    <div className={`form-check mb-3 p-3 border rounded-3 ${paymentMethod === 'paypal' ? 'border-primary bg-light' : ''}`}>
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="paypal"
                                            checked={paymentMethod === 'paypal'}
                                            onChange={() => {
                                                setPaymentMethod('paypal');
                                                setShowMPBrick(false);
                                            }}
                                            disabled={purchaseCompleted || isLoading}
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

                                    <div className={`form-check mb-3 p-3 border rounded-3 ${paymentMethod === 'oxxo' ? 'border-primary bg-light' : ''}`}>
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="oxxo"
                                            checked={paymentMethod === 'oxxo'}
                                            onChange={() => {
                                                setPaymentMethod('oxxo');
                                                setShowMPBrick(false);
                                            }}
                                            disabled={purchaseCompleted || isLoading}
                                        />
                                        <label className="form-check-label fw-semibold d-flex align-items-center" htmlFor="oxxo">
                                            <Store size={20} className="me-2" style={{ color: '#CD5C5C' }} />
                                            OXXO Pay
                                        </label>
                                    </div>
                                </div>

                                {/* 🎨 Mercado Pago Brick */}
                                {showMPBrick && paymentMethod === 'mercadopago' && !purchaseCompleted && (
                                    <div className="border rounded-3 p-4 bg-light mb-4">
                                        <h5 className="mb-3">Ingresa los datos de tu tarjeta</h5>
                                        {MERCADOPAGO_PUBLIC_KEY === 'TEST-tu-public-key-aqui' ? (
                                            <div className="alert alert-warning">
                                                ⚠️ Configura tu PUBLIC_KEY de Mercado Pago en el código
                                            </div>
                                        ) : (
                                            <CardPayment
                                                initialization={initialization}
                                                customization={customization}
                                                onSubmit={onSubmitMP}
                                                onReady={onReadyMP}
                                                onError={onErrorMP}
                                            />
                                        )}
                                    </div>
                                )}

                                {/* Formulario manual de tarjeta */}
                                {paymentMethod === 'card' && !showMPBrick && (
                                    <div className="border rounded-3 p-4 bg-light mb-4">
                                        <div className="row g-3">
                                            <div className="col-12">
                                                <label className="form-label fw-semibold">Número de tarjeta</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="1234 5678 9012 3456"
                                                    value={cardNumber}
                                                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                                    maxLength="19"
                                                    disabled={purchaseCompleted || isLoading}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">Vencimiento</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="MM/AA"
                                                    value={expiryDate}
                                                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                                                    maxLength="5"
                                                    disabled={purchaseCompleted || isLoading}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">CVV</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="123"
                                                    value={cvv}
                                                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                                                    maxLength="4"
                                                    disabled={purchaseCompleted || isLoading}
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
                                                    disabled={purchaseCompleted || isLoading}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mb-4">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="terms"
                                            checked={agreedToTerms}
                                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                                            disabled={purchaseCompleted || isLoading}
                                        />
                                        <label className="form-check-label" htmlFor="terms">
                                            Acepto los <a href="#" style={{ color: '#87CEEB' }}>términos y condiciones</a>
                                        </label>
                                    </div>
                                </div>

                                {!showMPBrick && (
                                    <button
                                        className="btn btn-lg w-100 py-3 fw-bold rounded-3 shadow-sm"
                                        style={{
                                            background: purchaseCompleted
                                                ? '#28a745'
                                                : 'linear-gradient(135deg, #2C3E50 0%, #87CEEB 100%)',
                                            border: 'none',
                                            color: 'white'
                                        }}
                                        onClick={handlePaymentClick}
                                        disabled={!isPaymentReady() || isLoading || purchaseCompleted}
                                    >
                                        {purchaseCompleted ? (
                                            <>
                                                <Shield size={20} className="me-2" />
                                                Pago Completado - ${priceBreakdown.total}
                                            </>
                                        ) : isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Procesando pago...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard size={20} className="me-2" />
                                                {paymentMethod === 'mercadopago' ? 'Continuar al pago' : 'Confirmar y Pagar'} ${priceBreakdown.total}
                                            </>
                                        )}
                                    </button>
                                )}

                                {!isPaymentReady() && !purchaseCompleted && (
                                    <div className="alert alert-warning mt-3 mb-0" role="alert">
                                        <small>
                                            {!agreedToTerms && 'Debes aceptar los términos y condiciones'}
                                            {agreedToTerms && paymentMethod === 'card' && (!cardNumber || !expiryDate || !cvv || !cardName) && 'Completa todos los campos de la tarjeta'}
                                            {agreedToTerms && priceBreakdown.total === 0 && 'Verifica las fechas de reserva'}
                                        </small>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm rounded-4 sticky-top" style={{ top: '20px' }}>
                            <div className="card-body p-4">
                                <div className="d-flex mb-4">
                                    <img
                                        src={currentReservationData.images?.[0] || 'https://via.placeholder.com/80x80'}
                                        className="rounded-3 me-3"
                                        alt={currentReservationData.name}
                                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/80x80?text=Sin+Imagen';
                                        }}
                                    />
                                    <div className="flex-grow-1">
                                        <h5 className="fw-bold mb-1" style={{ color: '#2C3E50' }}>{currentReservationData.name}</h5>
                                        <div className="d-flex align-items-center text-muted small mb-1">
                                            <MapPin size={14} className="me-1" />
                                            {currentReservationData.location}
                                        </div>
                                        {currentReservationData.rating > 0 && (
                                            <div className="d-flex align-items-center">
                                                <Star size={14} className="text-warning me-1" fill="currentColor" />
                                                <span className="small fw-semibold">{currentReservationData.rating}</span>
                                                <span className="text-muted small ms-1">({currentReservationData.reviews})</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <hr />

                                {priceBreakdown.nights > 0 && (
                                    <div className="mb-4">
                                        <h6 className="fw-bold mb-3" style={{ color: '#2C3E50' }}>Desglose del precio</h6>

                                        {/* Dentro del desglose del precio */}
                                        {currentReservationData?.reservationType === 'tourism' ? (
                                            <div className="d-flex justify-content-between mb-2">
                                                <span>${currentReservationData.pricePerPerson} x {priceBreakdown.participants || currentReservationData.participants} persona{(priceBreakdown.participants || currentReservationData.participants) > 1 ? 's' : ''}</span>
                                                <span>${priceBreakdown.subtotal}</span>
                                            </div>
                                        ) : priceBreakdown.nights > 0 ? (
                                            <div className="d-flex justify-content-between mb-2">
                                                <span>${currentReservationData.price} x {priceBreakdown.nights} noche{priceBreakdown.nights > 1 ? 's' : ''}</span>
                                                <span>${priceBreakdown.subtotal}</span>
                                            </div>
                                        ) : null}
                                        <div className="d-flex justify-content-between mb-2 text-muted">
                                            <span>Tarifa de servicio</span>
                                            <span>${priceBreakdown.serviceFee}</span>
                                        </div>

                                        <div className="d-flex justify-content-between mb-3 text-muted">
                                            <span>Impuestos</span>
                                            <span>${priceBreakdown.taxes}</span>
                                        </div>

                                        <hr />

                                        <div className="d-flex justify-content-between fw-bold fs-5" style={{ color: purchaseCompleted ? '#28a745' : '#2C3E50' }}>
                                            <span>{purchaseCompleted ? 'Pagado' : 'Total'}</span>
                                            <span>${priceBreakdown.total}</span>
                                        </div>
                                    </div>
                                )}

                                {currentReservationData.amenities?.length > 0 && (
                                    <div className="mb-4">
                                        <h6 className="fw-bold mb-3" style={{ color: '#2C3E50' }}>Amenidades incluidas</h6>
                                        <div className="row g-2">
                                            {currentReservationData.amenities.slice(0, 4).map((amenity, index) => (
                                                <div key={index} className="col-12">
                                                    <div className="d-flex align-items-center small">
                                                        {getAmenityIcon(amenity)}
                                                        <span className="ms-2 text-truncate">{amenity}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="rounded-3 p-3 bg-light">
                                    <div className="d-flex align-items-center mb-2">
                                        <Clock size={16} style={{ color: '#87CEEB' }} className="me-2" />
                                        <span className="small fw-semibold">Soporte {currentSupportInfo.available}</span>
                                    </div>
                                    <div className="d-flex align-items-center mb-2">
                                        <Phone size={16} style={{ color: '#87CEEB' }} className="me-2" />
                                        <span className="small">{currentSupportInfo.phone}</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <Mail size={16} style={{ color: '#87CEEB' }} className="me-2" />
                                        <span className="small">{currentSupportInfo.email}</span>
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