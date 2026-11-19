import { Router } from "express";

import {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deactivateSupplier
} from "../controllers/supplier.controller.js";

const router = Router();

router.post("/", createSupplier);
router.get("/", getSuppliers);
router.get("/:id", getSupplierById);
router.patch("/:id", updateSupplier);
router.delete("/:id", deactivateSupplier);

export default router;