import axios from "./axios";

export const getClienteRequest = async () => axios.get("/cliente/listar");

export const createClienteRequest = async (task) => axios.post("/cliente/crear", task);

export const updateClienteRequest = async (id,task) =>
  axios.put(`cliente/editar/${id}`, task);

export const deleteClienteRequest = async (id) => axios.delete(`/cliente/eliminar/${id}`);

export const getClienteIdRequest = async (id) => axios.get(`/cliente/obtener/${id}`);
export const getClienteIdUsuarioRequest = async (id) => axios.get(`/cliente/obtenerXUsuario/${id}`);
export const getClienteBuscarRequest = async (parametro) => axios.get(`/cliente/buscar/${parametro}`);
