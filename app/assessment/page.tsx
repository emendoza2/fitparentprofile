"use client";

import { getQuestions } from "@/lib/sheets-api";
import { PersonalityTest } from "@/components/personality-test";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function AssessmentPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["questions"],
    queryFn: getQuestions,
  });

  return (
    <main className="container mx-auto py-8 px-4">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PersonalityTest />
      </HydrationBoundary>
    </main>
  );
}
