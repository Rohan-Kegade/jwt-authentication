import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../models/user.model.js";

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  synchronize: true,
  logging: false,
  entities: [User],
});

export { AppDataSource };
