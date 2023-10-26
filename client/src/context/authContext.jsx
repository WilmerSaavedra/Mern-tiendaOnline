import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import {
  loginRequest,
  registerRequest,
  verifyTokenRequest,
  sendEmailRequest,
} from "../api/auth";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within a AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  // clear errors after 5 seconds

  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      if (res.status === 200) {
        setUser(res.data);
        setIsAuthenticated(true);
      
      }
   
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
        setUser(res.data);
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
     
    } catch (error) {
      setErrors([error.response.data.message]);
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const checkLogin = async () => {
      const cookies = Cookies.get();
      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const res = await verifyTokenRequest(cookies.token);
        console.log(res);
        if (!res.data) return setIsAuthenticated(false);
        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        setIsAuthenticated(false);
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
        signup,
        signin,
        logout,
        isAuthenticated,
        errors,
        loading,
        sendEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
