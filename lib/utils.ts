import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

// Adicionar função para formatar percentual
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100)
}

// Adicionar função para parsing de números brasileiros
export const parseFloatBR = (value: string): number => {
  if (!value) return 0
  // Remove espaços e substitui vírgula por ponto
  const cleanValue = value.toString().replace(/\s/g, "").replace(",", ".")
  return Number.parseFloat(cleanValue) || 0
}
