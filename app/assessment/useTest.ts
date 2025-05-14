"use client";

import { useQuery } from "@tanstack/react-query";
import { getTest } from "./getTest";
// import { getTest } from "./getTest";

export const useTest = () =>
  useQuery({
    queryKey: ["test"],
    queryFn: getTest,
  });
