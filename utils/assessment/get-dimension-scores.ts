export interface DimensionScores {
  [dimension: string]: [score: number, responses: number[]];
}
export function getDimensionScores(
  answers: Record<string, number>,
  questions?: {
    id: string;
    dimension: string;
    framing: "Positive" | "Negative";
  }[]
): DimensionScores {
  if (!questions) return {};
  // Group answers by dimension
  const dimensionMap: Record<string, number[]> = {};
  questions.forEach((q) => {
    if (!dimensionMap[q.dimension]) dimensionMap[q.dimension] = [];
    const trueScore =
      q.framing === "Positive" ? answers[q.id] || 0 : 6 - (answers[q.id] || 1);
    dimensionMap[q.dimension].push(trueScore);
  });
  // Calculate average score per dimension (scale to 0-100)
  const scores: DimensionScores = {};
  Object.entries(dimensionMap).forEach(([dimension, values]) => {
    if (values.length === 0) {
      scores[dimension] = [0, []];
    } else {
      // Each answer is 1-5, so average and scale
      // Min score is 15, max is 85
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const score = Math.round(((avg - 1) / 4) * 70 + 15);
      scores[dimension] = [score, values];
    }
  });
  return scores;
}
