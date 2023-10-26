import  BoucherPago from '../models/BoucherPago.js'
// Obtener todos los bouchers de pago
export const obtenerBouchersPago = async (req, res) => {
  try {
    const bouchersPago = await BoucherPago.find();
    res.json(bouchersPago);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener bouchers de pago' });
  }
};

// Crear un nuevo boucher de pago
export const crearBoucherPago = async (req, res) => {
  try {
    const nuevoBoucherPago = new BoucherPago(req.body);
    await nuevoBoucherPago.save();
    res.json({ mensaje: 'Boucher de pago creado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear boucher de pago' });
  }
};

// Obtener un boucher de pago por ID
export const obtenerBoucherPagoPorId = async (req, res) => {
  try {
    const boucherPago = await BoucherPago.findById(req.params.id);
    res.json(boucherPago);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener boucher de pago por ID' });
  }
};
