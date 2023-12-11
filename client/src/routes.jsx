// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "./context/authContext";

// export const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated, user, loading } = useAuth();

//   if (loading) return <h1>Loading...</h1>;

//   if (!isAuthenticated && !loading) {
//     // Si no está autenticado, redirige a la página de inicio de sesión
//     return <Navigate to="/login" replace />;
//   }

//   // Verifica si el componente hijo es una ruta y tiene una propiedad path
//   if (
//     !children ||
//     !children.props ||
//     !children.props.path ||
//     typeof children.props.path !== "string"
//   ) {
//     // Si no es una ruta o no tiene una propiedad path válida, redirige a la página principal
//     return <Navigate to="/" replace />;
//   }

//   // Verifica si el usuario tiene el rol adecuado para acceder a la ruta
//   const isAdminRoute = children.props.path.includes("/admin");
//   if (isAdminRoute && (!user || !user.isAdmin)) {
//     // Redirige a la página principal del usuario si intenta acceder a una ruta de administrador
//     return <Navigate to="/" replace />;
//   }

//   // Verifica si el usuario tiene el rol adecuado para acceder a la ruta de usuario
//   const isUserRoute = children.props.path.includes("/user");
//   if (isUserRoute && (!user || user.isAdmin)) {
//     // Redirige a la página principal del administrador si intenta acceder a una ruta de usuario
//     return <Navigate to="/admin" replace />;
//   }

//   // Si todo está bien, renderiza las rutas protegidas
//   return <Outlet />;
// };


import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/authContext";

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <h1>Loading...</h1>;
  if (!isAuthenticated && !loading) return <Navigate to="/login" replace />;
  return <Outlet />;
};
