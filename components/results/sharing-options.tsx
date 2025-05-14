import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";
import SocialShare from "@/components/social-share";
import { toast } from "@/hooks/use-toast";

function supportsWebPCanvas() {
  if (typeof window === "undefined") return false;
  const canvas = document.createElement("canvas");
  if (!canvas.getContext) {
    return false;
  }
  return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
}

const printPage = () => {
  alert("To print properly, ensure that printing backgrounds is checked.");
  window.print();
};

const downloadPDF = async () => {
  toast({
    title: "Downloading PDF",
    description: "Your FIT Parent Profile is being generated as a PDF...",
  });

  const element = document.getElementById("printable");
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  const opt = {
    margin: 0.5,
    filename: "fit-parent-report.pdf",
    image: { type: supportsWebPCanvas() ? "webp" : "jpeg" },
    html2canvas: { scale: 1.5 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    pagebreak: { mode: "avoid-all" },
  };

  // @ts-ignore: there are no types for html2pdf
  import("html2pdf.js").then((html2pdf) => {
    html2pdf.default().from(element).set(opt).save();
  });
};

export function SharingOptions() {
  return (
    <div className="print:hidden">
      <div className="flex justify-center gap-4 pt-2">
        <Button onClick={printPage} variant="outline" className="gap-2">
          <Printer className="w-4 h-4" /> Print
        </Button>
        <Button onClick={downloadPDF} variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Save as PDF
        </Button>
      </div>
      <div className="pt-2">
        <SocialShare />
      </div>
    </div>
  );
}
