import React ,{ createContext, useContext ,useState,useEffect} from "react";
import {
  getPedidosRequest,
  getPedidoRequest,
  getPedidoXUsuaioRequest,
  createPedidoRequest,
  updatePedidoRequest,
  deletePedidoRequest,
} from "../api/pedido";

const PedidoContext = createContext();
export const usePedido = () => {
  const context = useContext(PedidoContext);
  if (!context)
    throw new Error("usePedido debe ser utilizado dentro de un PedidoProvide");
  return context;
};
export function PedidoProvider({children}) {
  const [pedidos, setPedido] = useState([]);
  const [errors, setErrors] = useState([]);
  const [datosClienteValidos, setDatosClienteValidos] = useState(false);

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const getPedidos = async () => {
    const res = await getPedidosRequest;
    setPedido(res.data);
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
      setPedido([...pedidos, res.data]);
      setDatosClienteValidos(true);
      console.log("------" + res.data);
      return res.data;
    } catch (error) {
      console.log(error);
      setDatosClienteValidos(false)
    }
  };

  const getPedido = async (id) => {
    try {
      const res = await getPedidoRequest(id);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };
  const getPedidoxUsuario = async (id, idUser) => {
    try {
      const res = await getPedidoXUsuaioRequest(id, idUser);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const updatePedido = async (id, pedido) => {
    try {
      await updatePedidoRequest(id, pedido);
    } catch (error) {
      console.error(error);
    }
  };
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
        datosClienteValidos,
        setDatosClienteValidos
      }}
     > {children}
    </PedidoContext.Provider>
  );
}
export default PedidoContext;