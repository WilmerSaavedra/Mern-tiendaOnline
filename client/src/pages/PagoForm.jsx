import {
  initMercadoPago,
  CardPayment,
  Payment,
  Wallet,
} from "@mercadopago/sdk-react";
import { useEffect, useRef, useState } from "react";
import { LineaTiempo } from "../components/LineaTiempo";
import { usePedido } from "../context/pedidoContext";
import { usePago } from "../context/pagoContext";
import { useMercadopago } from "react-sdk-mercadopago";

export const PagoForm = () => {
  const { getPedido } = usePedido();
  const [orderId, setOrderId] = useState("");
  const [pedidoData, setPedidoData] = useState(null);
  useEffect(() => {
    const storedOrderId = localStorage.getItem("OrdenId");
    if (storedOrderId) {
      setOrderId(storedOrderId);
     
      (async () => {
        try {
          const data = await getPedido(storedOrderId);
          if(data){
            setPedidoData(data); 
            console.log("pedidoData", pedidoData);
          }
        } catch (error) {
          console.error("Error al obtener detalles del pedido:", error);
        }
      })();
    }
  }, [getPedido]);

  return (
    <div className="container">
    <LineaTiempo />
    

    {pedidoData && ( 
      <div>
        <h2>Detalles del pedido:</h2>
        
        {pedidoData.pagoResultado && (
          <>
          <h1>Pago realizado con éxito</h1>
          {/* <p>Cliente: {pedidoData.cliente.nombre} {pedidoData.cliente.apellido}</p> */}
          <p>Estado del pedido: {pedidoData.pagoResultado.status}</p>
          </>
        )}
        <p>Fecha del pedido: {pedidoData.fechaPedido}</p>
      
      </div>
    )}
  </div>
);
};




