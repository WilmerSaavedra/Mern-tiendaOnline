import axios from "./axios";

export const registerRequest = async (user) =>
  axios.post(`/user/register`, user);

export const loginRequest = async (user) => axios.post(`/user/login`, user);
export const sendEmailRequest = async (user) => axios.post(`/user/sendEmail`, user);
export const verifyTokenRequest = async () => axios.get(`/user/verify`);
