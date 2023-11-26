import axios from "./axios"

export const getPedidosRequest=()=>{
    return axios.get("/pedido/listar")
}
export const getPedidoRequest = async (id) => axios.get(`/pedido/obtener/${id}`);

export const getPedidoXUsuaioRequest = async (idUsuario) => axios.get(`/pedido/ListarxUsuario/${idUsuario}`);

export const createPedidoRequest = async (pedido) => axios.post("/pedido/crear", pedido);

export const updatePedidoRequest = async (id,pedido) =>
  axios.put(`/pedido/editar/${id}`, pedido);

export const deletePedidoRequest = async (id) => axios.delete(`/pedido/delete/${id}`);
