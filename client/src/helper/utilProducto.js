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
    console.log(
      params
        ? `Editando el producto con ID: ${params.id}`
        : "Creando un nuevo producto"
    );

    console.log("operation", operation);
    console.log("data handleProductOperation", data);

    const response = params
      ? await operation(params, data)
      : await operation(data);
    console.log("res", response);
    if (response.error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Hubo un problema al ${
          params ? "actualizar" : "crear"
        } el producto`,
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
    console.log(e);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Hubo un problema al guardar el producto",
    });
  }
};
