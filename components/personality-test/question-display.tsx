import { dimensionColors } from "@/lib/questions";
import { useAssessment } from "@/lib/store/assessment-sync";
import {
  personalityTestStore,
  Question,
} from "@/lib/store/personality-test-store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useStore } from "zustand";
import { QuestionSchema } from "@/lib/sheets-api";
import { z } from "zod";

const beliefScale = [
  "Strongly disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly agree",
];

const behaviorScale = ["Never", "Rarely", "Sometimes", "Often", "Always"];

interface QuestionDisplayProps {
  questionIndex: number;
  question: z.infer<typeof QuestionSchema>;
  // questionPages: z.infer<typeof QuestionSchema>[][];
  // currentPageQuestions: z.infer<typeof QuestionSchema>[];
}

export function QuestionDisplay({
  questionIndex,
  // questionPages,
  question,
}: // currentPageQuestions,
QuestionDisplayProps) {
  const { data: assessment, setAnswer } = useAssessment();
  // const setAnswer = assessment.setAnswer;

  // const handleOptionSelect = useStore(
  //   personalityTestStore,
  //   (state) => state.handleOptionSelect
  // );

  // const question = currentPageQuestions[questionIndex];
  const answer = assessment.answers[question.id];
  const dimension = question.dimension;
  const dimensionColor =
    dimensionColors[dimension as keyof typeof dimensionColors];

  const scale = question.type === "Behavior" ? behaviorScale : beliefScale;

  // const scaleAbridged = ["Strong", "Disagree", "Neutral", "Agree", "Strong"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 1,
        delay: 0.05 * questionIndex,
      }}
      className="flex gap-3 justify-between flex-col md:flex-row"
    >
      <div className="flex items-center">
        <h3 className="text-base md:text-lg font-medium">
          {question.statement}
        </h3>
      </div>

      <div className="flex flex-col items-center group">
        <div>
          {/* <div
            className={cn(
              "flex justify-between gap-1 mb-2 text-xs text-muted-foreground transition",
              questionIndex === 0
                ? "opacity-75"
                : "opacity-0 group-hover:opacity-75 delay-0 group-hover:delay-1000",
              questionIndex === 0 &&
                answer > 0 &&
                "group-hover:delay-1000 group-hover:opacity-0"
            )}
          >
            <span className="w-6"></span>
            <span className="w-12 text-center">{scaleAbridged[1]}</span>
            <span className="w-6"></span>
            <span className="w-12 text-center">{scaleAbridged[3]}</span>
            <span className="w-6"></span>
          </div> */}

          <div className="flex justify-between items-center gap-x-2">
            {scale.map((title, index) => (
              <label
                key={index + 1}
                title={title}
                aria-label={`Rating ${index + 1}`}
                className="flex flex-col flex-1 items-center justify-center w-16"
              >
                <div
                  className={cn(
                    "rounded-full transition-all duration-200 border-2 cursor-pointer w-9 h-9 md:w-9 md:h-9",
                    dimensionColor.border,
                    answer === index + 1
                      ? dimensionColor.bgTranslucent
                      : "bg-transparent"
                  )}
                ></div>
                <input
                  type="radio"
                  name={`question-${questionIndex}`}
                  value={index + 1}
                  checked={answer === index + 1}
                  onChange={() => setAnswer(question.id, index + 1)}
                  className="sr-only"
                />
                <span
                  className={cn(
                    "mt-2 text-center h-8 text-xs text-muted-foreground transition delay-0 group-hover:delay-1000",
                    // answer > 0
                    // ? "opacity-0 group-hover:opacity-75 pointer-events-none group-hover:pointer-events-auto"
                    // : "opacity-75"
                    "opacity-75"
                  )}
                >
                  {scale[index]}
                </span>
              </label>
            ))}
          </div>

          {/* <div className="relative flex justify-between gap-4 mt-2 text-xs text-muted-foreground h-5"> */}
          {/* Hints: show when not answered, or when answered and hovering */}
          {/* <div
              className={cn(
                "absolute left-0 right-0 flex justify-between w-full transition delay-0 group-hover:delay-1000",
                questionIndex !== 0
                  ? "opacity-0 group-hover:opacity-75 pointer-events-none group-hover:pointer-events-auto"
                  : "opacity-75",
                questionIndex === 0 && answer > 0 && "group-hover:opacity-0"
              )}
              style={{ top: 0 }}
            >
              <span>{scaleAbridged[0]}</span>
              <span>{scaleAbridged[2]}</span>
              <span>{scaleAbridged[4]}</span>
            </div> */}
          {/* <div
              className={cn(
                "absolute left-0 right-0 flex justify-between w-full transition delay-0 group-hover:delay-1000",
                answer > 0
                  ? "opacity-0 group-hover:opacity-75 pointer-events-none group-hover:pointer-events-auto"
                  : "opacity-75"
              )}
              style={{ top: 0 }}
            >
              {scale.map((x) => (
                <span key={x}>{x}</span>
              ))}
            </div> */}
          {/* Scale answer: show when answered and not hovering */}
          {/* <span
              className={cn(
                "absolute left-0 right-0 mx-auto text-center transition delay-0",
                answer > 0
                  ? "opacity-75 group-hover:opacity-0 group-hover:delay-1000"
                  : "opacity-0"
              )}
              style={{ top: 0 }}
            >
              {answer > 0 ? scale[answer - 1] : null}
            </span> */}
          {/* </div> */}
        </div>
      </div>
    </motion.div>
  );
}
