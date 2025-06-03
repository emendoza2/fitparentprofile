"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";
import ResultsClient from "@/components/results-client";
import { useAuth } from "@/components/auth/context";
import { getPrinciples } from "@/lib/principles";
import { useAssessment } from "@/lib/store/assessment-sync";
import { useQuestions } from "@/lib/use-assessment-sheets";
import {
  DimensionScores,
  getDimensionScores,
} from "@/utils/assessment/get-dimension-scores";
import { useRouter } from "next/navigation";
import ProfileDropdown from "@/components/ui/profile-dropdown";

export default function Results() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const {
    data: { answers },
    loading: assessmentLoading,
  } = useAssessment(user?.id); // if the user exists, passing this will allow the results to sync.
  const { data: questions, isLoading, error } = useQuestions();
  const data: DimensionScores = useMemo(
    () => getDimensionScores(answers, questions),
    [questions, answers]
  );
  useEffect(() => {
    if (!user && !loading) {
      const currentPath = window.location.pathname + window.location.search;
      router.replace(`/signup?callback=${encodeURIComponent(currentPath)}`);
    }
  }, [user, loading, router]);

  // const [principlesData, setPrinciplesData] = useState<any>(null);

  // useEffect(() => {
  //   getPrinciples().then(setPrinciplesData);
  // }, []);

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-4xl mx-auto relative">
        {user && (
          <div className="absolute top-4 right-4 z-10">
            <ProfileDropdown />
          </div>
        )}
        <Card className="border-none shadow-lg">
          <CardContent className="p-6 md:p-8 space-y-6" id="printable">
            <div className="flex justify-center">
              <Image
                src="/logo.svg"
                width={200}
                height={200}
                alt="FIT Parenting Logo"
                priority
              />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold">
                Your FIT Parent Profile
              </h2>
              <p className="text-muted-foreground">
                Based on your responses across 10 dimensions
              </p>
            </div>

            <Suspense>
              {data && !assessmentLoading ? (
                <ResultsClient data={data} user={user} />
              ) : (
                <div>Loading results...</div>
              )}
            </Suspense>

            <p className="mb-2 text-center">
              Don't just take our word for it. Dig deeper by checking out our{" "}
              <Link
                href="/research"
                target="_blank"
                className="text-sky-11 underline"
              >
                research
              </Link>
              .{" "}
            </p>

            <div className="pt-4 print:hidden">
              <Link
                href="/"
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M8 16H3v5" />
                </svg>{" "}
                Take the Test Again
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </main>
  );
}
