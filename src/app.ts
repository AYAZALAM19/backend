import express, { Application } from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import productRoutes from "./routes/product.routes";

const app: Application = express();

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (images)
app.use("/uploads", express.static(uploadDir));

// Routes
app.use("/api/products", productRoutes);

// Health check
app.get("/", (_req, res) => {
  res.json({ message: "✅ Server is running" });
});

export default app;
