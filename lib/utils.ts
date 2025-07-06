import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const getCodeFil = (program: string ) : string => {
  return program
    .split(" ")
    .filter((world) => world[0] == world[0].toUpperCase())
    .map((part) => part[0])
    .join("")
}