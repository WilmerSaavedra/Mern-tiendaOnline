import User from "../models/Usuario.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { TOKEN_SECRET } from "../config.js";
import { createAccessToken } from "../libs/jwt.js";
import { handleFailedLogin } from "../middlewares/auth.middleware.js";
import nodemailer from "nodemailer";
import { ObjectId } from 'mongodb';

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userFound = await User.findOne({ email });

    if (userFound)
      return res.status(400).json({
        message: "The email is already in use",
      });

    // hashing the password
    const passwordHash = await bcrypt.hash(password, 10);

    // creating the user
    const newUser = new User({
      username,
      email,
      password: passwordHash,
    });

    // saving the user in the database
    const userSaved = await newUser.save();

    // create access token
    const token = await createAccessToken({
      id: userSaved._id,
    });

    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV !== "development",
      secure: true,
      sameSite: "none",
    });

    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userFound = await User.findOne({ email });
    if (!userFound) {
      // Maneja el caso en el que el correo electrónico no existe en la base de datos
      return res.status(404).json({
        message: "El correo electrónico no existe.",
      });
    }
    console.log(userFound.loginAttempts);
    if (userFound.loginAttempts >= 3) {
      return handleFailedLogin(
        userFound,
        res,
        "La cuenta está bloqueada temporalmente por sobrepasar intentos permitidos."
      );
    }
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return handleFailedLogin(userFound, res, "La contraseña es incorrecta.");
    }

    // Restablecer los intentos de inicio de sesión después de un inicio de sesión exitoso
    userFound.loginAttempts = 0;
    await userFound.save();

    const token = await createAccessToken({
      id: userFound._id,
      username: userFound.username,
      isAdmin: userFound.isAdmin,
      email: userFound.email,
    });

    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV !== "development",
      secure: true,
      sameSite: "none",
    });

    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      isAdmin: userFound.isAdmin,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.send(false);

  jwt.verify(token, TOKEN_SECRET, async (error, user) => {
    if (error) return res.sendStatus(401);

    const userFound = await User.findById(user.id);
    if (!userFound) return res.sendStatus(401);

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      isAdmin: userFound.isAdmin,
    });
  });
};

export const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const sendEmail = async (req, res) => {
  try {
    const {
      username,
      email,
      subject,
      message,
    } = req.body;
    
   
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      secure: false,
      auth: {
        user: "b23603876f00e3",
        pass: "34a009ebe0a814",
      },
      debug: true,
    });

    const mailOptions = {
      from: email,
      to: "destinatario@gmail.com",
      subject: subject,
      text: `Nombre: ${username}\nCorreo electrónico: ${email}\nMensaje: ${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error al enviar el correo electrónico:", error);
        res
          .status(404)
          .json({ message: "error al enviar su mensaje , intentelo de nuevo" });
      } else {
        console.log("Correo electrónico enviado:", info.response);
        return res.json({
          message: `hola ${username}, su mensaje a sido enviado en breve nos comunicaremos con usted`,
        });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de usuario no válido" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateUserById = async (req, res) => {
  try {
    const { username, email, isAdmin } = req.body;
    await User.findByIdAndUpdate(req.params.id, {
      username,
      email,
      isAdmin,
    });
    res.json({ message: "Usuario actualizado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteUserById = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Genera un token único para restablecer la contraseña
    const resetToken = await bcrypt.hash(user.email, 10);

    // Guarda el token en el usuario
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora de expiración

    await user.save();

    // Configura el transporte de nodemailer
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      secure: false,
      auth: {
        user: "b23603876f00e3",
        pass: "34a009ebe0a814",
      },
      debug: true,
    });

    // Construye el enlace de restablecimiento de contraseña
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    // Configura el correo electrónico
    const mailOptions = {
      from: "tu_correo@gmail.com",
      to: user.email,
      subject: "Recuperación de Contraseña",
      text: `Hola ${user.username},\n\n
        Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:\n
        ${resetLink}\n\n
        Si no solicitaste esto, ignora este correo y tu contraseña seguirá siendo la misma.\n`,
    };

    // Envía el correo electrónico
    await transporter.sendMail(mailOptions);

    res.json({
      message:
        "Se ha enviado un correo electrónico con instrucciones para restablecer la contraseña",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const obtenerUsuariosSinCliente = async (req, res) => {
  try {
    const usuariosSinCliente = await User.aggregate([
      {
        $lookup: {
          from: "clientes", // Nombre de la colección de clientes
          localField: "_id",
          foreignField: "usuario",
          as: "cliente",
        },
      },
      {
        $match: {
          cliente: { $eq: [] },
          isAdmin: false,
        },
      },
    ]);

    res.json(usuariosSinCliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};
