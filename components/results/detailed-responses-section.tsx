import { PrinciplesData, PrincipleData } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { dimensionColors } from "@/lib/questions";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen, CheckCircle2, ExternalLink } from "lucide-react";
import { DimensionScores } from "@/utils/assessment/get-dimension-scores";
import { getScoreInterpretation } from "@/utils/assessment/get-score-interpretation";
import {
  useDimensionResearchScripture,
  useDimensions,
  useQuestions,
} from "@/lib/use-assessment-sheets";
import { z } from "zod";
import {
  QuestionSchema,
  ResourceSchema,
  ScriptureSchema,
} from "@/lib/sheets-api";

function DotResponseIndicator({
  score,
  dimension,
  className,
}: {
  score: number;
  dimension: keyof typeof dimensionColors;
  className: string;
}) {
  return (
    <div className={cn("flex gap-x-1", className)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={cn(
            "w-3 h-3 rounded-full block",
            i <= score ? dimensionColors[dimension].bg : "bg-gray-200"
          )}
        />
      ))}
    </div>
  );
}

function DetailedResources({
  dimension,
  responses,
  questions,
  Scripture,
  resources,
}: // principle,
{
  dimension: keyof typeof dimensionColors;
  responses: number[];
  questions: z.infer<typeof QuestionSchema>[];
  Scripture: z.infer<typeof ScriptureSchema>[];
  resources: z.infer<typeof ResourceSchema>[];
  // principle: PrincipleData;
}) {
  // console.log("principle", principle);
  // const resources = principle.resources;
  // if (!resources) return null;

  return (
    <div className="mt-6 space-y-6 print:mt-4 print:space-y-4">
      {/* Daily Actions */}
      <div className="space-y-2">
        <h4
          className={cn(
            "font-semibold flex items-center gap-2",
            dimensionColors[dimension].color
          )}
        >
          <Calendar className="h-4 w-4" />
          Act on It
        </h4>
        <ul className="space-y-1 list-disc pl-5">
          {questions.map((statement, index) => (
            <li key={index} className="text-sm">
              <div className="flex gap-x-2 justify-between items-center opacity-50">
                {statement.statement}
                <DotResponseIndicator
                  score={responses[index]}
                  dimension={dimension}
                  className="flex"
                />
              </div>
              {/* {statement.challenge} */}
            </li>
          ))}
        </ul>
      </div>

      {/* Bible Verses */}
      <div className="space-y-2">
        <h4
          className={cn(
            "font-semibold flex items-center gap-2",
            dimensionColors[dimension].color
          )}
        >
          <BookOpen className="h-4 w-4" />
          Bible Verses
        </h4>
        <ul className="space-y-1 list-disc pl-5">
          {Scripture.map((verse, index) => (
            <li key={index} className="text-sm">
              <a
                href={
                  "https://www.biblegateway.com/passage/?search=" +
                  encodeURIComponent(verse.reference) +
                  "&version=ESV"
                }
                target="_blank"
                rel="noreferrer"
                className="text-sky-11 hover:underline"
              >
                {verse.reference}
              </a>
              : {verse.text}
            </li>
          ))}
        </ul>
      </div>

      {/* Books & Materials */}
      <div className="space-y-2">
        <h4
          className={cn(
            "font-semibold flex items-center gap-2",
            dimensionColors[dimension].color
          )}
        >
          <CheckCircle2 className="h-4 w-4" />
          Recommended Books & Materials
        </h4>
        <ul className="space-y-1 list-disc pl-5">
          {resources
            .filter((r) => r.category === "Book")
            .map((book, index) => (
              <li key={index} className="text-sm">
                <a
                  href={book.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-11 hover:underline"
                >
                  <em>{book.title}</em>
                </a>
                :{" "}
                {book.free && (
                  <Badge className="text-xs" variant="secondary">
                    FREE
                  </Badge>
                )}{" "}
                {book.description}
              </li>
            ))}
        </ul>
      </div>

      {/* Articles & Media */}
      <div className="space-y-2">
        <h4
          className={cn(
            "font-semibold flex items-center gap-2",
            dimensionColors[dimension].color
          )}
        >
          <ExternalLink className="h-4 w-4" />
          Additional Articles & Media
        </h4>
        <ul className="space-y-1 list-disc pl-5">
          {resources
            .filter((r) => r.category !== "Book")
            .map((article, index) => (
              <li key={index} className="text-sm">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-11 hover:underline"
                >
                  {article.title}
                </a>
                :{" "}
                {article.free && (
                  <Badge className="text-xs" variant="secondary">
                    FREE
                  </Badge>
                )}{" "}
                {article.description}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export function DetailedResponsesSection({
  data,
}: // principlesData,
{
  data: DimensionScores;
  principlesData: PrinciplesData;
}) {
  const { data: dimensions } = useDimensions();
  const dimensionMap =
    dimensions && Object.fromEntries(dimensions.map((d) => [d.dimension, d]));

  const { data: questions } = useQuestions();
  const { dimensionData } = useDimensionResearchScripture();

  return (
    <div className="py-4 space-y-6 border-t">
      <h3 className="text-lg font-semibold">Detailed Responses</h3>
      {Object.entries(data).map(([dimension, [score, responses]]) => {
        const colorKey = dimension as keyof typeof dimensionColors;
        return (
          <div key={dimension} className="space-y-4">
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
              </h3>
              <span className="text-sm font-semibold">{score}%</span>
            </div>
            <Progress
              value={score}
              className="h-2"
              indicatorClassName={dimensionColors[colorKey].bgTranslucent}
            />
            {dimensionMap && (
              <p className="text-sm text-muted-foreground">
                {getScoreInterpretation(dimension, score, dimensionMap)}
              </p>
            )}
            {dimensionData && questions && (
              <DetailedResources
                dimension={colorKey}
                responses={responses}
                Scripture={dimensionData?.[dimension]?.scripture}
                resources={dimensionData?.[dimension]?.research}
                questions={questions?.filter((q) => q.dimension === dimension)}
                // principle={principlesData[dimension]}
              />
            )}
            <hr className="mt-6 print:mt-4" />
          </div>
        );
      })}
    </div>
  );
}
