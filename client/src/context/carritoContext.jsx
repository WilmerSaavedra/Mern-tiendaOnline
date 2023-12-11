import { useReducer } from "react";
import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { carritoReducer, initialState } from "../reducers/carritoReducer";

const CarritoContext = createContext();

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context)
    throw new Error("CarritoContext must be used within a CarritoProvider");
  return context;
};
// const initialState = [];
export const CarritoProvider = ({ children }) => {
  const [listaCarrito, dispatch] = useReducer(carritoReducer, initialState);
  useEffect(() => {
    const carritoEnSession = sessionStorage.getItem("listaCarrito");
    if (carritoEnSession) {
      const parsedCarrito = JSON.parse(carritoEnSession);
      dispatch({
        type: "[Carrito] actualizar Carrito",
        payload: parsedCarrito,
      });
    }
  }, []); // Solo se ejecuta una vez al inicio

  const agregarCompra = (compra) => {
    if (!compra.cantidad) {
      compra.cantidad = 1;
    }
    const action = {
      type: "[Carrito] agregar Compra",
      payload: compra,
    };
    dispatch(action);
  };
  const eliminarCompra = (id) => {
    const action = {
      type: "[Carrito] eliminar Compra",
      payload: id,
    };
    dispatch(action);
  };
  const aumentarCompra = (id) => {
    const action = {
      type: "[Carrito] aumentar Compra",
      payload: id,
    };
    dispatch(action);
  };
  const disminuirCompra = (id) => {
    const action = {
      type: "[Carrito] disminuir Compra",
      payload: id,
    };
    dispatch(action);
  };
  const actualizarCarrito = (nuevaListaCarrito) => {
    const action = {
      type: "[Carrito] actualizar Carrito",
      payload: nuevaListaCarrito,
    };
    dispatch(action);
  };
  const actualizarCantidad = (data) => {
    console.log("Actualizar cantidad:", data);
    const action = {
      type: "[Carrito] actualizar cantidad Compra",
      payload: data,
    };
    dispatch(action);
  };
  const limpiarCarrito = () => {
    const action = {
      type: "[Carrito] limpiar Carrito",
    };
    dispatch(action);
  };
  return (
    <CarritoContext.Provider
      value={{
        listaCarrito,
        agregarCompra,
        eliminarCompra,
        aumentarCompra,
        disminuirCompra,
        actualizarCantidad,
        actualizarCarrito,
        limpiarCarrito
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export default CarritoContext;
