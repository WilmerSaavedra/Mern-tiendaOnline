export const obtenerCantidadTotalEnCarrito = (carrito) => {
  return carrito.reduce((total, producto) => total + producto.cantidad, 0);
};
export const calcularTotal = (listaCarrito, envioGratis) => {
  let total = calcularSubTotal(listaCarrito) - calcularDescuento(listaCarrito);
  if (envioGratis) {
    total += 10;
  }
  return total.toFixed(2);
};
export const calcularSubTotal = (listaCarrito) => {
  if (Array.isArray(listaCarrito)) {
    return listaCarrito
      .reduce((total, item) => total + item.cantidad * item.precio, 0)
      .toFixed(2);
  } else {
    return "0.00";
  }
};
export const calcularDescuento = (listaCarrito) => {
  const descuento = 10;
  const cantidad = listaCarrito.reduce((cant, item) => cant + item.cantidad, 0);

  if (cantidad > 2) {
    return ((calcularSubTotal(listaCarrito) * descuento) / 100).toFixed(2);
  }

  return "0.00";
};
export const updateSessionStorage = (nuevoCarrito) => {
  sessionStorage.setItem("listaCarrito", JSON.stringify(nuevoCarrito));
};