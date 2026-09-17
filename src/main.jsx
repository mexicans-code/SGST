import { createRoot } from 'react-dom/client'
import React from 'react'
import App from './App.jsx'
import './index.css'
import { installMock } from './mock/server'

installMock()

if (!localStorage.getItem("usuario")) {
  localStorage.setItem("usuario", JSON.stringify({
    id_usuario: 3,
    nombre: "Luis",
    apellido_p: "Pérez",
    apellido_m: "García",
    email: "usuario@sierragorda.mx",
    telefono: "4429876543",
    rol: "usuario",
    foto: "",
    direccion: "Calle Hidalgo 45, Jalpan de Serra"
  }));
}
if (!localStorage.getItem("rol")) {
  localStorage.setItem("rol", "usuario");
}
if (!localStorage.getItem("token")) {
  localStorage.setItem("token", "demo.sesion-abierta.sin-seguridad");
}

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { HashRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import {GoogleOAuthProvider} from "@react-oauth/google";

const GOOGLE_CLIENT_ID = "1022920288128-tmak14ctk73nkt4ksmp2t1o822tnvehj.apps.googleusercontent.com";


const root = createRoot(document.getElementById('root'))
root.render(
  
  <HashRouter>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
    </GoogleOAuthProvider>
  </HashRouter>
)