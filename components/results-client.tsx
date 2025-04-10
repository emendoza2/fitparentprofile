"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  RefreshCcw,
  BarChart,
  Printer,
  Download,
  Calendar,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  ExternalLinkIcon,
  HelpCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Tooltip,
  Legend,
} from "recharts";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import SocialShare from "@/components/social-share";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PrincipleData, PrinciplesData } from "@/lib/types";
import { dimensionColors } from "@/lib/questions";

// Format scores for radar chart with custom colors
interface RadarChartDatum {
  dimension: string;
  score: number;
  fullMark: 100;
  fill: string;
  stroke: string;
}

// Define dimension colors
// const dimensionColors: Record<
//   string,
//   {
//     fill: string;
//     stroke: string;
//     bg: string;
//     bgTranslucent: string;
//     color: string;
//     border: string;
//   }
// > = {
//   "TRUTH-SEEKING": {
//     fill: "#FF5733",
//     stroke: "#C70039",
//     bg: "bg-red-500",
//     bgTranslucent: "bg-red-500/20",
//     color: "text-red-500",
//     border: "border-red-500",
//   },
//   EXEMPLIFYING: {
//     fill: "#FFC300",
//     stroke: "#900C3F",
//     bg: "bg-amber-500",
//     bgTranslucent: "bg-amber-500/20",
//     color: "text-amber-500",
//     border: "border-amber-500",
//   },
//   COMMUNICATING: {
//     fill: "#36D7B7",
//     stroke: "#2E86C1",
//     bg: "bg-teal-500",
//     bgTranslucent: "bg-teal-500/20",
//     color: "text-teal-500",
//     border: "border-teal-500",
//   },
//   ENGAGING: {
//     fill: "#3498DB",
//     stroke: "#2980B9",
//     bg: "bg-blue-500",
//     bgTranslucent: "bg-blue-500/20",
//     color: "text-blue-500",
//     border: "border-blue-500",
//   },
//   AFFIRMING: {
//     fill: "#9B59B6",
//     stroke: "#8E44AD",
//     bg: "bg-purple-500",
//     bgTranslucent: "bg-purple-500/20",
//     color: "text-purple-500",
//     border: "border-purple-500",
//   },
//   LOVING: {
//     fill: "#E74C3C",
//     stroke: "#C0392B",
//     bg: "bg-red-600",
//     bgTranslucent: "bg-red-600/20",
//     color: "text-red-600",
//     border: "border-red-600",
//   },
//   TEACHING: {
//     fill: "#2ECC71",
//     stroke: "#27AE60",
//     bg: "bg-green-500",
//     bgTranslucent: "bg-green-500/20",
//     color: "text-green-500",
//     border: "border-green-500",
//   },
//   TRAINING: {
//     fill: "#F1C40F",
//     stroke: "#F39C12",
//     bg: "bg-yellow-500",
//     bgTranslucent: "bg-yellow-500/20",
//     color: "text-yellow-500",
//     border: "border-yellow-500",
//   },
//   PEACEMAKING: {
//     fill: "#1ABC9C",
//     stroke: "#16A085",
//     bg: "bg-emerald-500",
//     bgTranslucent: "bg-emerald-500/20",
//     color: "text-emerald-500",
//     border: "border-emerald-500",
//   },
//   ENTRUSTING: {
//     fill: "#34495E",
//     stroke: "#2C3E50",
//     bg: "bg-slate-700",
//     bgTranslucent: "bg-slate-700/20",
//     color: "text-slate-700",
//     border: "border-slate-700",
//   },
// };

const formatScoresForRadarChart = (
  scores: Record<string, [number, number[]]>
): RadarChartDatum[] => {
  return Object.entries(scores).map(([dimension, [score]]) => ({
    dimension,
    score,
    fullMark: 100,
    fill: dimensionColors[dimension as keyof typeof dimensionColors].fill,
    stroke: dimensionColors[dimension as keyof typeof dimensionColors].stroke,
  }));
};

function supportsWebPCanvas() {
  if (typeof window === "undefined") return false;
  const canvas = document.createElement("canvas");
  if (!canvas.getContext) {
    return false;
  }
  return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
}

