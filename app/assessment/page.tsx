import { getPrinciples } from "@/lib/principles";
import PersonalityTest from "@/components/personality-test";

export default async function AssessmentPage() {
  // Fetch principles data on the server
  const principlesData = await getPrinciples();

  return (
    <main className="container mx-auto py-8 px-4">
      <PersonalityTest principlesData={principlesData} />
    </main>
  );
}
