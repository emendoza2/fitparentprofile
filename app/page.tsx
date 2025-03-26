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
  Hourglass,
  HourglassIcon,
  Watch,
  LucideWatch,
  Clock1,
  Clock9,
  Timer,
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
import PersonalityTest from "@/components/personality-test";
import Link from "next/link";
import Image from "next/image";

const principles = [
  {
    title: "Focus on Convictions",
    badge: "Truth-Seeking",
    description:
      "Build your family's foundation on biblical truth and eternal values.",
    color: dimensionColors["TRUTH-SEEKING"].color,
    id: "TRUTH-SEEKING",
  },
  {
    title: "Model Christlike Behavior",
    badge: "Exemplifying",
    description:
      "Live out the values and character you want your child to internalize.",
    color: dimensionColors["EXEMPLIFYING"].color,
    id: "EXEMPLIFYING",
  },
  {
    title: "Practice Compassionate Listening",
    badge: "Empathizing",
    description:
      "Engage in open, empathetic communication to validate your child’s feelings and build trust.",
    color: dimensionColors["EMPATHIZING"].color,
    id: "EMPATHIZING",
  },
  {
    title: "Prioritize Quality Time",
    badge: "Attending",
    description:
      "Dedicate undivided attention to your child to foster a strong, lasting relationship.",
    color: dimensionColors["ATTENDING"].color,
    id: "ATTENDING",
  },
  {
    title: "Encourage and Uplift",
    badge: "Affirming",
    description:
      "Regularly affirm your child’s worth through positive, life-giving words that reflect their identity in Christ.",
    color: dimensionColors["AFFIRMING"].color,
    id: "AFFIRMING",
  },
  {
    title: "Show Unconditional Love",
    badge: "Loving",
    description:
      "Express love consistently and authentically, mirroring the love God shows us.",
    color: dimensionColors["LOVING"].color,
    id: "LOVING",
  },
  {
    title: "Teach the Essential",
    badge: "Teaching",
    description:
      "Equip your child with the knowledge and skills to navigate life’s challenges.",
    color: dimensionColors["TEACHING"].color,
    id: "TEACHING",
  },
  {
    title: "Discipline with Grace",
    badge: "Training",
    description:
      "Set clear, loving boundaries that guide behavior while nurturing growth and maturity.",
    color: dimensionColors["TRAINING"].color,
    id: "TRAINING",
  },
  {
    title: "Foster Healthy Conflict Resolution",
    badge: "Peacemaking",
    description:
      "Cultivate a home environment where conflicts are resolved constructively and relationships are strengthened.",
    color: dimensionColors["PEACEMAKING"].color,
    id: "PEACEMAKING",
  },
  {
    title: "Yield to God’s Guidance",
    badge: "Yielding",
    description:
      "Surrender your parenting journey to God, trusting and resting in His wisdom and provision.",
    color: dimensionColors["YIELDING"].color,
    id: "YIELDING",
  },
];

export default function Assessment() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-3xl mx-auto p-4">
        <Card className="shadow-lg">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="flex justify-center">
              <Image
                src="/fit-parenting-logo.png"
                width={200}
                height={200}
                alt="FIT Parenting Logo"
              />
            </div>
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold">
                Get Your FIT Parent Profile
              </h1>
              <p className="text-muted-foreground text-sm">
                Family. Intentionality. Truth.
              </p>
              <CallToAction />
              <p className="text-base">
                Welcome to the life-long pursuit of building a healthy
                relationship with your child. Take our assessment to understand
                10 principles that address your child's emotional, mental,
                physical, relational, and spiritual health.{" "}
              </p>
              <dl className="text-left list-disc list-inside text-sm space-y-6">
                {principles.map((principle, index) => (
                  <div key={principle.id}>
                    <dt className="text-xl mb-3">
                      <strong>
                        {principle.title}{" "}
                        <Badge
                          className={cn(
                            dimensionColors[principle.id].bg,
                            "align-top inline-block text-base uppercase"
                          )}
                        >
                          {principle.badge}
                        </Badge>
                      </strong>{" "}
                    </dt>
                    <dd className="text-muted-foreground">
                      {principle.description}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="text-sm">
                You’ll rate yourself on 10 statements for each principle using a
                1–5 scale from Strongly Disagree to Strongly Agree. Be honest!
                We're all works in progress.
              </p>
              <div className="text-left text-xs pt-4 border-t border-muted-foreground/20">
                <p className="mb-2">
                  If you'd like to dig deeper, check out our{" "}
                  <Link href="/research" className="text-blue-600 underline">
                    research
                  </Link>
                  .{" "}
                </p>
              </div>
            </div>
            <CallToAction />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
function CallToAction() {
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
