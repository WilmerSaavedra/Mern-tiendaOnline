import Producto from "../models/Producto.js";

export const validarStock = async (ordenItems) => {
    try {
      for (const item of ordenItems) {
        const product = await Producto.findById(item.producto);
        if (!product || product.stock < item.cantidad) {
          const productName = product ? product.nombre : "Producto no encontrado";
          const errorMessage = `No hay suficiente stock para, ${productName}". Stock disponible: ${
            product ? product.stock : 0
          }, Cantidad solicitada: ${item.cantidad}`;
          return {
            success: false,
            errorDetails: errorMessage,
            productName,
          };
        }
      }
      return { success: true }; // Suficiente stock disponible
    } catch (error) {
      console.error(
        "Error al verificar la disponibilidad de stock:",
        error.message
      );
      return { success: false, errorDetails: error.message };
    }
  };