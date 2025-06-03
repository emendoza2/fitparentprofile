import { DimensionSchema } from "@/lib/sheets-api";
import { z } from "zod";

export function getScoreInterpretation(
  dimension: string,
  score: number,
  dimensionMap: Record<string, z.infer<typeof DimensionSchema>>
) {
  const levels = dimensionMap[dimension]?.levels || [];
  if (score < 25) {
    return levels[1] || "Needs immediate attention.";
  } else if (score < 50) {
    return levels[2] || "Needs growth.";
  } else if (score < 75) {
    return levels[3] || "Good.";
  } else {
    return levels[4] || "Excellent.";
  }
}
