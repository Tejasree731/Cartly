import { z } from "zod";
import * as productService from "../services/product.service.js";

const createProductSchema = z.object({
  name: z.string().trim().min(1).max(150),
  sku: z.string().trim().min(1).max(50),
  barcode: z.string().trim().max(100).nullable().optional(),
  description: z.string().optional(),
  price: z.coerce.number().positive().finite().max(99999999.99),
  quantity: z.coerce.number().int().min(0).default(0),
  minStock: z.coerce.number().int().min(0).default(10)
});

const updateProductSchema = createProductSchema
  .omit({ quantity: true })
  .partial();

function handleError(res, error) {
  if (error.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: "SKU or barcode already exists"
    });
  }

  if (error.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "Product not found"
    });
  }

  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Internal server error"
  });
}

export async function createProduct(req, res) {
  const parsed = createProductSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      errors: parsed.error.issues
    });
  }

  const data = {
    ...parsed.data,
    barcode: parsed.data.barcode || null
  };

  try {
    const product = await productService.createProduct(data);

    return res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getProducts(req, res) {
  try {
    const products = await productService.getProducts(
      req.query.search?.trim()
    );

    return res.json({
      success: true,
      data: products
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getProductById(req, res) {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID"
    });
  }

  try {
    const product = await productService.getProductById(id);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.json({ success: true, data: product });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function updateProduct(req, res) {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID"
    });
  }

  const parsed = updateProductSchema.safeParse(req.body);

  if (!parsed.success || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Provide valid product fields",
      errors: parsed.success ? undefined : parsed.error.issues
    });
  }

  try {
    const product = await productService.updateProduct(id, {
      ...parsed.data,
      ...(parsed.data.barcode !== undefined
        ? { barcode: parsed.data.barcode || null }
        : {})
    });

    return res.json({ success: true, data: product });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function deactivateProduct(req, res) {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID"
    });
  }

  try {
    const product = await productService.deactivateProduct(id);

    return res.json({
      success: true,
      message: "Product deactivated",
      data: product
    });
  } catch (error) {
    return handleError(res, error);
  }
}