import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { create } from "zustand";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { getQueryClient } from "@/app/query-providers";
import { devtools, persist } from "zustand/middleware";

export interface Assessment {
  current_page: number;
  answers: Record<string, number>;
}

getQueryClient().setMutationDefaults(["assessment"], {
  mutationFn: upsertAssessment,
});

const emptyAssessment: Assessment = { current_page: 0, answers: {} };

async function fetchAssessment(userId: string): Promise<Assessment> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("assessment_responses")
    .select("answers, current_page")
    .eq("user_id", userId)
    .single();
  if (error) throw error;
  return {
    answers: data?.answers ?? {},
    current_page: data?.current_page ?? 0,
  };
}

async function upsertAssessment(opts: {
  userId: string;
  current_page: number;
  answers: Record<string, number>;
}) {
  const supabase = createClient();
  const { error } = await supabase.from("assessment_responses").upsert({
    user_id: opts.userId,
    answers: opts.answers,
    current_page: opts.current_page,
  });
  if (error) throw error;
  return opts;
}

interface BufferState {
  answers: Record<string, number>;
  current_page: number;
  setAnswer: (id: string, val: number) => void;
  setPage: (p: number) => void;
  clear: () => void;
}

const useAssessmentBuffer = create<BufferState>()(
  persist(
    devtools((set) => ({
      answers: {},
      current_page: 0,
      setAnswer: (id, val) =>
        set((s) => ({ answers: { ...s.answers, [id]: val } })),
      setPage: (p) => set({ current_page: p }),
      clear: () => set({ answers: {}, current_page: 0 }),
    })),
    {
      name: "personality-test-storage",
    }
  )
);

export function useAssessment(userId?: string | null) {
  const qc = useQueryClient();
  const buf = useAssessmentBuffer();

  const {
    data = emptyAssessment,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: ["assessment", userId],
    placeholderData: emptyAssessment,
    enabled: !!userId,
    staleTime: 1_000 * 60 * 60 * 24, // 24 h
    queryFn: () => fetchAssessment(userId!),
  });

  const mutation = useMutation({
    mutationKey: ["assessment"],
    mutationFn: upsertAssessment,
    onMutate: async (newRow) => {
      await qc.cancelQueries({ queryKey: ["assessment", userId] });
      const prev = qc.getQueryData<Assessment>(["assessment", userId]);
      qc.setQueryData(["assessment", userId], newRow); // optimistic UI
      return { prev };
    },
    onError: (_e, _row, ctx) => {
      if (ctx?.prev) qc.setQueryData(["assessment", userId], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["assessment", userId] });
    },
  });

  useEffect(() => {
    if (isSuccess && userId) {
      if (
        Object.keys(buf.answers).length > 0 ||
        buf.current_page > data.current_page
      ) {
        const merged: Assessment = {
          answers: { ...data.answers, ...buf.answers },
          current_page: Math.max(data.current_page, buf.current_page),
        };
        mutation.mutate({ userId, ...merged });
      }
      buf.clear(); // buffer is now empty
    }
  }, [isSuccess, userId]); /* eslint-disable-line react-hooks/exhaustive-deps */
  // We suppress exhaustive-deps because we intentionally run the effect only once. Adding all referenced values would cause unnecessary reruns and network writes.

  function setCurrentPage(p: number) {
    if (isSuccess && userId) {
      mutation.mutate({
        userId,
        current_page: p,
        answers: data.answers,
      });
    } else {
      buf.setPage(p); // still loading – keep it local
    }
  }

  function setAnswer(id: string, val: number) {
    // if (!userId) return;
    if (isSuccess && userId) {
      mutation.mutate({
        userId,
        current_page: data.current_page,
        answers: { ...data.answers, [id]: val },
      });
    } else {
      buf.setAnswer(id, val); // buffer until snapshot arrives
    }
  }

  function reset() {
    // if (!userId) return;
    if (userId) {
      mutation.mutate({ userId, current_page: 0, answers: {} });
    } else {
      buf.clear();
    }
  }

  return {
    data: userId ? data : buf,
    loading: isLoading,
    setCurrentPage,
    setAnswer,
    reset,
  };
}
