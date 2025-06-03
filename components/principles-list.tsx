"use client";

import { Badge } from "@/components/ui/badge";
import { dimensionColors } from "@/lib/questions";
import { cn, properCase, titleCase } from "@/lib/utils";
import { PrinciplesData } from "@/lib/types";
import { z } from "zod";
import { DimensionSchema } from "@/lib/sheets-api";

interface PrinciplesListProps {
  dimensions: z.infer<typeof DimensionSchema>[];
}

export default function PrinciplesList({ dimensions }: PrinciplesListProps) {
  // Create a principles array from the fetched data
  const principles = dimensions.map((dim) => ({
    title: dim.welcome_title || titleCase(dim.dimension),
    badge: properCase(dim.dimension),
    description: dim.welcome_description || "",
    color:
      dimensionColors[dim.dimension as keyof typeof dimensionColors]?.color ||
      "",
    id: dim.dimension,
  }));

  return (
    <dl className="text-left list-disc list-inside text-sm space-y-6">
      {principles.map((principle) => (
        <div key={principle.id}>
          <dt className="text-xl mb-3">
            <strong>
              {principle.title}{" "}
              <Badge
                className={cn(
                  dimensionColors[principle.id as keyof typeof dimensionColors]
                    ?.bg || "bg-gray-500",
                  "align-top inline-block text-base uppercase"
                )}
              >
                {principle.badge}
              </Badge>
            </strong>{" "}
          </dt>
          <dd className="text-muted-foreground">{principle.description}</dd>
        </div>
      ))}
    </dl>
  );
}
