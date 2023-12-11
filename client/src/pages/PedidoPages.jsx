import React, { useEffect, useState } from "react";
import { usePedido } from "../context/pedidoContext";
import { useAuth } from "../context/authContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { ModalPedidoDetalle } from "../components/pedido/ModalPedidoDetalle";

function PedidoPages() {
  const { user, loading: userLoading } = useAuth();
  const { pedidos, getPedidoxUsuario, deletePedido, getPedidoPagar } = usePedido();
  const [loading, setLoading] = useState(true);
  const [idPedido, setIdPedido] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const toggleModal = async (Id) => {
    setIdPedido(Id === null ? null : Id);
    setIsModalOpen(!isModalOpen);
    await getPedidoxUsuario(user.id);
  };

  const closeModal = async () => {
    setIsModalOpen(false);
    await getPedidoxUsuario(user.id);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userLoading && user && user.id) {
          setLoading(true);
          await getPedidoxUsuario(user.id);
          setLoading(false);
        } else {
          console.error("User or user.id is null or undefined.");
        }
      } catch (error) {
        console.error("Error al obtener pedidos:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user, userLoading]);

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
        await deletePedido(pedidoId);
        Swal.fire("Eliminado", "Pedido ha sido eliminado.", "success");
        getPedidoxUsuario(user.id);
      }
    } catch (error) {
      console.error("Error al eliminar pedido:", error);
      let errorMessage = "Hubo un problema al eliminar el pedido.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      Swal.fire("Error", errorMessage, "error");
    }
  };

  const handlePedido = (pedidoId) => {
    if (pedidoId !== null) {
      navigate(`/crudpedido/${pedidoId}`);
    }
  };

  const handlePagarPedido = async (pedidoId) => {
    if (pedidoId !== null) {
      const respuesta = await getPedidoPagar(pedidoId);
      if (respuesta.result.id) {
        const preferenceId = respuesta.result.id;
        window.location.replace(respuesta.result.init_point);
        localStorage.setItem("OrdenId", respuesta.result.external_reference);
      } else {
        console.error("Error al iniciar el proceso de pago.");
      }
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <br></br><br></br>
          <h2>Tus Pedidos </h2>
          {loading ? (
            <p>Cargando pedidos...</p>
          ) : (
            Array.isArray(pedidos) && pedidos.length > 0 ? (
              <table className="table shopping-summery">
                <thead>
                  <tr className="main-hading">
                    <th>Fecha del Pedido</th>
                    <th>Pago</th>
                    <th>Precio Total</th>
                    <th>Estado del Pedido</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((pedido) => (
                    <tr key={pedido._id}>
                      <td>{new Date(pedido.fechaPedido).toLocaleDateString()}</td>
                      <td>{pedido.pagoResultado?.status ? pedido.pagoResultado.status : "Pedido sin pagar"}</td>
                      <td>${pedido.precioTotal}</td>
                      <td>{pedido.estadoPedido}</td>
                      <td>
                        <a onClick={() => toggleModal(pedido._id)} className=" pe-4">
                          <i className="fa-sharp fa-solid  fa-info"></i>
                        </a>
                        {pedido.pagoResultado?.status === undefined &&
                          pedido.estadoPedido === "pendiente" && (
                            <>
                              <a onClick={() => handlePedido(pedido._id)} className="pe-4">
                                <i className="fa-sharp fa-solid fa-pen-to-square"></i>
                              </a>
                              <a onClick={() => handleDelete(pedido._id)}>
                                <i className="fa-sharp fa-solid fa-trash"></i>
                              </a>
                            </>
                          )}
                        {pedido.pagoResultado?.status === "Pedido Pagado" &&
                          pedido.estadoPedido === "entregado" && (
                            <a onClick={() => handleDelete(pedido._id)}>
                              <i className="fa-sharp fa-solid fa-trash"></i>
                            </a>
                          )}
                        {pedido.pagoResultado?.status === undefined && (
                          <button onClick={() => handlePagarPedido(pedido._id)}>
                            Pagar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No hay pedidos.</p>
            )
          )}
        </div>
      </div>
      <ModalPedidoDetalle isOpen={isModalOpen} closeModal={closeModal} idPedido={idPedido} />
    </div>
  );
}

export default PedidoPages;
