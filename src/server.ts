import express from "express";
import router from "./router";
import "dotenv/config";
import { connectDB } from "./config/db";
import cors from "cors";
import { corsConfig } from "./config/cors";
const app = express();
connectDB();

// habilitar express.json entrada de datos en formato json  en el body  funcionamiento  global

//cors

app.use(cors(corsConfig));
app.use(express.json());

app.use("/", router);

export default app;
