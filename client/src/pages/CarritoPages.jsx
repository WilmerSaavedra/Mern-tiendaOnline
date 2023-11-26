import { FaMinus, FaPlus, FaTrashAlt } from "react-icons/fa";
import { useCarrito } from "../context/carritoContext";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { LineaTiempo } from "../components/LineaTiempo";

import {
  calcularTotal,
  calcularSubTotal,
  calcularDescuento,
  updateSessionStorage,
} from "../reducers/utilCarritoReducer";
import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { ModalLogin } from "../components/ModalLogin";
export const CarritoPages = () => {
  const {
    listaCarrito,
    eliminarCompra,
    actualizarCantidad,
    actualizarCarrito,
  } = useCarrito();
  // console.log("listaCarrito cant",listaCarrito.length)
const navigate=useNavigate();
  const [envioGratis, setEnvioGratis] = useState(() => {
    const envio = JSON.parse(localStorage.getItem("envioGratis"));
    return envio ? true : false;
  });
  // Cambia el estado de envío gratis si el carrito no está vacío
  const handleEnvioGratisChange = () => {
    if (listaCarrito.length !== 0) {
      const nuevoEstado = !envioGratis;
      setEnvioGratis(nuevoEstado); // Primero actualiza el estado
      localStorage.setItem("envioGratis", JSON.stringify(nuevoEstado)); // Luego almacena en localStorage
    }
  };

  // Elimina un producto del carrito y actualiza la sesión
  const handleQuitar = (id) => {
    eliminarCompra(id);
    const nuevoCarrito = listaCarrito.filter((producto) => producto._id !== id);
    actualizarCarrito(nuevoCarrito);
    updateSessionStorage(nuevoCarrito);
    setEnvioGratis(false);
    localStorage.setItem("envioGratis", JSON.stringify(false));
  };

  // Aumenta la cantidad de un producto en el carrito y actualiza la sesión
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
    updateSessionStorage(nuevoCarrito);
  };

  // Disminuye la cantidad de un producto en el carrito y actualiza la sesión
  const handleDisminuirCompra = (id) => {
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
    updateSessionStorage(nuevoCarrito);
  };

  const subtotal = calcularSubTotal(listaCarrito);
  const descuento = calcularDescuento(listaCarrito);
  const total = calcularTotal(listaCarrito, envioGratis);
  const { user, isAuthenticated } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleCheckoutClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      console.log("Usuario autenticado, navegando a /pedido");
      sessionStorage.setItem("pasoActual", "2");
      navigate("/pedido");
    } else {
      toggleModal()
    }
   
  };
  return (
    <>
      <div className="shopping-cart section">
        <div className="container">
          <LineaTiempo></LineaTiempo>
          <br></br>
          <div className="row">
            <div className="col-12">
              <table className="table shopping-summery">
                <thead>
                  <tr className="main-hading">
                    <th>PRODUCT</th>
                    <th>NAME</th>
                    <th className="text-center">UNIT PRICE</th>
                    <th className="text-center">QUANTITY</th>
                    <th className="text-center">TOTAL</th>
                    <th className="text-center">
                      <i className="ti-trash remove-icon"></i>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {listaCarrito.length > 0 ? (
                    listaCarrito.map((item) => (
                      <tr key={item._id}>
                        <td className="image" data-title="No">
                          <img src={item.image.principal.url} alt="#" />
                        </td>
                        <td className="product-des" data-title="Description">
                          <p className="product-name">
                            <a href="#">{item.nombre}</a>
                          </p>
                          <p className="product-des">{item.descripcion}</p>
                        </td>
                        <td className="price" data-title="Price">
                          <span>${item.precio} </span>
                        </td>
                        <td className="qty" data-title="Qty">
                          <div className="input-group">
                            <div className="button minus">
                              <button
                                type="button"
                                className="btn btn-primary btn-number"
                                data-type="minus"
                                data-field="quant[1]"
                                onClick={() => handleDisminuirCompra(item._id)}
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
                                onClick={() => handleAumentarCompra(item._id)}
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
          <div className="row">
            <div className="col-12">
              <div className="total-amount">
                <div className="row">
                  <div className="col-lg-8 col-md-5 col-12">
                    <div className="left">
                      <div className="coupon">
                        <form action="#" target="_blank">
                          <input
                            name="Coupon"
                            placeholder="Enter Your Coupon"
                          />
                          <button className="btn">Apply</button>
                        </form>
                      </div>
                      <div className="checkbox">
                        <label
                          id="checkbox"
                          className={`checkbox-inline ${
                            envioGratis ? "checked" : ""
                          }`}
                          htmlFor="envio"
                        >
                          <input
                            name="news"
                            id="envio"
                            type="checkbox"
                            checked={envioGratis}
                            onChange={handleEnvioGratisChange}
                          />
                          Shipping (+10$)
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-7 col-12">
                    <div className="right">
                      <ul>
                        <li>
                          Subtotal<span>${subtotal}</span>
                        </li>
                        <li>
                          {!envioGratis ? (
                            <>{/* Envío<span>Gratis</span> */}</>
                          ) : (
                            <>
                              Envío<span>(+10$)</span>
                            </>
                          )}
                        </li>
                        <li>
                          Descuento
                          <span>${descuento}</span>
                        </li>
                        <li className="last">
                          Total a Pagar
                          <span>${total}</span>
                        </li>
                      </ul>
                      <div className="button5 d-flex flex-column align-items-center">
                        <Link
                          onClick={handleCheckoutClick}
                          className="btn btn-primary text-center"
                          style={
                            listaCarrito.length === 0
                              ? { pointerEvents: "none", opacity: 0.6 }
                              : {}
                          }
                        >
                          Checkout
                        </Link>
                        <Link
                          to="/shop"
                          href="#"
                          className="btn btn-primary text-center"
                        >
                          Continue shopping
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalLogin isOpen={isModalOpen} closeModal={closeModal} />
    </>
  );
};
