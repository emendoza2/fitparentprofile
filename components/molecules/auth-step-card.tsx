"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function AuthStepCard({
  children,
  parentPage,
  parentPageTitle,
}: React.PropsWithChildren<{ parentPage: string; parentPageTitle: string }>) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md space-y-6">
        <div>
          <Link href={parentPage}>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {parentPageTitle}
            </Button>
          </Link>
        </div>
        <Card className="border-none shadow-lg">{children}</Card>
      </div>
    </div>
  );
}
