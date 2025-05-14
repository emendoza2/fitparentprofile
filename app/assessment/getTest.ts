"use server";

import { getPrinciples } from "@/lib/principles";
// import { getPrinciples } from "@/lib/principles";
import { createInterlacedQuestions } from "./createInterlacedQuestions";

export async function getTest() {
  const principlesData = await getPrinciples();
  const questionsPerPage = 20;
  const totalPages =
    Object.values(principlesData).reduce(
      (acc, x) => acc + x.statements.length,
      0
    ) / questionsPerPage;

  const interlacedQuestions = createInterlacedQuestions(
    principlesData,
    totalPages,
    questionsPerPage
  ); // I don't like this, but it's a good way to have the questions ordered consistently on the server and client

  return {
    principlesData,
    interlacedQuestions,
    totalPages,
    questionsPerPage,
  };
}
