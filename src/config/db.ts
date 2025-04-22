 // filepath: /c:/Users/RAFAEL CORREDOR G/Desktop/devtree/src/config/db.ts
 import mongoose from "mongoose";
 

 export const connectDB = async () => {
   try {
     const url = process.env.MONGO_URI;
     if (!url) {
       throw new Error("MongoDB connection URL is not defined in environment variables");
     }
 
     const connection = await mongoose.connect(url);
     console.log("MongoDB conectado con Express");
 
     const url2 = `${connection.connection.host}:${connection.connection.port}`;
     console.log(`MongoDB conectado con Express en ${url2}`);
   } catch (error) {
     console.log("Error al conectar con MongoDB", error);
     process.exit(1);
   }
 };