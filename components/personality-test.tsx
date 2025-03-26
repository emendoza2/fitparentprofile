"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  personalityQuestions,
  dimensions,
  interpretations,
  dimensionColors,
} from "@/lib/questions";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  RefreshCcw,
  BarChart,
  Printer,
  Download,
  HelpCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Tooltip,
  Legend,
} from "recharts";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
// import { jsPDF } from "jspdf";
// import * as canvg from "canvg";
// import html2canvas from "html2canvas";
// import html2pdf from "html2pdf.js";

// Reorganize questions to have one from each dimension on each page
const createInterlacedQuestions = () => {
  const interlacedQuestions = [];

  // Create 10 pages with 10 questions each (one from each dimension)
  for (let pageIndex = 0; pageIndex < 10; pageIndex++) {
    const pageQuestions = [];

    // Add one question from each dimension to this page
    for (let dimensionIndex = 0; dimensionIndex < 10; dimensionIndex++) {
      // Get the question from this dimension that corresponds to the current page
      const question = personalityQuestions[dimensionIndex][pageIndex];

      // Add dimension info to the question for tracking
      pageQuestions.push({
        ...question,
        dimensionIndex,
        questionIndex: pageIndex,
      });
    }

    // Shuffle the questions on this page
    const shuffledPageQuestions = [...pageQuestions].sort(
      () => Math.random() - 0.5
    );
    interlacedQuestions.push(shuffledPageQuestions);
  }

  return interlacedQuestions;
};

// Sample data for preview
const getDummyData = () => {
  const dummyScores: Record<string, number> = {};

  dimensions.forEach((dimension) => {
    // Generate random scores between 40 and 80 for a balanced profile
    dummyScores[dimension] = Math.floor(Math.random() * 40) + 40;
  });

  return dummyScores;
};

