import { Link, useNavigate, NavLink } from "react-router-dom";
import { Input, Select, Button, Message } from "../components/ui";
import { Spinner } from "reactstrap";
import React, { useEffect, useState, useRef } from "react";
import { pedidoSchema } from "../schemas/pedido";
import { useAuth } from "../context/authContext";
import { usePedido } from "../context/pedidoContext";
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

import { usePago } from "../context/pagoContext";
import { LineaTiempo } from "../components/LineaTiempo";
// import { Wallet } from "@mercadopago/sdk-react";

export const PedidoForm = () => {
  initMercadoPago("TEST-337ea3bf-0a3c-4745-bcc1-bb4a24f8c6c4");
  const { listaCarrito } = useCarrito();
  const { createPago } = usePago();
  const {
    setDatosClienteValidos,
    createPedido,
    errors: pedidoErrors,
  } = usePedido();
  const [preferenceId, setPreferenceId] = useState();
  const [mostrarWallet, setMostrarWallet] = useState(false);
  const [mostrarBotonPaypal, setMostrarBotonPaypal] = useState(false);
  const [mostrarBotonCash, setMostrarBotonCash] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef(null);
  const envio = JSON.parse(localStorage.getItem("envioGratis"));
  console.log("isEnvio", envio);
  const subtotal = calcularSubTotal(listaCarrito);
  const descuento = calcularDescuento(listaCarrito);
  const total = calcularTotal(listaCarrito, 10);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    trigger,
    reset,
  } = useForm({
    resolver: zodResolver(pedidoSchema),
    shouldUnregister: true,
  });
  const { user } = useAuth();

  const [metodoPago, setMetodoPago] = useState("Paypal");
  useEffect(() => {
    // Reinicia datosClienteValidos a false cuando el formulario se monta.
    setDatosClienteValidos(false);
  }, []);
  useEffect(() => {
    // Verificar el método de pago al cargar la página
    if (metodoPago === "Paypal") {
      setMostrarBotonPaypal(true);
    } else if (metodoPago === "Mercado Pago") {
      setMostrarWallet(true);
    } else if (metodoPago === "Cash") {
      setMostrarBotonCash(true);
    }
  }, [metodoPago]);
  console.log("preferenceId",preferenceId) 
  console.log("metodoPago",metodoPago) 

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const pagoData = listaCarrito.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        precio: Number(item.precio),
        cantidad: item.cantidad,
      }));
      console.log("userf", user);
      const pedidoData = {
        usuario: {
          _id: user.id,
          nombre: data.nombre,
          apellido: data.apellido,
          telefono: data.telefono,
          dni: data.dni,
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
        // pagoResultado: {
        //   id: data.paymentId,
        //   status: data.paymentStatus,
        //   update_time: data.paymentUpdateTime,
        //   email_address: data.emailAddress,
        // },
        precioTotal: parseInt(total),
        estadoPedido: "pendiente",
        fechaPedido: new Date(),
        delivery: envio ? true : false,
        fechaDelivery: addFechaDelivery(new Date(), 4),
      };
      console.log(pedidoData);
      console.log("pagoData", pagoData);

      const respuesta = await createPedido(pedidoData);
      // console.log("respuesta", respuesta.init_point);
      // const id = await createPago(pagoData);
      // console.log("createPago(pagoData) id ", id);
      if (metodoPago === "Mercado Pago") {
        if (respuesta.id) {
          // window.location.href=respuesta.init_point
          const preferenceId = respuesta.id;
          setPreferenceId(preferenceId)
           // Supongo que el ID está en respuesta.id, verifica que sea el lugar correcto
          // localStorage.setItem("preferenceId", preferenceId);
          // sessionStorage.setItem("pasoActual", "3");
          // navigate("/pago");
        }
      }
      console.log("preferenceId",preferenceId)  
      //  else {
      //   navigate("/about");
      // }

      // sessionStorage.setItem("pasoActual", "3");
      // await navigate("/pago");
    } catch (error) {
      console.log(error);
    }finally {
      setIsLoading(false); // Finaliza la carga después de recibir una respuesta (éxito o error)
    }
  };

  const handleInputChange = (e, name, maxLength) => {
    const inputValue = e.target.value;
    let valorLimitado;
    if (name === "dni" || name === "telefono") {
      valorLimitado = handleInputNumerico(inputValue, maxLength, name);
    } else {
      valorLimitado = handleInputLetras(inputValue, maxLength, name);
    }
    setValue(name, valorLimitado);
    trigger(name);
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
                          onChange={(e) =>
                            handleInputChange(e, item.label, item.maxLength)
                          }
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
                          onChange={(e) =>
                            handleInputChange(e, item.label, item.maxLength)
                          }
                        />
                        {errors[item.label] && (
                          <Message message={errors[item.label].message} />
                        )}
                      </div>
                    ))}
                    <div className="col-lg-12 col-md-12 col-12 mt-4">
                      <Select
                        className="form-select"
                        {...register("localidad")}
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
                        required="required"
                        {...register("referencia")}
                      />
                      {errors.referencia && (
                        <Message message={errors.referencia.message} />
                      )}
                    </div>
                  </div>
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
                        <button form="CreateForm" type="submit" className="btn btn-success"
                        // disabled={preferenceId !== undefined}
                        >
                         {isLoading ? (
                    <Spinner color="primary" className="mx-2" /> // Icono de carga
                  ) : (
                    "Mercado Pago" // Texto del botón
                  )}
                        
                        </button>
                      )}
                      {preferenceId && mostrarWallet && (
                        <Wallet
                          initialization={{
                            preferenceId: preferenceId,
                            redirectMode: "modal",
                          }}
                        ></Wallet>
                      )}
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
