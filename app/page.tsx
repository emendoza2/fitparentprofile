import { getDimensions } from "@/lib/sheets-api";
import { getQueryClient } from "./query-providers";
import Welcome from "./welcome";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function WelcomePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["dimensions"],
    queryFn: getDimensions,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Welcome />
    </HydrationBoundary>
  );
}
