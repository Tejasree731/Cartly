import { z } from "zod";
import * as supplierService from "../services/supplier.service.js";

const createSupplierSchema = z.object({
  name: z.string().trim().min(2).max(150),
  email: z.union([
    z.string().trim().email().max(255),
    z.literal("")
  ]).optional(),
  phone: z.string().trim().max(20).optional(),
  address: z.string().trim().max(1000).optional()
});

const updateSupplierSchema = createSupplierSchema.partial();

function parseId(value) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function handleError(res, error) {
  if (error.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: "A supplier with this email already exists"
    });
  }

  if (error.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "Supplier not found"
    });
  }

  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Internal server error"
  });
}

function normalizeSupplier(data) {
  return {
    ...data,
    ...(data.email !== undefined
      ? { email: data.email.toLowerCase() || null }
      : {}),
    ...(data.phone !== undefined
      ? { phone: data.phone || null }
      : {}),
    ...(data.address !== undefined
      ? { address: data.address || null }
      : {})
  };
}

// POST /api/suppliers
export async function createSupplier(req, res) {
  const parsed = createSupplierSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      errors: parsed.error.issues
    });
  }

  try {
    const supplier = await supplierService.createSupplier(
      normalizeSupplier(parsed.data)
    );

    return res.status(201).json({
      success: true,
      data: supplier
    });
  } catch (error) {
    return handleError(res, error);
  }
}

// GET /api/suppliers
export async function getSuppliers(req, res) {
  const search =
    typeof req.query.search === "string"
      ? req.query.search.trim()
      : "";

  try {
    const suppliers = await supplierService.getSuppliers(search);

    return res.json({
      success: true,
      count: suppliers.length,
      data: suppliers
    });
  } catch (error) {
    return handleError(res, error);
  }
}

// GET /api/suppliers/:id
export async function getSupplierById(req, res) {
  const id = parseId(req.params.id);

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Invalid supplier ID"
    });
  }

  try {
    const supplier = await supplierService.getSupplierById(id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found"
      });
    }

    return res.json({
      success: true,
      data: supplier
    });
  } catch (error) {
    return handleError(res, error);
  }
}

// PATCH /api/suppliers/:id
export async function updateSupplier(req, res) {
  const id = parseId(req.params.id);

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Invalid supplier ID"
    });
  }

  const parsed = updateSupplierSchema.safeParse(req.body);

  if (
    !parsed.success ||
    !Object.keys(req.body ?? {}).length
  ) {
    return res.status(400).json({
      success: false,
      message: "Provide valid supplier fields",
      errors: parsed.success
        ? undefined
        : parsed.error.issues
    });
  }

  try {
    const existing = await supplierService.getSupplierById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found"
      });
    }

    const supplier = await supplierService.updateSupplier(
      id,
      normalizeSupplier(parsed.data)
    );

    return res.json({
      success: true,
      data: supplier
    });
  } catch (error) {
    return handleError(res, error);
  }
}

// DELETE /api/suppliers/:id
export async function deactivateSupplier(req, res) {
  const id = parseId(req.params.id);

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Invalid supplier ID"
    });
  }

  try {
    const existing = await supplierService.getSupplierById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found"
      });
    }

    const supplier = await supplierService.deactivateSupplier(id);

    return res.json({
      success: true,
      message: "Supplier deactivated successfully",
      data: supplier
    });
  } catch (error) {
    return handleError(res, error);
  }
}