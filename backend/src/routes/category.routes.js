import { Router } from "express";

import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deactivateCategory
} from "../controllers/category.controller.js";

const router = Router();

router.post("/", createCategory);
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.patch("/:id", updateCategory);
router.delete("/:id", deactivateCategory);

export default router;