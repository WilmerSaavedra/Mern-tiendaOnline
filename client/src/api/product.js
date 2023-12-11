import axios from "./axios";

export const getProductSRequest = async () =>{
 return axios.get("/product/listar");
} 

export const createProductRequest = async (product) => {
  const form = new FormData();

  // Agrega propiedades al FormData excepto imágenes
  for (let key in product) {
    if (key !== "imagenPrincipal" ) {
      form.append(key, product[key]);
    }
  }
  // Agrega imagen principal al FormData
  if (product.imagenPrincipal) {
    form.append("imagenPrincipal", product.imagenPrincipal[0]);
  }

  return axios.post("/product/crear", form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateProductRequest = async (id, product) => {
  const form = new FormData();

  for (let key in product) {
    if (key !== "imagenPrincipal") {
      form.append(key, product[key]);
    }
  }

  if (product.imagenPrincipal instanceof File) {
    form.append("imagenPrincipal", product.imagenPrincipal);
  }

  return axios.put(`/product/editar/${id}`, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


export const deleteProductRequest = async (id) => axios.delete(`/product/eliminar/${id}`);

export const getProductRequest = async (id) => axios.get(`/product/obtener/${id}`);

export const getProductBuscarRequest = async (parametro) => axios.get(`/product/buscar/${parametro}`);
