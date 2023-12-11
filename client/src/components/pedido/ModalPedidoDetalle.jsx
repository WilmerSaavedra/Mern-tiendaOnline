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
import { useCarrito } from "../../context/carritoContext";
import {
  handleInputNumerico,
  handleInputLetras,
  generateLocalidadOptions,
  addFechaDelivery,
} from "../../helper/utilPedido";
import { useAuth } from "../../context/authContext";

export function ModalPedidoDetalle({ isOpen, closeModal, idPedido }) {
  const {
    getPedido,
    createPedido,
    updatePedidoEnvio,
    getPedidos,
    errors: pedidoErrors,
    pedidos,
  } = usePedido();
  const {
    listaCarrito,
    eliminarCompra,
    actualizarCantidad,
    actualizarCarrito,
    limpiarCarrito,
  } = useCarrito();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
    reset,
  } = useForm({
    // resolver: zodResolver(marcaSchema),
    shouldUnregister: false,
  });
  const { user } = useAuth();
  console.log("idPedido>>>>>>>>>>>>>>>>>>>", idPedido);
  const [selectedImage, setSelectedImage] = useState(null);
  const inputRef = useRef();
  const [modalTitle, setModalTitle] = useState("Crear Marca");
  const [selectedCliente, setSelectedCliente] = useState(null);

  const [localidad, setLocalidad] = useState("");
  const [direccion, setDireccion] = useState("");
  const [referencia, setReferencia] = useState("");
  let [errorMessage, setErrorMessage] = useState("");
  const [productsInOrder, setProductsInOrder] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [idP, setIdP] = useState(idPedido);

  useEffect(() => {
    // Calculate total when productsInOrder changes
    const calculateTotal = () => {
      let total = 0;
      productsInOrder.forEach((item) => {
        total += item.producto.precio * item.cantidad;
      });
      setTotalAmount(total);
    };

    calculateTotal();
  }, [productsInOrder]);
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
      // setIsLoading(true);
    console.log("selectedCliente id ", selectedCliente);
    console.log("isAdmin ", user.isAdmin);

      const pedidoData = {
        usuario: {
          _id: selectedCliente._id,
          isAdmin: user.isAdmin,
        },
        DireccionEnvio: {
          direccion: data.direccion,
          referencia: data.referencia,
          localidad: data.localidad,
        },
        // metodoPago: "",
      };
      console.log("pedidoData :>> ", pedidoData);
      console.log("idPedido insubmit:>> ", idPedido);
      let respuesta = {};
      if (idP) {
        respuesta = await updatePedidoEnvio(idP, pedidoData);
        console.log("respuesta updatePedido:>>>>>>>>>>> ", respuesta);
      }

      if (respuesta) {
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: `Pedido editado exitosamente`,
        });
      }
      console.log("respuesta createPedido  :>> ", respuesta);
    } catch (error) {
      errorMessage = "Ocurrió un error al editar el pedido.";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    } finally {
      // setIsLoading(false);
    }
  };
  useEffect(() => {
    if (idPedido !== null) {
      console.log("Type of pedidos:", typeof pedidos);
      console.log("Content of pedidos:", pedidos);
      
      const fetchData = async () => {
        try {
          // setIsLoading(true);
          const pedidoDetails = await getPedido(idPedido);
          if (pedidoDetails) {
           
            setSelectedCliente(pedidoDetails.cliente);
            setLocalidad(pedidoDetails.DireccionEnvio.localidad);
            setDireccion(pedidoDetails.DireccionEnvio.direccion);
            setReferencia(pedidoDetails.DireccionEnvio.referencia);
            setValue("localidad", pedidoDetails.DireccionEnvio.localidad || "");
            setValue("direccion", pedidoDetails.DireccionEnvio.direccion || "");
            setValue("referencia", pedidoDetails.DireccionEnvio.referencia || "");
            
            setProductsInOrder(pedidoDetails.ordenItems);
          }
        } catch (error) {
          console.error("Error fetching order details:", error);
        } finally {
          // setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [idPedido]);
  return (
    <Modals isOpen={isOpen} closeModal={closeModal} size="lg">
      <div className="container">
        {/* <br></br> */}
        <h2>Detalle de Pedido</h2>

        <div className="row">
          <div className="col-md-8  text-start">
            <div className="col-md-12 ">
              <div className="col-12">
                <table className="table shopping-summery">
                  <thead>
                    <tr className="main-hading">
                      <th>Producto</th>
                      <th className="text-center">Cantidad</th>
                      <th className="text-center">SubTotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsInOrder.length > 0 ? (
                      productsInOrder.map((item) => (
                        <tr key={item._id}>
                          {/* <td className="image" data-title="No">
                              <img src={item.image.principal.url} alt="#" />
                            </td> */}
                          <td className="product-des" data-title="Description">
                            <p className="product-name">
                              {item.producto.nombre}
                            </p>
                            {/* <p className="product-des">{item.descripcion}</p> */}
                          </td>

                          <td>
                            <span>{item.cantidad}</span>
                          </td>
                          <td className="total-amount" data-title="Total">
                            <span>
                              $
                              {(item.producto.precio * item.cantidad).toFixed(
                                2
                              )}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5">El carrito está vacío.</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="2" className="text-end">
                        <strong>Total:</strong>
                      </td>
                      <td className="total-amount">
                        <span>${totalAmount.toFixed(2)}</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
          <div className="col-md-12 ">
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
                    Editar Direccion de Envio
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Modals>
  );
}
