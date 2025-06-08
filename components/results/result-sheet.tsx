import { DimensionSummaryList } from "@/components/results/dimension-summary-list";
import { RadarChartSection } from "@/components/results/radar-chart-section";
import { ScoreSummary } from "@/components/results/score-summary";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DimensionScores } from "@/utils/assessment/get-dimension-scores";
import { addCallback } from "@/utils/callback";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import QRCode from "react-qr-code";

const APPLE_STORE_URL = "https://testflight.apple.com/join/c6QWRe9z";
const GOOGLE_PLAY_URL =
  "https://drive.google.com/file/d/1UP8NLyjP2Eq-GB5ijGpOE4756rlDnPwn/view?usp=sharing";

function AppDownloadBanner() {
  return (
    <Card className="flex flex-row items-start">
      <div>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="rounded-2xl overflow-hidden">
              <Image src="/appIcon.svg" alt="App Icon" width={48} height={48} />
            </div>
            <div>
              <CardTitle>Get the Full Experience</CardTitle>
              <CardDescription>
                Download our app to view your complete personality profile and
                track your growth over time.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex gap-2 items-center">
              <Link href={APPLE_STORE_URL} className="h-10">
                <Image
                  src="/app-store-dl.svg"
                  alt="Download on the App Store"
                  width={120}
                  height={40}
                  className="h-full w-auto"
                />
              </Link>
              <Link href={GOOGLE_PLAY_URL} className="h-10">
                <Image
                  src="/google-play-dl.svg"
                  alt="Get it on Google Play"
                  width={135}
                  height={40}
                  className="h-full w-auto"
                />
              </Link>
            </div>
          </div>
        </CardContent>
      </div>
      <div className="mr-6 mt-6 bg-white p-2 rounded-lg shadow border">
        <QRCode value="https://fitparent.app/store-redirect" size={86} />
      </div>
    </Card>
  );
}

function LoggedOutBanner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const callback = pathname + "?" + searchParams.toString();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Save Your Results</CardTitle>
        <CardDescription>
          Create a free account to save your profile and unlock full detailed
          results.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-2">
            <Button asChild>
              <Link href={addCallback("/signup", callback)}>
                Create Account
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href={addCallback("/login", callback)}>Login</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ResultSheet({
  data,
  isLoggedIn,
}: {
  data: DimensionScores;
  isLoggedIn: boolean;
}) {
  const dataParam = useSearchParams().get("data");
  data = dataParam ? (JSON.parse(atob(dataParam)) as DimensionScores) : data;

  return (
    <>
      <ScoreSummary data={data} />
      <RadarChartSection data={data} />
      <div className="relative max-h-[500px] overflow-y-hidden">
        <DimensionSummaryList data={data} />
        <div className="fade-bottom-overlay pointer-events-none absolute left-0 right-0 bottom-0 h-48" />
      </div>
      <AppDownloadBanner />
      {!isLoggedIn && (
        <>
          <LoggedOutBanner />
        </>
      )}
    </>
  );
}
