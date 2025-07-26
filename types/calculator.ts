export type CalculationMode = "single" | "compare"

export interface Benefit {
  name: string
  value: number
  frequency: "mensal" | "anual"
}

export interface CalculationInputs {
  annualAdjustmentRate: number
  salaryType: "mensal" | "horista"
  initialMonthlySalary: number
  hourlyRate: number
  hoursPerMonth: number
  benefits: Benefit[]
  calculateDiscounts: boolean
  dependents: number
}

// Adicionar interface para dados anuais
export interface YearlyData {
  year: number
  monthlySalary: number
  grossSalary12: number
  thirteenthSalary: number
  vacations: number
  totalGross: number
  inss: number
  irrf: number
  fgts: number
  benefits: number
  netGains: number
}

export interface CalculationResults {
  totalGrossGains: number
  totalNetGains: number
  totalInss: number
  totalIrrf: number
  totalFgts: number
  totalBenefits: number
  totalVacations: number
  hasDiscounts: boolean
  yearlyData: YearlyData[] // Adicionar dados anuais
}
