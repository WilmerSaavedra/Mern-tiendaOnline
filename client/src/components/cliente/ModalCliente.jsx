import React, { useState, useEffect, useRef } from "react";
import { Modals } from "../ui/Modals";
import { Input, Button, Textarea, Message, Select } from "../ui";
import { useClientes } from "../../context/clienteContext";
import { useAuth } from "../../context/authContext";
import { useForm } from "react-hook-form";
// import { marcaSchema } from "../../schemas/marca";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { handleProductOperation } from "../../helper/utilProducto";

export function ModalCliente({ isOpen, closeModal, clienteId }) {
  const {
    getCliente,
    createCliente,
    updateCliente,
    getClienteId,
    errors: clienteErrors,
  } = useClientes();
  const { getUsersinClientes, usuario } = useAuth();

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

  const [modalTitle, setModalTitle] = useState("Crear Cliente");
  useEffect(() => {
    if (clienteId !== null) {
      reset();
    }
    getUsersinClientes();
  }, [clienteId,reset]);
 
  useEffect(() => {
    const fetchData =  async() => {
      try {
        if (clienteId !== null) {
          setModalTitle("Editar Cliente");
          const clienteInfo = await getClienteId(clienteId);
          // setClienteInfo(clienteInformacion);
          console.log("clienteInfo>>>>>>>>>>>>>>><<",clienteInfo)
          // console.log("usaurio>>>>>>>>>>>>>>><<",usuario)

          // console.log("clienclienteInfo.usuario.usernameeInfo>>>>>>>>>>>>>>><<",clienteInfo.usuario.username)
          setValue("nombre", clienteInfo.nombre);
          setValue("apellido", clienteInfo.apellido);
          setValue("telefono", clienteInfo.telefono);
          setValue("dni", clienteInfo.dni);
          setValue("usuario", clienteInfo.usuario.username); 
        } else {
          setModalTitle("Crear Cliente");
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (!clienteId) {
      reset();
    }
    fetchData();
  }, [ getClienteId,clienteId, setValue,watch]);

  const onSubmit = async (data) => {
    try {
      const ndata = watch();
      console.log("getValues", getValues());
      console.log("data", ndata);
      const updatedData = { ...ndata };

      if (clienteId) {
        await handleProductOperation(
          updateCliente,
          clienteId,
          updatedData,
          getClienteId,
          closeModal,
          reset
        );
      } else {
        await handleProductOperation(
          createCliente,
          null,
          updatedData,
          getClienteId,
          () => {
            closeModal(); // Cerrar el modal
            getUsersinClientes(); // Actualizar la lista de usuarios
            reset(); // Restablecer el formulario
          }
        );
      }
    } catch (error) {
      console.error(error);

      const errorMessage =
        error.response && error.response.status === 400
          ? "Hubo un problema con los datos proporcionados."
          : "Hubo un problema al guardar  cliente";

      Swal.fire({
        icon: "error",
        title: error.response ? "Error de Validación" : "Error",
        text: errorMessage,
      });
    }
  };

  return (
    <Modals isOpen={isOpen} closeModal={closeModal} size="md">
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        {clienteErrors && <Message message={clienteErrors} />}
          <div className="row">
            <div className="col-md-12 mt-4">
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
            </div>
            <div className="col-md-12 mt-4">
              <Input
                type="text"
                name="apellido"
                label="apellido"
                {...register("apellido")}
              />
              {formErrors.apellido && (
                <Message message={formErrors.apellido.message} />
              )}
            </div>
            <div className="col-md-6 mt-4">
              <Input
                type="text"
                name="telefono"
                label="telefono"
                {...register("telefono")}
              />
              {formErrors.telefono && (
                <Message message={formErrors.telefono.message} />
              )}
            </div>
            <div className="col-md-6 mt-4">
              <Input type="text" name="dni" label="dni" {...register("dni")} />
              {formErrors.dni && <Message message={formErrors.dni.message} />}
            </div>
            <div className="col-md-12 mt-4">
              <label htmlFor="usuario">Usuario</label>
              <Select
                className="form-control"
                id="usuario"
                name="usuario"
            
                {...register("usuario")}
               
              >
                <option value="">Seleccione Usuario</option>
                {usuario.map((user) => (
                  <option key={user._id} value={user.username}>
                    {user.username}
                  </option>
                ))}
              </Select>
              {formErrors.usuario && (
                <Message message={formErrors.usuario.message} />
              )}
            </div>
          </div>
          <Button className="col-md-12 mt-4">Guardar</Button>
        </form>
      </div>
    </Modals>
  );
}
