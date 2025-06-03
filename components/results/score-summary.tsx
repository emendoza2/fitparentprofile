import { DimensionScores } from "@/utils/assessment/get-dimension-scores";

export function ScoreSummary({ data }: { data: DimensionScores }) {
  const totalScore = Object.values(data).reduce((a, [b]) => a + b, 0);
  return (
    <div className="text-center text-2xl mt-4 space-y-2">
      <h3 className="font-bold">You scored</h3>
      <div className="text-6xl">{totalScore}</div>
      <div>out of 1000</div>
    </div>
  );
}
