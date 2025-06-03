import { getPrinciples } from "@/lib/principles";
// import { getPrinciples } from "@/lib/principles";
import { createInterlacedQuestions } from "./createInterlacedQuestions";
import { useQuery } from "@tanstack/react-query";
import { useQuestions } from "@/lib/use-assessment-sheets";
import { useMemo } from "react";

function splitmix32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x9e3779b9) | 0;
    let t = a ^ (a >>> 16);
    t = Math.imul(t, 0x21f0aaad);
    t = t ^ (t >>> 15);
    t = Math.imul(t, 0x735a2d97);
    return ((t = t ^ (t >>> 15)) >>> 0) / 4294967296;
  };
}

const globalPrng = splitmix32(((Math.E / Math.PI) * 2 ** 32) >>> 0);

function shuffleArray<T>(array: T[], prng: () => number = globalPrng): T[] {
  return array.sort(() => prng() - 0.5);
}

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

export function useTest() {
  const { data: questions, ...queryResult } = useQuestions();

  const questionsPerPage = 10;
  const totalPages = questions ? questions.length / questionsPerPage : 0;

  const interlacedQuestions = useMemo(() => {
    if (!questions) return [];
    // Group questions by dimension
    const questionsByDimension = questions.reduce((acc, q) => {
      if (!acc[q.dimension]) {
        acc[q.dimension] = [];
      }
      acc[q.dimension].push(q);
      return acc;
    }, {} as Record<string, typeof questions>);

    const prng = splitmix32(((Math.E / Math.PI) * 2 ** 32) >>> 0);

    // Shuffle questions within each dimension
    const shuffledQuestionsByDimension = Object.fromEntries(
      Object.entries(questionsByDimension).map(([dimension, questions]) => [
        dimension,
        shuffleArray([...questions], prng),
      ])
    );

    // Get number of questions per dimension
    const questionsPerDimension = Object.values(shuffledQuestionsByDimension)[0]
      .length;

    // Create interlaced array of questions
    const interlacedQuestions = Array(questionsPerDimension)
      .fill(null)
      .flatMap((_, index) => {
        return shuffleArray(
          Object.values(shuffledQuestionsByDimension).map(
            (questions) => questions[index]
          )
        );
      });

    // Create pages with shuffled questions
    const totalPages = Math.ceil(interlacedQuestions.length / questionsPerPage);
    const pages = [];

    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
      const pageQuestions = interlacedQuestions.slice(
        pageIndex * questionsPerPage,
        (pageIndex + 1) * questionsPerPage
      );
      pages.push(shuffleArray([...pageQuestions]));
    }
    return pages;
  }, [questions]);

  return {
    data: {
      // principlesData,
      interlacedQuestions,
      totalPages,
      questionsPerPage,
    },
    ...queryResult,
  };
}
