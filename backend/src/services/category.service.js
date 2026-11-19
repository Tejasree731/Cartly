import prisma from "../config/prisma.js";

export function createCategory(data) {
  return prisma.category.create({
    data
  });
}

export function getCategories(search) {
  return prisma.category.findMany({
    where: {
      isActive: true,
      ...(search
        ? {
            name: {
              contains: search,
              mode: "insensitive"
            }
          }
        : {})
    },
    orderBy: {
      name: "asc"
    }
  });
}

export function getCategoryById(id) {
  return prisma.category.findFirst({
    where: {
      id,
      isActive: true
    },
    include: {
      _count: {
        select: {
          products: true
        }
      }
    }
  });
}

export function updateCategory(id, data) {
  return prisma.category.update({
    where: { id },
    data
  });
}

export function deactivateCategory(id) {
  return prisma.category.update({
    where: { id },
    data: {
      isActive: false
    }
  });
}