import axios from "./axios";

export const getMarcaRequest = async () => axios.get("/marca/listar");

export const createMarcaRequest = async (task) => axios.post("/marca/crear", task);

export const updateMarcaRequest = async (id,task) =>
  axios.put(`marca/editar/${id}`, task);

export const deleteMarcaRequest = async (id) => axios.delete(`/marca/eliminar/${id}`);

export const getMarcaIdRequest = async (id) => axios.get(`/marca/obtener/${id}`);
