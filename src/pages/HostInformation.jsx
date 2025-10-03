import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';




const HostInformation = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
        const storedUser = localStorage.getItem("token");

        if (storedUser) {
            const decodedToken = parseJwt(storedUser);
            console.log("Token decodificado:", decodedToken);
            console.log("ID Usuario:", decodedToken?.id_usuario);
            console.log("Tipo de usuario:", decodedToken?.rol);

            setUser(decodedToken);
            
            // Si ya es anfitrión, redirigir inmediatamente
            if (decodedToken?.rol === 'anfitrion') {
                navigate('/host/upload');
            } else {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, [navigate]);

    const handleHost = async () => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Quieres convertirte en anfitrión?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, quiero ser anfitrión',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.post("http://localhost:3000/api/hospitality/convertirseEnAnfitrion", {
                    id_usuario: user.id_usuario
                });

                console.log("Respuesta del servidor:", response.data);

                await Swal.fire({
                    title: '¡Éxito!',
                    text: 'Ahora eres anfitrión',
                    icon: 'success',
                    confirmButtonColor: '#dc3545'
                });

                navigate("/host/upload");
            } catch (error) {
                console.log("Error al convertirse en anfitrión:", error);

                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al convertirte en anfitrión',
                    icon: 'error',
                    confirmButtonColor: '#dc3545'
                });
            }
        }
    };

    if (loading) {
        return null;
    }

    if (user?.rol === 'anfitrion') {
        return null;
    }

    return (
        <div className="container-fluid p-0">
            <div className="row g-0 min-vh-100">
                <div className="col-lg-6 d-none d-lg-block">
                    <div
                        className="h-100"
                        style={{
                            backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            minHeight: '100vh'
                        }}
                    ></div>
                </div>

                <div className="col-lg-6">
                    <div className="d-flex align-items-center justify-content-center h-100 p-4 p-md-5">
                        <div className="text-center" style={{ maxWidth: '500px' }}>
                            <div className="mb-4">
                                <svg
                                    width="60"
                                    height="60"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="text-danger mx-auto"
                                >
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                </svg>
                            </div>

                            <h1 className="display-4 fw-bold mb-4">
                                ¿Quieres ser Anfitrión?
                            </h1>
                            <p className="lead text-muted mb-4">
                                Comparte tu espacio y empieza a generar ingresos.
                                Únete a nuestra comunidad de anfitriones.
                            </p>

                            <button
                                className="btn btn-danger btn-lg px-5 py-3 rounded-pill shadow-sm"
                                onClick={handleHost}
                            >
                                Comenzar ahora
                            </button>

                            <div className="mt-5">
                                <div className="row g-4 text-center">
                                    <div className="col-4">
                                        <h3 className="fw-bold mb-1">+1M</h3>
                                        <p className="small text-muted mb-0">Anfitriones</p>
                                    </div>
                                    <div className="col-4">
                                        <h3 className="fw-bold mb-1">180+</h3>
                                        <p className="small text-muted mb-0">Países</p>
                                    </div>
                                    <div className="col-4">
                                        <h3 className="fw-bold mb-1">4.8★</h3>
                                        <p className="small text-muted mb-0">Valoración</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HostInformation;