export default function PersonalityTest() {
  const [interlacedQuestions, setInterlacedQuestions] = useState<
    {
      dimensionIndex: number;
      questionIndex: number;
      question: string;
    }[][]
  >([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    Array(personalityQuestions.flat().length).fill(0)
  );
  const [showResults, setShowResults] = useState(false);
  const [direction, setDirection] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [dummyData] = useState(getDummyData());
  const router = useRouter();

  // Initialize interlaced questions on component mount
  useEffect(() => {
    setInterlacedQuestions(createInterlacedQuestions());
  }, []);

  const totalPages = 10;
  const questionsPerPage = 10;
  const currentPageQuestions = interlacedQuestions[currentPage] || [];

  const pageProgress = ((currentPage + 1) / totalPages) * 100;
  const questionProgress =
    (answers.filter((answer) => answer !== 0).length /
      (totalPages * questionsPerPage)) *
    100;

  const handleOptionSelect = (questionIndex: number, value: number) => {
    const newAnswers = [...answers];
    const question = currentPageQuestions[questionIndex];

    // Calculate the original global index based on dimension and question index
    const globalQuestionIndex =
      question.dimensionIndex * 10 + question.questionIndex;

    newAnswers[globalQuestionIndex] = value;
    setAnswers(newAnswers);
  };

  const getAnswerForQuestion = (questionIndex: number) => {
    if (!currentPageQuestions[questionIndex]) return 0;

    const question = currentPageQuestions[questionIndex];
    const globalQuestionIndex =
      question.dimensionIndex * 10 + question.questionIndex;
    return answers[globalQuestionIndex];
  };

  const isPageComplete = () => {
    // Check if all questions on the current page have been answered
    for (let i = 0; i < currentPageQuestions.length; i++) {
      if (getAnswerForQuestion(i) === 0) {
        return false;
      }
    }
    return true;
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setDirection(1);
      window.scrollTo(0, 0);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
      }, 200);
    } else {
      router.push(
        "results?scores=" +
          encodeURIComponent(btoa(JSON.stringify(calculateDimensionScores())))
      );
      window.scrollTo(0, 0);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setDirection(-1);
      window.scrollTo(0, 0);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
      }, 200);
    }
  };

  // const resetTest = () => {
  //   setAnswers(Array(personalityQuestions.flat().length).fill(0));
  //   setCurrentPage(0);
  //   setShowResults(false);
  //   setShowPreview(false);
  //   setInterlacedQuestions(createInterlacedQuestions()); // Regenerate questions for a new test
  // };

  const calculateDimensionScores = () => {
    const scores: Record<string, number> = {};

    dimensions.forEach((dimension, dimensionIndex) => {
      // Calculate score for each dimension based on the 10 questions in that dimension
      let totalScore = 0;

      for (let questionIndex = 0; questionIndex < 10; questionIndex++) {
        const answerIndex = dimensionIndex * 10 + questionIndex;
        totalScore += answers[answerIndex];
      }

      // Convert to percentage (max score would be 10 questions * 5 points = 50)
      const percentageScore = Math.round((totalScore / 50) * 100);
      scores[dimension] = percentageScore;
    });

    return scores;
  };

  // Function to get circle size based on position (1-5)
  const getCircleSize = (position: number) => {
    // Position 1 and 5 are largest, 3 is smallest
    switch (position) {
      case 1:
      case 5:
        return "w-6 h-6 md:w-7 md:h-7";
      case 2:
      case 4:
        return "w-6 h-6 md:w-7 md:h-7";
      case 3:
        return "w-6 h-6 md:w-7 md:h-7";
      default:
        return "w-6 h-6";
    }
  };

  // Function to get circle border color based on position (1-5)
  const getCircleBorderColor = (position: number) => {
    switch (position) {
      case 1:
        return "border-gray-400";
      case 2:
        return "border-gray-400";
      case 3:
        return "border-gray-400";
      case 4:
        return "border-gray-400";
      case 5:
        return "border-gray-400";
      default:
        return "border-gray-400";
    }
  };

  // Function to get circle fill color when selected
  const getCircleFillColor = (position: number) => {
    switch (position) {
      case 1:
        return "bg-gray-400";
      case 2:
        return "bg-gray-400";
      case 3:
        return "bg-gray-400";
      case 4:
        return "bg-gray-400";
      case 5:
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  // Function to get selected circle style
  const getSelectedStyle = (questionIndex: number, position: number) => {
    const answer = getAnswerForQuestion(questionIndex);
    if (answer === position) {
      return getCircleFillColor(position);
    }
    return "bg-transparent";
  };

  // const downloadPDF = () => {
  //   // const element = document.body;
  //   // import("html2pdf.js").then((html2pdf) =>
  //   //   html2pdf.default().from(element).save("fit-profile.pdf")
  //   // );
  //   var doc = new jsPDF("l", "mm", [1200, 1210]);

  //   const ctx = doc.canvas.getContext("2d");
  //   const oldDrawImage = ctx.drawImage;
  //   ctx.drawImage = (
  //     image,
  //     sx,
  //     sy,
  //     sWidth,
  //     sHeight,
  //     dx,
  //     dy,
  //     dWidth,
  //     dHeight
  //   ) => {
  //     const svgStartsWith = `data:image/svg+xml,`;
  //     const isSvg = image.src.startsWith(svgStartsWith);
  //     if (isSvg) {
  //       const svgData = decodeURIComponent(image.src.split(svgStartsWith)[1]);
  //       ctx.save();
  //       ctx.translate(dx, dy);
  //       v = canvg.Canvg.fromString(ctx, svgData, {
  //         ignoreMouse: true,
  //         ignoreAnimation: true,
  //         ignoreDimensions: true,
  //         ignoreClear: true,
  //       });

  //       v.start();
  //       ctx.restore();
  //     } else {
  //       oldDrawImage.call(
  //         ctx,
  //         image,
  //         sx,
  //         sy,
  //         sWidth,
  //         sHeight,
  //         dx,
  //         dy,
  //         dWidth,
  //         dHeight
  //       );
  //     }
  //     return ctx;
  //   };

  //   doc.html(document.body, {
  //     callback: function (doc) {
  //       doc.save();
  //     },
  //     x: 10,
  //     y: 10,
  //   });
  // };

  // Render results component
  // const renderResults = (scores: Record<string, number>) => {
  //   const radarData = formatScoresForRadarChart(scores);

  //   return (
  //     <motion.div
  //       initial={{ opacity: 0, y: 20 }}
  //       animate={{ opacity: 1, y: 0 }}
  //       transition={{ duration: 0.5 }}
  //     >
  //       <Card className="border-none shadow-lg">
  //         <CardContent className="p-6 md:p-8 space-y-6" id="printable">
  //           <div className="text-center space-y-2">
  //             <h2 className="text-2xl md:text-3xl font-bold">
  //               Your FIT Parent Profile
  //             </h2>
  //             <p className="text-muted-foreground">
  //               Based on your responses across 10 dimensions
  //             </p>
  //             <div className="flex justify-center gap-4 pt-2">
  //               <Button onClick={printPage} variant="outline" className="gap-2">
  //                 <Printer className="w-4 h-4" /> Print
  //               </Button>
  //               <Button
  //                 onClick={downloadPDF}
  //                 variant="outline"
  //                 className="gap-2"
  //               >
  //                 <Download className="w-4 h-4" /> Save as PDF
  //               </Button>
  //             </div>
  //           </div>

  //           <div className="w-full h-[400px] mt-4">
  //             <CustomRadarChart data={radarData} />
  //           </div>

  //           <div className="py-4 space-y-6">
  //             {Object.entries(scores).map(([dimension, score]) => (
  //               <div key={dimension} className="space-y-2">
  //                 <div className="flex justify-between items-center">
  //                   <h3
  //                     className={cn(
  //                       "font-medium flex items-center",
  //                       dimensionColors[
  //                         dimension as keyof typeof dimensionColors
  //                       ].color
  //                     )}
  //                   >
  //                     <span
  //                       className={cn(
  //                         "inline-block w-3 h-3 rounded-full mr-2",
  //                         dimensionColors[
  //                           dimension as keyof typeof dimensionColors
  //                         ].bg
  //                       )}
  //                     ></span>
  //                     {dimension}
  //                   </h3>
  //                   <span className="text-sm font-semibold">{score}%</span>
  //                 </div>
  //                 <Progress
  //                   value={score}
  //                   className="h-2"
  //                   indicatorClassName={
  //                     dimensionColors[dimension as keyof typeof dimensionColors]
  //                       .bgTranslucent
  //                   }
  //                 />
  //                 <p className="text-sm text-muted-foreground">
  //                   {getScoreInterpretation(dimension, score)}
  //                 </p>
  //               </div>
  //             ))}
  //           </div>

  //           <div className="pt-4">
  //             <Button
  //               onClick={resetTest}
  //               className="w-full flex items-center justify-center gap-2"
  //             >
  //               <RefreshCcw className="h-4 w-4" /> Take the Test Again
  //             </Button>
  //           </div>
  //         </CardContent>
  //       </Card>
  //     </motion.div>
  //   );
  // };

  // If questions haven't loaded yet, show a loading state
  if (interlacedQuestions.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card className="border-none shadow-lg">
          <CardContent className="p-6 md:p-8 flex justify-center items-center min-h-[300px]">
            <p>Loading questions...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If preview is enabled, show results with dummy data
  if (showPreview) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Preview Mode</h2>
          <div className="flex items-center space-x-2">
            <Switch
              id="preview-mode"
              checked={showPreview}
              onCheckedChange={(checked) => {
                setShowPreview(checked);
                if (!checked) {
                  setShowResults(false);
                }
              }}
            />
            <Label htmlFor="preview-mode">Preview Results</Label>
          </div>
        </div>
        {/* {renderResults(dummyData)} */}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2 flex-1">
            <div className="flex justify-between text-sm">
              <span>
                Page {currentPage + 1} of {totalPages}
              </span>
              <span>{Math.round(questionProgress)}% Complete</span>
            </div>
            <Progress value={questionProgress} className="h-2" />
          </div>
          {/* <div className="ml-4 flex items-center space-x-2">
              <Switch
                id="preview-toggle"
                checked={showPreview}
                onCheckedChange={setShowPreview}
              />
              <Label htmlFor="preview-toggle" className="flex items-center">
                <BarChart className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Preview</span>
              </Label>
            </div> */}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ x: direction * 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction * -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-none shadow-lg">
              <CardContent className="p-6 md:p-8">
                <div className="mb-8">
                  <h2 className="text-xl md:text-2xl font-semibold text-center text-primary">
                    FIT Parent Profile{" "}
                    <Dialog>
                      <DialogTrigger>
                        <HelpCircle className="h-4 w-4 inline-block align-middle cursor-help" />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            How to take the FIT Parent Profile
                          </DialogTitle>
                        </DialogHeader>
                        <p>
                          {" "}
                          You’ll rate yourself on 10 statements for each
                          principle using a 1–5 scale from Strongly Disagree to
                          Strongly Agree. This will take around 30–60 minutes.
                          You'll get the best results if you&rsquo;re honest and
                          don&rsquo;t overthink your answers.{" "}
                        </p>
                      </DialogContent>
                    </Dialog>
                  </h2>
                  <p className="text-center text-muted-foreground mt-2">
                    Page {currentPage + 1} of {totalPages}
                  </p>
                </div>

                <div className="space-y-10">
                  {currentPageQuestions.map((question, questionIndex) => {
                    const dimension = dimensions[question.dimensionIndex];
                    const dimensionColor = dimensionColors[dimension];

                    return (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 1,
                          delay: 0.05 * questionIndex,
                        }}
                        // viewport={{ once: true }}
                        key={currentPage + questionIndex}
                        className="flex gap-4 justify-between"
                      >
                        <div className="flex items-center">
                          <h3 className="text-base md:text-lg font-medium">
                            {question.question}
                            {false && (
                              <Badge
                                variant="outline"
                                className={cn(
                                  "ml-2 font-normal",
                                  dimensionColor.color,
                                  dimensionColor.border
                                )}
                              >
                                {dimension}
                              </Badge>
                            )}
                          </h3>
                        </div>

                        <div className="flex flex-col items-center group">
                          <div>
                            <div
                              className={cn(
                                "flex justify-between gap-1 mb-2 text-xs text-muted-foreground transition",
                                questionIndex === 0
                                  ? "opacity-75"
                                  : "opacity-0 group-hover:opacity-75 delay-0 group-hover:delay-1000"
                              )}
                            >
                              <span className="w-6"></span>
                              <span className="w-12 text-center">Disagree</span>
                              <span className="w-6"></span>
                              <span className="w-12 text-center">Agree</span>
                              <span className="w-6"></span>
                            </div>

                            <div className="flex justify-between items-center gap-x-4">
                              {[
                                "Strongly disagree",
                                "Disagree",
                                "Neutral",
                                "Agree",
                                "Strongly agree",
                              ].map((title, index) => (
                                <button
                                  key={index + 1}
                                  title={title}
                                  onClick={() =>
                                    handleOptionSelect(questionIndex, index + 1)
                                  }
                                  className={cn(
                                    "rounded-full transition-all duration-200 border-2",
                                    getCircleSize(index + 1),
                                    dimensionColor.border, //getCircleBorderColor(value),
                                    getAnswerForQuestion(questionIndex) ===
                                      index + 1
                                      ? dimensionColor.bgTranslucent
                                      : "bg-transparent" //getSelectedStyle(questionIndex, value),
                                  )}
                                  aria-label={`Rating ${index + 1}`}
                                />
                              ))}
                            </div>

                            <div
                              className={cn(
                                "flex justify-between gap-4 mt-2 text-xs text-muted-foreground transition",
                                questionIndex === 0
                                  ? "opacity-75"
                                  : "opacity-0 group-hover:opacity-75 delay-0 group-hover:delay-1000"
                              )}
                            >
                              <span className="">Strong</span>
                              <span>Neutral</span>
                              <span className="">Strong</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between pt-2 pb-8">
          <Button
            variant="outline"
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Previous
          </Button>

          <Button
            onClick={goToNextPage}
            disabled={!isPageComplete()}
            className="flex items-center gap-2"
          >
            {currentPage === totalPages - 1 ? "See Results" : "Next"}
            {currentPage < totalPages - 1 && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
