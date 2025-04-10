"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { Footnotes } from "./footnote";

export function PrintButton() {
  // Function to handle printing (uses browser API)
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handlePrint}
      className="flex items-center gap-2 print:hidden"
    >
      <Printer className="h-4 w-4" />
      Print Research
    </Button>
  );
}

export function ResearchFootnotes() {
  return (
    <Footnotes
      Title={({ id }) => (
        <h3 id={id} className="text-xl font-bold mb-4">
          References
        </h3>
      )}
      List={({ children }) => (
        <ol className="list-decimal pl-5 space-y-2">{children}</ol>
      )}
    />
  );
}
