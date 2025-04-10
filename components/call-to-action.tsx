"use client";

import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";
import Link from "next/link";

export default function CallToAction() {
  return (
    <div className="text-center pt-2">
      <Button size="lg" asChild>
        <Link href="/assessment">Start Assessment</Link>
      </Button>
      {/* Time indicator */}
      <div className="text-muted-foreground text-xs pt-2">
        <p>
          <Timer className="inline" size={12} /> Takes 30–60 minutes
        </p>
      </div>
    </div>
  );
}
