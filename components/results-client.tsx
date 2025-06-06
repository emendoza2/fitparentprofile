"use client";

import { ResultSheet } from "@/components/results/result-sheet";
import { SharingOptions } from "@/components/results/sharing-options";
import { DimensionScores } from "@/utils/assessment/get-dimension-scores";
import { User } from "@supabase/supabase-js";
import { AuthProvider } from "./auth/context";

export default function ResultsClient({
  user,
  data,
}: {
  data: DimensionScores;
  user: User | null;
}) {
  const isLoggedIn = !!user;
  return (
    <AuthProvider>
      <ResultSheet data={data} isLoggedIn={isLoggedIn} />
      <SharingOptions />
    </AuthProvider>
  );
}
