import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getDisplayName } from "next/dist/shared/lib/utils";

export function withPrefetch<T, Props extends object>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  Wrapped: React.ComponentType<Props>
) {
  async function PrefetchedComponent(props: Props) {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
      queryKey,
      queryFn,
    });

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Wrapped {...props} />
      </HydrationBoundary>
    );
  }

  PrefetchedComponent.displayName = `withPrefetch(${getDisplayName(Wrapped)})`;

  return PrefetchedComponent;
}
