import { CorsOptions } from "cors";

const allowedOrigins = ["http://localhost:5173", "http://localhost:4000"]; // Agrega los orígenes permitidos

export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Permitir el origen
    } else {
      console.error(`Origin: ${origin}`);
      callback(new Error("Error de cors")); // Rechazar el origen
    }
  },
  credentials: true, // Permitir cookies y encabezados de autenticación
};