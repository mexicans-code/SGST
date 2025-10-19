import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Star, MessageCircle } from 'lucide-react';

const Reviews = () => {
    const [showAll, setShowAll] = useState(false);
    const [resenas, setResenas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [promedioRating, setPromedioRating] = useState(0);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const reservationData = JSON.parse(localStorage.getItem('reservationData'));
            
            console.log('Reservation Data:', reservationData);
            
            // Determinar si es hostelería o experiencia
            const isExperiencia = reservationData?.tipo === 'experiencia' || reservationData?.id_experiencia;
            const propertyId = reservationData?.id;
            
            console.log('Tipo:', isExperiencia ? 'Experiencia' : 'Hostelería');
            console.log('ID Propiedad:', propertyId);
            
            if (!propertyId) {
                console.log('No hay propiedad disponible');
                setLoading(false);
                return;
            }

            // Construir la URL según el tipo
            const queryParam = isExperiencia ? 'id_experiencia' : 'id_hosteleria';
            const url = `http://localhost:3000/api/reviews/getReviews?${queryParam}=${propertyId}`;
            
            console.log('URL de búsqueda:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            console.log('Reviews:', result);

            if (result.success && result.data) {
                const reviewsFormateadas = result.data.map((review, index) => ({
                    id: review.id_calificacion || index,
                    nombre: review.nombre_usuario || 'Usuario',
                    fecha: new Date(review.fecha_reseña).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long'
                    }),
                    rating: review.calificacion,
                    texto: `"${review.comentario || 'Sin comentario'}"`,
                    inicial: (review.nombre_usuario || 'U')[0].toUpperCase(),
                    color: getColorByIndex(index)
                }));

                setResenas(reviewsFormateadas);

                // Calcular promedio de rating
                if (reviewsFormateadas.length > 0) {
                    const promedio = (
                        reviewsFormateadas.reduce((sum, r) => sum + r.rating, 0) / 
                        reviewsFormateadas.length
                    ).toFixed(1);
                    setPromedioRating(promedio);
                }
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const getColorByIndex = (index) => {
        const colors = ['bg-danger', 'bg-info', 'bg-success', 'bg-warning', 'bg-primary'];
        return colors[index % colors.length];
    };

    const totalResenas = resenas.length;
    const resenasMostradas = showAll ? resenas : resenas.slice(0, 2);

    const renderStars = (rating) => {
        return (
            <div className="d-flex gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={14}
                        className={i < rating ? 'text-warning' : 'text-secondary'}
                        fill={i < rating ? 'currentColor' : 'none'}
                    />
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <p className="text-muted">Cargando reseñas...</p>
            </div>
        );
    }

    if (totalResenas === 0) {
        return (
            <div className="container py-5">
                <div className="alert alert-info">
                    <MessageCircle size={20} className="me-2" />
                    No hay reseñas disponibles aún para esta propiedad
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="mb-5">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center gap-2">
                        <MessageCircle size={24} className="text-primary" />
                        <h2 className="fw-bold mb-0" style={{ fontSize: '24px' }}>Reseñas de huéspedes</h2>
                    </div>
                    <div className="d-flex align-items-center gap-4">
                        <div className="text-end">
                            <h3 className="fw-bold mb-0" style={{ fontSize: '24px' }}>{promedioRating}</h3>
                            <p className="text-muted small mb-0">{totalResenas} reseña{totalResenas !== 1 ? 's' : ''}</p>
                        </div>
                        <div className="d-flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={18}
                                    className={i < Math.round(promedioRating) ? 'text-warning' : 'text-secondary'}
                                    fill={i < Math.round(promedioRating) ? 'currentColor' : 'none'}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="row">
                    {resenasMostradas.map((resena) => (
                        <div key={resena.id} className="col-md-6 mb-4">
                            <div className="card h-100 border-light shadow-sm">
                                <div className="card-body">
                                    {/* Info del Usuario */}
                                    <div className="d-flex align-items-start gap-3 mb-3">
                                        <div
                                            className={`${resena.color} rounded-circle text-white d-flex align-items-center justify-content-center flex-shrink-0`}
                                            style={{ width: '40px', height: '40px', fontSize: '16px', fontWeight: 'bold' }}
                                        >
                                            {resena.inicial}
                                        </div>
                                        <div className="flex-grow-1">
                                            <h5 className="fw-semibold mb-1">{resena.nombre}</h5>
                                            <p className="text-muted small mb-0">{resena.fecha}</p>
                                        </div>
                                        <div>{renderStars(resena.rating)}</div>
                                    </div>

                                    {/* Texto de la Reseña */}
                                    <p className="card-text text-secondary small lh-relaxed">{resena.texto}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Botón Ver Más */}
                {totalResenas > 2 && (
                    <div className="d-flex justify-content-center mt-4">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="btn btn-outline-primary rounded-pill px-4"
                        >
                            {showAll ? 'Ver menos reseñas' : `Ver las ${totalResenas} reseñas`}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reviews;