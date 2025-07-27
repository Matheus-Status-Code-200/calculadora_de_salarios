export interface Benefit {
  name: string
  value: number
  frequency: "mensal" | "anual"
}

export interface CalculationInputs {
  salaryType: "mensal" | "horista"
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
  grossGains: number
  netGains: number
  vacations: number
  thirteenthSalary: number
  inss: number
  irrf: number
  fgts: number
  benefits: number
  indenization: number
}

export interface CalculationResults {
  yearlyData: YearlyData[]
  totalGrossGains: number
  totalNetGains: number
  totalVacations: number
  totalThirteenthSalary: number
  totalInss: number
  totalIrrf: number
  totalFgts: number
  totalBenefits: number
  totalIndenization: number
  hasDiscounts: boolean
}

export type CalculationMode = "single" | "compare"
