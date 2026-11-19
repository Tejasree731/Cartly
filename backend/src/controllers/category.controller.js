import { z } from "zod";
import * as categoryService from "../services/category.service.js";

const createCategorySchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(500).optional()
});

const updateCategorySchema = createCategorySchema.partial();

function handleError(res, error) {
  if (error.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: "A category with this name already exists"
    });
  }

  if (error.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "Category not found"
    });
  }

  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Internal server error"
  });
}

function parseId(value) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

// POST /api/categories
export async function createCategory(req, res) {
  const parsed = createCategorySchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      errors: parsed.error.issues
    });
  }

  try {
    const category = await categoryService.createCategory(
      parsed.data
    );

    return res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    return handleError(res, error);
  }
}

// GET /api/categories
export async function getCategories(req, res) {
  try {
    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const categories =
      await categoryService.getCategories(search);

    return res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    return handleError(res, error);
  }
}

// GET /api/categories/:id
export async function getCategoryById(req, res) {
  const id = parseId(req.params.id);

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Invalid category ID"
    });
  }

  try {
    const category =
      await categoryService.getCategoryById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    return res.json({
      success: true,
      data: category
    });
  } catch (error) {
    return handleError(res, error);
  }
}

// PATCH /api/categories/:id
export async function updateCategory(req, res) {
  const id = parseId(req.params.id);

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Invalid category ID"
    });
  }

  const parsed = updateCategorySchema.safeParse(req.body);

  if (
    !parsed.success ||
    Object.keys(req.body ?? {}).length === 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Provide valid category fields",
      errors: parsed.success
        ? undefined
        : parsed.error.issues
    });
  }

  try {
    const existing =
      await categoryService.getCategoryById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    const category = await categoryService.updateCategory(
      id,
      parsed.data
    );

    return res.json({
      success: true,
      data: category
    });
  } catch (error) {
    return handleError(res, error);
  }
}

// DELETE /api/categories/:id
export async function deactivateCategory(req, res) {
  const id = parseId(req.params.id);

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Invalid category ID"
    });
  }

  try {
    const existing =
      await categoryService.getCategoryById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    const category =
      await categoryService.deactivateCategory(id);

    return res.json({
      success: true,
      message: "Category deactivated successfully",
      data: category
    });
  } catch (error) {
    return handleError(res, error);
  }
}