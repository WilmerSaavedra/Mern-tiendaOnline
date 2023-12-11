import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Swal from "sweetalert2";
import { useForm, useWatch } from "react-hook-form";
import { useMarcas } from "../context/marcaContext";
import { ModalMarca } from "../components/marca/ModalMarca";
import { Alert } from "react-bootstrap";

dayjs.extend(utc);

export function MarcaForm({ isOpen }) {
  const { reset } = useForm();
  const {
    createMarca,
    getMarcaId,
    getMarcas,
    updateMarca,
    deleteMarca,
    marcas,
    errors: registerErrors,
  } = useMarcas();

  const [selectedMarcas, setSelectedMarcas] = useState({});
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMarcaId, setEditingMarcaId] = useState(null);

  useEffect(() => {
    getMarcas();
  }, []);
  const handleDelete = async (marcaId) => {
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
        setSelectedMarcas((prevSelected) => ({
          ...prevSelected,
          [marcaId]: false,
        }));

        await deleteMarca(marcaId);

        Swal.fire("Eliminado", "Marca ha sido eliminado.", "success");
        getMarcas();
      }
    } catch (error) {
      console.error("Error al eliminar Marca:", error);
      let errorMessage = "Hubo un problema al eliminar marca.";
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
      const selectedMarcaIds = Object.keys(selectedMarcas).filter(
        (marcaId) => selectedMarcas[marcaId]
      );

      if (selectedMarcaIds.length === 0) {
        Swal.fire(
          "Selecciona Marcas",
          "Por favor, selecciona Marcas para eliminar.",
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
        for (const marcaId of selectedMarcaIds) {
          await deleteMarca(marcaId);
        }

        Swal.fire(
          "Eliminados",
          "Marcas han sido eliminados.",
          "success"
        );
        getMarcas();
        setSelectedMarcas({}); // Limpiar la lista de productos seleccionados
      }
    } catch (error) {
      console.error("Error al eliminar marcas:", error);
      let errorMessage = "Hubo un problema al eliminar marcas.";
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
  const handleCheckboxChange = (marcaIid) => {
    setSelectedMarcas((prevSelected) => {
      return {
        ...prevSelected,
        [marcaIid]: !prevSelected[marcaIid],
      };
    });
  };
  const toggleModal = (productId) => {
    if(productId ===null){
    setEditingMarcaId(null); 

    }else{setEditingMarcaId(productId)}
    
    setIsModalOpen(!isModalOpen);
  };
  const closeModal = () => {
    console.log("cerrando modal")
    setIsModalOpen(false);
    setEditingMarcaId(null);
    // reset()
    
  };

  return (
    <>
      <div className="shopping-cart section">
        <div className="container">
          <br></br>
          <div className="row">
            <div class="col-md-6  text-start">
              <h1 class=" text-success fs-2">Lista de Marcas</h1>
            </div>
            <div class="col-md-6 d-flex align-items-center justify-content-end">
              <button
                className="btn btn-danger  px-3"
                onClick={handleDeleteSelected}
                disabled={!Object.values(selectedMarcas).some((value) => value)}
              >
                Borrar
              </button>
              <button onClick={()=>toggleModal(null)} class="btn btn-success btn-lg px-3">
                Crear Marca
              </button>
            </div>
            <br></br>
            <br></br>

            <div className="col-12">
              <table className="table shopping-summery">
                <thead>
                  <tr className="main-hading">
                    <th className="text-start">Marca</th>
                    <th className="text-start">Accion</th>
                    <th className="text-start">Seleccionar</th>
                  </tr>
                </thead>
                <tbody>
                  {marcas.map((marca) => (
                    <tr key={marca._id}>
                      <td>{marca.nombre}</td>

                      <td>
                        <a onClick={() => toggleModal(marca._id)} className=" pe-4">
                          <i class="fa-sharp fa-solid fa-pen-to-square"></i>
                        </a>
                        <a onClick={() => handleDelete(marca._id)}>
                          <i className="fa-sharp fa-solid fa-trash"></i>
                        </a>
                      </td>
                      <td>
                        <div className="checkProduct">
                          <div className="checkbox">
                            <label
                              className={`checkbox-inline ${
                                selectedMarcas[marca._id] ? "checked" : ""
                              }`}
                              htmlFor={`checkbox-${marca._id}`}
                            >
                              {" "}
                              <input
                                type="checkbox"
                                onChange={() =>
                                  handleCheckboxChange(marca._id)
                                }
                                checked={selectedMarcas[marca._id] || false}
                                id={`checkbox-${marca._id}`}
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

      <ModalMarca isOpen={isModalOpen} closeModal={closeModal} marcaId={editingMarcaId} />
    </>
  );
}
