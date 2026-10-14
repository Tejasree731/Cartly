import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deactivateProduct
} from "../controllers/product.controller.js";

const router = Router();

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.patch("/:id", updateProduct);
router.delete("/:id", deactivateProduct);

export default router;