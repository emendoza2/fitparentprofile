import { fetchDataFromCSVUrl } from "@/lib/google-sheets";
import { z } from "zod";

// Environment variables for each sheet
const QUESTIONS_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_QUESTIONS_URL;
const CHALLENGES_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_CHALLENGES_URL;
const PRAYER_CHALLENGES_URL =
  process.env.NEXT_PUBLIC_GOOGLE_SHEETS_PRAYER_CHALLENGES_URL;
const RESOURCES_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_RESOURCES_URL;
const SCRIPTURE_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_SCRIPTURE_URL;
const RESEARCH_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_RESEARCH_URL;
const INDICATORS_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_INDICATORS_URL;
const DIMENSIONS_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_DIMENSIONS_URL;
const RESOURCE_INDICATORS_URL =
  process.env.NEXT_PUBLIC_GOOGLE_SHEETS_RESOURCE_INDICATORS_URL;

// Zod schemas for each sheet
export const QuestionSchema = z.object({
  id: z.string(),
  statement: z.string(),
  dimension: z.string(),
  indicator: z.string(),
  type: z.enum(["Belief", "Behavior"]),
  framing: z.enum(["Positive", "Negative"]),
});

export const ChallengeSchema = z.object({
  id: z.string(),
  dimension: z.string(),
  indicator: z.string(),
  indicator_id: z.string(),
  // question_id: z.string(),
  title: z.string(),
  description: z.string(),
  difficulty: z.string().transform((val) => parseInt(val)),
  duration: z.string().transform((val) => parseInt(val)), // in minutes
  xp: z.string().transform((val) => parseInt(val)),
});

export const PrayerChallengeSchema = z.object({
  dimension: z.string(),
  indicator: z.string(),
  prayer: z.string(),
});

export const ResourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string().optional(),
  url: z.string().url(),
  category: z.string(),
  description: z.string(),
  free: z.string().transform((val) => val === "TRUE"), // to boolean
  dimension: z.string(),
});

export const ScriptureSchema = z.object({
  reference: z.string(),
  text: z.string(),
  dimension: z.string(),
});

export const ResearchSchema = z.object({
  text: z.string(),
  citation: z.string(),
  dimension: z.string(),
});

export const IndicatorSchema = z.object({
  id: z.string(),
  indicator: z.string(),
  dimension: z.string(),
});

export const DimensionSchema = z.object({
  dimension: z.string(),
  why: z.string(),
  description: z.string(),
  welcome_title: z.string(),
  welcome_description: z.string(),
});

export const ResourceIndicatorSchema = z.object({
  // id: z.string(),
  resource_id: z.string(),
  indicator: z.string(),
  indicator_id: z.string(),
  // it's first a string, then a JSON object, then an array of five 0/1 values.
  // levels_supported: z
  // 	.string()
  // 	.transform((val) => JSON.parse(val))
  // 	.pipe(
  // 		z.tuple([z.number(), z.number(), z.number(), z.number(), z.number()]),
  // 	),
});

// API functions
export async function getQuestions() {
  if (!QUESTIONS_URL) throw new Error("QUESTIONS_URL env var not set");
  return fetchDataFromCSVUrl(QUESTIONS_URL, QuestionSchema);
}

export async function getChallenges() {
  if (!CHALLENGES_URL) throw new Error("CHALLENGES_URL env var not set");
  return fetchDataFromCSVUrl(CHALLENGES_URL, ChallengeSchema);
}

export async function getResources() {
  if (!RESOURCES_URL) throw new Error("RESOURCES_URL env var not set");
  return fetchDataFromCSVUrl(RESOURCES_URL, ResourceSchema);
}

export async function getScripture() {
  if (!SCRIPTURE_URL) throw new Error("SCRIPTURE_URL env var not set");
  return fetchDataFromCSVUrl(SCRIPTURE_URL, ScriptureSchema);
}

export async function getResearch() {
  if (!RESEARCH_URL) throw new Error("RESEARCH_URL env var not set");
  return fetchDataFromCSVUrl(RESEARCH_URL, ResearchSchema);
}

export async function getResourceIndicators() {
  if (!RESOURCE_INDICATORS_URL)
    throw new Error("RESOURCE_INDICATORS_URL env var not set");
  return fetchDataFromCSVUrl(RESOURCE_INDICATORS_URL, ResourceIndicatorSchema);
}

export async function getIndicators() {
  if (!INDICATORS_URL) throw new Error("INDICATORS_URL env var not set");
  return fetchDataFromCSVUrl(INDICATORS_URL, IndicatorSchema);
}

export async function getDimensions() {
  if (!DIMENSIONS_URL) throw new Error("DIMENSIONS_URL env var not set");
  return fetchDataFromCSVUrl(DIMENSIONS_URL, DimensionSchema);
}

export async function getPrayerChallenges() {
  if (!PRAYER_CHALLENGES_URL)
    throw new Error("PRAYER_CHALLENGES_URL env var not set");
  return fetchDataFromCSVUrl(PRAYER_CHALLENGES_URL, PrayerChallengeSchema);
}
