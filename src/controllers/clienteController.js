import Cliente from "../models/Cliente.js";
import Usuario from "../models/Usuario.js";
import { ObjectId } from "mongodb";

const handleError = (res, status, message) => {
  return res.status(status).json({ message });
};

const handleSuccess = (res, data) => {
  return res.status(200).json(data);
};

const findUserByUsername = async (username) => {
  return await Usuario.findOne({ username });
};

const findClienteByUsuarioId = async (userId) => {
  return await Cliente.findOne({ usuario: userId });
};
const findClienteByField = async (field, value) => {
  const query = {};
  query[field] = value;
  return await Cliente.findOne(query);
};
export const obtenerClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find().populate("usuario", "username");
    handleSuccess(res, clientes);
  } catch (error) {
    handleError(res, 500, error.message);
  }
};

export const obtenerClientePorId = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id).populate(
      "usuario",
      "username"
    );
    if (!cliente) {
      return handleError(res, 404, "Cliente no encontrado");
    }
    handleSuccess(res, cliente);
  } catch (error) {
    handleError(res, 500, error.message);
  }
};

export const obtenerClientePorIdUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    if (!ObjectId.isValid(idUsuario)) {
      return handleError(res, 400, "ID de cliente no válido");
    }
    const cliente = await Cliente.findOne({
      usuario: idUsuario,
    }).populate("usuario", "username email");
    if (!cliente) {
      return handleError(res, 404, "Cliente no encontrado");
    }
    handleSuccess(res, cliente);
  } catch (error) {
    handleError(res, 500, error.message);
  }
};

export const crearCliente = async (req, res) => {
  try {
    const { usuario, nombre, apellido, telefono, dni } = req.body;

    const user = await findUserByUsername(usuario);

    if (!user) {
      return handleError(res, 404, "Usuario no encontrado");
    }

    const clienteExistente = await findClienteByUsuarioId(user._id);

    if (clienteExistente) {
      return handleError(
        res,
        400,
        "Ya existe un cliente asociado a este usuario"
      );
    }

    const clientePorTelefono = await findClienteByField("telefono", telefono);
    if (clientePorTelefono) {
      return handleError(res, 400, "Ya existe un cliente con este teléfono");
    }

    const clientePorDni = await findClienteByField("dni", dni);
    if (clientePorDni) {
      return handleError(res, 400, "Ya existe un cliente con este DNI");
    }

    const nuevoCliente = await Cliente.create({
      usuario: user._id,
      nombre,
      apellido,
      telefono,
      dni,
    });

    handleSuccess(res, nuevoCliente);
  } catch (error) {
    handleError(res, 400, error.message);
  }
};

export const actualizarCliente = async (req, res) => {
  try {
    const { usuario, nombre, apellido, telefono, dni } = req.body;
    const user = await findUserByUsername(usuario);

    if (!user) {
      return handleError(res, 404, "Usuario no encontrado");
    }

    const clienteExistente = await findClienteByUsuarioId(user._id);

    if (clienteExistente && clienteExistente._id.toString() !== req.params.id) {
      return handleError(res, 400, "Ya existe otro cliente asociado a este usuario");
    }

    const clientePorTelefono = await findClienteByField("telefono", telefono);
    if (clientePorTelefono && clientePorTelefono._id.toString() !== req.params.id) {
      return handleError(res, 400, "Ya existe un cliente con este teléfono");
    }

    const clientePorDni = await findClienteByField("dni", dni);
    if (clientePorDni && clientePorDni._id.toString() !== req.params.id) {
      return handleError(res, 400, "Ya existe un cliente con este DNI");
    }

    const cliente = await Cliente.findByIdAndUpdate(req.params.id, {
      nombre,
      apellido,
      telefono,
      dni,
    }, {
      new: true,
    });

    if (!cliente) {
      return handleError(res, 404, "Cliente no encontrado");
    }

    handleSuccess(res, cliente);
  } catch (error) {
    handleError(res, 500, error.message);
  }
};

export const buscarClientes = async (req, res) => {
  try {
    const { parametro } = req.params;

    if (!parametro) {
      const todosLosClientes = await Cliente.find();
      return handleSuccess(res, todosLosClientes);
    }

    const clientesEncontrados = await Cliente.find({
      $or: [
        { nombre: { $regex: parametro, $options: "i" } },
        { apellido: { $regex: parametro, $options: "i" } },
        { telefono: { $regex: parametro, $options: "i" } },
        { dni: { $regex: parametro, $options: "i" } },
      ],
    });

    handleSuccess(res, clientesEncontrados);
  } catch (error) {
    handleError(res, 500, "Error al buscar clientes");
  }
};

export const eliminarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id);
    if (!cliente) {
      return handleError(res, 404, "Cliente no encontrado");
    }
    handleSuccess(res, { message: "Cliente eliminado correctamente" });
  } catch (error) {
    handleError(res, 500, error.message);
  }
};
