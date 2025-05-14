import { google } from "googleapis";
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

function rowToObject(headers: string[], row: string[]): Record<string, string> {
  return Object.fromEntries(
    headers.map((header, index) => [header, row[index]])
  );
}

export async function getPrinciples(): Promise<PrinciplesData> {
  if (cachedPrinciples) return cachedPrinciples;

  // Authenticate using service account credentials from environment variables
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // Handle newline characters
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({
    version: "v4",
    auth,
    fetchImplementation: (init, options) =>
      fetch(init, { ...options, cache: "force-cache" }),
  });
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID; // Get from environment variable

  // Define the named ranges to fetch
  const namedRanges = {
    research: process.env.GOOGLE_RANGE_RESEARCH || "Research",
    resources: process.env.GOOGLE_RANGE_RESOURCES || "Resources",
    Scripture: process.env.GOOGLE_RANGE_SCRIPTURE || "Scripture",
    statements: process.env.GOOGLE_RANGE_STATEMENTS || "Question Statements",
    dimensions: process.env.GOOGLE_RANGE_DIMENSIONS || "All Dimensions",
  };

  const dataByCategory: Record<string, Record<string, any[]>> = {};

  // Fetch data from each named range
  for (const [category, rangeName] of Object.entries(namedRanges)) {
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: rangeName, // Use the named range
      });

      const rows = response.data.values || [];
      if (rows.length <= 1) continue; // Skip if only header row exists

      // Process the data based on category
      dataByCategory[category] = processSheetData(category, rows);
    } catch (error) {
      console.error(`Error fetching data from ${category} range:`, error);
      dataByCategory[category] = {};
    }
  }

  const dimensions = Object.keys(dataByCategory.dimensions);
  console.log(dataByCategory.statements);

  // Construct the principles object
  const principles = Object.fromEntries(
    dimensions.map((dimension) => [
      dimension,
      {
        research: dataByCategory.research?.[dimension] || [],
        resources: dataByCategory.resources?.[dimension] || [],
        Scripture: dataByCategory.Scripture?.[dimension] || [],
        statements: dataByCategory.statements?.[dimension] || [],
        ...(dataByCategory.dimensions?.[dimension][0] || {}),
      },
    ])
  ) as PrinciplesData;

  cachedPrinciples = principles;
  return principles;
}

// Helper function to process sheet data based on category
function processSheetData(
  category: string,
  rows: any[][]
): Record<string, any[]> {
  const result: Record<string, any[]> = {};

  // Skip header row
  const dataRows = rows.slice(1);

  // Process based on category
  switch (category) {
    // case 'research':
    //     // Assuming format: dimension, text, citation
    //     dataRows.forEach(row => {
    //         if (row.length >= 3) {
    //             const dimension = row[0];
    //             if (!result[dimension]) result[dimension] = [];
    //             result[dimension].push({
    //                 text: row[1],
    //                 citation: row[2]
    //             });
    //         }
    //     });
    //     break;

    // case 'resources':
    //     // Assuming format: dimension, category, free, title, url, description
    //     dataRows.forEach(row => {
    //         if (row.length >= 6) {
    //             const dimension = row[0];
    //             if (!result[dimension]) result[dimension] = [];
    //             result[dimension].push({
    //                 category: row[1],
    //                 free: row[2] === 'TRUE',
    //                 title: row[3],
    //                 url: row[4],
    //                 description: row[5]
    //             });
    //         }
    //     });
    //     break;

    // case 'Scripture':
    //     // Assuming format: dimension, reference, text
    //     dataRows.forEach(row => {
    //         if (row.length >= 3) {
    //             const dimension = row[0];
    //             if (!result[dimension]) result[dimension] = [];
    //             result[dimension].push({
    //                 reference: row[1],
    //                 text: row[2]
    //             });
    //         }
    //     });
    //     break;

    // case 'statements':
    //     // Assuming format: dimension, statement, action
    //     dataRows.forEach(row => {
    //         if (row.length >= 3) {
    //             const rowObj = Object.fromEntries(rows[0].map((header, i) => [header, row[i]]))
    //             const dimension = rowObj.dimension;
    //             if (!result[dimension]) result[dimension] = [];
    //             result[dimension].push(rowObj)
    //         }
    //     });
    //     break;

    case "dimensions":
      // Format: dimension, why, description, welcome, Level 0, Level 1, Level 2, Level 3, Level 4, Level 5
      dataRows.forEach((row) => {
        if (row.length >= 3) {
          const rowObj = rowToObject(rows[0], row);
          const dimension = rowObj.dimension;
          if (!dimension) return; // sometimes it is blank lol

          if (!result[dimension]) result[dimension] = [];

          const defaultLevels = [
            "[NA]",
            "Struggling: Consider making this principle a priority.",
            "Seeking: This area needs intentional focus and development.",
            "Growing: You are applying this principle well but may have areas to improve.",
            "Thriving: You are strongly living out this principle. Keep going!",
            "[NA]",
          ];

          result[dimension].push({
            why: rowObj.why,
            description: rowObj.description,
            welcome: {
              title: rowObj.welcome_title,
              description: rowObj.welcome_descriptionrowObj,
            },
            levels: row
              .slice(5, 11)
              .map((level, index) => level || defaultLevels[index]),
          });
        }
      });
      // dataRows.forEach(row => {
      //     if (row.length >= 10) {
      //         const dimension = row[0];
      //         if (!result[dimension]) result[dimension] = [];

      //         // Default values for levels
      //         const defaultLevels = [
      //             '[NA]',
      //             'Struggling: Consider making this principle a priority.',
      //             'Seeking: This area needs intentional focus and development.',
      //             'Growing: You are applying this principle well but may have areas to improve.',
      //             'Thriving: You are strongly living out this principle. Keep going!',
      //             '[NA]'
      //         ];

      //         // Extract levels from rows 5-11
      //         const levels = row.slice(5, 11).map((level, index) => level || defaultLevels[index]);

      //         result[dimension].push({
      //             why: row[1],
      //             description: row[2],
      //             welcome: {
      //                 title: row[3],
      //                 description: row[4]
      //             },
      //             levels: levels
      //         });
      //     }
      // });
      break;

    default:
      // Generic processing for unknown categories
      dataRows.forEach((row) => {
        if (row.length >= 3) {
          const rowObj = rowToObject(rows[0], row);
          const dimension = rowObj.dimension;
          if (!dimension) return;
          if (!result[dimension]) result[dimension] = [];
          result[dimension].push(rowObj);
        }
      });
  }

  return result;
}

// For backward compatibility with existing code
export const principles: PrinciplesData = {};
