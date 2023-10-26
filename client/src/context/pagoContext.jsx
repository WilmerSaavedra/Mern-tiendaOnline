import React ,{ createContext, useContext ,useState,useEffect} from "react";
import {
    createPagoRequest,
} from "../api/pago";

const PagoContext = createContext();
export const usePago = () => {
  const context = useContext(PagoContext);
  if (!context)
    throw new Error("usePago debe ser utilizado dentro de un PagoProvide");
  return context;
};
export function PagoProvider({children}) {
  const [pagos, setPago] = useState([]);
  const [errors, setErrors] = useState([]);
  
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);
  
  const createPago = async (pago) => {
    try {
      console.log("error");
      const res = await createPagoRequest(pago);
      setPago([...pagos, res.data]);
      console.log("------" + res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <PagoContext.Provider
      value={{
        pagos,
        createPago,
        errors,
      }}
     > {children}
    </PagoContext.Provider>
  );
}
export default PagoContext;