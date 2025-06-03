import { useState } from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Tooltip,
} from "recharts";
import { dimensionColors } from "@/lib/questions";
import { DimensionScores } from "@/utils/assessment/get-dimension-scores";

interface RadarChartDatum {
  dimension: string;
  score: number;
  fullMark: 100;
  fill: string;
  stroke: string;
}

const formatScoresForRadarChart = (
  scores: DimensionScores
): RadarChartDatum[] => {
  return Object.entries(scores).map(([dimension, [score]]) => ({
    dimension,
    score,
    fullMark: 100,
    fill: (
      dimensionColors[dimension as keyof typeof dimensionColors] ??
      dimensionColors["TRUTH-SEEKING"]
    ).fill,
    stroke: (
      dimensionColors[dimension as keyof typeof dimensionColors] ??
      dimensionColors["TRUTH-SEEKING"]
    ).stroke,
  }));
};

export function RadarChartSection({ data }: { data: DimensionScores }) {
  const radarData = formatScoresForRadarChart(data);
  const [hoveredDimension, setHoveredDimension] =
    useState<RadarChartDatum | null>(null);

  return (
    <div className="w-full h-[400px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          cx="50%"
          cy="50%"
          outerRadius="80%"
          data={radarData}
          onMouseMove={(e) => {
            if (e.activePayload)
              setHoveredDimension(e.activePayload[0].payload);
          }}
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
                radarData.find((d) => d.dimension === e.value) ?? null
              );
            }}
          />
          <Radar
            name="You scored"
            dataKey="score"
            stroke="black"
            strokeWidth={2}
            fill={hoveredDimension?.fill ?? "var(--primary)"}
            className={
              hoveredDimension?.fill +
              " " +
              hoveredDimension?.stroke +
              " transition"
            }
            fillOpacity={0.5}
          />
          <Tooltip formatter={(value, name) => `${value}%`} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
