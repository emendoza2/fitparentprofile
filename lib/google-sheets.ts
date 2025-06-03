import Papa from "papaparse";
import { z } from "zod";

export async function fetchDataFromCSVUrl<Schema extends z.ZodTypeAny>(
  url: string,
  schema: Schema,
  transform: (records: unknown[]) => unknown[] = (records) => records
): Promise<z.infer<Schema>[]> {
  const response = await fetch(url);
  const csvText = await response.text();

  const { data: records } = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    delimiter: ",",
  });

  const parsedRecords = z.array(schema).parse(transform(records));

  return parsedRecords;
}
