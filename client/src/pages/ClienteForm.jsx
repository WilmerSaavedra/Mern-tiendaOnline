import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Swal from "sweetalert2";
import { useForm, useWatch } from "react-hook-form";
import { useClientes } from "../context/clienteContext";
import { useAuth} from "../context/authContext";
import { ModalCliente } from "../components/cliente/ModalCliente";
import { Alert } from "react-bootstrap";

dayjs.extend(utc);

export function ClienteForm({ isOpen }) {
  const { reset } = useForm();
  const {
    createCliente,
    getClienteId,
    getClientes,
    updateCliente,
    deleteCliente,
    clientes,
    errors: registerErrors,
  } = useClientes();
  const { getUsersinClientes, usuario } = useAuth();
  const [selectedClientes, setSelectedClientes] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClienteId, setEditingClienteId] = useState(null);

  useEffect(() => {
    getClientes();
  }, []);
  const handleDelete = async (clienteId) => {
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
        setSelectedClientes((prevSelected) => ({
          ...prevSelected,
          [clienteId]: false,
        }));

        await deleteCliente(clienteId);
        await Promise.all([getClientes(), getUsersinClientes()]);

        Swal.fire("Eliminado", "Cliente ha sido eliminado.", "success");
      }
    } catch (error) {
      console.error("Error al eliminar Cliente:", error);
      let errorMessage = "Hubo un problema al eliminar Cliente.";
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

  const handleDeleteSelected = async () => {
    try {
      const selectedClienteIds = Object.keys(selectedClientes).filter(
        (clienteId) => selectedClientes[clienteId]
      );

      if (selectedClienteIds.length === 0) {
        Swal.fire(
          "Selecciona Clientes",
          "Por favor, selecciona Clientes para eliminar.",
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
        for (const clienteId of selectedClienteIds) {
          await deleteCliente(clienteId);
        }

        Swal.fire(
          "Eliminados",
          "Clientes han sido eliminados.",
          "success"
        );
        getClientes();
        setSelectedClientes({}); // Limpiar la lista de productos seleccionados
      }
    } catch (error) {
      console.error("Error al eliminar Clientes:", error);
      let errorMessage = "Hubo un problema al eliminar Clientes.";
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
  const handleCheckboxChange = (clienteId) => {
    setSelectedClientes((prevSelected) => {
      return {
        ...prevSelected,
        [clienteId]: !prevSelected[clienteId],
      };
    });
  };
  const toggleModal = async ( clienteId) => {
    if(clienteId ===null){
    setEditingClienteId(null); 

    }else{setEditingClienteId(clienteId)}
   
    
    setIsModalOpen(!isModalOpen);
  };
  const closeModal = async() => {
    console.log("cerrando modal")
    setIsModalOpen(false);
    setEditingClienteId(null);
    // reset()
    
  };

  return (
    <>
      <div className="shopping-cart section">
        <div className="container">
          <br></br>
          <div className="row">
            <div class="col-md-6  text-start">
              <h1 class=" text-success fs-2">Lista de Clientes</h1>
            </div>
            <div class="col-md-6 d-flex align-items-center justify-content-end">
              <button
                className="btn btn-danger  px-3"
                onClick={handleDeleteSelected}
                disabled={!Object.values(selectedClientes).some((value) => value)}
              >
                Borrar
              </button>
              <button onClick={()=>toggleModal(null)} class="btn btn-success btn-lg px-3">
                Crear Cliente
              </button>
            </div>
            <br></br>
            <br></br>

            <div className="col-12">
              <table className="table shopping-summery">
                <thead>
                  <tr className="main-hading">
                    <th className="text-start">Cliente</th>
                    <th className="text-start">Apellido</th>
                    <th className="text-start">Telefono</th>
                    <th className="text-start">Dni</th>
                    <th className="text-start">Accion</th>
                    <th className="text-start">Seleccionar</th>
                  </tr>
                </thead>
                <tbody>
                {clientes && Array.isArray(clientes) && clientes.map((cliente)=> (
                    <tr key={cliente._id}>
                      <td>{cliente.nombre}</td>
                      <td>{cliente.apellido}</td>
                      <td>{cliente.telefono}</td>
                      <td>{cliente.dni}</td>
                      <td>
                        <a onClick={() => toggleModal(cliente._id)} className=" pe-4">
                          <i class="fa-sharp fa-solid fa-pen-to-square"></i>
                        </a>
                        <a onClick={() => handleDelete(cliente._id)}>
                          <i className="fa-sharp fa-solid fa-trash"></i>
                        </a>
                      </td>
                      <td>
                        <div className="checkProduct">
                          <div className="checkbox">
                            <label
                              className={`checkbox-inline ${
                                selectedClientes[cliente._id] ? "checked" : ""
                              }`}
                              htmlFor={`checkbox-${cliente._id}`}
                            >
                              {" "}
                              <input
                                type="checkbox"
                                onChange={() =>
                                  handleCheckboxChange(cliente._id)
                                }
                                checked={selectedClientes[cliente._id] || false}
                                id={`checkbox-${cliente._id}`}
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

      <ModalCliente isOpen={isModalOpen} closeModal={closeModal} clienteId={editingClienteId} />
    </>
  );
}
