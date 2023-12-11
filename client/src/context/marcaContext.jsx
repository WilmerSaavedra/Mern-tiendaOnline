import { createContext, useContext, useState } from "react";
import { useEffect } from "react";
import {
  createMarcaRequest,
  deleteMarcaRequest,
  getMarcaRequest,
  getMarcaIdRequest,
  updateMarcaRequest,
} from "../api/marca";

const MarcaContext = createContext();

export const useMarcas = () => {
  const context = useContext(MarcaContext);
  if (!context)
    throw new Error("useMarcas must be used within a MarcaProvider");
  return context;
};

export function MarcaProvider({ children }) {
  const [marcas, setMarcas] = useState([]);
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
  const getMarcas = async () => {
    const res = await getMarcaRequest();
    setMarcas(res.data);
  };

  const deleteMarca = async (id) => {
    try {
      const res = await deleteMarcaRequest(id);
      if (res.status === 204)
        setMarcas(marcas.filter((marca) => marca._id !== id));
    } catch (error) {
      console.log(error.response.data);
      setErrors(error.response.data.message);
    }
  };

  const createMarca = async (marca) => {
    try {
      console.log("createProduct------" + JSON.stringify(marca));
      const res = await createMarcaRequest(marca);
      setMarcas([...marcas, res.data]);
      console.log("------" + res.data); 
      return res.data;
    } catch (error) {
      
      console.log(error);
      setErrors([error.response.data.message]);
    }
  };

  const getMarcaId = async (id) => {
    try {
      const res = await getMarcaIdRequest(id);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const updateMarca = async (id, marca) => {
    try {
      const res=await updateMarcaRequest(id, marca);
      return res.data;
    } catch (error) {

      console.error(error);
      setErrors([error.response.data.message]);
    }
  };

  return (
    <MarcaContext.Provider
      value={{
        marcas,
        getMarcas,
        deleteMarca,
        createMarca,
        getMarcaId,
        updateMarca,
      }}
    >
      {children}
    </MarcaContext.Provider>
  );
}
