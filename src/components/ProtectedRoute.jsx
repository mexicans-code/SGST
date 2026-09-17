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

  if (!allowedRoles.includes(userRole)) {
    switch (userRole) {
      case "admin":
        return <Navigate to="/dashboard" replace />;

      case "anfitrion":
        return <Navigate to="/host/publications" replace />;

      case "usuario":
        return <Navigate to="/" replace />;

      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;