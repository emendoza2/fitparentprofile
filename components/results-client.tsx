"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Calendar, BookOpen, CheckCircle2, ExternalLink } from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Tooltip,
} from "recharts";
import { toast } from "@/hooks/use-toast";
import { PrincipleData, PrinciplesData } from "@/lib/types";
import { dimensionColors } from "@/lib/questions";
import { ResultSheet } from "@/components/results/result-sheet";
import { SharingOptions } from "@/components/results/sharing-options";
import { AuthProvider } from "./auth/context";
import { User } from "@supabase/supabase-js";
import { PersonalityTestProvider } from "./personality-test/personality-test-context";

// Format scores for radar chart with custom colors
interface RadarChartDatum {
  dimension: string;
  score: number;
  fullMark: 100;
  fill: string;
  stroke: string;
}

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
              {statement.challenge}
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

export default function ResultsClient({
  principlesData,
  user,
}: {
  principlesData: PrinciplesData;
  user: User | null;
}) {
  const isLoggedIn = !!user;
  return (
    <AuthProvider>
      <PersonalityTestProvider
        principlesData={principlesData}
        questionPages={[]}
        totalPages={0}
        questionsPerPage={0}
      >
        <ResultSheet principlesData={principlesData} isLoggedIn={isLoggedIn} />
      </PersonalityTestProvider>
      <SharingOptions />
    </AuthProvider>
  );
}
