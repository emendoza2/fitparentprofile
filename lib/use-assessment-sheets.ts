import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  getQuestions,
  getChallenges,
  getResources,
  getScripture,
  getResearch,
  getResourceIndicators,
  getDimensions,
  getIndicators,
  getPrayerChallenges,
} from "@/lib/sheets-api";

// Individual data hooks
export function useDimensions() {
  return useQuery({
    queryKey: ["dimensions"],
    queryFn: getDimensions,
    staleTime: 1000 * 60 * 10,
  });
}

export function useIndicators() {
  return useQuery({
    queryKey: ["indicators"],
    queryFn: getIndicators,
    staleTime: 1000 * 60 * 10,
  });
}

export function useQuestions() {
  return useQuery({
    queryKey: ["questions"],
    queryFn: getQuestions,
    staleTime: 1000 * 60 * 10,
  });
}
export function useChallenges() {
  return useQuery({
    queryKey: ["challenges"],
    queryFn: getChallenges,
    staleTime: 1000 * 60 * 10,
  });
}
export function usePrayerChallenges() {
  return useQuery({
    queryKey: ["prayerChallenges"],
    queryFn: getPrayerChallenges,
    staleTime: 1000 * 60 * 10,
  });
}
export function useResources() {
  return useQuery({
    queryKey: ["resources"],
    queryFn: getResources,
    staleTime: 1000 * 60 * 10,
  });
}
export function useScripture() {
  return useQuery({
    queryKey: ["scripture"],
    queryFn: getScripture,
    staleTime: 1000 * 60 * 10,
  });
}
export function useResearch() {
  return useQuery({
    queryKey: ["research"],
    queryFn: getResearch,
    staleTime: 1000 * 60 * 10,
  });
}
export function useResourceIndicators() {
  return useQuery({
    queryKey: ["resourceIndicators"],
    queryFn: getResourceIndicators,
    staleTime: 1000 * 60 * 10,
  });
}

// Aggregate hooks
export function useJoinedQuestions() {
  const questionsQ = useQuestions();
  const challengesQ = useChallenges();

  const loading = questionsQ.isLoading || challengesQ.isLoading;
  const error = questionsQ.error || challengesQ.error;

  const questions = useMemo(() => {
    if (!questionsQ.data || !challengesQ.data) return undefined;
    return questionsQ.data.map((q) => ({
      ...q,
      challenges: challengesQ.data.filter((c) => c.question_id === q.id),
    }));
  }, [questionsQ.data, challengesQ.data]);

  return { questions, loading, error };
}

export function useIndicatorResources() {
  const indicatorsQ = useResourceIndicators();
  const resourcesQ = useResources();

  const loading = indicatorsQ.isLoading || resourcesQ.isLoading;
  const error = indicatorsQ.error || resourcesQ.error;

  // For each indicator, specify which resources apply
  const indicatorResources = useMemo(() => {
    if (!indicatorsQ.data || !resourcesQ.data) return undefined;
    // Map indicator -> [resources]
    const map: Record<string, any[]> = {};
    indicatorsQ.data.forEach((ind) => {
      map[ind.indicator] = map[ind.indicator] || [];
      const resource = resourcesQ.data.find((r) => r.id === ind.resource_id);
      if (resource) map[ind.indicator].push(resource);
    });
    return map;
  }, [indicatorsQ.data, resourcesQ.data]);

  return { indicatorResources, loading, error };
}

export function useDimensionResearchScripture() {
  const scriptureQ = useScripture();
  const researchQ = useResearch();

  const loading = scriptureQ.isLoading || researchQ.isLoading;
  const error = scriptureQ.error || researchQ.error;

  // For each dimension, specify which research and scripture apply
  const dimensionData = useMemo(() => {
    if (!scriptureQ.data || !researchQ.data) return undefined;
    // Map dimension -> { scripture: [], research: [] }
    const map: Record<string, { scripture: any[]; research: any[] }> = {};
    scriptureQ.data.forEach((s) => {
      map[s.dimension] = map[s.dimension] || { scripture: [], research: [] };
      map[s.dimension].scripture.push(s);
    });
    researchQ.data.forEach((r) => {
      map[r.dimension] = map[r.dimension] || { scripture: [], research: [] };
      map[r.dimension].research.push(r);
    });
    return map;
  }, [scriptureQ.data, researchQ.data]);

  return { dimensionData, loading, error };
}
