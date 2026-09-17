import { createRoot } from 'react-dom/client'
import React from 'react'
import App from './App.jsx'
import './index.css'
import { installMock } from './mock/server'

installMock()

const segs = window.location.pathname.split('/').filter(Boolean);
const basename = segs.length ? '/' + segs[0] : '/';

const redirectPath = sessionStorage.getItem(':sgstRedirect');
if (redirectPath) {
  sessionStorage.removeItem(':sgstRedirect');
  window.history.replaceState({}, '', redirectPath);
}

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import {GoogleOAuthProvider} from "@react-oauth/google";

const GOOGLE_CLIENT_ID = "1022920288128-tmak14ctk73nkt4ksmp2t1o822tnvehj.apps.googleusercontent.com";


const root = createRoot(document.getElementById('root'))
root.render(
  
  <BrowserRouter basename={basename}>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
    </GoogleOAuthProvider>
  </BrowserRouter>
)