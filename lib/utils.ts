import { clsx } from "clsx";

export function cn(...parts: Array<string | false | null | undefined>) {
  return clsx(parts);
}

export function formatDate(input: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(input));
}

export function slugify(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
