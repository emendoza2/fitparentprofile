"use client";

import { useAuth } from "@/components/auth/context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useRequireLogin() {
  const { user, isLoading: loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!user && !loading) {
      const currentPath = window.location.pathname + window.location.search;
      router.replace(`/signup?callback=${encodeURIComponent(currentPath)}`);
    }
  }, [user, loading, router]);
}
