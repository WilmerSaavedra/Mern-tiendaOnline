import { Link, useNavigate, NavLink } from "react-router-dom";
import { Input, Select, Button, Message } from "../components/ui";
import { Spinner } from "reactstrap";
import React, { useEffect, useState, useRef } from "react";
import { pedidoSchema } from "../schemas/pedido";
import { useAuth } from "../context/authContext";
import { usePedido } from "../context/pedidoContext";
import { useClientes } from "../context/clienteContext";
import Swal from "sweetalert2";
import {
  calcularTotal,
  calcularSubTotal,
  calcularDescuento,
} from "../reducers/utilCarritoReducer";
import { useCarrito } from "../context/carritoContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  handleInputNumerico,
  handleInputLetras,
  generateLocalidadOptions,
  addFechaDelivery,
} from "../helper/utilPedido";
import {
  initMercadoPago,
  CardPayment,
  Payment,
  Wallet,
} from "@mercadopago/sdk-react";

// import { usePago } from "../context/pagoContext";
import { LineaTiempo } from "../components/LineaTiempo";
// import { Wallet } from "@mercadopago/sdk-react";

export const PedidoForm = () => {
  initMercadoPago("TEST-337ea3bf-0a3c-4745-bcc1-bb4a24f8c6c4");

  const { listaCarrito } = useCarrito();
  const {
    setDatosClienteValidos,
    createPedido,
    errors: pedidoErrors,
  } = usePedido();
  const { user } = useAuth();
  const {
    getClienteIdUsuario,
    errors: clienteErrors,
  } = useClientes();
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(pedidoSchema),
    shouldUnregister: true,
  });

  const [preferenceId, setPreferenceId] = useState();
  const [mostrarWallet, setMostrarWallet] = useState(false);
  const [mostrarBotonPaypal, setMostrarBotonPaypal] = useState(false);
  const [mostrarBotonCash, setMostrarBotonCash] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [metodoPago, setMetodoPago] = useState("Paypal");
  const navigate = useNavigate();

  const envio = JSON.parse(localStorage.getItem("envioGratis"));
  const subtotal = calcularSubTotal(listaCarrito);
  const descuento = calcularDescuento(listaCarrito);
  const total = calcularTotal(listaCarrito, 10);

  useEffect(() => {
    setDatosClienteValidos(false);
  }, []);
  useEffect(() => {
    const fetchClienteData = async () => {
      try {
        const clienteData = await getClienteIdUsuario(user.id);

        setValue("nombre", clienteData.nombre);
        setValue("apellido", clienteData.apellido);
        setValue("telefono", clienteData.telefono);
        setValue("dni", clienteData.dni);
      } catch (error) {
        console.error("Error al obtener datos del cliente:", error);
      }
    };

    fetchClienteData();
  }, [ user.id, setValue]);
  useEffect(() => {
    if (metodoPago === "Paypal") {
      setMostrarBotonPaypal(true);
    } else if (metodoPago === "Mercado Pago") {
      setMostrarWallet(true);
    } else if (metodoPago === "Cash") {
      setMostrarBotonCash(true);
    }
  }, [metodoPago]);

  const onSubmit = async () => {
    const data = getValues();

    try {
      setIsLoading(true);
      const pedidoData = {
        failureUrl: "pedidos",
        usuario: {
          _id: user.id,
          isAdmin: user.isAdmin,
          nombre: data.nombre,
          apellido: data.apellido,
          dni: data.dni,
          telefono: data.telefono,
          email: user.email,
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
        metodoPago,
        precioTotal: parseInt(total),
        estadoPedido: "pendiente",
        fechaPedido: new Date(),
        delivery: envio ? true : false,
        fechaDelivery: addFechaDelivery(new Date(), 4),
      };
      console.log("pedidoData :>> ", pedidoData);

      const respuesta = await createPedido(pedidoData);

      console.log("respuesta createPedido  :>> ", respuesta);

      if (metodoPago === "Mercado Pago") {
        if (respuesta.result.id) {
          Swal.fire({
            title: "¡Pedido creado!",
            text: "Tu pedido ha sido creado exitosamente.",
            icon: "success",
          })
          const preferenceId = respuesta.result.id;
          setPreferenceId(preferenceId);

          const storedOrdenId = respuesta.result.external_reference;
          window.location.replace(respuesta.result.init_point);

          localStorage.setItem("OrdenId", storedOrdenId);
        } else {
          console.error("Error al iniciar el proceso de pago.");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const inputName = e.target.name;

    let valorLimitado;
    if (inputName === "dni" || inputName === "telefono") {
      valorLimitado = handleInputNumerico(inputValue, inputName);
    } else {
      valorLimitado = handleInputLetras(inputValue, inputName);
    }

    setValue(inputName, valorLimitado);
    trigger(inputName);
  };

  return (
    <>
      <section className="shop checkout section">
        <div className="container">
          <LineaTiempo></LineaTiempo>
          {/* <Wallet initialization={{preferenceId}} /> */}
          <div className="row">
            <div className="col-lg-8 col-12">
              <div className="checkout-form">
                <h2>Haga su pago aquí</h2>
                <p>
                  Por favor regístrese para realizar el pago más rápidamente
                </p>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="form"
                  id="CreateForm"
                >
                  {pedidoErrors && <Message message={pedidoErrors} />}

                  <div className="row">
                    {[
                      {
                        label: "nombre",
                        maxLength: 50,
                        colClass: "col-md-6 mt-4",
                      },
                      {
                        label: "apellido",
                        maxLength: 50,
                        colClass: "col-md-6 mt-4",
                      },
                      {
                        label: "email",
                        maxLength: 255,
                        colClass: "col-md-12 mt-4",
                      },
                    ].map((item) => (
                      <div className={item.colClass} key={item.label}>
                        <Input
                          type="text"
                          name={item.label}
                          label={`Ingrese su ${item.label}`}
                          required
                          defaultValue={
                            item.label === "email" && user ? user.email : ""
                          }
                          {...register(item.label)}
                          onChange={handleInputChange}
                        />
                        {errors[item.label] && (
                          <Message message={errors[item.label].message} />
                        )}
                      </div>
                    ))}

                    {[
                      {
                        label: "telefono",
                        maxLength: 9,
                        colClass: "col-md-6 mt-4",
                      },
                      { label: "dni", maxLength: 8, colClass: "col-md-6 mt-4" },
                    ].map((item) => (
                      <div className={item.colClass} key={item.label}>
                        <Input
                          name={item.label}
                          label={`Ingrese su ${
                            item.label === "telefono" ? "teléfono" : "DNI"
                          }`}
                          required
                          {...register(item.label)}
                          onChange={handleInputChange}
                        />
                        {errors[item.label] && (
                          <Message message={errors[item.label].message} />
                        )}
                      </div>
                    ))}
                    <div className="col-lg-12 col-md-12 col-12 mt-4">
                      <Select
                        className="form-select"
                        name="localidad"
                        {...register("localidad")}
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
                        {...register("direccion")}
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
                        {...register("referencia")}
                        onChange={handleInputChange}
                      />
                      {errors.referencia && (
                        <Message message={errors.referencia.message} />
                      )}
                    </div>
                  </div>
                  {/* <button >hola</button> */}
                </form>

                {/* </form> */}
              </div>
            </div>
            <div className="col-lg-4 col-12">
              <div className="order-details">
                <div className="single-widget">
                  <h2>TOTALES DEL CARRITO</h2>
                  <div className="content">
                    <ul>
                      <li>
                        Sub Total<span>$ {subtotal}</span>
                      </li>
                      <li>
                        (+) Envio<span> $ {!envio ? 0.0 : 10.0}</span>
                      </li>
                      <li>
                        (-) Descuento<span>$ {descuento}</span>
                      </li>
                      <li className="last">
                        Total<span>$ {total}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="single-widget">
                  <h2>PAGOS</h2>
                  <div className="content">
                    <div className="col-lg-12 col-md-12 col-12">
                      <p>{errors.metodoPago?.message}</p>
                      <div className="checkbox">
                        <label
                          className={`checkbox-inline ${
                            metodoPago === "Paypal" ? "checked" : ""
                          }`}
                          htmlFor="paypalCheckbox"
                        >
                          <input
                            id="paypalCheckbox"
                            type="checkbox"
                            name="metodoPago"
                            value="Paypal"
                            {...register("metodoPago")}
                            onChange={() => {
                              setMetodoPago("Paypal");
                              setMostrarWallet(false);
                              setMostrarBotonPaypal(true);
                              setMostrarBotonCash(false);
                            }}
                            checked={metodoPago === "Paypal"}
                          />
                          PayPal
                        </label>
                      </div>
                      <div className="checkbox">
                        <label
                          className={`checkbox-inline ${
                            metodoPago === "Mercado Pago" ? "checked" : ""
                          }`}
                          htmlFor="checkCheckbox"
                        >
                          <input
                            id="checkCheckbox"
                            type="checkbox"
                            name="metodoPago"
                            value="Mercado Pago"
                            {...register("metodoPago")}
                            onChange={() => {
                              setMetodoPago("Mercado Pago");
                              setMostrarWallet(true);
                              setMostrarBotonPaypal(false);
                              setMostrarBotonCash(false);
                            }}
                            checked={metodoPago === "Mercado Pago"}
                          />
                          Mercado Pago
                        </label>
                      </div>
                      <div className="checkbox">
                        <label
                          className={`checkbox-inline ${
                            metodoPago === "Cash" ? "checked" : ""
                          }`}
                          htmlFor="cashCheckbox"
                        >
                          <input
                            id="cashCheckbox"
                            type="checkbox"
                            name="metodoPago"
                            form="CreateForm"
                            value="Cash"
                            {...register("metodoPago")}
                            onChange={() => {
                              setMetodoPago("Cash");
                              setMostrarWallet(false);
                              setMostrarBotonPaypal(false);
                              setMostrarBotonCash(true);
                            }}
                            checked={metodoPago === "Cash"}
                          />
                          Cash On Delivery
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="single-widget payement">
                  <div className="content">
                    <img src="images/payment-method.png" alt="#" />
                  </div>
                </div>

                <div className="single-widget get-button">
                  <div className="content">
                    <div className="button">
                      {mostrarWallet && (
                        <button
                          form="CreateForm"
                          type="submit"
                          className="btn btn-success"
                          // disabled={preferenceId !== undefined}
                        >
                          {isLoading ? (
                            <Spinner color="primary" className="mx-2" /> // Icono de carga
                          ) : (
                            "Mercado Pago" // Texto del botón
                          )}
                        </button>
                      )}
                      {/* {preferenceId && mostrarWallet && (
                        <Wallet
                          initialization={{
                            preferenceId: preferenceId,
                            redirectMode: "modal",
                          }}
                        ></Wallet>
                      )} */}
                      {mostrarBotonPaypal && (
                        <button
                          form="CreateForm"
                          type="submit"
                          className="btn btn-success"
                        >
                          Pagar con PayPal
                        </button>
                      )}
                      {mostrarBotonCash && (
                        <button
                          form="CreateForm"
                          type="submit"
                          className="btn btn-success"
                        >
                          Pagar en Efectivo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="shop-services section home">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6 col-12">
              <div className="single-service">
                <i className="ti-rocket"></i>
                <h4>Descuento de 10% </h4>
                <p>Comprar mas de tres Productos</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <div className="single-service">
                <i className="ti-reload"></i>
                <h4>Devolución gratuita</h4>
                <p>Devoluciones en 30 días</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <div className="single-service">
                <i className="ti-lock"></i>
                <h4>Pago Seguro</h4>
                <p>Pago 100% seguro</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <div className="single-service">
                <i className="ti-tag"></i>
                <h4>Producto de Calidad</h4>
                <p>Precio garantizado</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
