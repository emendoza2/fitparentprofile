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
// import { jsPDF } from "jspdf";
// import * as canvg from "canvg";
// import html2canvas from "html2canvas";
// import html2pdf from "html2pdf.js";

// Reorganize questions to have one from each dimension on each page

import PersonalityTest from "@/components/personality-test";
import Link from "next/link";

export default function Assessment() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div
        // initial={{ opacity: 0 }}
        // animate={{ opacity: 1 }}
        // transition={{ duration: 0.5 }}
        className="w-full max-w-3xl mx-auto p-4"
      >
        <Card className="shadow-lg">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold">FIT Parenting Assessment</h1>
              <p className="text-muted-foreground text-sm">
                Family. Intentionality. Truth.
              </p>
              <p className="text-base">
                These 10 principles of “being” as a parent form a comprehensive
                framework for Fit Parenting that nurtures your child’s
                spiritual, emotional, mental, relational, physical, and
                practical growth (Luke 2:52). In essence, they encourage parents
                to:
              </p>
              <ul className="text-left list-disc list-inside text-sm space-y-1">
                <li>
                  <strong>Focus on Convictions (Truth-Seeking):</strong> Build
                  your family's foundation on biblical truth and eternal values.
                </li>
                <li>
                  <strong>Model Christlike Behavior (Exemplifying):</strong>{" "}
                  Live out the values and character you want your child to
                  internalize.
                </li>
                <li>
                  <strong>
                    Practice Compassionate Listening (Empathizing):
                  </strong>{" "}
                  Engage in open, empathetic communication to validate your
                  child’s feelings and build trust.
                </li>
                <li>
                  <strong>Prioritize Quality Time (Attending):</strong> Dedicate
                  undivided attention to your child to foster a strong, lasting
                  relationship.
                </li>
                <li>
                  <strong>Encourage and Uplift (Affirming):</strong> Regularly
                  affirm your child’s worth through positive, life-giving words
                  that reflect their identity in Christ.
                </li>
                <li>
                  <strong>Show Unconditional Love (Loving):</strong> Express
                  love consistently and authentically, mirroring the love God
                  shows us.
                </li>
                <li>
                  <strong>Teach the Essential (Teaching):</strong> Equip your
                  child with the knowledge and skills to navigate life’s
                  challenges.
                </li>
                <li>
                  <strong>Discipline with Grace (Training):</strong> Set clear,
                  loving boundaries that guide behavior while nurturing growth
                  and maturity.
                </li>
                <li>
                  <strong>
                    Foster Healthy Conflict Resolution (Peacemaking):
                  </strong>{" "}
                  Cultivate a home environment where conflicts are resolved
                  constructively and relationships are strengthened.
                </li>
                <li>
                  <strong>Yield to God’s Guidance (Yielding):</strong> Surrender
                  your parenting journey to God, trusting and resting in His
                  wisdom and provision.
                </li>
              </ul>
              <p className="text-sm">
                You’ll rate yourself on 10 statements for each principle using a
                1–5 scale. This will take around 30–60 minutes. Be honest! We're
                all works in progress.
              </p>
              {/* <p className="text-sm font-semibold">
                Let this be a guide for growth, not guilt. No parent is
                perfect—but intentional steps matter.
              </p> */}
              <div className="text-left text-xs pt-4 border-t border-muted-foreground/20">
                <p className="font-semibold">Selected References:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    Focus on the Family. <em>Parenting resources</em>. Retrieved
                    from https://www.focusonthefamily.com
                  </li>
                  <li>
                    FamilyLife. <em>Family ministry and parenting insights</em>.
                    Retrieved from https://www.familylife.com
                  </li>
                  <li>
                    Rosemond, John (2013).{" "}
                    <em>
                      Parenting by The Book: Biblical Wisdom for Raising Your
                      Child
                    </em>
                    . Simon and Schuster.
                  </li>
                  <li>
                    Tan-Chi, Peter, & Tan-Chi, Deonna (2020).{" "}
                    <em>Motivate!: 8 Secrets of Successful Parenting</em>. OMF
                    Literature.
                  </li>
                  <li>
                    Thomas, Gary (2004).{" "}
                    <em>
                      Sacred Parenting: How Raising Children Shapes Our Souls
                    </em>
                    . Zondervan.
                  </li>
                  <li>
                    Tripp, Paul David (2016).{" "}
                    <em>
                      Parenting: 14 Gospel Principles That Can Radically Change
                      Your Family
                    </em>
                    . Crossway.
                  </li>
                  <li>
                    Faber, Adele, & Mazlish, Elaine (2012).{" "}
                    <em>
                      How to Talk So Kids Will Listen & Listen So Kids Will Talk
                    </em>
                    . Scribner.
                  </li>
                </ul>
              </div>
            </div>
            <div className="text-center pt-4">
              <Button size="lg" asChild>
                <Link href="/assessment">Start Assessment</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
