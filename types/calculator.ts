export type CalculationMode = "single" | "compare"

export type SalaryType = "mensal" | "horista"

export interface Benefit {
  name: string
  value: number
  frequency: "mensal" | "anual"
}

export interface CalculationInputs {
  salaryType: SalaryType
  initialMonthlySalary: number
  hourlyRate: number
  hoursPerMonth: number
  annualAdjustmentRate: number
  indenizationPercentage: number
  benefits: Benefit[]
  calculateDiscounts: boolean
  dependents: number
}

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
  indenization: number
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
  totalIndenization: number
  hasDiscounts: boolean
  yearlyData: YearlyData[]
}

export interface ValidationResult {
  isValid: boolean
  error: string
}
