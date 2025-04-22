import { NextFunction, Request, Response } from "express";

// Extend the Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: UserDto;
    }
  }
}

import jwt from "jsonwebtoken";
import User, { UserDto } from "../models/User";
import { toUserDto } from "../utils/mapper";
 
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization;
  if (!bearer) {
    const error = new Error("No token provided");
    res.status(401).json({ error: error.message });
    return;
  }

  const token = bearer.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      user: UserDto;
    };

    console.log("resultado de decode  ", decoded);

    const { user } = decoded;
    console.log("resultado de user   ", user);

    const userFindById = await User.findById({ _id: user._id });

    if (!userFindById) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Agregar el usuario al objeto req para que esté disponible en el siguiente middleware/controlador
    req.user = toUserDto(userFindById); // ✅ Ya no da error
    // Llamar a next() para pasar el control al siguiente middleware/controlador
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};