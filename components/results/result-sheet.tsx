import { PrinciplesData } from "@/lib/types";
import { ScoreSummary } from "@/components/results/score-summary";
import { RadarChartSection } from "@/components/results/radar-chart-section";
import { DimensionSummaryList } from "@/components/results/dimension-summary-list";
import { DetailedResponsesSection } from "@/components/results/detailed-responses-section";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { addCallback } from "@/utils/callback";
import { useMemo, useRef } from "react";
import { personalityTestStore } from "@/lib/store/personality-test-store";
import { useStore } from "zustand";

function LoggedOutBanner() {
  // Should prompt them to create an account to save their results and view the full results
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const callback = pathname + "?" + searchParams.toString();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Save Your Results</CardTitle>
        <CardDescription>
          Create a free account to save your profile and unlock full detailed
          results.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-2">
            <Button asChild>
              <Link href={addCallback("/signup", callback)}>
                Create Account
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href={addCallback("/login", callback)}>Login</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ResultSheet({
  principlesData,
  isLoggedIn,
}: {
  principlesData: PrinciplesData;
  isLoggedIn: boolean;
}) {
  const dataParam = useSearchParams().get("data");
  const store = useStore(personalityTestStore);
  const dataStore = useMemo(
    () => store.calculateCompactAnswers({ principlesData }),
    [store.answers]
  );
  const data = dataParam
    ? (JSON.parse(atob(dataParam)) as {
        [dimension: string]: [score: number, responses: number[]];
      })
    : dataStore;

  return (
    <>
      <ScoreSummary data={data} />
      <RadarChartSection data={data} />
      {isLoggedIn ? (
        <DimensionSummaryList data={data} principlesData={principlesData} />
      ) : (
        <div className="relative">
          <DimensionSummaryList data={data} principlesData={principlesData} />
          <div className="fade-bottom-overlay pointer-events-none absolute left-0 right-0 bottom-0 h-16" />
        </div>
      )}
      {isLoggedIn && (
        <DetailedResponsesSection data={data} principlesData={principlesData} />
      )}
      {!isLoggedIn && <LoggedOutBanner />}
    </>
  );
}
