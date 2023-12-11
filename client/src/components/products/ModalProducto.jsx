import React, { useState, useEffect, useRef } from "react";
import { Modals } from "../ui/Modals";
import { Input, Button, Textarea, Message, Select } from "../ui";
import { useProducts } from "../../context/productContext";
import { useMarcas } from "../../context/marcaContext";

import { useForm } from "react-hook-form";
import { productSchema } from "../../schemas/product";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { handleProductOperation } from "../../helper/utilProducto";

export function ModalProducto({ isOpen, closeModal, productId }) {
  const {
    getProducts,
    createProduct,
    updateProduct,
    getProduct,
    errors: productErrors,
  } = useProducts();
  const { getMarcas, marcas } = useMarcas();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors: formErrors },
    reset,
  } = useForm({
    resolver: zodResolver(productSchema),
    shouldUnregister: false,
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const inputRef = useRef();

  const handleEditImage = () => {
    setImageInputVisible(true);
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const [modalTitle, setModalTitle] = useState("Crear Producto");

  useEffect(() => {
    getMarcas();
  }, []);

  useEffect(() => {
    if (productId !== null) {
      reset();
    }
  }, [productId, reset]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (productId !== null) {
          setModalTitle("Editar Producto");
          const productInfo = await getProduct(productId);
          console.log("productInfo>>>>>>", productInfo);
          setValue("nombre", productInfo.nombre);
          setValue("precio", String(productInfo.precio));
          setValue("stock", String(productInfo.stock));
          setValue("genero", productInfo.genero);
          setValue("estilo", productInfo.estilo);
          setValue("marca", productInfo.marca.nombre);
          setValue("tallas", productInfo.tallas);
          setValue("color", productInfo.color);
          setValue("esLanzamiento", productInfo.esLanzamiento);
          setValue("imagenPrincipal", productInfo.image.principal.url);
          setSelectedImage(productInfo.image.principal.url);
        }else {
          setModalTitle("Crear Producto");
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (!productId) {
      reset();
    }
    fetchData();
  }, [getProduct, productId, setValue, watch]);
  const handleChange = (e) => {
    console.log("handleChange");
    if (e.target.name === "imagenPrincipalEdit") {
      const selectedFile = e.target.files[0];
      console.log("imagenPrincipal", selectedFile);
      setValue("imagenPrincipal", selectedFile);
      if (selectedFile) {
        const imageUrl = URL.createObjectURL(selectedFile);
        setSelectedImage(imageUrl);
      } else {
        setSelectedImage(null);
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      const ndata = watch();
      // data.precio = Number(data.precio);
      // data.stock = Number(data.stock);
      console.log("getValues", getValues());
      console.log("data", ndata);

      const updatedData = { ...ndata };

      if (productId && !data.imagenPrincipal) {
        // Modo de edición sin cambiar la imagen
        delete updatedData.imagenPrincipal;
      }
      if (productId) {
        await handleProductOperation(
          updateProduct,
          productId,
          updatedData,
          getProducts,
          closeModal,
          reset
        );
      } else {
        await handleProductOperation(
          createProduct,
          null,
          updatedData,
          getProducts,
          closeModal,
          reset
        );
      }
    } catch (error) {
      console.error(error);

      const errorMessage =
        error.response && error.response.status === 400
          ? "Hubo un problema con los datos proporcionados."
          : "Hubo un problema al guardar el producto";

      Swal.fire({
        icon: "error",
        title: error.response ? "Error de Validación" : "Error",
        text: errorMessage,
      });
    }
  };

  return (
    <Modals isOpen={isOpen} closeModal={closeModal} size="md">
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="col-md-12 mt-4">
            <h2>{modalTitle}</h2>
            <br></br>
            <Input
              type="text"
              name="nombre"
              label="Nombre"
              {...register("nombre")}
              autoFocus
            />
            {formErrors.nombre && (
              <Message message={formErrors.nombre.message} />
            )}
          </div>

          <div className="col-md-12 mt-4">
            <label htmlFor="genero">Género</label>
            <Select
              className="form-select"
              id="genero"
              name="genero"
              {...register("genero")}
            >
              <option value="">Seleccione Género</option>
              <option value="hombre">Hombre</option>
              <option value="mujer">Mujer</option>
              <option value="unisex">Unisex</option>
            </Select>
            {formErrors.genero && (
              <Message message={formErrors.genero.message} />
            )}
          </div>
          <div className="row">
            <div className="col-md-6 mt-4">
              <label htmlFor="estilo">Estilo</label>
              <Select
                className="form-select"
                id="estilo"
                name="estilo"
                {...register("estilo")}
              >
                <option value="">Seleccione Estilo</option>
                <option value="urbano">Urbano</option>
                <option value="deportivo">Deportivo</option>
                <option value="escolar">Escolar</option>
              </Select>
              {formErrors.estilo && (
                <Message message={formErrors.estilo.message} />
              )}
            </div>

            <div className="col-md-6 mt-4">
              <label htmlFor="marca">Marca</label>
              <Select
                className="form-select"
                id="marca"
                name="marca"
                {...register("marca")}
              >
                <option value="">Seleccione Marca</option>
                {marcas.map((marca) => (
                  <option key={marca._id} value={marca.nombre}>
                    {marca.nombre}
                  </option>
                ))}
              </Select>
              {formErrors.marca && (
                <Message message={formErrors.marca.message} />
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mt-4">
              <label htmlFor="color">Color</label>
              <Select
                className="form-select"
                id="color"
                name="color"
                {...register("color")}
              >
                <option value="">Seleccione Color</option>
                <option value="negro">negro</option>
                <option value="blanco">blanco</option>
                <option value="azul">azul</option>
              </Select>
              {formErrors.color && (
                <Message message={formErrors.color.message} />
              )}
            </div>
            <div className="col-md-6 mt-4">
              <label htmlFor="talla">Talla</label>
              <Select
                className="form-select"
                id="talla"
                name="tallas"
                {...register("tallas")}
              >
                <option value="">Seleccione Talla</option>
                <option value="39">39</option>
                <option value="40">40</option>
                <option value="41">41</option>
              </Select>
              {formErrors.tallas && (
                <Message message={formErrors.tallas.message} />
              )}
            </div>
          </div>
          <div className="col-md-12 mt-4">
            <Input
              type="number"
              name="precio"
              label="Precio"
              {...register("precio")}
            />
            {formErrors.precio && (
              <Message message={formErrors.precio.message} />
            )}
          </div>

          <div className="col-md-12 mt-4">
            <Input
              type="number"
              name="stock"
              label="Stock"
              {...register("stock")}
            />
            {formErrors.stock && <Message message={formErrors.stock.message} />}
          </div>

          <div className="col-md-12 mt-4">
            {productId ? (
              // Para la edición
              <>
                {selectedImage && (
                  <div className="md-image">
                    <img
                      src={selectedImage}
                      alt="Imagen seleccionada"
                      className="img-fluid"
                      style={{ maxHeight: "200px" }}
                    />
                  </div>
                )}
                <input
                  type="file"
                  name="imagenPrincipalEdit"
                  accept="image/*"
                  onChange={handleChange}
                />
              </>
            ) : (
              // Para la creación
              <input
                id={`imagenPrincipalInput-${Date.now()}`}
                type="file"
                name="imagenPrincipal"
                accept="image/*"
                {...register("imagenPrincipal")}
              />
            )}
          </div>
          {formErrors.imagenPrincipal && (
            <Message message={formErrors.imagenPrincipal.message} />
          )}
          <Button className="col-md-12 mt-4">Guardar</Button>
        </form>
      </div>
    </Modals>
  );
}
