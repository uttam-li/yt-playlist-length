import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { videoFormat } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseDuration(duration: string) {

  if( duration === undefined ) return 0;

  const match = duration.match(/PT((\d+)H)?((\d+)M)?((\d+)S)?/);

  let hours = (match && match[2] ? parseInt(match[2]) : 0);
  let minutes = (match && match[4] ? parseInt(match[4]) : 0);
  let seconds = (match && match[6] ? parseInt(match[6]) : 0);
  
  return hours * 3600 + minutes * 60 + seconds;
}

export function calculateTotalDuration(seconds: number, format: videoFormat) {

  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  let remainingSeconds = Math.floor(seconds % 60);

  hours = Number(String(hours).padStart(2, '0'));
  minutes = Number(String(minutes).padStart(2, '0'));
  remainingSeconds = Number(String(remainingSeconds).padStart(2, '0'));
  
  if (format === 'hrs') {
    return `${hours}:${minutes}:${remainingSeconds}`;
  } else if (format === 'min') {
    const totalMinutes = (hours * 60) + minutes;
    return `${totalMinutes}:${remainingSeconds}`;
  } else if (format === 'sec') {
    const totalSeconds = (hours * 3600) + (minutes * 60) + remainingSeconds;
    return `${totalSeconds}`;
  } else {
    return null;
  }
}

export function chunk(array: any[], size: number) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}