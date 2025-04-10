"use server";

import { Card, CardContent } from "@/components/ui/card";
import { getPrinciples } from "@/lib/principles";
import Image from "next/image";
import Link from "next/link";
import PrinciplesList from "@/components/principles-list";
import CallToAction from "@/components/call-to-action";

// Server component
export default async function Welcome() {
  // Fetch principles data on the server
  const principlesData = await getPrinciples();

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-3xl mx-auto p-4">
        <Card className="shadow-lg">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="flex justify-center">
              <Image
                src="/fit-parenting-logo.jpeg"
                width={200}
                height={200}
                alt="FIT Parenting Logo"
              />
            </div>
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold">
                Get Your FIT Parent Profile
              </h1>
              <p className="text-muted-foreground text-sm">
                Family. Intentionality. Truth.
              </p>
              <CallToAction />
              <p className="text-base">
                Welcome to the life-long pursuit of building a healthy
                relationship with your child. Take our assessment to understand
                10 principles that address your child's emotional, mental,
                physical, relational, and spiritual health.{" "}
              </p>
              <PrinciplesList principlesData={principlesData} />
              <p className="text-sm">
                You'll rate yourself on 10 statements for each principle using a
                1–5 scale from Strongly Disagree to Strongly Agree. Be honest!
                We're all works in progress.
              </p>
              <div className="text-left text-xs pt-4 border-t border-muted-foreground/20">
                <p className="mb-2">
                  If you'd like to dig deeper, check out our{" "}
                  <Link href="/research" className="text-blue-600 underline">
                    research
                  </Link>
                  .{" "}
                </p>
              </div>
            </div>
            <CallToAction />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