// Custom radar chart with dimension-specific colors
const CustomRadarChart = ({ data }: { data: RadarChartDatum[] }) => {
  const [hoveredDimension, setHoveredDimension] =
    useState<RadarChartDatum | null>(null);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart
        cx="50%"
        cy="50%"
        outerRadius="80%"
        data={data}
        onMouseMove={(e) => {
          if (e.activePayload) setHoveredDimension(e.activePayload[0].payload);
        }}
        //onMouseOut={() => setHoveredDimension(null)}
      >
        <PolarGrid />
        <PolarAngleAxis
          dataKey="dimension"
          tick={(props) => {
            const { payload, x, y, textAnchor, ...rest } = props;
            const fill = dimensionColors[
              payload.value as keyof typeof dimensionColors
            ]
              ? dimensionColors[payload.value as keyof typeof dimensionColors]
                  .fill
              : "fill-black";
            return (
              <text
                x={x}
                y={y}
                textAnchor={textAnchor}
                {...rest}
                className={fill}
                fontSize={12}
              >
                {payload.value}
              </text>
            );
          }}
          onMouseEnter={(e) => {
            setHoveredDimension(
              data.find((d) => d.dimension === e.value) ?? null
            );
          }}
        />
        <Radar
          name="You scored"
          dataKey="score"
          stroke="black"
          strokeWidth={2}
          fill={hoveredDimension?.fill ?? "var(--primary)"}
          className={cn(
            hoveredDimension?.fill,
            hoveredDimension?.stroke,
            "transition"
          )}
          fillOpacity={0.5}
        />
        <Tooltip formatter={(value, name) => `${value}%`} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

const printPage = () => {
  alert("To print properly, ensure that printing backgrounds is checked.");
  window.print();
};

const downloadPDF = async () => {
  const { dismiss } = toast({
    title: "Downloading PDF",
    description: "Your FIT Parent Profile is being generated as a PDF...",
  });

  const element = document.getElementById("printable");
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  const opt = {
    margin: 0.5,
    filename: "fit-parent-report.pdf",
    image: { type: supportsWebPCanvas() ? "webp" : "jpeg" },
    html2canvas: { scale: 1.5 }, // Set scale for higher DPI
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    pagebreak: { mode: "avoid-all" },
  };

  // @ts-ignore: there are no types for html2pdf
  import("html2pdf.js").then((html2pdf) => {
    html2pdf.default().from(element).set(opt).save();
    // dismiss();
  });
};

// Fixed getScoreInterpretation function to handle all score ranges properly
const getScoreInterpretation = (
  dimension: string,
  score: number,
  principlesData: PrinciplesData
) => {
  // Get the levels from the principles data
  const levels = principlesData[dimension]?.levels || [];

  // Determine the appropriate interpretation based on score
  if (score < 25) {
    return levels[1] || "Needs immediate attention.";
  } else if (score < 50) {
    return levels[2] || "Needs growth.";
  } else if (score < 75) {
    return levels[3] || "Good.";
  } else {
    return levels[4] || "Excellent.";
  }
};

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
      ))}{" "}
    </div>
  );
}

