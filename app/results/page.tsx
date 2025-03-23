"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  personalityQuestions,
  dimensions,
  interpretations,
  dimensionColors,
} from "@/lib/questions";
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
import { fitParentResources } from "@/lib/resources";

// Format scores for radar chart with custom colors
interface RadarChartDatum {
  dimension: (typeof dimensions)[number];
  score: number;
  fullMark: 100;
  fill: string;
  stroke: string;
}
const formatScoresForRadarChart = (
  scores: Record<string, number>
): RadarChartDatum[] => {
  return dimensions.map((dimension) => ({
    dimension: dimension,
    score: scores[dimension],
    fullMark: 100,
    fill: dimensionColors[dimension].fill,
    stroke: dimensionColors[dimension].stroke,
  }));
};

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
          name="Your Profile"
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
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
};

const printPage = () => {
  alert("To print properly, ensure that printing backgrounds is checked.");
  window.print();
};
const downloadPDF = async () => {
  const element = document.getElementById("printable");
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  // // Convert SVGs to canvas
  // const svgs = element.getElementsByTagName("svg");
  // for (let i = 0; i < svgs.length; i++) {
  //   const svg = svgs[i];
  //   const svgData = new XMLSerializer().serializeToString(svg);
  //   await canvg.Canvg.from(ctx, svgData);
  //   const imgData = canvas.toDataURL("image/png");
  //   const img = new Image();
  //   img.src = imgData;
  //   svg.parentNode.replaceChild(img, svg);
  // }

  // Capture the element as an image
  // const canvas2 = await html2canvas(element!, {
  //   scale: 4,
  // });

  const opt = {
    margin: 0.5,
    filename: "fit-parent-report.pdf",
    image: { type: "png" },
    html2canvas: { scale: 2 }, // Set scale for higher DPI
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    pagebreak: { mode: "avoid-all" },
  };
  import("html2pdf.js").then((html2pdf) =>
    html2pdf.default().from(element).set(opt).save()
  );

  // // Create PDF
  // const pdf = new jsPDF();
  // canvas2.toBlob((blob) => {
  //   const url = URL.createObjectURL(blob!);
  //   // window.open(url);
  //   // download it
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = "fit-parent-profile.png";
  //   a.click();
  // });
  // window.open(imgData2);
  // pdf.addImage(imgData2, 'PNG', 0, 0);
  // pdf.save('document.pdf');
  // var doc = new jsPDF("l", "mm", [1200, 1210]);

  // doc.html(element, {
  //   callback: function (doc) {
  //     doc.save();
  //   },
  //   x: 10,
  //   y: 10,
  // });
};

// Fixed getScoreInterpretation function to handle all score ranges properly
const getScoreInterpretation = (dimension: string, score: number) => {
  // Check if the dimension exists in interpretations
  if (!interpretations[dimension]) {
    return "No interpretation available for this dimension.";
  }

  // Determine the appropriate interpretation based on score
  if (score < 25) {
    return interpretations[dimension][0] || "Needs immediate attention.";
  } else if (score < 50) {
    return interpretations[dimension][1] || "Needs growth.";
  } else if (score < 75) {
    return interpretations[dimension][2] || "Good.";
  } else {
    return interpretations[dimension][3] || "Excellent.";
  }
};

// Render detailed resources for a specific dimension
const renderDetailedResources = (dimension: (typeof dimensions)[number]) => {
  const resources = fitParentResources[dimension];
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
          Suggestions
        </h4>
        <ul className="space-y-1 list-disc pl-5">
          {resources.dailyActions.map((action, index) => (
            <li key={index} className="text-sm">
              {action}
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
          {resources.bibleVerses.map((verse, index) => (
            <li key={index} className="text-sm">
              <span dangerouslySetInnerHTML={{ __html: verse }} />
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
          {resources.books.map((book, index) => (
            <li key={index} className="text-sm">
              <span dangerouslySetInnerHTML={{ __html: book }} />
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
          {resources.articles.map((article, index) => (
            <li key={index} className="text-sm">
              <span dangerouslySetInnerHTML={{ __html: article }} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default function Results() {
  const scoreParam = useSearchParams().get("scores");
  const scores = JSON.parse(atob(scoreParam!)) as Record<
    (typeof dimensions)[number],
    number
  >;
  const radarData = formatScoresForRadarChart(scores);

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-4xl mx-auto">
        <Card className="border-none shadow-lg">
          <CardContent className="p-6 md:p-8 space-y-6" id="printable">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold">
                Your F.I.T. Parent Profile
              </h2>
              <p className="text-muted-foreground">
                Based on your responses across 10 dimensions
              </p>
              <div className="flex justify-center gap-4 pt-2">
                <Button onClick={printPage} variant="outline" className="gap-2">
                  <Printer className="w-4 h-4" /> Print
                </Button>
                <Button
                  onClick={downloadPDF}
                  variant="outline"
                  className="gap-2"
                >
                  <Download className="w-4 h-4" /> Save as PDF
                </Button>
              </div>
            </div>

            <div className="w-full h-[400px] mt-4">
              <CustomRadarChart data={radarData} />
            </div>

            <div className="py-4 space-y-6">
              {Object.entries(scores).map(([dimension, score]) => (
                <div key={dimension} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3
                      className={cn(
                        "font-medium flex items-center",
                        dimensionColors[
                          dimension as keyof typeof dimensionColors
                        ].color
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block w-3 h-3 rounded-full mr-2",
                          dimensionColors[
                            dimension as keyof typeof dimensionColors
                          ].bg
                        )}
                      ></span>
                      {dimension}
                    </h3>
                    <span className="text-sm font-semibold">{score}%</span>
                  </div>
                  <Progress
                    value={score}
                    className="h-2"
                    indicatorClassName={
                      dimensionColors[dimension as keyof typeof dimensionColors]
                        .bgTranslucent
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    {getScoreInterpretation(dimension, score)}
                  </p>

                  {/* Render detailed resources for this dimension */}
                  {renderDetailedResources(dimension)}

                  <hr className="mt-6 print:mt-4" />
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Button
                // onClick={resetTest}
                asChild
                className="w-full flex items-center justify-center gap-2"
              >
                <Link href="/">
                  <RefreshCcw className="h-4 w-4" /> Take the Test Again
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
