import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

export default function LoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const redirigirPorRol = (rol) => {
        switch (rol) {
            case 'admin':
                return '/dashboard';
            case 'anfitrion':
                return '/host/publications';
            case 'usuario':
                return '/';
            default:
                return '/';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/api/auth/login", formData);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("usuario", JSON.stringify(response.data.usuario));
            localStorage.setItem("rol", response.data.usuario.rol);
            window.dispatchEvent(new Event('usuarioActualizado'));

            await Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: `Bienvenido ${response.data.usuario.nombre}`,
                timer: 1500,
                showConfirmButton: false
            });

            navigate(redirigirPorRol(response.data.usuario.rol), { replace: true });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.error || 'Credenciales incorrectas',
                confirmButtonColor: '#2C3E50'
            });
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);
            const response = await axios.post("http://localhost:3000/api/auth/google-login", {
                credential: credentialResponse.credential,
            });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("usuario", JSON.stringify(response.data.usuario));
            window.dispatchEvent(new Event('usuarioActualizado'));

            await Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: `Bienvenido ${response.data.usuario.nombre}`,
                timer: 1500,
                showConfirmButton: false
            });

            navigate(redirigirPorRol(response.data.usuario.rol), { replace: true });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.error || 'Error al iniciar sesión con Google',
                confirmButtonColor: '#2C3E50'
            });
        }
    };

    const handleGoogleError = () => {
        console.log("=== GOOGLE LOGIN ERROR ===");
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo iniciar sesión con Google',
            confirmButtonColor: '#2C3E50'
        });
    };

    return (
        <section
            className="h-100"
            style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}
        >
            <div className="container py-4 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100" style={{ marginTop: "100px" }}>
                    <div className="col-xl-10">
                        <div className="card rounded-4 text-black shadow-lg border-0">
                            <div className="row g-0">
                                <div
                                    className="col-lg-6 d-flex align-items-center justify-content-center position-relative overflow-hidden"
                                    style={{
                                        background: "linear-gradient(135deg, #2C3E50 0%, #87CEEB 100%)",
                                        minHeight: "600px"
                                    }}
                                >
                                    <div className="position-absolute w-100 h-100" style={{ opacity: 0.1 }}>
                                        <div className="position-absolute rounded-circle bg-white" style={{ width: "300px", height: "300px", top: "-100px", left: "-100px" }}></div>
                                        <div className="position-absolute rounded-circle bg-white" style={{ width: "200px", height: "200px", bottom: "-50px", right: "-50px" }}></div>
                                    </div>
                                    <div className="px-4 py-5 p-md-5 text-center position-relative">
                                        <img
                                            src="https://blogger.googleusercontent.com/img/a/AVvXsEhD-CBxjfcc96SYgYSWU5N4P59lr9qK8EP9O4nN4QjpDnmPJZhN71h1B02iWSFS9eXIuIqCXp0ZPKmE2SqTl_5DzJ4U7Ox8qVfPcV3wwt86SEMuzwDByuxWjceTPfNDzma7rCWBknp7tQC2GmgB9f4C6C9F6ZJQUpAIjpTia4aO6Qzpv9aFr0v4UvB04jo"
                                            alt="Login illustration"
                                            className="img-fluid rounded-3 shadow-lg"
                                            style={{ maxWidth: "90%" }}
                                        />
                                        <div className="text-white mt-4">
                                            <h3 className="fw-bold mb-3">Bienvenido de vuelta</h3>
                                            <p className="mb-0 opacity-75">Gestiona tus reservaciones y descubre nuevos lugares</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-6 bg-white">
                                    <div className="card-body p-4 p-md-5 mx-md-3">
                                        <div className="text-center mb-5">
                                            <img
                                                src="https://blogger.googleusercontent.com/img/a/AVvXsEhjjv5anKGHGaRt5CNdVF8Hz9RdIHor9kmWhQwXqnJcHaOHhGEt4XyvIOymsgqvwJiJZCjkE15JavstMTSSnwD1meWD1ZW5dD6QTfDxkDiIJfS2MzP8E1XqzmmAqnSGwHjeab-B4tf5KI62qs8gLuYLOVzMam_veip1vVIvkPzZNccw1iuA1cNqeO6klNw"
                                                style={{ width: "160px" }}
                                                alt="logo"
                                                className="mb-3"
                                            />
                                            <h3 className="fw-bold mb-2" style={{ color: "#2C3E50" }}>Inicia Sesión</h3>
                                            <p className="text-muted mb-0">Ingresa tus credenciales para continuar</p>
                                        </div>

                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-4">
                                                <label htmlFor="form2Example11" className="form-label fw-semibold" style={{ color: "#2C3E50" }}>
                                                    Correo Electrónico
                                                </label>
                                                <input
                                                    type="email"
                                                    id="form2Example11"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="form-control form-control-lg py-3 px-4 rounded-3"
                                                    placeholder="tu@email.com"
                                                    style={{ backgroundColor: "#f8f9fa", border: "2px solid #e9ecef" }}
                                                    required
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="form2Example22" className="form-label fw-semibold" style={{ color: "#2C3E50" }}>
                                                    Contraseña
                                                </label>
                                                <input
                                                    type="password"
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    id="form2Example22"
                                                    className="form-control form-control-lg py-3 px-4 rounded-3"
                                                    placeholder="Ingresa tu contraseña"
                                                    style={{ backgroundColor: "#f8f9fa", border: "2px solid #e9ecef" }}
                                                    required
                                                />
                                            </div>

                                            <div className="d-flex justify-content-between align-items-center mb-4">
                                                <a className="text-decoration-none fw-semibold" href="#!" style={{ color: "#87CEEB" }}>
                                                    ¿Olvidaste tu contraseña?
                                                </a>
                                            </div>

                                            <div className="mb-4">
                                                <button
                                                    className="btn btn-lg w-100 py-3 fw-semibold rounded-3 shadow-sm text-white"
                                                    type="submit"
                                                    style={{ background: "linear-gradient(135deg, #2C3E50 0%, #87CEEB 100%)", border: "none" }}
                                                >
                                                    Iniciar Sesión
                                                </button>
                                            </div>

                                            <div className="text-center mb-4">
                                                <div className="d-flex align-items-center mb-4">
                                                    <hr className="flex-grow-1" style={{ height: "2px", opacity: 0.1 }} />
                                                    <span className="px-3 text-muted small fw-semibold">O CONTINÚA CON</span>
                                                    <hr className="flex-grow-1" style={{ height: "2px", opacity: 0.1 }} />
                                                </div>

                                                {/* Botón de Google OAuth */}
                                                <div className="d-flex justify-content-center">
                                                    <GoogleLogin
                                                        onSuccess={handleGoogleSuccess}
                                                        onError={handleGoogleError}
                                                        size="large"
                                                        width="100%"
                                                        text="signin_with"
                                                        shape="rectangular"
                                                        theme="outline"
                                                    />
                                                </div>
                                            </div>

                                            <div className="text-center pt-3 pb-2">
                                                <p className="mb-0 text-muted">
                                                    ¿No tienes una cuenta?{" "}
                                                    <a href="/register" className="fw-bold text-decoration-none" style={{ color: "#2C3E50" }}>
                                                        Crear cuenta nueva
                                                    </a>
                                                </p>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}