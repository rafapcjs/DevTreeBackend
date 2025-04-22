import User, { IUser, UserDto } from "../models/User";
import type { Request, Response, RequestHandler } from "express";
import { checkPassword, hashPassword } from "../utils/auth";
import { validationResult } from "express-validator";
import slug, { reset } from "slug"; // Static import
import { generateJwt } from "../utils/jwt";

export const createAccount: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("createAccount called");
    const { email, password, handle } = req.body;

    // Check if the user already exists by email
    const userExist = await User.findOne({ email });
    if (userExist) {
      const error = new Error("The user already exists");
      res.status(409).json({ error: error.message });
      return;
    }

    // Slugify the handle to ensure it's URL-friendly
    const slugifiedHandle = slug(handle, "-");

    // Check if the handle already exists
    const handleExist = await User.findOne({ handle: slugifiedHandle });
    if (handleExist) {
      const error = new Error("The handle already exists");
      res.status(409).json({ error: error.message });
      return;
    }

    // Create a new user object
    const user = new User(req.body);
    user.password = await hashPassword(password); // Hash the password
    user.handle = slugifiedHandle; // Set the URL-friendly handle

    // Save the user to the database
    await user.save();

    console.log("User registered successfully");
    res.status(201).send("Registered successfully");
  } catch (error) {
    console.error("Error in createAccount:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    console.log("login called");

    // Validate the incoming request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("The user does not exist in the database");
      res.status(404).json({ error: error.message });
      return;
    }

    // Check if the password is correct
    const isPasswordCorrect = await checkPassword(password, user.password);
    if (!isPasswordCorrect) {
      const error = new Error("Incorrect password");
      res.send("contraseña incorrecta");

      res.status(401).json({ error: error.message });
      return;
    }

    const token = generateJwt({ user });

    res.send(token);
  } catch (error) {
    console.error("Error in login:", error);
    res.send("error de servidor");

    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  res.json(req.user);
};
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Cuerpo de la solicitud:", req.body);
    console.log("Usuario autenticado:", req.user);

    const { description } = req.body;
    const handle = slug(req.body.handle, "");

    console.log("Nuevo handle:", handle);

    const handleExist = await User.findOne({ handle });
    if (handleExist && handleExist._id.toString() !== req.user?._id) {
        res.status(409).json({ error: "The handle already exists" });
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
        res.status(404).json({ error: "User not found" });
    } 

    user.description = description;
    user.handle = handle;
    await user.save();

    res.send("Profile updated successfully");
  } catch (e) {
    console.error("Update profile error:", e);
      res.status(500).json({ error: "Error updating profile" });
  }
};