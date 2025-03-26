"use client";
import { useState, useEffect, Suspense } from "react";
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
import { fitParentResources } from "@/lib/resources";
import SocialShare from "@/components/social-share";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "@/hooks/use-toast";
import { principles } from "@/lib/principles";
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
import Image from "next/image";

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

function supportsWebPCanvas() {
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

function DetailedResources({
  dimension,
}: {
  dimension: (typeof dimensions)[number];
}) {
  const resources = principles[dimension];
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
          {resources.statements.map((statement, index) => (
            <li key={index} className="text-sm">
              {statement.action}
              {/* TODO: add statement.statement to this via dot display */}
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
          {resources.Scripture.map((verse, index) => (
            <li key={index} className="text-sm">
              <a
                href={
                  "https://www.biblegateway.com/passage/?search=" +
                  encodeURIComponent(verse.reference) +
                  "&version=ESV"
                }
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
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
          {resources.resources
            .filter((r) => r.category === "Book")
            .map((book, index) => (
              <li key={index} className="text-sm">
                <a
                  href={book.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
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
          {resources.resources
            .filter((r) => r.category !== "Book")
            .map((article, index) => (
              <li key={index} className="text-sm">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
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

function ResultSheet() {
  const scoreParam = useSearchParams().get("scores");
  const scores = JSON.parse(atob(scoreParam!)) as Record<
    (typeof dimensions)[number],
    number
  >;
  const radarData = formatScoresForRadarChart(scores);

  return (
    <>
      <div className="text-center text-2xl mt-4 space-y-2">
        <h3 className="font-bold">You scored</h3>
        <div className="text-6xl">
          {Object.values(scores).reduce((a, b) => a + b, 0)}
        </div>
        <div>out of 1000</div>
      </div>
      <div className="w-full h-[400px] mt-4">
        <CustomRadarChart data={radarData} />
      </div>

      <div className="py-4 space-y-6 border-t">
        <h3 className="text-lg font-semibold">Summary</h3>
        {Object.entries(scores).map(([dimension, score]) => (
          <div key={dimension} className="space-y-2">
            <div className="flex justify-between items-center">
              <h3
                className={cn(
                  "font-medium flex items-center",
                  dimensionColors[dimension as keyof typeof dimensionColors]
                    .color
                )}
              >
                <span
                  className={cn(
                    "inline-block w-3 h-3 rounded-full mr-2",
                    dimensionColors[dimension as keyof typeof dimensionColors]
                      .bg
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
                    <p>
                      {principles[dimension as keyof typeof principles].why}
                    </p>
                  </DialogContent>
                </Dialog>
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
          </div>
        ))}
      </div>

      <div className="py-4 space-y-6 border-t">
        <h3 className="text-lg font-semibold">Breakdown</h3>
        {Object.entries(scores).map(([dimension, score]) => (
          <div key={dimension} className="space-y-2">
            <div className="flex justify-between items-center">
              <h3
                className={cn(
                  "font-medium flex items-center",
                  dimensionColors[dimension as keyof typeof dimensionColors]
                    .color
                )}
              >
                <span
                  className={cn(
                    "inline-block w-3 h-3 rounded-full mr-2",
                    dimensionColors[dimension as keyof typeof dimensionColors]
                      .bg
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
            <DetailedResources
              dimension={dimension as keyof typeof dimensionColors}
            />

            <hr className="mt-6 print:mt-4" />
          </div>
        ))}
      </div>
    </>
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

export default function Results() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-4xl mx-auto">
        <Card className="border-none shadow-lg">
          <CardContent className="p-6 md:p-8 space-y-6" id="printable">
            <div className="flex justify-center">
              <Image
                src="/fit-parenting-logo.png"
                width={200}
                height={200}
                alt="FIT Parenting Logo"
              />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold">
                Your FIT Parent Profile
              </h2>
              <p className="text-muted-foreground">
                Based on your responses across 10 dimensions
              </p>
              <SharingOptions />
            </div>

            <Suspense>
              <ResultSheet />
            </Suspense>

            <p className="mb-2 text-center">
              Don't just take our word for it. Dig deeper by checking out our{" "}
              <Link
                href="/research"
                target="_blank"
                className="text-blue-600 underline"
              >
                research
              </Link>
              .{" "}
            </p>

            <div className="pt-4 print:hidden">
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
            <SharingOptions />
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </main>
  );
}
