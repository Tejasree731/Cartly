import prisma from "../config/prisma.js";

export function createProduct(data) {
  return prisma.product.create({ data });
}

export function getProducts(search) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { sku: { contains: search, mode: "insensitive" } }
            ]
          }
        : {})
    },
    orderBy: { createdAt: "desc" }
  });
}

export function getProductById(id) {
  return prisma.product.findUnique({
    where: { id }
  });
}

export function updateProduct(id, data) {
  return prisma.product.update({
    where: { id },
    data
  });
}

export function deactivateProduct(id) {
  return prisma.product.update({
    where: { id },
    data: { isActive: false }
  });
}