import { useEffect, useRef } from "react";
import { createContext, useContext, useState } from "react";
import {
  loginRequest,
  registerRequest,
  verifyTokenRequest,
  sendEmailRequest,
  getUserRequest,
  deleteUserRequest,
  getUserIdRequest,
  updateUserRequest,
  getUserSinClientesRequest,
} from "../api/auth";
import Cookies from "js-cookie";
import { usePedido } from "../context/pedidoContext";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within a AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [usuario, setUsuario] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const isMounted = useRef(true);
  // const { limpiarPedidos } = usePedido(); 

  // clear errors after 5 seconds

  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      if (res.status === 200) {
        setUser(res.data);
        setIsAuthenticated(true);
        setIsAdmin(res.data.isAdmin || false);
      }
      return res
    } catch (error) {
      console.log(error.response.data);
      setErrors([error.response.data.message]);
    }
  };
  const sendEmail = async (user) => {
    try {
      console.log(user);
      const res = await sendEmailRequest(user);
      if (res.status === 200) {
        // setUser(res.data);
        setErrors([...errors, res.data.message]);
      }
    } catch (error) {
      setErrors([...errors, error.response.data.message]);
    }
  };
  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      setUser(res.data);
      setIsAuthenticated(true);
      setIsAdmin(res.data.isAdmin || false);
    } catch (error) {
      setErrors([error.response.data.message]);
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    // limpiarPedidos()
  };
  const getUsers = async () => {
    const res = await getUserRequest();
    setUsuario(res.data);
  };
  const getUsersinClientes = async () => {
    const res = await getUserSinClientesRequest();
    setUsuario(res.data);
  };
  const updateUser = async (id, user) => {
    try {
      const res = await updateUserRequest(id, user);
      return res.data;
    } catch (error) {
      console.error(error);
      setErrors([error.response.data.message]);
    }
  };
  const deleteUser = async (id) => {
    try {
      const res = await deleteUserRequest(id);
      if (res.status === 204)
        setUsuario(marcas.filter((marca) => marca._id !== id));
    } catch (error) {
      console.log(error.response.data);
      setErrors(error.response.data.message);
    }
  };
  const getUserId = async (id) => {
    try {
      const res = await getUserIdRequest(id);
      // setUsuario(res.data);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const checkLogin = async () => {
      const cookies = Cookies.get();
      if (!cookies.token) {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const res = await verifyTokenRequest(cookies.token);
        console.log(res);
        if (!res.data) return setIsAuthenticated(false);
        setIsAuthenticated(true);
        setUser(res.data);
        setIsAdmin(res.data.isAdmin || false);
        setLoading(false);
      } catch (error) {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  useEffect(() => {
    let timer;
    if (errors.length > 0) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [errors]);
  return (
    <AuthContext.Provider
      value={{
        user,
        usuario,
        signup,
        signin,
        logout,
        getUsers,
        getUserId,
        deleteUser,
        updateUser,
        getUsersinClientes,
        isAuthenticated,
        errors,
        loading,
        isAdmin,
        sendEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
