import React, { useEffect, useState,useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Swal from "sweetalert2";
import { useForm, useWatch } from "react-hook-form";
import { useProducts } from "../context/productContext";
import { ModalProducto } from "../components/products/ModalProducto";
import { Alert } from "react-bootstrap";
import {toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
dayjs.extend(utc);

export function ProductForm({ isOpen }) {
  const { reset } = useForm();
  const {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    products,
    errors: registerErrors,
  } = useProducts();

  const [selectedProducts, setSelectedProducts] = useState({});
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    getProducts();
  }, []);
  const handleDelete = async (productId) => {
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
        setSelectedProducts((prevSelected) => ({
          ...prevSelected,
          [productId]: false,
        }));

        await deleteProduct(productId);

        Swal.fire("Eliminado", "El producto ha sido eliminado.", "success");
        getProducts();
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      let errorMessage = "Hubo un problema al eliminar el producto.";
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
      const selectedProductIds = Object.keys(selectedProducts).filter(
        (productId) => selectedProducts[productId]
      );

      if (selectedProductIds.length === 0) {
        Swal.fire(
          "Selecciona productos",
          "Por favor, selecciona productos para eliminar.",
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
        for (const productId of selectedProductIds) {
          await deleteProduct(productId);
        }

        Swal.fire(
          "Eliminados",
          "Los productos han sido eliminados.",
          "success"
        );
        getProducts();
        setSelectedProducts({}); // Limpiar la lista de productos seleccionados
      }
    } catch (error) {
      console.error("Error al eliminar los productos:", error);
      let errorMessage = "Hubo un problema al eliminar los productos.";
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
  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prevSelected) => {
      return {
        ...prevSelected,
        [productId]: !prevSelected[productId],
      };
    });
  };
  const toggleModal = (productId) => {
    if(productId ===null){
    setEditingProductId(null); 

    }else{setEditingProductId(productId)}
    
    setIsModalOpen(!isModalOpen);
  };
  const closeModal = () => {
    console.log("cerrando modal")
    setIsModalOpen(false);
    setEditingProductId(null);
    // reset()
    
  };
  const notificationShownRef = useRef(false);

  const showNotification = () => {
    toast.error("¡El stock está vacío!", { position: "top-center" });
    notificationShownRef.current = true;
  };

  useEffect(() => {
    if (products.some(product => product.stock === 0) && !notificationShownRef.current) {
      showNotification();
    }
  }, [products]);
  return (
    <>
      <div className="shopping-cart section">
        <div className="container">
          <br></br>
          <div className="row">
            <div class="col-md-6  text-start">
              <h1 class=" text-success fs-2">Lista de Productos</h1>
            </div>
            <div class="col-md-6 d-flex align-items-center justify-content-end">
              <button
                className="btn btn-danger  px-3"
                onClick={handleDeleteSelected}
                disabled={!Object.values(selectedProducts).some((value) => value)}
              >
                Borrar
              </button>
              <button onClick={()=>toggleModal(null)} class="btn btn-success btn-lg px-3">
                Crear Producto
              </button>
            </div>
            <br></br>
            <br></br>

            <div className="col-12">
              <table className="table shopping-summery">
                <thead>
                  <tr className="main-hading">
                    <th className="text-start">Producto</th>
                    <th className="text-start">Stock</th>
                    <th className="text-start"> Imagen</th>
                    <th className="text-start">Precio</th>
                    <th className="text-start">Accion</th>
                    <th className="text-start">Seleccionar</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr style={{ backgroundColor: product.stock === 0 ? "#E87B85" : "" }} key={product._id}>
                      <td>{product.nombre}</td>

                      <td >{product.stock}</td>
                      <td>
                        <img
                          class="rounded-circle"
                          style={{ width: "35px", height: "35px" }}
                          src={product.image.principal.url}
                          alt="#"
                        />
                      </td>

                      <td>{product.precio}</td>

                      <td>
                        <a onClick={() => toggleModal(product._id)} className=" pe-4">
                          <i class="fa-sharp fa-solid fa-pen-to-square"></i>
                        </a>
                        <a onClick={() => handleDelete(product._id)}>
                          <i className="fa-sharp fa-solid fa-trash"></i>
                        </a>
                      </td>
                      <td>
                        <div className="checkProduct">
                          <div className="checkbox">
                            <label
                              className={`checkbox-inline ${
                                selectedProducts[product._id] ? "checked" : ""
                              }`}
                              htmlFor={`checkbox-${product._id}`}
                            >
                              {" "}
                              <input
                                type="checkbox"
                                onChange={() =>
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <ModalProducto isOpen={isModalOpen} closeModal={closeModal} productId={editingProductId} />
      {/* <ToastContainer /> */}
    </>
  );
}
