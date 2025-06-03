"use server";

import { useQuestions } from "@/lib/use-assessment-sheets";
import { getTest, useTest } from "./getTest";
import { PersonalityTest } from "@/components/personality-test";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

async function AssessmentPage() {
  // if (isLoading || !testData) {
  //   return <main className="container mx-auto py-8 px-4">Loading...</main>;
  // }
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["test"],
    queryFn: getTest,
  });
  await queryClient.prefetchQuery({
    queryKey: ["questions"],
    queryFn: useQuestions,
  });

  return (
    <main className="container mx-auto py-8 px-4">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PersonalityTest
        // questions={questions}
        // interlacedQuestions={testData.interlacedQuestions}
        // totalPages={testData.totalPages}
        // questionsPerPage={testData.questionsPerPage}
        />
      </HydrationBoundary>
    </main>
  );
}

export default AssessmentPage;
