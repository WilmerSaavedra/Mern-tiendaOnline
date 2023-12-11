
import Marca from "../models/Marca.js";
export const obtenerMarcaPorId = async (req, res) => {
    const { id } = req.params;
  
    try {
      const marca = await Marca.findById(id);
  
      if (!marca) {
        return res.status(404).json({ mensaje: "Marca no encontrada" });
      }
  
      res.status(200).json(marca);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al obtener marca por ID", error: error.message });
    }
  };
export const obtenerMarcas = async (req, res) => {
  try {
    const marcas = await Marca.find();
    res.status(200).json(marcas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener marcas", error: error.message });
  }
};

export const crearMarca = async (req, res) => {
  const { nombre } = req.body;

  try {
    const nuevaMarca = new Marca({ nombre });
    const marcaGuardada = await nuevaMarca.save();
    res.status(201).json(marcaGuardada);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear marca", error: error.message });
  }
};

export const actualizarMarca = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  try {
    const marcaActualizada = await Marca.findByIdAndUpdate(
      id,
      { nombre },
      { new: true }
    );

    res.status(200).json(marcaActualizada);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar marca", error: error.message });
  }
};

export const eliminarMarca = async (req, res) => {
  const { id } = req.params;

  try {
    await Marca.findByIdAndDelete(id);
    res.status(200).json({ mensaje: "Marca eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar marca", error: error.message });
  }
};
