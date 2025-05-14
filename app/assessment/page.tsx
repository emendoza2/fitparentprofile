// import { getPrinciples } from "@/lib/principles";
// import { PersonalityTest } from "@/components/personality-test";
// import { createInterlacedQuestions } from "@/lib/util/question-pages";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  useQuery,
} from "@tanstack/react-query";
import { getTest } from "./getTest";
import { PersonalityTest } from "@/components/personality-test";
// import { getTest } from "./getTest";
// import { Assessment } from "./assessment";

export default async function AssessmentPage() {
  const queryClient = new QueryClient();

  // await queryClient.prefetchQuery({
  //   queryKey: ["test"],
  //   queryFn: getTest,
  // });

  // // Fetch principles data on the server
  // const principlesData = await getPrinciples();
  // const questionsPerPage = 20;
  // const totalPages =
  //   Object.values(principlesData).reduce(
  //     (acc, x) => acc + x.statements.length,
  //     0
  //   ) / questionsPerPage;

  // const interlacedQuestions = createInterlacedQuestions(
  //   principlesData,
  //   totalPages,
  //   questionsPerPage
  // ); // I don't like this, but it's a good way to have the questions ordered consistently on the server and client
  const { principlesData, interlacedQuestions, totalPages, questionsPerPage } =
    await getTest();
  return (
    <main className="container mx-auto py-8 px-4">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PersonalityTest
          principlesData={principlesData}
          interlacedQuestions={interlacedQuestions}
          totalPages={totalPages}
          questionsPerPage={questionsPerPage}
        />
      </HydrationBoundary>
    </main>
  );
}
