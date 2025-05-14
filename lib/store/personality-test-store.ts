import { create, useStore } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { PrinciplesData, StatementItem } from "@/lib/types";
import { dimensions, personalityQuestions } from "@/lib/questions";
import { mapObjectValues } from "../utils";
import { produce } from "immer";

export interface Question extends StatementItem {
  // dimensionIndex: number;
  dimension: string; // the dimension that the question belongs to
  questionIndex: number; // the original index of the question in the dimension
}

export interface PersonalityTestProps {
  principlesData: PrinciplesData;
  questionPages: Question[][];
  totalPages: number;
  questionsPerPage: number;
}

export interface PersonalityTestState {
  // Questions state
  // interlacedQuestions: Question[][];
  currentPage: number;
  // totalPages: number;
  // questionsPerPage: number;

  // Answers state
  answers: Record<string, number[]>;

  // UI state
  direction: number;
  showPreview: boolean;

  // Computed values
  getCurrentPageQuestions: (props: {
    questionPages: Question[][];
  }) => Question[];
  getPageProgress: (props: { totalPages: number }) => number;
  getQuestionProgress: (props: {
    totalPages: number;
    questionsPerPage: number;
  }) => number;

  // Actions
  // setInterlacedQuestions: (questions: Question[][]) => void;
  setCurrentPage: (page: number) => void;
  setAnswers: (answers: Record<string, number[]>) => void;
  setDirection: (direction: number) => void;
  setShowPreview: (show: boolean) => void;

  // Helper functions
  handleOptionSelect: (
    props: { questionPages: Question[][] },
    questionIndex: number,
    value: number
  ) => void;
  getAnswerForQuestion: (
    props: { questionPages: Question[][] },
    questionIndex: number
  ) => number;
  isPageComplete: (props: { questionPages: Question[][] }) => boolean;
  calculateDimensionScores: (props: { principlesData: PrinciplesData }) => {
    scores: Record<string, number>;
    detailedResponses: Record<
      string,
      Array<{ question: string; answer: number }>
    >;
  };
  calculateCompactAnswers: (props: {
    principlesData: PrinciplesData;
  }) => Record<string, [number, number[]]>;
}

export function createPersonalityTestStore(
  initProps: Partial<PersonalityTestProps> &
    Pick<PersonalityTestProps, "principlesData">
  // principlesData: PrinciplesData
) {
  const DEFAULT_PROPS: PersonalityTestProps = {
    principlesData: {},
    questionPages: [],
    totalPages: 10,
    questionsPerPage: 10,
  };

  const dimensions = Object.keys(initProps.principlesData);
  const answers = mapObjectValues(
    initProps.principlesData,
    (dimensionData) => Array(dimensionData.statements.length).fill(0) // empty answer = 0
  );

  return create<PersonalityTestState>()(
    devtools(
      persist(
        (set, get) => ({
          // Initial state
          ...DEFAULT_PROPS,
          ...initProps,
          currentPage: 0,
          answers,
          direction: 0,
          showPreview: false,

          // Computed values
          getCurrentPageQuestions: () =>
            get().questionPages[get().currentPage] ?? [],

          getPageProgress: () =>
            (((get().currentPage ?? 0) + 1) / (get().totalPages ?? 10)) * 100,

          getQuestionProgress: () =>
            (Object.values(get().answers)
              .flat()
              .filter((answer) => answer !== 0).length /
              (get().totalPages * get().questionsPerPage)) *
            100,

          // Actions
          setInterlacedQuestions: (questions) =>
            set({ questionPages: questions }),
          setCurrentPage: (page) => set({ currentPage: page }),
          setAnswers: (answers) => set({ answers }),
          setDirection: (direction) => set({ direction }),
          setShowPreview: (show) => set({ showPreview: show }),

          // Helper functions
          handleOptionSelect: (
            props: { questionPages: Question[][] },
            questionIndex,
            value
          ) =>
            set(({ getCurrentPageQuestions, answers }) => ({
              answers: produce(answers, (draft) => {
                const question = getCurrentPageQuestions({
                  questionPages: props.questionPages,
                })[questionIndex];
                draft[question.dimension][question.questionIndex] = value;
              }),
            })),

          getAnswerForQuestion: (
            props: { questionPages: Question[][] },
            questionIndex: number
          ) => {
            const { getCurrentPageQuestions, answers } = get();
            const currentPageQuestions = getCurrentPageQuestions({
              questionPages: props.questionPages,
            });
            if (!currentPageQuestions[questionIndex]) return 0;

            const question = currentPageQuestions[questionIndex];

            return answers[question.dimension][question.questionIndex];
          },

          isPageComplete: (props: { questionPages: Question[][] }) => {
            const { getCurrentPageQuestions, getAnswerForQuestion } = get();
            return getCurrentPageQuestions({
              questionPages: props.questionPages,
            }).every(
              (_, i) =>
                getAnswerForQuestion(
                  { questionPages: props.questionPages },
                  i
                ) !== 0
            );
          },

          calculateDimensionScores: () => {
            const { answers } = get();
            const scores: Record<string, number> = {};
            const detailedResponses: Record<
              string,
              Array<{ question: string; answer: number }>
            > = {};

            dimensions.forEach((dimension, dimensionIndex) => {
              // Calculate score for each dimension based on the 10 questions in that dimension
              let totalScore = 0;
              const maxScore =
                initProps.principlesData[dimension].statements.length * 5; // because 5 is the max answer score
              const dimensionResponses: Array<{
                question: string;
                answer: number;
              }> = [];

              for (
                let questionIndex = 0;
                questionIndex < answers[dimension].length;
                questionIndex++
              ) {
                const answer = answers[dimension][questionIndex];
                totalScore += answer;

                // Store the detailed response
                dimensionResponses.push({
                  question:
                    initProps.principlesData[dimension].statements[
                      questionIndex
                    ].statement,
                  answer: answer,
                });
              }

              // Convert to percentage (max score would be 10 questions * 5 points = 50)
              const percentageScore = Math.round((totalScore / maxScore) * 100);
              scores[dimension] = percentageScore;
              detailedResponses[dimension] = dimensionResponses;
            });

            return { scores, detailedResponses };
          },

          calculateCompactAnswers: () => {
            const dimensionScores = get().calculateDimensionScores();
            return Object.fromEntries(
              Object.entries(dimensionScores.detailedResponses).map(
                ([dimension, responses]) => {
                  return [
                    dimension,
                    [
                      dimensionScores.scores[dimension],
                      responses.map((response) => response.answer),
                    ],
                  ];
                }
              )
            );
          },
        }),
        {
          name: "personality-test-storage",
        }
      ),
      {
        enabled: true,
        name: "Personality Test Store",
      }
    )
  );
}

