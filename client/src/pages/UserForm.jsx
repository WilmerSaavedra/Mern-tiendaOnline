import React, { useState, useEffect, useRef } from "react";
// import { Modals } from "../ui/Modals";
import { Input, Button, Textarea, Message, Select } from "../components/ui";
import { useClientes } from "../context/clienteContext";
import { useAuth } from "../context/authContext";
import { useForm } from "react-hook-form";
// import { marcaSchema } from "../../schemas/marca";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { handleProductOperation } from "../helper/utilProducto";

export function UserForm() {
  const {
    getCliente,
    createCliente,
    updateCliente,
    getClienteId,
    getClienteIdUsuario,
    errors: clienteErrors,
  } = useClientes();
  const { getUsersinClientes, usuario, user } = useAuth();
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

  const [clienteId, setClienteId] = useState(null);
  const inputRef = useRef();
  const [modalTitle, setModalTitle] = useState("Crear Cliente");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user.id !== null) {
          setModalTitle("Editar Cliente");
          const clienteInfo = await getClienteIdUsuario(user.id );
          if (clienteInfo) {
            setValue("nombre", clienteInfo.nombre);
            setValue("apellido", clienteInfo.apellido);
            setValue("telefono", clienteInfo.telefono);
            setValue("dni", clienteInfo.dni);
            setValue("usuario", clienteInfo._id);
            setClienteId(clienteInfo._id);
          }
        } else {
          setModalTitle("Crear Cliente");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [user.id, setValue]);

  const onSubmit = async () => {
    try {
      const ndata = watch();
      console.log("getValues", getValues());
      // console.log("data>>>>>>>>>>>>>>>>>>", ndata);
      const updatedData = { ...ndata };
      updatedData.usuario = user.username;
      if (clienteId) {
        const update = await updateCliente(clienteId, updatedData);
        getClienteIdUsuario(user.id);
        if (update) {
          Swal.fire({
            icon: "success",
            title: "Cliente Actualizado",
            text: "El cliente ha sido actualizado correctamente.",
          });
        } 
      } else {
        const create = await createCliente(updatedData);
        console.log('createCliente>>>>>>>>>', create)
        setClienteId(create._id);
        getClienteIdUsuario(user.id);
        if (create) {
          Swal.fire({
            icon: "success",
            title: "Cliente Creado",
            text: "El cliente ha sido creado correctamente.",
          });
        } else {
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container w-75 mt-5">
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <div className="row">
          <div className="col-md-12 mt-4">
            <h2>{modalTitle}</h2>

            {clienteErrors && <Message message={clienteErrors} />}
            <br></br>
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
        </div>
        <Button className="col-md-12 mt-4">Guardar</Button>
      </form>
      <br></br>
      <br></br>
    </div>
  );
}
