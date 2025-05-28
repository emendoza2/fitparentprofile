import { PrinciplesData } from "@/lib/types";
import { mapObjectValues } from "@/lib/utils";

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

// Reorganize questions to have one from each dimension on each page
export const createInterlacedQuestions = (
  principlesData: PrinciplesData,
  totalPages: number = Object.values(principlesData).reduce(
    (acc, x) => acc + x.statements.length,
    0
  ) / 10,
  questionsPerPage: number = 10
) => {
  console.log("interlaced qustions", totalPages, questionsPerPage);
  const interlacedQuestions = [];
  const prng = splitmix32(((Math.E / Math.PI) * 2 ** 32) >>> 0);

  // Shuffle questions into one long array
  const shuffledQuestionsByDimension = mapObjectValues(
    principlesData,
    (dimensionData, dimension) =>
      shuffleArray(
        // add dimension and original question index to each statement so that it can be used to reconstruct the original question
        dimensionData.statements.map((statement, index) => ({
          ...statement,
          dimension,
          questionIndex: index,
        })),
        prng
      )
  );

  const questionsPerDimension = Object.values(shuffledQuestionsByDimension)[0]
    .length;

  const shuffledQuestions = Array(questionsPerDimension)
    .fill(null) // make a range of length questionsPerDimension
    .flatMap((_, index) => {
      return shuffleArray(
        Object.values(shuffledQuestionsByDimension).map(
          (questions) => questions[index]
        ),
        prng
      ); // abc+bca+cba, etc
    });

  // Create 10 pages with 10 questions each (one from each dimension)
  for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
    const pageQuestions = [];

    // Add one question from each dimension to this page
    for (
      let questionIndex = 0;
      questionIndex < questionsPerPage;
      questionIndex++
    ) {
      const shuffledQuestionIndex =
        questionIndex + pageIndex * questionsPerPage;
      const question = shuffledQuestions[shuffledQuestionIndex];
      pageQuestions.push(question);
    }

    // Shuffle the questions on this page
    const shuffledPageQuestions = shuffleArray([...pageQuestions], prng);
    interlacedQuestions.push(shuffledPageQuestions);
  }

  return interlacedQuestions;
};
