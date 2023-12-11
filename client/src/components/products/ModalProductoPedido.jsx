import { NavLink } from "react-router-dom";
import { useProducts } from "../../context/productContext";
import { useCarrito } from "../../context/carritoContext";
import { obtenerCantidadTotalEnCarrito } from "../../reducers/utilCarritoReducer";
import { ButtonLink, Card } from "../ui";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modals } from "../ui/Modals";
import { Input, Button, Textarea, Message, Select } from "../ui";
import { useForm } from "react-hook-form";

export function ModalProductoPedido({ isOpen, closeModal }) {
  const { products, getProducts,getProductBuscar } = useProducts();
  const [selectedProducts, setSelectedProducts] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [productId, setProductId] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors: formErrors },
    reset,
  } = useForm({
    // resolver: zodResolver(productSchema),
    shouldUnregister: false,
  });
  // const [imageLoaded, setImageLoaded] = useState(false);
  const { agregarCompra, listaCarrito, actualizarCarrito } = useCarrito();
  useEffect(() => {
    getProducts();
    setSearchResults(products)
    console.log("ModalProductoPedido>>>>>>>>>>< ", products);
  }, []);
 

  const handleCheckboxChange = (productId) => {
    setProductId(productId);
    setSelectedProducts((prevSelected) => {
      const newSelected = { ...prevSelected };
      newSelected[productId] = !newSelected[productId];
      return newSelected;
    });
  };
  useEffect(() => {
    // Coloca aquí la lógica que estaba causando el error
    const selectedProduct = products.find((product) => product._id === productId);
    if (selectedProducts[productId]) {
      agregarCompra({ ...selectedProduct });
    } else {
      const nuevoCarrito = listaCarrito.filter((item) => item._id !== productId);
      actualizarCarrito(nuevoCarrito);
    }
  }, [selectedProducts, productId]);
  const onSubmit = async (data) => {
    try {
      // Realiza la búsqueda con el valor del campo de entrada
      console.log("data>>>>>>>>>>>>>>>",data)
      const resultados = await getProductBuscar(data.nombre);
      setSearchResults(resultados.productos);
      // Muestra los resultados en la consola o actualiza el estado del componente
      console.log('Resultados de la búsqueda:', resultados);
    } catch (error) {
      console.error('Error al buscar productos:', error);
    }
  };

  
  return (
    <Modals isOpen={isOpen} closeModal={closeModal} size="md">
      <div className="container">
        <div className="row">
          <form
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
          >
            <div className="col-md-12 mt-4 d-flex justify-content-between my-2">
              {/* <h2>{modalTitle}</h2> */}
              <br></br>
              <Input
                type="text"
                name="nombre"
                label="Producto"
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
     
            <table className="table shopping-summery">
              <thead>
                <tr className="main-hading">
                  <th className="text-start">Producto</th>
                  <th className="text-start">Precio</th>
                  <th className="text-start">Agregar</th>

                </tr>
              </thead>
              <tbody>
              {Array.isArray(searchResults) && searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <tr key={product._id}>
                    <td>{product.nombre}</td>
                    <td>{product.precio}</td>

                    <td>
                    <div className="checkProduct">
                          <div className="checkbox">
                            <label
                              className={`checkbox-inline ${
                                selectedProducts[product._id] ? "checked" : ""
                              }`}
                              htmlFor={`checkbox-${product._id}`}
                            >
                              <input
                                type="checkbox"
                                onChange={(e) =>
                                  handleCheckboxChange(product._id)
                                }
                                checked={selectedProducts[product._id] || false}
                                id={`checkbox-${product._id}`}
                              />
                            </label>
                          </div>
                        </div>
                     
                    </td>
                  </tr>
                )) ) : (
    <tr>
      <td colSpan="3">No se encontraron resultados</td>
    </tr>
  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modals>
  );
}
