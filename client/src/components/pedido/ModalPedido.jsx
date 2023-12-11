import React, { useState, useEffect, useRef } from "react";
import { Modals } from "../ui/Modals";
import { Input, Button, Textarea, Message, Select } from "../ui";
import { usePedido } from "../../context/pedidoContext";
import { useForm } from "react-hook-form";
// import { marcaSchema } from "../../schemas/marca";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { handleProductOperation } from "../../helper/utilProducto";

export function ModalPedido({ isOpen, closeModal, pedidoId }) {
  const {
    getPedido,
    createPedido,
    updatePedido,
    getPedidos,
    errors: pedidoErrors,
  } = usePedido();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors: formErrors },
    reset,
  } = useForm({
    // resolver: zodResolver(marcaSchema),
    shouldUnregister: false,
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const inputRef = useRef();
  const [modalTitle, setModalTitle] = useState("Crear Marca");

  useEffect(() => {
    if (pedidoId !== null) {
      reset();
    }
  }, [pedidoId, reset]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (pedidoId !== null) {
          setModalTitle("Editar Marca");
          const PedidoInfo = await getPedido(pedidoId);
          console.log("PedidoInfo>>>>>>", PedidoInfo);
          setValue("nombre", PedidoInfo.nombre);
        }else{
          setModalTitle("Crear Marca");
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (!pedidoId) {
      reset();
    }
    fetchData();
  }, [getPedido, pedidoId, setValue, watch]);
 
  const onSubmit = async (data) => {
    try {
      const ndata = watch();
      console.log("getValues", getValues());
      console.log("data", ndata);
      const updatedData = { ...ndata };

      if (pedidoId) {
        await handleProductOperation(
          updatePedido,
          pedidoId,
          updatedData,
          getPedido,
          closeModal,
          reset
        );
      } else {
        await handleProductOperation(
          createPedido,
          null,
          updatedData,
          getPedido,
          closeModal,
          reset
        );
      }
    } catch (error) {
      console.error(error);

      const errorMessage =
        error.response && error.response.status === 400
          ? "Hubo un problema con los datos proporcionados."
          : "Hubo un problema al guardar la marca";

      Swal.fire({
        icon: "error",
        title: error.response ? "Error de Validación" : "Error",
        text: errorMessage,
      });
    }
  };

  return (
    <Modals isOpen={isOpen} closeModal={closeModal} size="lg">
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          {/* <div className="col-md-12 mt-4">
            <h2>{modalTitle}</h2>
            <br></br>
            <Input
              type="text"
              name="nombre"
              label="Nombre"
              {...register("nombre")}
              autoFocus
            />
            {formErrors.nombre && (
              <Message message={formErrors.nombre.message} />
            )}
          </div> */}

          <Button className="col-md-12 mt-4">Guardar</Button>
        </form>
      </div>
    </Modals>
  );
}
