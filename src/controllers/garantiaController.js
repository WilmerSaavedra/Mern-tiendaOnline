import  IntercambioProducto from '../models/IntercambioProducto.js'
// Obtener todos los intercambios de productos
exports.obtenerIntercambiosProducto = async (req, res) => {
  try {
    const intercambiosProducto = await IntercambioProducto.find();
    res.json(intercambiosProducto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener intercambios de productos' });
  }
};

// Crear un nuevo intercambio de productos
exports.crearIntercambioProducto = async (req, res) => {
  try {
    const nuevoIntercambioProducto = new IntercambioProducto(req.body);
    await nuevoIntercambioProducto.save();
    res.json({ mensaje: 'Intercambio de productos creado correctamente' });
 
} catch (error) {
    res.status(500).json({ mensaje: 'Error al crear intercambio de productos' });
  }
};

// Obtener un intercambio de productos por ID
exports.obtenerIntercambioProductoPorId = async (req, res) => {
  try {
    const intercambioProducto = await IntercambioProducto.findById(req.params.id);
    res.json(intercambioProducto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener intercambio de productos por ID' });
  }
};
