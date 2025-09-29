import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { env } from "./env"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Navigates to the download URL to trigger automatic download
 * @param downloadUrl - The download URL path from the API response
 */
export function downloadFileFromUrl(downloadUrl: string): void {
  // Construct the full URL by combining backend URL with download path
  const fullUrl = `${env.NEXT_PUBLIC_BACKEND_URL}${downloadUrl}`;
  
  // Navigate to the download URL - browser will handle the download automatically
  window.location.href = fullUrl;
}
