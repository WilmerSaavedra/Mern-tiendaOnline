import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

// export const auth = (req, res, next) => {
//   try {
//     const { token } = req.cookies;

//     if (!token)
//       return res
//         .status(401)
//         .json({ message: "No token, authorization denied" });

//     jwt.verify(token, TOKEN_SECRET, (error, user) => {
//       if (error) {
//         return res.status(401).json({ message: "Token is not valid" });
//       }
//       req.user = user;
//       next();
//     });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };
export const auth = (req, res, next) => {
  try {
    const { token } = req.cookies;

    // No bloquear el acceso a la ruta si no hay token
    if (!token) {
      // Puedes establecer req.user como null o cualquier otro valor si deseas
      // tener acceso a req.user incluso cuando no esté autenticado
      req.user = null;
      return next();
    }

    jwt.verify(token, TOKEN_SECRET, (error, user) => {
      if (error) {
        return res.status(401).json({ message: "Token is not valid" });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const isAdmin = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    jwt.verify(token, TOKEN_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({ message: "Token is not valid" });
      }

      // Verificar si el usuario es administrador
      if (!decoded.isAdmin) {
        return res.status(403).json({ message: "Access denied. Admin rights required." });
      }

      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export async function handleFailedLogin(user, res, message) {
  user.loginAttempts += 1;

  if (user.loginAttempts >= 3) {
    const currentTime = new Date();

    if (user.lockUntil && currentTime > user.lockUntil) {
      // Ha pasado más de 1 hora, desbloquea la cuenta
      user.loginAttempts = 0;
      user.lockUntil = undefined;
    } else {
      // La cuenta todavía está bloqueada
      return res.status(400).json({
        message: "La cuenta está bloqueada temporalmente. Inténtalo más tarde.",
      });
    }

    // Bloquear durante 1 hora desde el tiempo actual
    // user.lockUntil = new Date(currentTime.getTime() + 1 * 60 * 60 * 1000);
    user.lockUntil = new Date(currentTime.getTime() + 10 * 1000); // 5 segundos en milisegundos
 
  }

  await user.save();

  return res.status(400).json({
    message,
  });
}

