import axios from "./axios";

export const registerRequest = async (user) =>
  axios.post(`/user/register`, user);
export const getUserRequest = async () => axios.get("/user/listar");
export const getUserSinClientesRequest = async () => axios.get("/user/listarUserSinClientes");
export const deleteUserRequest = async (id) =>
  axios.delete(`/user/eliminar/${id}`);

export const getUserIdRequest = async (id) => axios.get(`/user/obtener/${id}`);
export const loginRequest = async (user) => axios.post(`/user/login`, user);
export const sendEmailRequest = async (user) =>
  axios.post(`/user/sendEmail`, user);
export const verifyTokenRequest = async () => axios.get(`/user/verify`);
export const updateUserRequest = async (id, user) =>
  axios.put(`user/editar/${id}`, user);
