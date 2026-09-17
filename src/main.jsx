import { createRoot } from 'react-dom/client'
import React from 'react'
import App from './App.jsx'
import './index.css'
import { installMock } from './mock/server'

installMock()

const demoB64 = (obj) =>
  btoa(unescape(encodeURIComponent(JSON.stringify(obj))))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const demoUser = {
  id_usuario: 2,
  nombre: "Carmen",
  apellido_p: "Hernández",
  apellido_m: "Ríos",
  email: "anfitrion@sierragorda.mx",
  telefono: "4418765432",
  rol: "anfitrion",
  foto: "",
  direccion: "Carretera a Concá Km 3, Arroyo Seco"
};

const existingToken = localStorage.getItem("token");
const hasRealSession = existingToken && !existingToken.startsWith("demo.");

if (!hasRealSession) {
  localStorage.setItem("usuario", JSON.stringify(demoUser));
  localStorage.setItem("rol", demoUser.rol);
  localStorage.setItem(
    "token",
    `demo.${demoB64({
      id_usuario: demoUser.id_usuario,
      nombre: demoUser.nombre,
      email: demoUser.email,
      rol: demoUser.rol,
      iat: Date.now()
    })}.demo`
  );
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