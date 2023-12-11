import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Swal from "sweetalert2";
import { useForm, useWatch } from "react-hook-form";
import { usePedido } from "../context/pedidoContext";
import { ModalPedido } from "../components/pedido/ModalPedido";
import { Alert } from "react-bootstrap";
import io from "socket.io-client";
import { API_URL } from "../config.js";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";

dayjs.extend(utc);

export function OrdenForm({ isOpen }) {
  const { reset } = useForm();
  const { user, loading: userLoading } = useAuth();
  const isAdmin = user?.isAdmin || false;
  const {
    createPedido,
    getPedido,
    getPedidos,
    updatePedido,
    deletePedido,
    pedidos,
    errors: registerErrors,
  } = usePedido();
  const navigate = useNavigate();
  const [selectedPedidos, setselectedPedidos] = useState({});
  // const [pedidos, setPedidos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPedidoId, seteditingPedidoId] = useState(null);
  const [nuevoPedido, setNuevoPedido] = useState(null);


  useEffect(() => {
    let socket;

    const fetchData = async () => {
      try {
        const data = await getPedidos();
       console.log(">>>>>>>>>>>>>>>>>>>>>>>",data)
      } catch (error) {
        console.error("Error al obtener pedidos:", error);
      }
    };
  
    fetchData();
    if (user && user.id) {
      socket = io(API_URL);
      socket.on("pedidoCreado", async (data) => {
       await getPedidos();
       const ultimoPedido = pedidos[pedidos.length - 1];
console.log("ultimoPedido>>>>>><",ultimoPedido)
        toast.success(`se agrego un nuevo pedido !`, {
          position: "bottom-center", 
        });
      });

      return () => {
        if (socket) {
          socket.off("pedidoCreado");
          socket.close();
        }
      };
    }
  }, []);
  const handleDelete = async (pedidoId) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esto.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo",
      });

      if (result.isConfirmed) {
        setselectedPedidos((prevSelected) => ({
          ...prevSelected,
          [pedidoId]: false,
        }));

        await deletePedido(pedidoId);

        Swal.fire("Eliminado", "pedido ha sido eliminado.", "success");
        getPedidos();
      }
    } catch (error) {
      console.error("Error al eliminar pedido:", error);
      let errorMessage = "Hubo un problema al eliminar pedido.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }

      Swal.fire("Error", errorMessage, "error");
    }
  }; 
  console.log("pedidos>>dd<", pedidos);

  const handleDeleteSelected = async () => {
    try {
      const selectedpedidoIds = Object.keys(selectedPedidos).filter(
        (pedidoId) => selectedPedidos[pedidoId]
      );

      if (selectedpedidoIds.length === 0) {
        Swal.fire(
          "Selecciona Pedidos",
          "Por favor, selecciona Pedidos para eliminar.",
          "info"
        );
        return;
      }

      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esto.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlos",
      });

      if (result.isConfirmed) {
        for (const pedidoId of selectedpedidoIds) {
          await deletePedido(pedidoId);
        }

        Swal.fire("Eliminados", "Pedidos han sido eliminados.", "success");
        getPedidos();
        setselectedPedidos({}); // Limpiar la lista de productos seleccionados
      }
    } catch (error) {
      console.error("Error al eliminar Pedidos:", error);
      let errorMessage = "Hubo un problema al eliminar Pedidos.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }

      Swal.fire("Error", errorMessage, "error");
    }
  };
  const handleCheckboxChange = (pedidoIid) => {
    setselectedPedidos((prevSelected) => {
      return {
        ...prevSelected,
        [pedidoIid]: !prevSelected[pedidoIid],
      };
    });
  };
  const handlePedido = (pedidoId) => {
    if (pedidoId === null) {
      // setEditingPedidoId(null);
      navigate("/crudpedido");
    } else {
      // setEditingPedidoId(pedidoId);
      navigate(`/crudpedido/${pedidoId}`);
    }
  };

  return (
    <>
      <div className="shopping-cart section">
        <div className="container">
          <br></br>
          <div className="row">
            <div class="col-md-6  text-start">
              <h1 class=" text-success fs-2">Lista de Pedidos</h1>
            </div>
            <div class="col-md-6 d-flex align-items-center justify-content-end">
              <button
                className="btn btn-danger  px-3"
                onClick={handleDeleteSelected}
                disabled={
                  !Object.values(selectedPedidos).some((value) => value)
                }
              >
                Borrar
              </button>
              <button
                onClick={() => handlePedido(null)}
                class="btn btn-success btn-lg px-3"
              >
                Crear pedido
              </button>
            </div>
            <br></br>
            <br></br>

            <div className="col-12">
              <table className="table shopping-summery">
                <thead>
                  <tr className="main-hading">
                    <th className="text-start">Cliente</th>
                    <th className="text-start">Pago</th>
                    <th className="text-start">Estado</th>
                    <th className="text-start">Fecha</th>
                    <th className="text-start">Delivery</th>
                    <th className="text-start">Accion</th>
                    <th className="text-start">Seleccionar</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(pedidos) && pedidos.map((pedido) => (
                    <tr key={pedido._id}>
                      <td>{`${pedido.cliente?.nombre}`} </td>
                      <td>{pedido.pagoResultado?.status ? pedido.pagoResultado.status : "Pedido sin pagar"}</td>
                      <td>{pedido.estadoPedido}</td>
                      <td>{pedido.fechaPedido}</td>
                      <td>{pedido.isDelivery === true ? "si" : "no"}</td>

                      <td>
                        <a
                          onClick={() => handlePedido(pedido._id)}
                          className=" pe-4"
                        >
                          <i class="fa-sharp fa-solid fa-pen-to-square"></i>
                        </a>
                        <a onClick={() => handleDelete(pedido._id)}>
                          <i className="fa-sharp fa-solid fa-trash"></i>
                        </a>
                      </td>
                      <td>
                        <div className="checkProduct">
                          <div className="checkbox">
                            <label
                              className={`checkbox-inline ${
                                selectedPedidos[pedido._id] ? "checked" : ""
                              }`}
                              htmlFor={`checkbox-${pedido._id}`}
                            >
                              {" "}
                              <input
                                type="checkbox"
                                onChange={() =>
                                  handleCheckboxChange(pedido._id)
                                }
                                checked={selectedPedidos[pedido._id] || false}
                                id={`checkbox-${pedido._id}`}
                              />
                            </label>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* <ModalPedido
        isOpen={isModalOpen}
        closeModal={closeModal}
        pedidoId={editingPedidoId}
      /> */}
    </>
  );
}
