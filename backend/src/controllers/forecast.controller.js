
import { getDemandForecast } from "../services/forecast.service.js";

export async function getForecast(req, res, next) {
  try {
    const data = await getDemandForecast();

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
}
