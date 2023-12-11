import axios from "./axios"
import { usePedido } from "../context/pedidoContext";
export const getPedidosRequest = async () => {
  try {
    const response = await axios.get('/pedido/listar');

    // Si la solicitud es exitosa, devuelve los datos
    console.log("response.data>>>>>>>>>>>",response.data)
    return response.data;
  } catch (error) {
    // Si hay un error, puedes manejarlo aquí
    console.error('Error al obtener pedidos:', error);
    throw error; // O puedes manejar el error de otra manera
  }
};

export const getPedidoRequest = async (id) => axios.get(`/pedido/obtener/${id}`);
export const getPedidoPagarRequest = async (id) => axios.get(`/pedido/pagar/${id}`);

export const getPedidoXUsuaioRequest = async (idUsuario) => axios.get(`/pedido/obtenerxUsuaio/${idUsuario}`);

export const createPedidoRequest = async (pedido) => axios.post("/pedido/crear", pedido);

export const updatePedidoRequest = async (id,pedido) =>
 {

  try {
    console.log("crudpedido>>>>>>>>>>")

  return  axios.put(`/pedido/crudpedido/${id}`, pedido);

  } catch (error) {
    console.log("error catch>>>>>>>>>>")
  
    
  }
 }
  
 export const updatePedidoEnvioRequest = async (id,pedido) =>
 {

  try {
    console.log("crudpedido>>>>>>>>>>")

  return  axios.put(`/pedido/pedidoEnvio/${id}`, pedido);

  } catch (error) {
    console.log("error catch>>>>>>>>>>")
  
    
  }
 }
  
export const deletePedidoRequest = async (id) => axios.delete(`/pedido/eliminar/${id}`);
