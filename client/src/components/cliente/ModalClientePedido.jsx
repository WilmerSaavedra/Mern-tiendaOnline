import { NavLink } from "react-router-dom";
import { useClientes } from "../../context/clienteContext";
import { useCarrito } from "../../context/carritoContext";
import { obtenerCantidadTotalEnCarrito } from "../../reducers/utilCarritoReducer";
import { ButtonLink, Card } from "../ui";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modals } from "../ui/Modals";
import { Input, Button, Textarea, Message, Select } from "../ui";
import { useForm } from "react-hook-form";

export function ModalClientePedido({ isOpen, closeModal, onClienteSeleccionado }) {
  const { clientes, getClientes, getClienteBuscar } = useClientes();
  const [selectedClientes, setSelectedClientes] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors: formErrors },
    reset,
  } = useForm({
    // resolver: zodResolver(clienteschema),
    shouldUnregister: false,
  });

  useEffect(() => {
    getClientes();
    setSearchResults(clientes);
    console.log("ModalCliebtePedido>>>>>>>>>>< ", clientes);
  }, [searchResults]);

  const clickAgregar = (event) => {
    event.preventDefault();

    // Filter out only the selected clientes
    const selectedclienteIids = Object.keys(selectedClientes).filter(
      (clienteIid) => selectedClientes[clienteIid]
    );

    // Loop through selected clientes and add them to the cart
    selectedclienteIids.forEach((clienteIid) => {
      const product = clientes.find((item) => item._id === clienteIid);
    });

    setSelectedClientes({});
  };

 

  const onSubmit = async (data) => {
    try {
      // Realiza la búsqueda con el valor del campo de entrada
      console.log("data>>>>>>>>>>>>>>>", data);
      const resultados = await getClienteBuscar(data.nombre);
      setSearchResults(resultados.clientes);
      // Muestra los resultados en la consola o actualiza el estado del componente
      console.log("Resultados de la búsqueda:", resultados);
    } catch (error) {
      console.error("Error al buscar productos:", error);
    }
  };
  const handleCheckboxChange = (clienteIid) => {
    setSelectedClientes((prevSelected) => ({
      ...prevSelected,
      [clienteIid]: !prevSelected[clienteIid],
    }));
  
    const selectedCliente = clientes.find((cliente) => cliente._id === clienteIid);
  
    if (selectedCliente && !selectedClientes[clienteIid]) {
      onClienteSeleccionado(selectedCliente);
      closeModal()
    }
  };
  
  const handleCloseModal = () => {
    const selectedClienteId = Object.keys(selectedClientes).find(
      (clienteIid) => selectedClientes[clienteIid]
    );
  
    if (selectedClienteId) {
      const selectedCliente = clientes.find((cliente) => cliente._id === selectedClienteId);
  
      if (selectedCliente) {
        onClienteSeleccionado(selectedCliente);
      }
    }
  
    closeModal();
    setSelectedClientes({});
  };
  
  return (
    <Modals isOpen={isOpen} closeModal={handleCloseModal} size="md">
      <div className="container">
        <div className="row">
          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <div className="col-md-12 mt-4 d-flex justify-content-between my-2">
              {/* <h2>{modalTitle}</h2> */}
              <br></br>
              <Input
                type="text"
                name="nombre"
                label="Cliente"
                {...register("nombre")}
                autoFocus
              />
              {/* {formErrors.nombre && (
                <Message message={formErrors.nombre.message} />
              )} */}

              <Button className="mx-4">Buscar</Button>
            </div>
          </form>
        </div>
        <div className="row">
          <div className="col-12">
            <table className="table-sm shopping-summery">
              <thead>
                <tr className="main-hading">
                  <th className="text-start">Cliente</th>
                  <th className="text-start">Teléfono</th>
                  <th className="text-start">DNI</th>
                  <th className="text-start">Seleccionar</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(searchResults) && searchResults.length > 0 ? (
                  searchResults.map((cliente) => (
                    <tr key={cliente._id}>
                      <td>{`${cliente.nombre} ${cliente.apellido}`}</td>
                      <td>{cliente.telefono}</td>
                      <td>{cliente.dni}</td>
                      <td>
                        <div className="checkProduct">
                          <div className="checkbox">
                            <label
                              className={`checkbox-inline ${
                                selectedClientes[cliente._id] ? "checked" : ""
                              }`}
                              htmlFor={`checkbox-${cliente._id}`}
                            >
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No se encontraron resultados</td>
                  </tr>
                )}
              </tbody>
            </table>
            {/*  */}
          </div>
         
        </div>
      </div>
    </Modals>
  );
}
