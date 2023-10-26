export const initialState = [];

export const carritoReducer = (state = initialState, action) => {
  switch (action.type) {
    case "[Carrito] agregar Compra":
      const productoExistente = state.find(item => item._id === action.payload._id);
      if (productoExistente) {
        return state.map(item =>
          item._id === action.payload._id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      } else {
        return [...state, { ...action.payload, cantidad: 1 }];
      }

    case "[Carrito] eliminar Compra":
      return state.filter(compra => compra._id !== action.payload);

    case "[Carrito] aumentar Compra":
      return state.map(item =>
        item._id === action.payload ? { ...item, cantidad: item.cantidad + 1 } : item
      );

    case "[Carrito] actualizar Carrito":
      return action.payload;

    case "[Carrito] disminuir Compra":
      return state.map(item => {
        if (item._id === action.payload && item.cantidad > 1) {
          return { ...item, cantidad: item.cantidad - 1 };
        }
        return item;
      });

    case "[Carrito] actualizar cantidad Compra":
      return state.map(item =>
        item._id === action.payload.id
          ? { ...item, cantidad: action.payload.nuevaCantidad }
          : item
      );

    default:
      return state; // Devuelve el estado sin cambios en caso de acción desconocida
  }
};
