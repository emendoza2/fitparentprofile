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
import { DimensionScores } from "@/utils/assessment/get-dimension-scores";
import { z } from "zod";
import { DimensionSchema, QuestionSchema } from "@/lib/sheets-api";
import {
  useDimensionResearchScripture,
  useDimensions,
} from "@/lib/use-assessment-sheets";
import { getScoreInterpretation } from "@/utils/assessment/get-score-interpretation";

function DimensionSummary({
  dimension,
  score,
}: {
  dimension: string;
  score: number;
}) {
  const { data: dimensions } = useDimensions();
  const dimensionMap =
    dimensions && Object.fromEntries(dimensions.map((d) => [d.dimension, d]));
  const colorKey = dimension as keyof typeof dimensionColors;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3
          className={cn(
            "font-medium flex items-center",
            (dimensionColors[colorKey] ?? dimensionColors["TRUTH-SEEKING"])
              .color
          )}
        >
          <span
            className={cn(
              "inline-block w-3 h-3 rounded-full mr-2",
              (dimensionColors[colorKey] ?? dimensionColors["TRUTH-SEEKING"]).bg
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
              <p>{dimensionMap?.[dimension]?.why}</p>
            </DialogContent>
          </Dialog>
        </h3>
        <span className="text-sm font-semibold">{score}%</span>
      </div>
      <Progress
        value={score}
        className="h-2"
        indicatorClassName={
          (dimensionColors[colorKey] ?? dimensionColors["TRUTH-SEEKING"])
            .bgTranslucent
        }
      />
      {dimensionMap && (
        <p className="text-sm text-muted-foreground">
          {getScoreInterpretation(dimension, score, dimensionMap)}
        </p>
      )}
    </div>
  );
}

export function DimensionSummaryList({ data }: { data: DimensionScores }) {
  return (
    <div className="py-4 space-y-6 border-t">
      <h3 className="text-lg font-semibold">Summary</h3>
      {Object.entries(data).map(([dimension, [score]]) => (
        <DimensionSummary key={dimension} dimension={dimension} score={score} />
      ))}
    </div>
  );
}
