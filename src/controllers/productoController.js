import Product from "../models/Producto.js";
import { uploadImage, deleteImage } from "../libs/cloudinary.js";
import fs from "fs-extra";
export const likeProduct = async (req, res) => {
  try {
    console.log("en likes product")
    const productId = req.params.idProducto;
    console.log("productId",productId)
    const userId = req.user.id;
// console.log("user",req.user)
// console.log("usersid")
    // Buscar el producto por su ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    // Verificar si el usuario ya ha dado "me gusta" al producto
    if (product.likes.includes(userId)) {
      return res.status(400).json({ message: 'Ya le diste "me gusta" a este producto.' });
    }

    // Agregar el ID del usuario al array de "likes" del producto
    product.likes.push(userId);

    // Calcular la nueva calificación promedio del producto (por ejemplo, usando una función)
    const newRating = calculateNewRating(product);

    // Actualizar la calificación del producto
    product.rating = newRating;

    // Guardar los cambios en el producto
    await product.save();

    return res.json({ message: 'Me gusta agregado con éxito.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error interno en el servidor.' });
  }
};

// Función para calcular la nueva calificación promedio
function calculateNewRating(product) {
  const totalLikes = product.likes.length;
  // Calcula la calificación promedio (por ejemplo, sumando todos los likes y dividiendo por la cantidad)
  const newRating = totalLikes > 0 ? totalLikes / 5 : 0; // Suponiendo una calificación de 0 a 5
  return newRating;
}
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProductId = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Producto no existe" });
    }
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock } = req.body;
    const { image, additionalImages } = req.files || {};

    // Verificar si no se ha cargado una imagen principal
    if (!image) {
      return res.status(400).json({
        message: "Se requiere una imagen principal para crear el producto.",
      });
    }

    // Procesar la imagen principal y obtener su URL
    const customFileName = `${nombre.replace(/\s+/g, "_")}_${Date.now()}`;
    const result = await uploadImage(image.tempFilePath, customFileName);
    await fs.remove(image.tempFilePath);

    if (!result || !result.secure_url || !result.public_id) {
      return res
        .status(500)
        .json({ message: "No se pudo cargar la imagen principal." });
    }

    // Si la imagen principal se cargó correctamente, entonces creamos y guardamos el producto
    const newProduct = new Product({
      nombre,
      descripcion,
      precio,
      stock,
      image: {
        principal: { url: result.secure_url, public_id: result.public_id },
        adicionales: [], // Inicialmente, no hay imágenes adicionales
      },
    });

    if (additionalImages) {
      const additionalImageArray = Array.isArray(additionalImages)
        ? additionalImages
        : [additionalImages];

      const additionalImageUrls = await Promise.all(
        additionalImageArray.map(async (additionalImage,index) => {
          // Generar un nombre personalizado para la imagen adicional
          const additionalCustomFileName = `${nombre.replace(/\s+/g, "_")}_${(index + 1)
            .toString()
            .padStart(2, "0")}${additionalImage.name.slice(-4)}`;
          // const additionalCustomFileName = `${Date.now()}_${
          //   additionalImage.name
          // }`;
          const additionalResult = await uploadImage(
            additionalImage.tempFilePath,
            additionalCustomFileName
          );
          await fs.remove(additionalImage.tempFilePath);

          if (
            !additionalResult ||
            !additionalResult.secure_url ||
            !additionalResult.public_id
          ) {
            return null; // Manejar errores de carga de imágenes adicionales
          }

          return {
            url: additionalResult.secure_url,
            public_id: additionalResult.public_id,
          };
        })
      );

      // Agregar las URLs de las imágenes adicionales al producto
      newProduct.image.adicionales.push(...additionalImageUrls);
    }

    await newProduct.save();

    res.json(newProduct);
  } catch (error) {
    // Manejar otros errores internos
    return res.status(500).json({ message: "Error interno en el servidor." });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock } = req.body;
    const productId = req.params.id;

    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      return res
        .status(404)
        .json({ message: "El producto no fue encontrado." });
    }

    // Verificar si se proporcionó una nueva imagen principal
    if (req.files?.imagenPrincipal?.tempFilePath) {
      const customFileName = `${nombre.replace(/\s+/g, "_")}_${Date.now()}`;
      const result = await uploadImage(
        req.files?.imagenPrincipal?.tempFilePath,
        customFileName
      );

      if (!result || !result.secure_url || !result.public_id) {
        return res
          .status(500)
          .json({ message: "No se pudo cargar la nueva imagen principal." });
      }

      // Elimina la imagen principal anterior en Cloudinary
      if (existingProduct.imagePrincipal?.public_id) {
        await deleteImage(existingProduct.imagePrincipal.public_id);
      }

      // Actualiza la imagen principal en Cloudinary sin eliminar la anterior
      existingProduct.imagePrincipal = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    // Verificar si se proporcionó una nueva imagen adicional
    if (req.files?.imagenAdicional?.tempFilePath) {
      // Verifica si ya existe una imagen adicional
      if (
        existingProduct.imagenesAdicionales &&
        existingProduct.imagenesAdicionales.length > 0
      ) {
        // Obtiene el public_id de la imagen adicional antigua
        const publicIdImagenAntigua =
          existingProduct.imagenesAdicionales[0].public_id;

        // Elimina la imagen adicional antigua en Cloudinary
        await deleteImage(publicIdImagenAntigua);
      }

      // Carga la nueva imagen adicional
      const customFileName = `${nombre.replace(
        /\s+/g,
        "_"
      )}_adicional_${Date.now()}`;
      const result = await uploadImage(
        req.files?.imagenAdicional?.tempFilePath,
        customFileName
      );

      if (!result || !result.secure_url || !result.public_id) {
        return res
          .status(500)
          .json({ message: "No se pudo cargar la nueva imagen adicional." });
      }

      // Actualiza la imagen adicional en la base de datos
      existingProduct.imagenesAdicionales = [
        { url: result.secure_url, public_id: result.public_id },
      ];
    }

    // Actualiza el nombre del producto si se proporciona
    if (nombre) {
      // Genera el nuevo nombre de la imagen principal
      const newImagePrincipalName = `${nombre.replace(
        /\s+/g,
        "_"
      )}_${Date.now()}`;

      if (existingProduct.imagePrincipal?.public_id) {
        // Sube la nueva imagen principal con el nuevo nombre
        const newImagePrincipalResult = await uploadImage(
          existingProduct.imagePrincipal.url,
          newImagePrincipalName
        );

        if (
          newImagePrincipalResult &&
          newImagePrincipalResult.secure_url &&
          newImagePrincipalResult.public_id
        ) {
          // Actualiza la URL de la imagen principal y el public_id en la base de datos
          existingProduct.imagePrincipal = {
            url: newImagePrincipalResult.secure_url,
            public_id: newImagePrincipalResult.public_id,
          };
        }
        await deleteImage(existingProduct.imagePrincipal.public_id);
      }

      // Actualiza el nombre del producto
      existingProduct.nombre = nombre;
    }

    // Actualiza otros campos si se proporcionan
    if (descripcion) existingProduct.descripcion = descripcion;
    if (precio) existingProduct.precio = precio;
    if (stock) existingProduct.stock = stock;

    const updatedProduct = await existingProduct.save();

    return res.json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Elimina la imagen principal en Cloudinary si existe
    if (product.imagePrincipal?.public_id) {
      await deleteImage(product.imagePrincipal.public_id);
    }

    // Elimina las imágenes adicionales en Cloudinary si existen
    if (product.imagenesAdicionales && product.imagenesAdicionales.length > 0) {
      for (const imagenAdicional of product.imagenesAdicionales) {
        if (imagenAdicional.public_id) {
          await deleteImage(imagenAdicional.public_id);
        }
      }
    }

    // Elimina el producto de la base de datos
    await Product.findByIdAndDelete(productId);

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