export type PersonalityTestStore = ReturnType<
  typeof createPersonalityTestStore
>;
export const personalityTestStore = create<PersonalityTestState>()(
  devtools(
    persist(
      (set, get) => ({
        // UI state
        currentPage: 0,
        direction: 0,
        showPreview: false,
        answers: {},
        // principlesData: {},
        // questionPages: [],
        // totalPages: 10,
        // questionsPerPage: 10,

        // Computed values
        getCurrentPageQuestions: (props: { questionPages: Question[][] }) =>
          props.questionPages[get().currentPage] ?? [],

        getPageProgress: (props: { totalPages: number }) =>
          (((get().currentPage ?? 0) + 1) / (props.totalPages ?? 10)) * 100,

        getQuestionProgress: (props: {
          totalPages: number;
          questionsPerPage: number;
        }) => {
          const totalQuestions = props.totalPages * props.questionsPerPage;
          const answeredCount = Object.values(get().answers)
            .flat()
            .filter((answer) => answer !== 0).length;
          return (answeredCount / totalQuestions) * 100;
        },

        // Actions
        // setInterlacedQuestions: (questions) => set({ questionPages: questions }),
        setCurrentPage: (page) => set({ currentPage: page }),
        setAnswers: (answers) => set({ answers }),
        setDirection: (direction) => set({ direction }),
        setShowPreview: (show) => set({ showPreview: show }),

        // Helper functions
        handleOptionSelect: (
          props: { questionPages: Question[][] },
          questionIndex,
          value
        ) => {
          const { currentPage, answers } = get();
          set({
            answers: produce(answers, (draft) => {
              const question = props.questionPages[currentPage][questionIndex];
              const dimension = question.dimension;

              draft[dimension] ??= [];
              draft[dimension][question.questionIndex] = value;
            }),
          });
        },

        getAnswerForQuestion: (
          props: { questionPages: Question[][] },
          questionIndex: number
        ) => {
          const currentPage = get().currentPage;
          const question = props.questionPages[currentPage]?.[questionIndex];
          if (!question) return 0;

          const dimension = question.dimension;
          const answers = get().answers[dimension] || [];
          return answers[question.questionIndex] || 0;
        },

        isPageComplete: (props: { questionPages: Question[][] }) => {
          const currentPageQuestions = get().getCurrentPageQuestions({
            questionPages: props.questionPages,
          });
          return currentPageQuestions.every(
            (_, index) =>
              get().getAnswerForQuestion(
                { questionPages: props.questionPages },
                index
              ) !== 0
          );
        },

        calculateDimensionScores: (props: {
          principlesData: PrinciplesData;
        }) => {
          const { answers } = get();
          const { principlesData } = props;
          const scores: Record<string, number> = {};
          const detailedResponses: Record<
            string,
            Array<{ question: string; answer: number }>
          > = {};

          Object.keys(props).forEach((dimension) => {
            const dimensionAnswers = answers[dimension] || [];
            const dimensionResponses: Array<{
              question: string;
              answer: number;
            }> = [];
            let totalScore = 0;
            let maxScore = 0;

            for (
              let questionIndex = 0;
              questionIndex < dimensionAnswers.length;
              questionIndex++
            ) {
              const answer = dimensionAnswers[questionIndex] || 0;
              if (answer === 0) continue;

              totalScore += answer;
              maxScore += 5;

              dimensionResponses.push({
                question:
                  principlesData[dimension].statements[questionIndex].statement,
                answer: answer,
              });
            }

            const percentageScore =
              maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
            scores[dimension] = percentageScore;
            detailedResponses[dimension] = dimensionResponses;
          });

          return { scores, detailedResponses };
        },

        calculateCompactAnswers: (props: {
          principlesData: PrinciplesData;
        }) => {
          const dimensionScores = get().calculateDimensionScores({
            principlesData: props.principlesData,
          });
          return Object.fromEntries(
            Object.entries(dimensionScores.detailedResponses).map(
              ([dimension, responses]) => {
                return [
                  dimension,
                  [
                    dimensionScores.scores[dimension],
                    responses.map((response) => response.answer),
                  ],
                ];
              }
            )
          );
        },
      }),
      {
        name: "personality-test-storage",
      }
    ),
    {
      enabled: true,
      name: "Personality Test Store",
    }
  )
);

