import axios from "./axios"

export const createPagoRequest = async (pago) => axios.post("/pago/crear", pago);
