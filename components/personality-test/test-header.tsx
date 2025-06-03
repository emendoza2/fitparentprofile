import { HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useStore } from "zustand";
import { personalityTestStore } from "@/lib/store/personality-test-store";
import { useAssessment } from "@/lib/store/assessment-sync";

export function TestHeader({ totalPages }: { totalPages: number }) {
  const { data: assessment } = useAssessment();
  const currentPage = assessment.current_page;

  return (
    <div className="mb-8">
      <h2 className="text-xl md:text-2xl font-semibold text-center text-primary">
        FIT Parent Profile{" "}
        <Dialog>
          <DialogTrigger>
            <HelpCircle className="h-4 w-4 inline-block align-middle cursor-help" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>How to take the FIT Parent Profile</DialogTitle>
            </DialogHeader>
            <p>
              You'll rate yourself on 10 statements for each principle using a
              1–5 scale from Strongly Disagree to Strongly Agree. You'll get the
              best results if you&rsquo;re honest and don&rsquo;t overthink your
              answers.
            </p>
          </DialogContent>
        </Dialog>
      </h2>
      <p className="text-center text-muted-foreground mt-2">
        Page {currentPage + 1} of {totalPages}
      </p>
    </div>
  );
}
