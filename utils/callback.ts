import { NextRouter } from "next/router";

/** Redirects to signup (or any path) and tucks the current path into ?callback= */
export function redirectWithReturnTo(router: NextRouter, target = "/signup") {
  const callback = router.asPath;
  router.replace({
    pathname: target,
    query: { callback },
  });
}

/** After auth, reads ?callback and sends user back (or to default) */
export function goBackOr(router: NextRouter, fallback = "/") {
  const raw = router.query.callback;
  const dest = Array.isArray(raw) ? raw[0] : raw || fallback;
  router.replace(dest);
}

export function addCallback(path: string, callback: string) {
  return `${path}?callback=${encodeURIComponent(callback)}`;
}

/**
 * Ensures a URL is absolute (prepends window.location.origin if relative)
 */
export function toAbsoluteUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  try {
    new URL(url);
    return url;
  } catch {
    if (typeof window !== "undefined") {
      return window.location.origin + url;
    }
    return undefined;
  }
}
