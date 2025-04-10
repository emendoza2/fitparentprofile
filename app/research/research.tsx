import "./footnotes.css";

import React from "react"; // Import React if using JSX features directly
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { dimensionColors } from "@/lib/questions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Printer } from "lucide-react";
import Link from "next/link";

// Import types for props
import { PrinciplesData } from "@/lib/types"; // Adjust path/types as needed
import { FootnoteRef, Footnotes, FootnotesProvider } from "./footnote";
import { PrintButton, ResearchFootnotes } from "./client";

interface ResearchClientProps {
  principles: PrinciplesData;
}

// Accept principles and researchData as props
export default function ResearchClient({ principles }: ResearchClientProps) {
  // No data fetching here anymore

  return (
    // FootnotesProvider wraps the content that uses footnotes
    <FootnotesProvider>
      <article className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back Home
              </Button>
            </Link>
            {/* Print button uses onClick - client-side */}
            <PrintButton />
          </div>

          <Card className="border-none shadow-lg mb-8 print:shadow-none">
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="text-center space-y-2 mb-8">
                <h1 className="text-3xl md:text-4xl font-bold">
                  THE FIT PARENT GUIDE
                </h1>
                <p className="text-lg font-medium mt-4">
                  Welcome to the life-long pursuit of building a healthy
                  relationship with your child, to raise them into a healthy
                  adult. The definition of "healthy" is a holistic one, covering
                  the domains of emotional, mental, physical, relational, and
                  spiritual health.
                </p>
              </div>

              {/* Using FootnoteRef - client-side context consumer */}
              <div className="space-y-4">
                <p className="text-base">
                  <FootnoteRef
                    description={
                      <>
                        World Health Organization. (1948).{" "}
                        <em>Constitution of the World Health Organization</em>.
                        Retrieved from{" "}
                        <a
                          href="https://www.who.int/governance/eb/who_constitution_en.pdf"
                          className="text-blue-600"
                        >
                          https://www.who.int/governance/eb/who_constitution_en.pdf
                        </a>
                      </>
                    }
                    id="footnote-1"
                  >
                    <strong>World Health Organization (WHO):</strong> WHO's
                    definition of health goes beyond the absence of disease,
                    stating that health is a state of complete physical, mental,
                    and social well-being. This holistic perspective is
                    foundational to understanding child health today.
                  </FootnoteRef>
                </p>

                <p className="text-base">
                  <FootnoteRef
                    description={
                      <>
                        Centers for Disease Control and Prevention. (n.d.).{" "}
                        <em>Child Development</em>. Retrieved from{" "}
                        <a
                          href="https://www.cdc.gov/ncbddd/childdevelopment/index.html"
                          className="text-blue-600"
                        >
                          https://www.cdc.gov/ncbddd/childdevelopment/index.html
                        </a>
                      </>
                    }
                    id="footnote-2"
                  >
                    <strong>
                      Centers for Disease Control and Prevention (CDC):
                    </strong>{" "}
                    The CDC emphasizes that a healthy child is one who is
                    supported in all areas—physical, mental, and emotional—to
                    ensure optimal development.
                  </FootnoteRef>
                </p>

                <p className="text-base">
                  <FootnoteRef
                    description={
                      <>
                        Lerner, R. M., Bornstein, M. H., & Leventhal, T. (2014).{" "}
                        <em>
                          Handbook of Child Psychology and Developmental Science
                        </em>{" "}
                        (7th ed.). Wiley.
                      </>
                    }
                    id="footnote-3"
                  >
                    <strong>Developmental Psychology Research:</strong> Studies
                    in child development stress that nurturing emotional
                    intelligence, social skills, and spiritual growth is just as
                    important as physical health for building resilience and
                    long-term success.
                  </FootnoteRef>
                </p>

                <p className="text-base italic">
                  <strong>Luke 2:52:</strong> "And Jesus grew in wisdom,
                  stature, favor with God, and favor with man."
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-2xl font-bold">THE FIT PARENT APPROACH:</h2>

                <p className="text-base">
                  <strong>F – FAMILY:</strong> A family-centered approach –
                  Focused on you and your child.
                </p>

                <p className="text-base">
                  <strong>I – INTENTIONALITY:</strong> A proactive approach –
                  Focused on your child's unique emotional, mental, relational,
                  spiritual, physical needs.
                </p>

                <p className="text-base">
                  <strong>T – TRUTH:</strong> A Biblical approach – Focused on
                  principles based on God's Word.
                </p>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold mb-6">
            Research Supporting the FIT Principles
          </h2>

          {/* Use the researchData prop */}
          {Object.entries(principles).map(([dimension, principle]) => (
            <Card
              key={dimension}
              className="border-none shadow-lg mb-8 print:shadow-none page-break-inside-avoid"
            >
              <CardContent className="p-6 md:p-8">
                <h3
                  className={`text-xl font-bold mb-4 ${
                    dimensionColors[dimension as keyof typeof dimensionColors]
                      ?.color
                  }`}
                >
                  {dimension}
                </h3>

                <div className="space-y-4">
                  {/* Use research (singular) from map */}
                  {(
                    principle.research as { text: string; citation: string }[]
                  ).map((item, index) => (
                    <div key={index} className="mb-4">
                      <p className="text-base mb-2">
                        {item.text}
                        {/* Using FootnoteRef - client-side context consumer */}
                        <FootnoteRef
                          description={
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p: ({ children }) => <>{children}</>, // Use React Fragment
                                a: ({ children, href }) => (
                                  <a
                                    className="text-blue-600"
                                    target="_blank"
                                    rel="noopener noreferrer" // Add rel for security
                                    href={href}
                                  >
                                    {children}
                                  </a>
                                ),
                              }}
                            >
                              {item.citation}
                            </ReactMarkdown>
                          }
                          id={`${dimension}-${index}`}
                        ></FootnoteRef>
                      </p>
                    </div>
                  ))}
                </div>
                {/* Use the principles prop */}
                <div className="mt-4">
                  <h3 className="mb-1 text-lg font-bold">Why this matters</h3>
                  {/* Ensure principles[dimension] exists before accessing 'why' */}
                  <p className="text-base">
                    {principles[dimension]?.why ?? "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Footnotes component itself uses context */}
          <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
            <ResearchFootnotes />
            {/* Remove the hardcoded list below if Footnotes component renders it dynamically */}
            {/* <ol className="list-decimal pl-5 space-y-2"> ... </ol> */}
          </div>

          <div className="h-20 print:hidden"></div>
        </div>
      </article>
    </FootnotesProvider> // End FootnotesProvider wrap
  );
}

// Define a basic type for ResearchData if not already defined elsewhere
// You might want a more specific type based on your research.json structure
interface ResearchItem {
  text: string;
  citation: string;
}

type ResearchData = Record<string, ResearchItem[]>;
