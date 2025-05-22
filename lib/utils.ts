import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Remove the get410StatusUrls function that was causing issues
// We've moved this functionality to actions/get-410-urls-action.ts

