"use client";

import { Badge } from "@/components/ui/badge";
import { dimensionColors } from "@/lib/questions";
import { cn, properCase, titleCase } from "@/lib/utils";
import { PrinciplesData } from "@/lib/types";

interface PrinciplesListProps {
  principlesData: PrinciplesData;
}

export default function PrinciplesList({
  principlesData,
}: PrinciplesListProps) {
  // Create a principles array from the fetched data
  const principles = Object.entries(principlesData).map(([id, data]) => ({
    title: data.welcome?.title || titleCase(id),
    badge: properCase(id),
    description: data.description || "",
    color: dimensionColors[id as keyof typeof dimensionColors]?.color || "",
    id,
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
