import "dotenv/config";
import { app } from "./app.js";
import { AppDataSource } from "./config/db.config.js";

const port = process.env.PORT || 3000;

try {
  // Initialize database connection
  await AppDataSource.initialize();
  console.log("Database connected successfully");

  // Start Express server
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
} catch (error) {
  console.error("Failed to connect to the database:", error);
  process.exit(1); // exit if DB connection fails
}
