import { PrinciplesData } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { dimensionColors } from "@/lib/questions";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";
import { useAuth } from "../auth/context";

function getScoreInterpretation(
  dimension: string,
  score: number,
  principlesData: PrinciplesData
) {
  const levels = principlesData[dimension]?.levels || [];
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

function DimensionSummary({
  dimension,
  score,
  principlesData,
}: {
  dimension: string;
  score: number;
  principlesData: PrinciplesData;
}) {
  const colorKey = dimension as keyof typeof dimensionColors;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3
          className={cn(
            "font-medium flex items-center",
            dimensionColors[colorKey].color
          )}
        >
          <span
            className={cn(
              "inline-block w-3 h-3 rounded-full mr-2",
              dimensionColors[colorKey].bg
            )}
          ></span>
          {dimension}
          <Dialog>
            <DialogTrigger>
              <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground opacity-75" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{dimension}</DialogTitle>
              </DialogHeader>
              <p>{principlesData[dimension].why}</p>
            </DialogContent>
          </Dialog>
        </h3>
        <span className="text-sm font-semibold">{score}%</span>
      </div>
      <Progress
        value={score}
        className="h-2"
        indicatorClassName={dimensionColors[colorKey].bgTranslucent}
      />
      <p className="text-sm text-muted-foreground">
        {getScoreInterpretation(dimension, score, principlesData)}
      </p>
    </div>
  );
}

export function DimensionSummaryList({
  data,
  principlesData,
}: {
  data: Record<string, [number, number[]]>;
  principlesData: PrinciplesData;
}) {
  return (
    <div className="py-4 space-y-6 border-t">
      <h3 className="text-lg font-semibold">Summary</h3>
      {Object.entries(data).map(([dimension, [score]]) => (
        <DimensionSummary
          key={dimension}
          dimension={dimension}
          score={score}
          principlesData={principlesData}
        />
      ))}
    </div>
  );
}