function usePersonalityTestStore(
  principlesData: PrinciplesData,
  interlacedQuestions: Question[][],
  totalPages: number,
  questionsPerPage: number
) {
  const store = useStore(personalityTestStore);
  return {
    principlesData,
    interlacedQuestions,
    totalPages,
    questionsPerPage,
    ...store,
  };
}
// export const usePersonalityTestStore = create<PersonalityTestState>()(
//   devtools(
//     (set, get) => ({
//       // Initial state
//       interlacedQuestions: [],
//       currentPage: 0,
//       totalPages: 10,
//       questionsPerPage: 10,
//       answers: [],
//       direction: 0,
//       showPreview: false,

//       // Computed values
//       getCurrentPageQuestions: () =>
//         get().questionPages[get().currentPage] ?? [],

//       getPageProgress: () =>
//         (((get().currentPage ?? 0) + 1) / (get().totalPages ?? 10)) * 100,

//       getQuestionProgress: () =>
//         (get().answers.filter((answer) => answer !== 0).length /
//           (get().totalPages * get().questionsPerPage)) *
//         100,

//       // Actions
//       setInterlacedQuestions: (questions) => set({ questionPages: questions }),
//       setCurrentPage: (page) => set({ currentPage: page }),
//       setAnswers: (answers) => set({ answers }),
//       setDirection: (direction) => set({ direction }),
//       setShowPreview: (show) => set({ showPreview: show }),

//       // Helper functions
//       handleOptionSelect: (questionIndex, value) => {
//         const { getCurrentPageQuestions, answers } = get();
//         const newAnswers = [...answers];
//         const question = getCurrentPageQuestions()[questionIndex];

//         const globalQuestionIndex =
//           question.dimensionIndex * 10 + question.questionIndex;
//         newAnswers[globalQuestionIndex] = value;

//         set({ answers: newAnswers });
//       },

//       getAnswerForQuestion: (questionIndex) => {
//         const { getCurrentPageQuestions, answers } = get();
//         const currentPageQuestions = getCurrentPageQuestions();
//         if (!currentPageQuestions[questionIndex]) return 0;

//         const question = currentPageQuestions[questionIndex];
//         const globalQuestionIndex =
//           question.dimensionIndex * 10 + question.questionIndex;
//         return answers[globalQuestionIndex];
//       },

//       isPageComplete: () => {
//         const { getCurrentPageQuestions, getAnswerForQuestion } = get();
//         return getCurrentPageQuestions().every(
//           (_, i) => getAnswerForQuestion(i) !== 0
//         );
//       },

//       calculateDimensionScores: () => {
//         const { answers } = get();
//         const scores: Record<string, number> = {};
//         const detailedResponses: Record<
//           string,
//           Array<{ question: string; answer: number }>
//         > = {};

//         dimensions.forEach((dimension, dimensionIndex) => {
//           // Calculate score for each dimension based on the 10 questions in that dimension
//           let totalScore = 0;
//           const dimensionResponses: Array<{
//             question: string;
//             answer: number;
//           }> = [];

//           for (let questionIndex = 0; questionIndex < 10; questionIndex++) {
//             const answerIndex = dimensionIndex * 10 + questionIndex;
//             const answer = answers[answerIndex];
//             totalScore += answer;

//             // Store the detailed response
//             dimensionResponses.push({
//               question:
//                 personalityQuestions[dimensionIndex][questionIndex].question,
//               answer: answer,
//             });
//           }

//           // Convert to percentage (max score would be 10 questions * 5 points = 50)
//           const percentageScore = Math.round((totalScore / 50) * 100);
//           scores[dimension] = percentageScore;
//           detailedResponses[dimension] = dimensionResponses;
//         });

//         return { scores, detailedResponses };
//       },
//     }),
//     {
//       enabled: true,
//       name: "Personality Test Store",
//     }
//   )
// );
