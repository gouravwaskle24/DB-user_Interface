import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const data_types = [
  { id: 1, name: "INT", description: "Integer numerical data", value: "INT" },
  { id: 2, name: "VARCHAR", description: "Variable-length string", value: "VARCHAR(255)" },
  // { id: 3, name: "BOOLEAN", description: "Boolean data type", value: "BOOLEAN" },
  // { id: 4, name: "DATE", description: "Date value", value: "DATE" },
  { id: 5, name: "TEXT", description: "Text string", value: "TEXT" },
];
