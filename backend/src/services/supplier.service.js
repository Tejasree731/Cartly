import prisma from "../config/prisma.js";

export function createSupplier(data) {
  return prisma.supplier.create({ data });
}

export function getSuppliers(search) {
  return prisma.supplier.findMany({
    where: {
      isActive: true,
      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive"
                }
              },
              {
                email: {
                  contains: search,
                  mode: "insensitive"
                }
              }
            ]
          }
        : {})
    },
    orderBy: { createdAt: "desc" }
  });
}

export function getSupplierById(id) {
  return prisma.supplier.findFirst({
    where: {
      id,
      isActive: true
    }
  });
}

export function updateSupplier(id, data) {
  return prisma.supplier.update({
    where: { id },
    data
  });
}

export function deactivateSupplier(id) {
  return prisma.supplier.update({
    where: { id },
    data: { isActive: false }
  });
}