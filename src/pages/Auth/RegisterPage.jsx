import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { GoogleLogin } from '@react-oauth/google';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: "",
        apellido_p: "",
        apellido_m: "",
        email: "",
        telefono: "",
        password: "",
        confirmPassword: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar que las contraseñas coincidan
        if (formData.password !== formData.confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Las contraseñas no coinciden',
                confirmButtonColor: '#CD5C5C'
            });
            return;
        }

        try {
            const response = await axios.post("http://localhost:3000/api/auth/register", formData);
            console.log(response.data);
            
            // Limpiar formulario
            setFormData({
                nombre: "",
                apellido_p: "",
                apellido_m: "",
                email: "",
                telefono: "",
                password: "",
                confirmPassword: ""
            });

            // Guardar token y usuario
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("usuario", JSON.stringify(response.data.usuario));
            
            // Disparar evento para actualizar el Navbar
            window.dispatchEvent(new Event('usuarioActualizado'));

            Swal.fire({
                icon: 'success',
                title: '¡Registro exitoso!',
                text: 'Tu cuenta ha sido creada correctamente',
                confirmButtonColor: '#CD5C5C',
                timer: 2000,
                timerProgressBar: true
            }).then(() => {
                navigate("/");
            });

        } catch (error) {
            console.log("Error:", error.response?.data);
            
            Swal.fire({
                icon: 'error',
                title: 'Error en el registro',
                text: error.response?.data?.error || 'Ocurrió un error al registrar',
                confirmButtonColor: '#CD5C5C'
            });
        }
    };

    // Manejador para registro/login con Google
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            console.log("=== GOOGLE REGISTER/LOGIN SUCCESS ===");

            // Enviar el token de Google al backend
            const response = await axios.post("http://localhost:3000/api/auth/google-login", {
                credential: credentialResponse.credential
            });

            console.log("=== RESPUESTA DEL SERVIDOR (Google) ===");
            console.log(response.data);

            // Guardar token y usuario
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("usuario", JSON.stringify(response.data.usuario));
            
            // Disparar evento para actualizar el Navbar
            window.dispatchEvent(new Event('usuarioActualizado'));

            await Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: `Bienvenido ${response.data.usuario.nombre}`,
                timer: 1500,
                showConfirmButton: false
            });

            navigate("/");
        } catch (error) {
            console.error("Error en registro/login con Google:", error);
            
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.error || 'Error al registrarse con Google',
                confirmButtonColor: '#CD5C5C'
            });
        }
    };

    const handleGoogleError = () => {
        console.log("=== GOOGLE REGISTER/LOGIN ERROR ===");
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo registrar con Google',
            confirmButtonColor: '#CD5C5C'
        });
    };

    return (
        <section
            className="h-100"
            style={{ backgroundColor: "", minHeight: "100vh", marginTop: "100px" }}
        >
            <div className="container py-4 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-xl-10">
                        <div className="card rounded-4 text-black shadow-lg border-0">
                            <div className="row g-0">
                                <div
                                    className="col-lg-6 d-flex align-items-center justify-content-center position-relative overflow-hidden"
                                    style={{
                                        background: "linear-gradient(135deg, #CD5C5C 0%, #F4EFEA 100%)",
                                        minHeight: "700px"
                                    }}
                                >
                                    <div className="position-absolute w-100 h-100" style={{ opacity: 0.1 }}>
                                        <div className="position-absolute rounded-circle bg-white" style={{ width: "300px", height: "300px", top: "-100px", left: "-100px" }}></div>
                                        <div className="position-absolute rounded-circle bg-white" style={{ width: "200px", height: "200px", bottom: "-50px", right: "-50px" }}></div>
                                    </div>
                                    <div className="px-4 py-5 p-md-5 text-center position-relative">
                                        <img
                                            src="https://blogger.googleusercontent.com/img/a/AVvXsEhD-CBxjfcc96SYgYSWU5N4P59lr9qK8EP9O4nN4QjpDnmPJZhN71h1B02iWSFS9eXIuIqCXp0ZPKmE2SqTl_5DzJ4U7Ox8qVfPcV3wwt86SEMuzwDByuxWjceTPfNDzma7rCWBknp7tQC2GmgB9f4C6C9F6ZJQUpAIjpTia4aO6Qzpv9aFr0v4UvB04jo"
                                            alt="Register illustration"
                                            className="img-fluid rounded-3 shadow-lg"
                                            style={{ maxWidth: "90%" }}
                                        />
                                        <div className="text-white mt-4">
                                            <h3 className="fw-bold mb-3">Únete a nosotros</h3>
                                            <p className="mb-0 opacity-75">Crea tu cuenta y empieza a disfrutar de todos los beneficios</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-6 bg-white">
                                    <div className="card-body p-4 p-md-5 mx-md-3">
                                        <div className="text-center mb-4">
                                            <img
                                                src="https://blogger.googleusercontent.com/img/a/AVvXsEhjjv5anKGHGaRt5CNdVF8Hz9RdIHor9kmWhQwXqnJcHaOHhGEt4XyvIOymsgqvwJiJZCjkE15JavstMTSSnwD1meWD1ZW5dD6QTfDxkDiIJfS2MzP8E1XqzmmAqnSGwHjeab-B4tf5KI62qs8gLuYLOVzMam_veip1vVIvkPzZNccw1iuA1cNqeO6klNw"
                                                style={{ width: "140px" }}
                                                alt="logo"
                                                className="mb-2"
                                            />
                                            <h3 className="fw-bold mb-2" style={{ color: "#CD5C5C" }}>Crear Cuenta</h3>
                                            <p className="text-muted mb-0">Completa los datos para registrarte</p>
                                        </div>

                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-12 mb-3">
                                                    <label htmlFor="nombreCompleto" className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                        Nombre(s)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="nombreCompleto"
                                                        value={formData.nombre}
                                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                                        className="form-control form-control-lg py-3 px-4 rounded-3"
                                                        placeholder="Juan"
                                                        style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="apellidoPaterno" className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                        Apellido Paterno
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="apellidoPaterno"
                                                        value={formData.apellido_p}
                                                        onChange={(e) => setFormData({ ...formData, apellido_p: e.target.value })}
                                                        className="form-control form-control-lg py-3 px-4 rounded-3"
                                                        placeholder="Pérez"
                                                        style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
                                                        required
                                                    />
                                                </div>

                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="apellidoMaterno" className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                        Apellido Materno
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="apellidoMaterno"
                                                        value={formData.apellido_m}
                                                        onChange={(e) => setFormData({ ...formData, apellido_m: e.target.value })}
                                                        className="form-control form-control-lg py-3 px-4 rounded-3"
                                                        placeholder="García"
                                                        style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="email" className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                        Correo Electrónico
                                                    </label>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        className="form-control form-control-lg py-3 px-4 rounded-3"
                                                        placeholder="tu@email.com"
                                                        style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
                                                        required
                                                    />
                                                </div>

                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="telefono" className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                        Teléfono
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        id="telefono"
                                                        value={formData.telefono}
                                                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                                        className="form-control form-control-lg py-3 px-4 rounded-3"
                                                        placeholder="+52 123 456 7890"
                                                        style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="password" className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                        Contraseña
                                                    </label>
                                                    <input
                                                        type="password"
                                                        id="password"
                                                        value={formData.password}
                                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                        className="form-control form-control-lg py-3 px-4 rounded-3"
                                                        placeholder="Mínimo 8 caracteres"
                                                        style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
                                                        required
                                                    />
                                                </div>

                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="confirmPassword" className="form-label fw-semibold" style={{ color: "#000000" }}>
                                                        Confirmar Contraseña
                                                    </label>
                                                    <input
                                                        type="password"
                                                        id="confirmPassword"
                                                        value={formData.confirmPassword}
                                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                        className="form-control form-control-lg py-3 px-4 rounded-3"
                                                        placeholder="Confirma tu contraseña"
                                                        style={{ backgroundColor: "#F4EFEA", border: "2px solid #e9ecef" }}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="terminos"
                                                        style={{ borderColor: "#CD5C5C" }}
                                                        required
                                                    />
                                                    <label className="form-check-label text-muted small" htmlFor="terminos">
                                                        Acepto los{" "}
                                                        <a href="#!" className="text-decoration-none fw-semibold" style={{ color: "#CD5C5C" }}>
                                                            términos y condiciones
                                                        </a>
                                                        {" "}y la{" "}
                                                        <a href="#!" className="text-decoration-none fw-semibold" style={{ color: "#CD5C5C" }}>
                                                            política de privacidad
                                                        </a>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <button
                                                    className="btn btn-lg w-100 py-3 fw-semibold rounded-3 shadow-sm text-white"
                                                    type="submit"
                                                    style={{ background: "linear-gradient(135deg, #CD5C5C 0%, #F4EFEA 100%)", border: "none" }}
                                                >
                                                    Crear Cuenta
                                                </button>
                                            </div>

                                            <div className="text-center mb-4">
                                                <div className="d-flex align-items-center mb-4">
                                                    <hr className="flex-grow-1" style={{ height: "2px", opacity: 0.1 }} />
                                                    <span className="px-3 text-muted small fw-semibold">O REGÍSTRATE CON</span>
                                                    <hr className="flex-grow-1" style={{ height: "2px", opacity: 0.1 }} />
                                                </div>
                                                
                                                <div className="d-flex justify-content-center">
                                                    <GoogleLogin
                                                        onSuccess={handleGoogleSuccess}
                                                        onError={handleGoogleError}
                                                        size="large"
                                                        width="100%"
                                                        text="signup_with"
                                                        shape="rectangular"
                                                        theme="outline"
                                                    />
                                                </div>
                                            </div>

                                            <div className="text-center pt-3 pb-2">
                                                <p className="mb-0 text-muted">
                                                    ¿Ya tienes una cuenta?{" "}
                                                    <a href="/login" className="fw-bold text-decoration-none" style={{ color: "#CD5C5C" }}>
                                                        Iniciar sesión
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