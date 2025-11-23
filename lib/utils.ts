import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `PKR ${(price / 10000000).toFixed(2)} Cr`
  } else if (price >= 100000) {
    return `PKR ${(price / 100000).toFixed(2)} Lac`
  } else {
    return `PKR ${price.toLocaleString()}`
  }
}

export function formatArea(area: number, unit: string = 'sqft'): string {
  if (area >= 4356) {
    const kanals = (area / 4356).toFixed(2)
    return `${kanals} Kanal`
  } else if (area >= 272.25) {
    const marlas = (area / 272.25).toFixed(2)
    return `${marlas} Marla`
  }
  return `${area.toLocaleString()} ${unit}`
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}
