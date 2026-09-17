import { Navigate, useLocation } from "react-router-dom";

function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    return children;
  }

  let userRole = null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    userRole = payload.rol;
  } catch (error) {
    console.error("Token inválido");
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  // Solo redirigir si el usuario intenta acceder a páginas públicas
  if (location.pathname === "/login" || location.pathname === "/register") {
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

export default PublicRoute;
