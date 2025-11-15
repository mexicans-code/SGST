// CheckoutModal.jsx o donde proceses la compra

import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export default function CheckoutModal({ isOpen, onClose }) {
    const [showGoogleAuth, setShowGoogleAuth] = useState(false);
    const [purchaseData, setPurchaseData] = useState(null);

    const handlePurchaseSuccess = async (response) => {
        try {
            const purchaseResponse = await axios.post(
                'http://localhost:3004/purchase',
                purchaseData
            );

            console.log('✅ Compra exitosa:', purchaseResponse.data);

            // Si necesita autorizar Google Calendar
            if (purchaseResponse.data.needsGoogleCalendarAuth) {
                console.log('📅 Solicitar permiso de Google Calendar...');
                setShowGoogleAuth(true);
                setPurchaseData(purchaseResponse.data);
            } else {
                // Cerrar modal
                onClose();
                Swal.fire({
                    icon: 'success',
                    title: '¡Compra Exitosa!',
                    text: 'Tu reserva ha sido procesada'
                });
            }
        } catch (error) {
            console.error('Error en compra:', error);
        }
    };

    const handleGoogleCalendarSuccess = async (credentialResponse) => {
        try {
            console.log('✅ Google Calendar autorizado');
            
            const calendarResponse = await axios.post(
                'http://localhost:3004/create-calendar-event',
                {
                    credential: credentialResponse.credential,
                    reservationId: purchaseData.reservationId,
                    id_reserva: purchaseData.id_reserva,
                    usuarioEmail: purchaseData.usuarioEmail,
                    tipo: purchaseData.tipo
                }
            );

            console.log('📅 Evento creado en Calendar:', calendarResponse.data);

            Swal.fire({
                icon: 'success',
                title: '¡Compra y Calendario Sincronizado!',
                text: 'El evento se agregó a tu Google Calendar'
            });

            setShowGoogleAuth(false);
            onClose();

        } catch (error) {
            console.error('Error creando evento:', error);
            Swal.fire({
                icon: 'warning',
                title: 'Compra Exitosa',
                text: 'Compra procesada, pero no pudimos agregar el evento a tu calendario'
            });
        }
    };

    const handleGoogleCalendarError = () => {
        Swal.fire({
            icon: 'info',
            title: 'Calendario Opcional',
            text: 'Puedes agregar el evento manualmente a tu calendario más tarde'
        });
        setShowGoogleAuth(false);
        onClose();
    };

    return (
        <>
            {!showGoogleAuth ? (
                <div>
                    {/* Tu formulario de pago actual */}
                    <button onClick={handlePurchaseSuccess}>
                        Procesar Compra
                    </button>
                </div>
            ) : (
                <div className="text-center p-4">
                    <h4 className="mb-3">Agregar evento a tu Google Calendar</h4>
                    <p className="text-muted mb-4">
                        Permite que sincronicemos tu reserva con tu calendario de Google
                    </p>
                    <GoogleLogin
                        onSuccess={handleGoogleCalendarSuccess}
                        onError={handleGoogleCalendarError}
                        size="large"
                        width="100%"
                        text="signin_with"
                        shape="rectangular"
                    />
                    <button 
                        className="btn btn-link mt-3"
                        onClick={handleGoogleCalendarError}
                    >
                        Omitir este paso
                    </button>
                </div>
            )}
        </>
    );
}
