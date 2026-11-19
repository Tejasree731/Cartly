import express from "express";
import cors from "cors";
import prisma from "./config/prisma.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import supplierRoutes from "./routes/supplier.routes.js";
import forecastRoutes from "./routes/forecast.routes.js";

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173"
}));

app.use(express.json({ limit: "100kb" }));

app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      success: true,
      message: "Cartly API is running",
      database: "Neon PostgreSQL connected"
    });
  } catch (error) {
    console.error("Database health check failed:", error.message);

    res.status(503).json({
      success: false,
      message: "Database unavailable"
    });
  }
});

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/forecast", forecastRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found"
  });
});

export default app;