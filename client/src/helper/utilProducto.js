// util.js
import Swal from "sweetalert2";

export const handleProductOperation = async (
  operation,
  params,
  data,
  getProducts,
  closeModal,
  reset
) => {
  try {
    const response = params
      ? await operation(params, data)
      : await operation(data);
    if (response.error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Hubo un problema al ${params ? "actualizar" : "crear"}`,
      });
    } else {
      // reset();
      getProducts();
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: `Producto ${params ? "actualizado" : "creado"} exitosamente`,
      });
    }

    closeModal();
  } catch (e) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Hubo un problema al guardar",
    });
  }
};
