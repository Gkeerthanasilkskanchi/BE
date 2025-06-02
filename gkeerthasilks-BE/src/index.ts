import express from "express";
import dotenv from "dotenv";
import { userRoutes } from "./router/contactRouter";
import cors from "cors";
import path from "path";

dotenv.config();
const app = express();
const port = process.env.PORT || 8081;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// Use the user routes
app.use("/users", userRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


// Global error handler middleware
app.use((err:any, req:any, res:any, next:any) => {
  console.error(err); // Log the error
  res.status(500).json({ message: "Internal server error" }); // Send a generic error response
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
