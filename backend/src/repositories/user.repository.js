import { AppDataSource } from "../config/db.config.js";
import { User } from "../models/user.model.js";

export const userRepository = AppDataSource.getRepository(User);
