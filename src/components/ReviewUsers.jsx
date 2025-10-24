    import React, { useState } from 'react';
    import { Star, Loader } from 'lucide-react';

    export default function ReviewUsers({ isOpen, onClose, data, propertyId }) {
        const [rating, setRating] = useState(0);
        const [hoverRating, setHoverRating] = useState(0);
        const [comment, setComment] = useState('');
        const [submitted, setSubmitted] = useState(false);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState('');

        // Debug: Log cuando cambia el propertyId
        React.useEffect(() => {
            if (isOpen) {
                console.log('=== MODAL DE RESEÑA ABIERTO ===');
                console.log('propertyId:', propertyId);
                console.log('Nombre:', data?.establecimiento?.nombre || data?.experiencia?.titulo);
            }
        }, [isOpen, propertyId, data]);

        const handleSubmitReview = async () => {
            if (rating === 0) {
                alert('Por favor selecciona una calificación');
                return;
            }

            setLoading(true);
            setError('');

            try {
                const usuario = JSON.parse(localStorage.getItem('usuario'));
                const token = localStorage.getItem('token');

                console.log('=== ENVIANDO RESEÑA ===');
                console.log('ID Reserva:', propertyId);
                console.log('ID Usuario:', usuario.id_usuario);
                console.log('Calificación:', rating);
                console.log('Comentario:', comment);

                const response = await fetch('http://localhost:3000/api/reviews/addReview', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        id_reserva: propertyId,
                        id_usuario: usuario.id_usuario,
                        calificacion: rating,
                        comentario: comment || null
                    })
                });

                const result = await response.json();
                console.log('=== RESPUESTA DEL SERVIDOR ===');
                console.log('Success:', result.success);
                console.log('ID Reseña creada:', result.data?.id_reseña);
                console.log('ID Reserva confirmada:', result.data?.id_reserva);

                if (response.status === 409) {
                    // Usuario ya dejó una reseña
                    setError(result.error || 'Ya has dejado una reseña para esta reservación');
                    setLoading(false);
                    return;
                }

                if (!result.success) {
                    setError(result.error || 'Error al enviar la reseña');
                    setLoading(false);
                    return;
                }

                setSubmitted(true);
                setTimeout(() => {
                    setRating(0);
                    setComment('');
                    setSubmitted(false);
                    setLoading(false);
                    onClose();
                }, 2000);
            } catch (err) {
                console.error('Error:', err);
                setError('Error inesperado: ' + err.message);
                setLoading(false);
            }
        };

        // Get property name from data
        const getPropertyName = () => {
            if (!data) return 'Reserva';
            return data.establecimiento?.nombre || data.experiencia?.titulo || 'Reserva';
        };

        if (!isOpen) return null;

        return (
            <div
                className="modal d-block"
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 1050
                }}
                onClick={onClose}
            >
                <div
                    className="modal-dialog modal-dialog-centered"
                    onClick={(e) => e.stopPropagation()}
                    style={{ maxWidth: '600px' }}
                >
                    <div className="modal-content border-0 rounded-4">
                        {/* Header */}
                        <div className="modal-header border-0 pb-0">
                            <div className="flex-grow-1">
                                <h5 className="modal-title fw-bold" style={{ color: '#2C3E50' }}>
                                    Agregar reseña
                                </h5>
                            </div>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                                aria-label="Close"
                                disabled={loading}
                            ></button>
                        </div>

                        {/* Body */}
                        <div className="modal-body">
                            {submitted ? (
                                <div className="text-center py-5">
                                    <div
                                        className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            backgroundColor: '#d4edda'
                                        }}
                                    >
                                        <span style={{ fontSize: '32px' }}>✓</span>
                                    </div>
                                    <h6 className="fw-bold mb-2">¡Reseña enviada!</h6>
                                    <p className="text-muted mb-0">Gracias por compartir tu experiencia</p>
                                </div>
                            ) : (
                                <>
                                    {/* Error Message */}
                                    {error && (
                                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                            {error}
                                            <button
                                                type="button"
                                                className="btn-close"
                                                onClick={() => setError('')}
                                            ></button>
                                        </div>
                                    )}

                                    {/* Mostrar nombre de la reserva */}
                                    {data && (
                                        <div className="mb-4">
                                            <h5 className="fw-bold" style={{ color: '#2C3E50' }}>
                                                {getPropertyName()}
                                            </h5>
                                        </div>
                                    )}

                                    {/* Rating */}
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold mb-3" style={{ color: '#2C3E50' }}>
                                            ¿Cómo fue tu experiencia?
                                        </label>
                                        <div className="d-flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    className="btn p-0 border-0"
                                                    onClick={() => setRating(star)}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    disabled={loading}
                                                >
                                                    <Star
                                                        size={40}
                                                        style={{
                                                            color: star <= (hoverRating || rating) ? '#FFD700' : '#E0E0E0',
                                                            fill: star <= (hoverRating || rating) ? '#FFD700' : 'none',
                                                            cursor: loading ? 'not-allowed' : 'pointer',
                                                            transition: 'all 0.2s'
                                                        }}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                        {rating > 0 && (
                                            <small className="text-muted d-block mt-2">
                                                Calificación: {rating} de 5 estrellas
                                            </small>
                                        )}
                                    </div>

                                    {/* Comment */}
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold" style={{ color: '#2C3E50' }}>
                                            Cuéntanos más (opcional)
                                        </label>
                                        <textarea
                                            className="form-control border-2"
                                            rows="4"
                                            placeholder="¿Qué te gustó? ¿Hay algo que se podría mejorar?..."
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value.slice(0, 500))}
                                            disabled={loading}
                                            style={{ resize: 'vertical' }}
                                        />
                                        <small className="text-muted d-block mt-2">
                                            {comment.length}/500 caracteres
                                        </small>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        {!submitted && data && (
                            <div className="modal-footer border-0 pt-0">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={onClose}
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className="btn text-white fw-bold"
                                    onClick={handleSubmitReview}
                                    disabled={loading}
                                    style={{
                                        backgroundColor: loading ? '#ccc' : '#CD5C5C',
                                        cursor: loading ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Enviando...
                                        </>
                                    ) : (
                                        'Enviar reseña'
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }