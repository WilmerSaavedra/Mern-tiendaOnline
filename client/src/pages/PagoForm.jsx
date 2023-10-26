import { initMercadoPago, CardPayment, Payment,Wallet  } from "@mercadopago/sdk-react";
import { useEffect,useRef } from "react";
import { LineaTiempo } from "../components/LineaTiempo";
import { usePedido } from "../context/pedidoContext";
import { usePago } from "../context/pagoContext";
import { useMercadopago } from "react-sdk-mercadopago";
export const PagoForm = () => {
  const { createPago } = usePago();
  const walletRef = useRef(null);
 
  const preferenceId = localStorage.getItem("preferenceId");
  console.log("preferenceId", preferenceId);
  if (!preferenceId) {
    // Maneja el caso en el que preferenceId no esté definido
    console.log("No se encontró el ID de preferencia de Mercado Pago");
    return null; // o cualquier otro manejo de error que necesites
  }
  useEffect(() => {
     initMercadoPago("TEST-337ea3bf-0a3c-4745-bcc1-bb4a24f8c6c4");
    const preferenceId = localStorage.getItem("preferenceId");

    if (preferenceId) {
      // Espera a que el componente Wallet se monte y luego haz clic en él
      const interval = setInterval(() => {
        if (walletRef.current) {
          walletRef.current.click();
          clearInterval(interval);
        }
      }, 100);
    }
  }, []);
  

  const initialization = {
    preferenceId: preferenceId,
  };
  const customization = {
    visual: {
      // hidePaymentButton: true,
      style: {
        theme: "default",
      },
    },
    paymentMethods: {
      creditCard: "all",
      debitCard: "all",
      ticket: "all",
      bankTransfer: "all",
      atm: "all",
      onboarding_credits: "all",
      wallet_purchase: "all",
      maxInstallments: 1,
      "excluded_payment_types": [
        {
            "id": "ticket"
        }],
    },
  };
  const onSubmit = async (
    { selectedPaymentMethod, formData }
   ) => {
    // callback llamado al hacer clic en el botón enviar datos
    return new Promise((resolve, reject) => {
      fetch("/process_payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((response) => {
          // recibir el resultado del pago
          resolve();
        })
        .catch((error) => {
          // manejar la respuesta de error al intentar crear el pago
          reject();
        });
    });
   };
   const onError = async (error) => {
    // callback llamado para todos los casos de error de Brick
    console.log(error);
   };
  return (
    <div className="container">
      <LineaTiempo />
      <Wallet initialization={{preferenceId: preferenceId,redirectMode: "modal"}}
        ref={walletRef}/>
      {/* <Payment initialization={initialization} customization={customization} /> */}
     
    </div>
  );
};
