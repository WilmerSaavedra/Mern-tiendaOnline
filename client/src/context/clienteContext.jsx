import { createContext, useContext, useState } from "react";
import { useEffect } from "react";
import {
  createClienteRequest,
  deleteClienteRequest,
  getClienteRequest,
  getClienteIdRequest,
  updateClienteRequest,
  getClienteBuscarRequest,
  getClienteIdUsuarioRequest
} from "../api/cliente";

const ClienteContext = createContext();

export const useClientes = () => {
  const context = useContext(ClienteContext);
  if (!context)
    throw new Error("useClientes must be used within a ClienteProvider");
  return context;
};

export function ClienteProvider({ children }) {
  const [clientes, setClientes] = useState([]);
  const [errors, setErrors] = useState([]);
  // clear errors after 5 seconds
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);
  const getClientes = async () => {
    const res = await getClienteRequest();
  console.log('getClientes>>>><<<', res)
    setClientes(res.data);
    return res.data
  };

  const deleteCliente = async (id) => {
    try {
      const res = await deleteClienteRequest(id);
      if (res.status === 204)
        setClientes(clientes.filter((cliente) => cliente._id !== id));
    } catch (error) {
      console.log(error.response.data);
      setErrors(error.response.data.message);
    }
  };

  const createCliente = async (cliente) => {
    try {
      console.log("createProduct------" + JSON.stringify(cliente));
      const res = await createClienteRequest(cliente);
      return res.data;
    } catch (error) {
      console.log(error);
      setErrors([error.response.data.message]);
    }
  };

  const getClienteBuscar = async (parametro) => {
    try {
      const res = await getClienteBuscarRequest(parametro);
      console.log("getClienteBuscar conetxt",res.data)
      console.log("getClienteBuscar conetxt",res)

      setClientes(res.data);

      return res.data;
    } catch (error) {
      console.error(error);
    }
  };
  const getClienteId = async (id) => {
    try {
      const res = await getClienteIdRequest(id);
      // setClientes(res.data);

      return res.data;
    } catch (error) {
      console.error(error);
    }
  };
  const getClienteIdUsuario = async (id) => {
    try {
      const res = await getClienteIdUsuarioRequest(id);
      console.log("getClienteIdUsuarioRequest",res)
      setClientes(res.data);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };
  
  const updateCliente = async (id, cliente) => {
    try {
      const res = await updateClienteRequest(id, cliente);
      if (res.status === 400 || res.status === 404) {
        console.log("Error 404 o 400:", res.response.data.message);
        setErrors([res.response.data.message]);
      }
      return res.data;

    } catch (error) {
      if (error.response && (error.response.status === 500 || error.response.status === 400 )) {
        console.log("Error 500:", error.response.data.message);
        setErrors([error.response.data.message]);
      } else {
        console.error("Error desconocido:", error);
        setErrors(["Error desconocido"]);
      }
    }
  };

  return (
    <ClienteContext.Provider
      value={{
        clientes,
        getClientes,
        deleteCliente,
        createCliente,
        getClienteId,
        updateCliente,
        getClienteBuscar,
        getClienteIdUsuario,
        errors
      }}
    >
      {children}
    </ClienteContext.Provider>
  );
}
