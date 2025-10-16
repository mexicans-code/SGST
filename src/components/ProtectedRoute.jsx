// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  let userRole = null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    userRole = payload.rol;
    
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;