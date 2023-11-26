import { createContext, useContext, useState } from "react";
import { useEffect } from "react";
import {
  createProductRequest,
  deleteProductRequest,
  getProductSRequest,
  getProductRequest,
  updateProductRequest,
} from "../api/product";

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context)
    throw new Error("useProduct must be used within a ProductProvider");
  return context;
};

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [errors, setErrors] = useState([]);
  // clear errors after 5 seconds
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);
  const getProducts = async () => {
    const res = await getProductSRequest();
    setProducts(res.data);
  };

  const deleteProduct = async (id) => {
    try {
      const res = await deleteProductRequest(id);
      if (res.status === 204)
        setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.log(error.response.data);
      setErrors(error.response.data.message);
    }
  };

  const createProduct = async (product) => {
    try {
      console.log("createProduct------" + JSON.stringify(product));
      const res = await createProductRequest(product);
      setProducts([...products, res.data]);
      console.log("------" + res.data); 
      return res.data;
    } catch (error) {
      
      console.log(error);
      setErrors([error.response.data.message]);
    }
  };

  const getProduct = async (id) => {
    try {
      const res = await getProductRequest(id);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const updateProduct = async (id, product) => {
    try {
      const res=await updateProductRequest(id, product);
      return res.data;
    } catch (error) {

      console.error(error);
      setErrors([error.response.data.message]);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        getProducts,
        deleteProduct,
        createProduct,
        getProduct,
        updateProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
