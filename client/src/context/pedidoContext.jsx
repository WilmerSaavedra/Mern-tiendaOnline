import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getPedidosRequest,
  getPedidoRequest,
  getPedidoXUsuaioRequest,
  createPedidoRequest,
  updatePedidoRequest,
  deletePedidoRequest,
  getPedidoPagarRequest,
  updatePedidoEnvioRequest,
} from "../api/pedido";

const PedidoContext = createContext();
export const usePedido = () => {
  const context = useContext(PedidoContext);
  if (!context)
    throw new Error("usePedido debe ser utilizado dentro de un PedidoProvide");
  return context;
};
export function PedidoProvider({ children }) {
  const [pedidos, setPedido] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [datosClienteValidos, setDatosClienteValidos] = useState(false);

  const getPedidos = async () => {
    const res = await getPedidosRequest();
    setPedido(res);
    console.log("getPedidos>>>>", res);
    return res;
  };
  const limpiarPedidos = () => {
    setPedido([]); // Limpiar el estado de pedidos
  };
  const deletePedido = async (id) => {
    try {
      const res = await deletePedidoRequest(id);
      if (res.status === 204)
        setPedido(pedidos.filter((pedidos) => pedidos._id !== id));
    } catch (error) {
      console.log(error.response.data);
      setErrors(error.response.data.message);
    }
  };

  const createPedido = async (pedido) => {
    try {
      const res = await createPedidoRequest(pedido);
      console.log("------" + res.data);

      setPedido([...pedidos, res.data]);
      setDatosClienteValidos(true);
      console.log("------" + res.data);
      return res.data;
    } catch (error) {
      console.log(error);
  
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.message;
        setErrors([errorMessage]);
  
        console.log("errorMessage",errorMessage);
      } else {
        setDatosClienteValidos(false);
        setErrors(["Error al procesar la solicitud"]); 
      }
    }
  };
  

  const getPedido = async (id) => {
    try {
      const res = await getPedidoRequest(id);
      console.log("getPedido", res);
      setPedido(res.data);
      return res.data;
    } catch (error) {
      console.error(error);
      setErrors(error.response.data.message);
    }
  };
  const getPedidoPagar = async (id) => {
    try {
      const res = await getPedidoPagarRequest(id);
      console.log("getPedidoPagar", res);
      setPedido(res.data);
      return res.data;
    } catch (error) {
      console.error(error);
      setErrors(error.response.data.message);
    }
  };
  const getPedidoxUsuario = async (id) => {
    try {
      const res = await getPedidoXUsuaioRequest(id);
      console.log("getPedidoXUsuaioRequest",res)
      setPedido(res.data);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const updatePedido = async (id, pedido) => {
    try {
      console.log("updatePedido>>>>>>>>>>>>><");

      const res = await updatePedidoRequest(id, pedido);
      console.log("res>>>>>>>>>>>>><", res);
      if (res.status !== 200) {
        setErrors([res.data.message]);
        console.log("res.status>>>>>>>>>>>>><", res);
      }
      return res.data;
    } catch (error) {
      // console.error("Caught an error:", error.response);
      setErrors([error?.response.data.message]);
      console.log("Errors>>>>>>>>>>>>><:", error);

      console.log("Errors inside updatePedido:", errors);
    }
  };
  const updatePedidoEnvio = async (id, pedido) => {
    try {
      console.log("updatePedido>>>>>>>>>>>>><");

      const res = await updatePedidoEnvioRequest(id, pedido);
      console.log("res>>>>>>>>>>>>><", res);
      if (res.status !== 200) {
        setErrors([res.data.message]);
        console.log("res.status>>>>>>>>>>>>><", res);
      }
      return res.data;
    } catch (error) {
      // console.error("Caught an error:", error.response);
      setErrors([error?.response.data.message]);
      console.log("Errors>>>>>>>>>>>>><:", error);

      console.log("Errors inside updatePedido:", errors);
    }
  };
  // ...

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
    <PedidoContext.Provider
      value={{
        pedidos,
        getPedido,
        getPedidos,
        getPedidoxUsuario,
        createPedido,
        updatePedido,
        deletePedido,
        errors,
        setErrors,
        datosClienteValidos,
        setDatosClienteValidos,
        limpiarPedidos,
        getPedidoPagar,
        updatePedidoEnvio,
      }}
    >
      {children}
    </PedidoContext.Provider>
  );
}
export default PedidoContext;
