import {
  getResearch,
  getResources,
  getScripture,
  getDimensions,
  getQuestions, // for statements
} from "./sheets-api";
// TODO: Uncomment and update the import path once sheets-api.ts is available in this project.
import {
  ResearchItem,
  ResourceItem,
  ScriptureItem,
  StatementItem,
  PrincipleData,
  PrinciplesData,
} from "./types";

// Cache to ensure data is fetched only once during build
let cachedPrinciples: PrinciplesData | null = null;

export async function getPrinciples(): Promise<PrinciplesData> {
  if (cachedPrinciples) return cachedPrinciples;

  // Fetch all data in parallel
  const [dimensions, research, resources, scripture, statements] =
    await Promise.all([
      getDimensions(),
      getResearch(),
      getResources(),
      getScripture(),
      getQuestions(),
    ]);

  // Group data by dimension
  const groupByDimension = <T extends { dimension: string }>(
    items: T[]
  ): Record<string, T[]> => {
    return items.reduce((acc, item) => {
      if (!acc[item.dimension]) acc[item.dimension] = [];
      acc[item.dimension].push(item);
      return acc;
    }, {} as Record<string, T[]>);
  };

  const researchByDimension = groupByDimension(research);
  const resourcesByDimension = groupByDimension(resources);
  const scriptureByDimension = groupByDimension(scripture);
  const statementsByDimension = groupByDimension(statements);

  // Build the principles object
  const principles: PrinciplesData = {};
  for (const dim of dimensions) {
    const dimension = dim.dimension;
    principles[dimension] = {
      research: researchByDimension[dimension] || [],
      resources: resourcesByDimension[dimension] || [],
      Scripture: scriptureByDimension[dimension] || [],
      statements: (statementsByDimension[dimension] || []).map((s) => ({
        statement: s.statement,
        challenge: s.indicator || "",
      })),
      why: dim.why,
      description: dim.description,
      welcome: {
        title: dim.welcome_title,
        description: dim.welcome_description,
      },
      levels: [], // You may want to add logic to fetch/parse levels if available
    };
  }

  cachedPrinciples = principles;
  return principles;
}

// For backward compatibility with existing code
export const principles: PrinciplesData = {};
