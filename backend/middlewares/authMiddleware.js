import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        mensaje: "Acceso denegado, token no proporcionado"
      });
    }

    const token = authHeader.split(" ")[1]; // Bearer TOKEN

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = {
      id: decoded.id,
      rol: decoded.rol
    };

    next();

  } catch (error) {
    return res.status(401).json({
      mensaje: "Token inválido o expirado"
    });
  }
};