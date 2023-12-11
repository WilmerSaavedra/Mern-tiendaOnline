import React, { useEffect, useState } from "react";
import { useProducts } from "../context/productContext";
import { ModalProductoPedido } from "../components/products/ModalProductoPedido";
import { ModalClientePedido } from "../components/cliente/ModalClientePedido";
import { useNavigate, useParams } from "react-router-dom";
import { FaMinus, FaPlus, FaTrashAlt } from "react-icons/fa";
import { Input, Button, Textarea, Message, Select } from "../components/ui";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  calcularTotal,
  calcularSubTotal,
  calcularDescuento,
  updateSessionStorage,
} from "../reducers/utilCarritoReducer";
import {
  handleInputNumerico,
  handleInputLetras,
  generateLocalidadOptions,
  addFechaDelivery,
} from "../helper/utilPedido";
import { useCarrito } from "../context/carritoContext";
import { pedidoSchema } from "../schemas/pedido";
import { useAuth } from "../context/authContext";
import { usePedido } from "../context/pedidoContext";
export function OrdenPages() {
  const { pedidoId } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClienteModalOpen, setIsClienteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [DireccionEnvio, setDireccionEnvio] = useState(null);
  const [pedidoEnEdicion, setPedidoEnEdicion] = useState(null);
  const [idPedido, setIdPedido] = useState(pedidoId);
  const [localidad, setLocalidad] = useState("");
  const [direccion, setDireccion] = useState("");
  const [referencia, setReferencia] = useState("");
  let [errorMessage, setErrorMessage] = useState("");

  const [preferenceId, setPreferenceId] = useState();

  const isEditingPedido = Boolean(idPedido);
  const {
    createPedido,
    updatePedido,
    getPedido,
    pedidos,
    getPedidoxUsuario,
    errors: pedidoErrors,
    getPedidoPagar,
  } = usePedido();
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    // resolver: zodResolver(pedidoSchema),
    shouldUnregister: true,
  });
  const { products, getProducts } = useProducts();

  console.log("pedidos>><", pedidos);

  const {
    listaCarrito,
    eliminarCompra,
    actualizarCantidad,
    actualizarCarrito,
    limpiarCarrito,
  } = useCarrito();
  const { user } = useAuth();
  const isAdmin = user?.isAdmin || false;

  useEffect(() => {
    if (idPedido) {
      const fetchData = async () => {
        try {
          const pedidoData = await getPedido(pedidoId);
          if (pedidoData) {
            // Extraer la información del pedido para actualizar el carrito
            const nuevoCarrito = pedidoData.ordenItems.map((item) => ({
              ...item.producto,
              cantidad: item.cantidad,
            }));
            // Actualizar el carrito en el contexto
            actualizarCarrito(nuevoCarrito);
            // Configurar los valores iniciales en el formulario
            if (pedidoData.cliente) {
              setSelectedCliente(pedidoData.cliente);
              setValue("nombre", pedidoData.cliente.nombre);
              setValue("apellido", pedidoData.cliente.apellido);
              setValue("telefono", pedidoData.cliente.telefono);
              setValue("dni", pedidoData.cliente.dni);
            }
            if (pedidoData.DireccionEnvio) {
              setDireccionEnvio(pedidoData.DireccionEnvio);
              setLocalidad(pedidoData.DireccionEnvio.localidad || "");
              setDireccion(pedidoData.DireccionEnvio.direccion || "");
              setReferencia(pedidoData.DireccionEnvio.referencia || "");
              setValue("localidad", pedidoData.DireccionEnvio.localidad || "");
              setValue("direccion", pedidoData.DireccionEnvio.direccion || "");
              setValue(
                "referencia",
                pedidoData.DireccionEnvio.referencia || ""
              );
            }
          }
        } catch (error) {
          console.error("Error fetching pedido:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    } else {
      limpiarCarrito();
    }
  }, [idPedido]);

  useEffect(() => {
    getProducts();
  }, [selectedCliente]);
  const subtotal = calcularSubTotal(listaCarrito);
  const descuento = calcularDescuento(listaCarrito);
  const total = calcularTotal(listaCarrito, 10);
  // console.log("listaCarrito", listaCarrito);
  const closeModal = () => {
    console.log("cerrando modal");
    setIsModalOpen(false);
    setIsClienteModalOpen(false);
    // reset()
  };
  const toggleModal = (productId) => {
    if (productId === null) {
    } else {
    }

    setIsModalOpen(!isModalOpen);
  };
  const toggleClienteModal = () => {
    setIsClienteModalOpen(!isClienteModalOpen);
  };
  const handleQuitar = (id) => {
    console.log("Eliminando producto con ID:", id);
    eliminarCompra(id);
    const nuevoCarrito = listaCarrito.filter((producto) => producto._id !== id);
    actualizarCarrito(nuevoCarrito);
  };
  const handleAumentarCompra = (id) => {
    const producto = listaCarrito.find((item) => item._id === id);
    if (producto) {
      actualizarCantidad({ id, nuevaCantidad: producto.cantidad + 1 });
    }
    const nuevoCarrito = listaCarrito.map((producto) => {
      if (producto._id === id) {
        return { ...producto, cantidad: producto.cantidad + 1 };
      }
      return producto;
    });
    actualizarCarrito(nuevoCarrito);
  };

  const handleDisminuirCompra = (id) => {
    console.log("id>>>>>>", id);
    const producto = listaCarrito.find((item) => item._id === id);
    if (producto && producto.cantidad > 1) {
      actualizarCantidad({ id, nuevaCantidad: producto.cantidad - 1 });
    }
    const nuevoCarrito = listaCarrito.map((producto) => {
      if (producto._id === id && producto.cantidad > 1) {
        return { ...producto, cantidad: producto.cantidad - 1 };
      }
      return producto;
    });
    actualizarCarrito(nuevoCarrito);
  };
  const handleClienteSeleccionado = (cliente) => {
    setSelectedCliente(cliente);
    setValue("nombre", cliente.nombre);
    setValue("apellido", cliente.apellido);
    setValue("telefono", cliente.telefono);
    setValue("dni", cliente.dni);
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const inputName = e.target.name;

    if (inputName === "localidad") {
      setLocalidad(inputValue);
    } else if (inputName === "direccion") {
      setDireccion(inputValue);
    } else if (inputName === "referencia") {
      setReferencia(inputValue);
    }
  };

  const onSubmit = async () => {
    console.log("onSubmit");
    const data = getValues();
    console.log("data ", data);

    try {
      setIsLoading(true);
      const pedidoData = {
        failureUrl: `pedidos`,
        usuario: {
          _id: selectedCliente._id,
          isAdmin: user.isAdmin,
        },
        ordenItems: listaCarrito.map((item) => ({
          producto: item._id,
          cantidad: item.cantidad,
        })),
        DireccionEnvio: {
          direccion: data.direccion,
          referencia: data.referencia,
          localidad: data.localidad,
        },
        metodoPago: "",
        precioTotal: parseInt(total),
        estadoPedido: "pendiente",
        fechaPedido: new Date(),
        delivery: true,
        fechaDelivery: addFechaDelivery(new Date(), 4),
      };
      console.log("pedidoData :>> ", pedidoData);
      console.log("idPedido insubmit:>> ", idPedido);
      let respuesta = {};
      if (!idPedido) {
        console.log("creando:>> ");

        respuesta = await createPedido(pedidoData);
      } else {
        console.log("editando:>>>>>>>>>>> ");
        console.log("pedidoData idPedido:>>>>>>>>>>> ", idPedido);
        console.log("pedidoData pedidoData:>>>>>>>>>>> ", pedidoData);

        respuesta = await updatePedido(idPedido, pedidoData);
        console.log("respuesta updatePedido:>>>>>>>>>>> ", respuesta);
      }
      console.log("respuesta>>>>><", respuesta);
      if (!user.isAdmin) {
        if (respuesta.result.id) {
          const preferenceId = respuesta.result.id;
          setPreferenceId(preferenceId);

          const storedOrdenId = respuesta.result.external_reference;
          window.location.replace(respuesta.result.init_point);

          localStorage.setItem("OrdenId", storedOrdenId);
        } else {
          console.error("Error al iniciar el proceso de pago.");
        }
      }
      if (respuesta) {
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: `Pedido creado exitosamente`,
        });
      }
      console.log("respuesta createPedido  :>> ", respuesta);
    } catch (error) {
      errorMessage = pedidoErrors || "Ocurrió un error al crear el pedido.";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="shopping-cart section">
        <div className="container ">
          {/* <br></br> */}
          <h2>{isEditingPedido ? "Editar Pedido" : "Crear Pedido"}</h2>

          <div className="row">
            <div className="col-md-8  text-start">
              <div className="col-md-12 d-flex justify-content-between my-4">
                <label className=" px-3">Seleccionar Productos</label>
                <button
                  onClick={() => toggleModal()}
                  className="btn btn-success btn-lg px-3 mx-3"
                >
                  Agregar
                </button>
              </div>
              <div className="col-md-12 ">
                <div className="col-12">
                  <table className="table shopping-summery">
                    <thead>
                      <tr className="main-hading">
                        <th>Producto</th>
                        <th className="text-center">Cantidad</th>

                        <th className="text-center">Precio</th>
                        <th className="text-center">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listaCarrito.length > 0 ? (
                        listaCarrito.map((item) => (
                          <tr key={item._id}>
                            {/* <td className="image" data-title="No">
                              <img src={item.image.principal.url} alt="#" />
                            </td> */}
                            <td
                              className="product-des"
                              data-title="Description"
                            >
                              <p className="product-name">
                                <a href="#">{item.nombre}</a>
                              </p>
                              {/* <p className="product-des">{item.descripcion}</p> */}
                            </td>

                            <td className="qty" data-title="Qty">
                              <div className="input-group">
                                <div className="button minus">
                                  <button
                                    type="button"
                                    className="btn btn-primary btn-number"
                                    data-type="minus"
                                    data-field="quant[1]"
                                    onClick={() =>
                                      handleDisminuirCompra(item._id)
                                    }
                                  >
                                    <FaMinus className="text-sm" />
                                  </button>
                                </div>

                                <input
                                  type="text"
                                  name="cantidadTotal"
                                  className="input-number"
                                  data-min="1"
                                  data-max="100"
                                  value={item.cantidad}
                                  onChange={(e) => handleCantidadInputChange(e)}
                                />

                                <div className="button plus">
                                  <button
                                    type="button"
                                    className="btn btn-primary btn-number"
                                    data-type="plus"
                                    data-field="quant[1]"
                                    onClick={() =>
                                      handleAumentarCompra(item._id)
                                    }
                                  >
                                    <FaPlus className="text-sm" />
                                  </button>
                                </div>
                              </div>
                            </td>
                            <td className="total-amount" data-title="Total">
                              <span>
                                ${(item.precio * item.cantidad).toFixed(2)}
                              </span>
                            </td>
                            <td className="action" data-title="Remove">
                              <a onClick={() => handleQuitar(item._id)}>
                                <FaTrashAlt className="text-sm" />
                              </a>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5">El carrito está vacío.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col-md-4 ">
              {isAdmin && (
                <div className="col-md-12 d-flex justify-content-between my-4">
                  <label className=" px-3"> Cliente</label>
                  <button
                    onClick={() => toggleClienteModal()}
                    className="btn btn-success btn-lg px-3 mx-3"
                  >
                    Agregar
                  </button>
                </div>
              )}
              <div className="row">
                <form
                  // onSubmit={handleSubmit(() => console.log("Formulario enviado"))}
                  onSubmit={handleSubmit(onSubmit)}
                  className="form row"
                  // id="CreateForm"
                >
                  <div className=" col-md-6">
                    <Input
                      type="text"
                      label="Nombre"
                      value={selectedCliente ? selectedCliente.nombre : ""}
                      readOnly
                    />
                  </div>
                  <div className=" col-md-6">
                    <Input
                      type="text"
                      label="Apellido"
                      value={selectedCliente ? selectedCliente.apellido : ""}
                      readOnly
                    />
                  </div>
                  <div className=" col-md-8">
                    <Input
                      className="my-4"
                      type="text"
                      label="Teléfono"
                      name="telefono"
                      value={selectedCliente ? selectedCliente.telefono : ""}
                      readOnly
                    />
                  </div>
                  <div className=" col-md-4">
                    <Input
                      type="text"
                      label="DNI"
                      className="my-4 px-0 text-center"
                      value={selectedCliente ? selectedCliente.dni : ""}
                      readOnly
                    />
                  </div>
                  <div className="col-lg-12 col-md-12 col-12 mt-2">
                    <Select
                      className="form-select"
                      name="localidad"
                      value={localidad}
                      {...register("localidad")}
                      onChange={(e) => {
                        handleInputChange(e);
                      }}
                    >
                      {generateLocalidadOptions().map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                    {errors.localidad && (
                      <Message message={errors.localidad.message} />
                    )}
                  </div>
                  <div className="col-lg-12 col-md-12 col-12 mt-4">
                    <Input
                      type="text"
                      name="direccion"
                      label="Ingrese su direccion"
                      required
                      value={direccion}
                      {...register("direccion")}
                      onChange={handleInputChange}
                    />
                    {errors.direccion && (
                      <Message message={errors.direccion.message} />
                    )}
                  </div>
                  <div className="col-lg-12 col-md-12 col-12 mt-4">
                    <Input
                      wrapperClassName="col-md-12  mt-4"
                      type="text"
                      name="referencia"
                      label="Ingrese una referencia de direccion"
                      required
                      value={referencia}
                      {...register("referencia")}
                      onChange={handleInputChange}
                    />
                    {errors.referencia && (
                      <Message message={errors.referencia.message} />
                    )}
                  </div>
                  <div className="col-lg-12">
                    <button
                      // form="CreateForm"
                      type="submit"
                      className="btn btn-success mt-2 control-form"
                    >
                      Guardar Pedido
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalProductoPedido
        isOpen={isModalOpen}
        closeModal={closeModal}
        // products={products}
      />
      <ModalClientePedido
        isOpen={isClienteModalOpen}
        closeModal={closeModal}
        onClienteSeleccionado={handleClienteSeleccionado}
        // products={products}
      />
    </>
  );
}
