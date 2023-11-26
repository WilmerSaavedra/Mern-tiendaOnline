import Product from "../models/Producto.js";
import { uploadImage, deleteImage } from "../libs/cloudinary.js";
import fs from "fs-extra";
export const darLikeAProducto = async (productoId, usuarioId, userIP) => {
  try {
    const producto = await Producto.findById(productoId);
    if (
      !producto.usuariosQueDieronLike.some((user) =>
        user.usuario.equals(usuarioId)
      )
    ) {
      producto.usuariosQueDieronLike.push({ usuario: usuarioId });
    }

    const tiempoLimite = new Date(Date.now() - 24 * 60 * 60 * 1000); // Ejemplo: 24 horas
    if (
      !producto.likesPorIP.some(
        (like) => like.ip === userIP && like.fecha > tiempoLimite
      )
    ) {
      producto.likesPorIP.push({ ip: userIP });
    }

    await producto.save();

    return "Like exitoso";
  } catch (error) {
    console.error(error);
    throw new Error("Error al dar like al producto");
  }
};
export const calcularRatingPorLikes = async (productoId) => {
  try {
    const producto = await Producto.findById(productoId);

    if (!producto) {
      throw new Error("Producto no encontrado");
    }

    const cantidadLikes = producto.usuariosQueDieronLike.length;

    const rating = Math.min(cantidadLikes / 5, 5);
    return rating;
  } catch (error) {
    console.error(error);
    throw new Error("Error al calcular el rating por likes");
  }
};
export const actualizarLikesYRating = async (productoId, usuarioId, userIP) => {
  try {
    await darLikeAProducto(productoId, usuarioId, userIP);

    const nuevoRating = await calcularRatingPorLikes(productoId);

    await Producto.findByIdAndUpdate(productoId, {
      $set: { rating: nuevoRating },
    });

    return "Like exitoso y rating actualizado";
  } catch (error) {
    console.error(error);
    throw new Error("Error al actualizar likes y rating");
  }
};
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
    const {
      nombre,
      precio,
      stock,
      genero,
      estilo,
      marca,
      tallas,
      color,
      esLanzamiento,
    } = req.body;
    const { imagenPrincipal } = req.files || {};
    console.log("req.body", req.body);
    console.log("req.files ", req.files);

    if (!imagenPrincipal) {
      return res.status(400).json({
        message: "Se requiere una imagen principal para crear el producto.",
      });
    }

    const customFileName = `${nombre.replace(/\s+/g, "_")}_${Date.now()}`;
    
    const uploadResultPromise = uploadImage(
      imagenPrincipal.tempFilePath,
      customFileName
    );
    const result = await uploadResultPromise;
    await fs.remove(imagenPrincipal.tempFilePath);

    if (!result || !result.secure_url || !result.public_id) {
      return res
        .status(500)
        .json({ message: "No se pudo cargar la imagen principal." });
    }

    const newProduct = new Product({
      nombre,
      precio: Number(precio),
      stock: Number(stock),
      genero,
      estilo,
      marca,
      tallas,
      color,
      esLanzamiento,
      image: {
        principal: { url: result.secure_url, public_id: result.public_id },
      },
    });
    console.log("newProduct", newProduct);
    await newProduct.save();

    res.json(newProduct);
  } catch (error) {
    return res.status(500).json({ message: "Error interno en el servidor." });
  }
};
export const updateProduct = async (req, res) => {
  try {
    const {
      nombre,
      precio,
      stock,
      genero,
      estilo,
      marca,
      tallas,
      color,
      esLanzamiento,
      imagenPrincipal: img,
    } = req.body;
    const { imagenPrincipal } = req.files || {};
    const productId = req.params.id;
console.log("img",img)
console.log("imagenPrincipal",imagenPrincipal)
console.log("req.body",req.body)
console.log("req.files",req.files)

    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      return res
        .status(404)
        .json({ message: "El producto no fue encontrado." });
    }

    let newImageInfo;

    if (imagenPrincipal?.tempFilePath) {
      const { tempFilePath } = imagenPrincipal;
      const customFileName = `${nombre.replace(/\s+/g, "_")}_${Date.now()}`;
      const result = await uploadImage(tempFilePath, customFileName);

      if (!result || !result.secure_url || !result.public_id) {
        return res
          .status(500)
          .json({ message: "No se pudo cargar la nueva imagen principal." });
      }

      if (existingProduct.imagePrincipal?.public_id) {
        await deleteImage(existingProduct.imagePrincipal.public_id);
      }

      newImageInfo = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    } else if (img?.url && img.public_id) {
      newImageInfo = {
        url: img.url,
        public_id: img.public_id,
      };
    }

    if (nombre) {
      existingProduct.nombre = nombre;
    }

    if (precio) existingProduct.precio = Number(precio);
    if (stock) existingProduct.stock = Number(stock);
    if (genero) existingProduct.genero = genero;
    if (estilo) existingProduct.estilo = estilo;
    if (marca) existingProduct.marca = marca;
    if (tallas) existingProduct.tallas = tallas;
    if (color) existingProduct.color = color;
    if (esLanzamiento !== undefined)
      existingProduct.esLanzamiento = esLanzamiento;

    if (newImageInfo) {
      existingProduct.image.principal = newImageInfo;
    }

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

    if (product.imagePrincipal?.public_id) {
      await deleteImage(product.imagePrincipal.public_id);
    }

    await Product.findByIdAndDelete(productId);

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