function DetailedResources({
  dimension,
  responses,
  principle,
}: {
  dimension: keyof typeof dimensionColors;
  responses: number[];
  principle: PrincipleData;
}) {
  const resources = principle.resources;
  if (!resources) return null;

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
          {/* {detailedResponses[dimension].map((statement, index) => (
            <li key={index} className="text-sm">
              <div className="flex gap-x-2 justify-between items-center opacity-50">
                {statement.statement}
                <DotResponseIndicator
                  score={}
                  dimension={dimension}
                  className="flex"
                />
              </div>
              {statement.action}
              {/* TODO: add statement.statement to this via dot display 
            </li>
          ))} */}
          {principle.statements.map((statement, index) => (
            <li key={index} className="text-sm">
              <div className="flex gap-x-2 justify-between items-center opacity-50">
                {statement.statement}
                <DotResponseIndicator
                  score={responses[index]}
                  dimension={dimension}
                  className="flex"
                />
              </div>
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
          {principle.Scripture.map((verse, index) => (
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

function SharingOptions() {
  return (
    <div className="print:hidden">
      <div className="flex justify-center gap-4 pt-2">
        <Button onClick={printPage} variant="outline" className="gap-2">
          <Printer className="w-4 h-4" /> Print
        </Button>
        <Button onClick={downloadPDF} variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Save as PDF
        </Button>
      </div>
      <div className="pt-2">
        <SocialShare />
      </div>
    </div>
  );
}

function ResultSheet({ principlesData }: { principlesData: PrinciplesData }) {
  const dataParam = useSearchParams().get("data");
  const data = JSON.parse(atob(dataParam!)) as {
    [dimension: string]: [score: number, responses: number[]];
  };

  //   const scores = data.s;
  //   const detailedResponses = data.r;

  const radarData = formatScoresForRadarChart(data);

  // Function to get the question text for a specific dimension and question index
  const getQuestionText = (dimensionIndex: number, questionIndex: number) => {
    const dimension = Object.keys(principlesData)[dimensionIndex];
    return principlesData[dimension].statements[questionIndex].statement;
  };

  return (
    <>
      <div className="text-center text-2xl mt-4 space-y-2">
        <h3 className="font-bold">You scored</h3>
        <div className="text-6xl">
          {Object.values(data).reduce((a, [b]) => a + b, 0)}
        </div>
        <div>out of 1000</div>
      </div>
      <div className="w-full h-[400px] mt-4">
        <CustomRadarChart data={radarData} />
      </div>

      <div className="py-4 space-y-6 border-t">
        <h3 className="text-lg font-semibold">Summary</h3>
        {Object.entries(data).map(([dimension, [score]]) => (
          <div key={dimension} className="space-y-2">
            <div className="flex justify-between items-center">
              <h3
                className={cn(
                  "font-medium flex items-center",
                  dimensionColors[dimension].color
                )}
              >
                <span
                  className={cn(
                    "inline-block w-3 h-3 rounded-full mr-2",
                    dimensionColors[dimension].bg
                  )}
                ></span>
                {dimension}
                <Dialog>
                  <DialogTrigger>
                    <HelpCircle
                      className="h-4 w-4 ml-1 text-muted-foreground opacity-75"
                      onClick={() => {}}
                    />
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
              indicatorClassName={dimensionColors[dimension].bgTranslucent}
            />
            <p className="text-sm text-muted-foreground">
              {getScoreInterpretation(dimension, score, principlesData)}
            </p>
          </div>
        ))}
      </div>

      <div className="py-4 space-y-6 border-t">
        <h3 className="text-lg font-semibold">Detailed Responses</h3>
        {Object.entries(data).map(
          ([dimension, [score, responses]], dimensionIndex) => (
            <div key={dimension} className="space-y-4">
              <div className="flex justify-between items-center">
                <h3
                  className={cn(
                    "font-medium flex items-center",
                    dimensionColors[dimension].color
                  )}
                >
                  <span
                    className={cn(
                      "inline-block w-3 h-3 rounded-full mr-2",
                      dimensionColors[dimension].bg
                    )}
                  ></span>
                  {dimension}
                </h3>
                <span className="text-sm font-semibold">{score}%</span>
              </div>

              {/* <div className="space-y-3">
              {detailedResponses[dimensionIndex].map(
                ([questionIndex, answer], idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <p className="text-sm">
                        {getQuestionText(dimensionIndex, questionIndex)}
                      </p>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <span
                            key={value}
                            className={cn(
                              "w-3 h-3 rounded-full",
                              value <= answer
                                ? dimensionColors[dimension].bg
                                : "bg-gray-200"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div> */}

              <Progress
                value={score}
                className="h-2"
                indicatorClassName={dimensionColors[dimension].bgTranslucent}
              />
              <p className="text-sm text-muted-foreground">
                {getScoreInterpretation(dimension, score, principlesData)}
              </p>

              {/* Render detailed resources for this dimension */}
              <DetailedResources
                dimension={dimension}
                responses={responses}
                principle={principlesData[dimension]}
              />

              <hr className="mt-6 print:mt-4" />
            </div>
          )
        )}
      </div>
    </>
  );
}

export default function ResultsClient({
  principlesData,
}: {
  principlesData: PrinciplesData;
}) {
  return (
    <>
      <ResultSheet principlesData={principlesData} />
      <SharingOptions />
    </>
  );
}
