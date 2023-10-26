import User from "../models/Usuario.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { TOKEN_SECRET } from "../config.js";
import { createAccessToken } from "../libs/jwt.js";
import { handleFailedLogin } from "../middlewares/auth.middleware.js";
import nodemailer from "nodemailer";

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
      username: userNombre,
      email: userEmail,
      subject,
      message,
    } = req.body;
    let senderEmail, senderName;

    // Verifica si el usuario está autenticado
    if (req.user) {
      senderEmail = req.user.email;
      senderName = req.user.username;
    } else {
      // Si el usuario no está autenticado, usa los datos del formulario
      senderEmail = userEmail;
      senderName = userNombre;
    }
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
      from: senderEmail,
      to: "destinatario@gmail.com",
      subject: subject,
      text: `Nombre: ${senderName}\nCorreo electrónico: ${senderEmail}\nMensaje: ${message}`,
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
          message:`hola ${senderName}, su mensaje a sido enviado en breve nos comunicaremos con usted`,
        });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });

  }
};
