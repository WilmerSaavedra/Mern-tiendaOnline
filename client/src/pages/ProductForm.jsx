import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Button, Card, Input, Label } from "../components/ui";
import { useProducts } from "../context/productContext";
import { Textarea } from "../components/ui/Textarea";
import { useForm } from "react-hook-form";
import { productSchema } from "../schemas/product";
import { zodResolver } from "@hookform/resolvers/zod";

dayjs.extend(utc);

export function ProductForm() {
  const {
    createProduct,
    getProduct,
    updateProduct,
    errors: registerErrors,
  } = useProducts();
  const navigate = useNavigate();
  const params = useParams();

  const {
    register,
    setValue,
    handleSubmit,
    setFieldValue,

    formState: { errors },
  } = useForm({ resolver: zodResolver(productSchema) });
  // Agrega un estado local para la imagen
  const [image, setSelectedImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const onSubmit = async (data) => {
    try {
      if (!image) {
        console.log("No se seleccionó una imagen");
        return;
      }
      if (!additionalImages) {
        console.log("No se seleccionó una imagen");
        return;
      }
      const updatedData = {
        ...data,
        image,
        additionalImages,
      };
      if (params.id) {
        await updateProduct(params.id, {
          ...data,
        });
      } else {
        await createProduct(updatedData);
        console.log("data submit ", updatedData);
      }

      navigate("/product");
    } catch (error) {
      console.log(error);
      // Handle error appropriately
    }
  };
  const handleChange = (e) => {
    if (e.target.name === "image") {
      setSelectedImage(e.target.files[0]);
    } else if (e.target.name === "additionalImages") {
      setAdditionalImages([...e.target.files]);
    }
  };
  useEffect(() => {
    const loadProduct = async () => {
      if (params.id) {
        console.log("en load product ", product);
        const product = await getProduct(params.id);
        setValue("nombre", product.nombre);
        setValue("descripcion", product.descripcion);
        setValue("precio", product.precio.toString());
        setValue("stock", product.stock.toString());
        // Cargar la imagen principal
        if (product.image && product.image.principal) {
          // Establecer la imagen principal en el estado local (mainImage)
          setSelectedImage(product.image.principal.url);
          // Puedes mostrar la imagen en un componente de vista previa si es necesario
          // setPreviewMainImage(product.image.principal.url);
        }

        // Cargar las imágenes adicionales
        if (product.image && product.image.adicionales) {
          // Crear un array de URLs de imágenes adicionales
          const additionalImagesUrls = product.image.adicionales.map(
            (img) => img.url
          );
          // Establecer las imágenes adicionales en el estado local (additionalImages)
          setAdditionalImages(additionalImagesUrls);
       
        }
      }
    };
    loadProduct();
  }, [params.id]);
  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Label htmlFor="nombre">Nombre</Label>
        <Input
          type="text"
          name="nombre"
          placeholder="Nombre"
          {...register("nombre")}
          autoFocus
        />
        {errors.nombre?.message && (
          <p className="text-red-500 text-xs italic">
            {errors.nombre?.message}
          </p>
        )}

        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          name="descripcion"
          placeholder="Descripción"
          {...register("descripcion")}
        />
        {errors.descripcion?.message && (
          <p className="text-red-500">{errors.descripcion?.message}</p>
        )}

        <Label htmlFor="precio">Precio</Label>
        <Input
          type="text"
          name="precio"
          placeholder="Precio"
          {...register("precio")}
        />
        {errors.precio?.message && (
          <p className="text-red-500">{errors.precio?.message}</p>
        )}

        <Label htmlFor="stock">Stock</Label>
        <Input
          type="text"
          name="stock"
          placeholder="Stock"
          {...register("stock")}
        />
        {errors.stock?.message && (
          <p className="text-red-500">{errors.stock?.message}</p>
        )}

        <Label htmlFor="image">Imagen</Label>
        <Input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />
        {errors.image?.message && (
          <p className="text-red-500">{errors.image.message}</p>
        )}
        <Label htmlFor="additionalImages">Imágenes adicionales</Label>
        <Input
          type="file"
          name="additionalImages"
          accept="image/*"
          multiple
          onChange={handleChange}
        />
        <Button>Guardar</Button>
      </form>
    </Card>
  );
}
