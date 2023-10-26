import axios from "./axios";

export const getProductSRequest = async () =>{
 return axios.get("/product/listar");
} 

export const createProductRequest = async (product) =>{
  console.log("Product.js",product)

  const form=new FormData()
  for (let key in product) {
    if (key === "image") {
      form.append("image", product.image); 
    } else {
      form.append(key, product[key]);
    }
  }
 return axios.post("/product", form,{
    headers:{
      "Content-Type":"multipart/form-data"
    }
  });
} 

export const updateProductRequest = async (id,product) =>
  axios.put(`/product/${id}`, product);

export const deleteProductRequest = async (id) => axios.delete(`/product/${id}`);

export const getProductRequest = async (id) => axios.get(`/product/${id}`);

