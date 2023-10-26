import Cita from "../models/Cita.js";
// Obtener todas las citas
export const obtenerCitas = async (req, res) => {
  try {
    const citas = await Cita.find();
    res.json(citas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener citas" });
  }
};

// Crear una nueva cita
export const crearCita = async (req, res) => {
  try {
    console.log("Datos enviados a crearCita:", req.body); // Agregar esta línea

    
    
    const nuevaCita = new Cita({
      cliente: req.body.cliente,
      fechaHora,
      estadoCita: "Pendiente",
    });

    // Guarda la cita en la base de datos
    await nuevaCita.save();

    // Devuelve una respuesta al cliente confirmando la solicitud de cita
    res.json({ mensaje: "Solicitud de cita realizada con éxito" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al solicitar la cita" });
  }
};

// Obtener una cita por ID
export const obtenerCitaPorId = async (req, res) => {
  try {
    const cita = await Cita.findById(req.params.id);
    res.json(cita);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener cita por ID" });
  }
};
