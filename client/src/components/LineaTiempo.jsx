import { useCarrito } from "../context/carritoContext";
import { usePedido } from "../context/pedidoContext";

import { useState, useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";

export function LineaTiempo() {
  const { listaCarrito } = useCarrito();
  const { datosClienteValidos } = usePedido();
  const [pasoActual, setPasoActual] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const pasoActualGuardado = sessionStorage.getItem("pasoActual");
    if (pasoActualGuardado !== null) {
      setPasoActual(Number(pasoActualGuardado));
    }
  }, []);

  const handlePasoClick = async (paso, e) => {
    e.preventDefault();
    let actualizarEnSession = true;
    if (paso === 1) {
      if (listaCarrito.length === 0) {
        actualizarEnSession = false;
        paso = 1;
        console.log("paso 1");
      }
    } else if (paso === 2) {
      if (listaCarrito.length === 0) {
        paso = 1;
        actualizarEnSession = true;
        console.log("paso 2.");
      } else if (!datosClienteValidos) {
        actualizarEnSession = false;
        console.log("Los datos de pedido están vacíos o no son válidos.");
      }
    } else {
      actualizarEnSession = true;
    }

    if (actualizarEnSession) {
      setPasoActual(paso);
      sessionStorage.setItem("pasoActual", paso.toString());
    } else {
      sessionStorage.setItem("pasoActual", paso.toString());
    }
    switch (paso) {
      case 1:
        await navigate("/carrito");
        break;
      case 2:
        await navigate("/pedido");
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="header__container--steps">
        <div className="header__wrapper--steps">
          <ul className="steps--list">
            <li id="steps--one">
              <div>
                <Link
                  className={`step__circle step__circle--first ${
                    pasoActual >= 1 ? "step__active" : ""
                  }`}
                  onClick={(e) => handlePasoClick(1, e)}
                >
                  <p className="step__circle--text">1</p>
                  <p className="step__circle--icon">✓</p>
                </Link>
                <p className="step__text">Carrito</p>
              </div>
            </li>

            {/* <li id="steps--two">
              <div>
                <Link
                  className={`step__circle step__circle--two ${
                    pasoActual >= 2 ? "step__active" : ""
                  }`}
                  // to="/pedido"
                  onClick={(e) => handlePasoClick(2, e)}
                >
                  <p className="step__circle--text">2</p>
                  <p className="step__circle--icon">✓</p>
                </Link>
                <p className="step__text">Revision y Pago</p>
              </div>
            </li> */}

            {/* <li id="steps--three">
              <div>
                <Link
                  className={`step__circle step__circle--three ${
                    pasoActual >= 3 ? "step__active" : ""
                  }`}
                  onClick={(e) => handlePasoClick(3, e)}
                >
                  <p className="step__circle--text">3</p>
                  <p className="step__circle--icon">✓</p>
                </Link>
                <p className="step__text">Pago</p>
              </div>
            </li> */}
            <li id="steps--four">
              <div>
              <Link
                  className={`step__circle step__circle--two ${
                    pasoActual >= 2 ? "step__active" : ""
                  }`}
                  // to="/pedido"
                  onClick={(e) => handlePasoClick(2, e)}
                >
                  <p className="step__circle--text">2</p>
                  <p className="step__circle--icon">✓</p>
                </Link>
                <p className="step__text">Revision y Pago</p>
              </div>
            </li>
          </ul>
          <div className="steps--timeline">
            <div className="steps--timeline-advance"></div>
          </div>
        </div>
      </div>
    </>
  );
}
