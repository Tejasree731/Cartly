
import prisma from "../config/prisma.js";

const HISTORY_DAYS = 30;
const FORECAST_DAYS = 7;

export async function getDemandForecast() {
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - HISTORY_DAYS);

  // Get completed sales for the last 30 days
  const sales = await prisma.saleItem.groupBy({
    by: ["productId"],
    where: {
      sale: {
        is: {
          status: "COMPLETED",
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
    },
    _sum: {
      quantity: true,
    },
  });

  const salesMap = new Map(
    sales.map((item) => [
      item.productId,
      item._sum.quantity ?? 0,
    ])
  );

  // Get all active products
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return products.map((product) => {
    const totalSold = salesMap.get(product.id) ?? 0;
    const dailyDemand = totalSold / HISTORY_DAYS;

    const forecastNext7Days = Math.ceil(
      dailyDemand * FORECAST_DAYS
    );

    const leadTime = product.leadTimeDays;
    const safetyStock = product.minStock;

    const reorderPoint =
      Math.ceil(dailyDemand * leadTime) + safetyStock;

    const targetStock =
      Math.ceil(dailyDemand * (leadTime + FORECAST_DAYS)) +
      safetyStock;

    const suggestedOrderQuantity = Math.max(
      0,
      targetStock - product.quantity
    );

    let stockStatus;

    if (totalSold === 0) {
      stockStatus = "INSUFFICIENT_HISTORY";
    } else if (product.quantity <= reorderPoint) {
      stockStatus = "REORDER";
    } else {
      stockStatus = "SUFFICIENT";
    }

    return {
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      currentStock: product.quantity,
      totalSoldLast30Days: totalSold,
      averageDailyDemand: Number(dailyDemand.toFixed(2)),
      forecastNext7Days,
      reorderPoint,
      suggestedOrderQuantity:
        totalSold === 0 ? null : suggestedOrderQuantity,
      stockStatus,
    };
  });
}
