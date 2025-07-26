import type { CalculationInputs, CalculationResults, YearlyData } from "@/types/calculator"

// Tabelas de INSS 2025
const inssTable = [
  { limit: 1518.0, rate: 0.075 },
  { limit: 2793.88, rate: 0.09 },
  { limit: 4190.83, rate: 0.12 },
  { limit: 8157.41, rate: 0.14 },
]

const inssTeto = 951.62

// Tabela de IRRF 2025
const irrfTable = [
  { limit: 2428.8, rate: 0, deduction: 0 },
  { limit: 2826.65, rate: 0.075, deduction: 182.16 },
  { limit: 3751.05, rate: 0.15, deduction: 394.16 },
  { limit: 4664.68, rate: 0.225, deduction: 675.49 },
  { limit: Number.POSITIVE_INFINITY, rate: 0.275, deduction: 896.0 },
]

const dependentDeduction = 189.59

export const calculateINSS = (salary: number): number => {
  if (salary > inssTable[3].limit) return inssTeto

  let inss = 0
  let lastLimit = 0

  for (const range of inssTable) {
    if (salary > range.limit) {
      inss += (range.limit - lastLimit) * range.rate
      lastLimit = range.limit
    } else {
      inss += (salary - lastLimit) * range.rate
      return Math.round(inss * 100) / 100
    }
  }

  return Math.round(inss * 100) / 100
}

export const calculateIRRF = (salary: number, inssDiscount: number, dependents: number): number => {
  const base = salary - inssDiscount - dependents * dependentDeduction

  if (base <= irrfTable[0].limit) return 0

  for (const range of irrfTable) {
    if (base <= range.limit) {
      const irrf = base * range.rate - range.deduction
      return Math.max(0, Math.round(irrf * 100) / 100)
    }
  }

  return 0
}

export const performCalculation = (period: number, inputs: CalculationInputs): CalculationResults => {
  let totalGrossGains = 0
  let totalNetGains = 0
  let totalInss = 0
  let totalIrrf = 0
  let totalFgts = 0
  let totalBenefits = 0
  let totalVacations = 0
  let totalIndenization = 0

  const yearlyData: YearlyData[] = []

  // Calcular salário mensal inicial
  let currentMonthlySalary =
    inputs.salaryType === "mensal" ? inputs.initialMonthlySalary : inputs.hourlyRate * inputs.hoursPerMonth

  const adjustmentMultiplier = 1 + inputs.annualAdjustmentRate / 100

  // Calcular benefícios anuais
  const annualBenefitValue = inputs.benefits.reduce((acc, benefit) => {
    return acc + (benefit.frequency === "mensal" ? benefit.value * 12 : benefit.value)
  }, 0)

  for (let year = 1; year <= period; year++) {
    // Salários do ano
    const grossSalary12 = currentMonthlySalary * 12
    const thirteenthSalary = currentMonthlySalary

    // Calcular férias (salário + 1/3 constitucional)
    const vacationBase = currentMonthlySalary
    const vacationBonus = currentMonthlySalary / 3
    const annualVacations = vacationBase + vacationBonus

    // Indenização (% sobre salário anual + 13º)
    const indenizationBase = grossSalary12 + thirteenthSalary
    const annualIndenization = (indenizationBase * inputs.indenizationPercentage) / 100

    const annualGross = grossSalary12 + thirteenthSalary + annualVacations

    let annualInss = 0
    let annualIrrf = 0

    if (inputs.calculateDiscounts) {
      // Calculate INSS for 12 months + 13th salary + vacation
      const inss12 = calculateINSS(currentMonthlySalary) * 12
      const inss13 = calculateINSS(thirteenthSalary)
      const inssVacation = calculateINSS(annualVacations)
      annualInss = inss12 + inss13 + inssVacation

      // Calculate IRRF for 12 months + 13th salary + vacation
      const irrf12 = calculateIRRF(currentMonthlySalary, inss12 / 12, inputs.dependents) * 12
      const irrf13 = calculateIRRF(thirteenthSalary, inss13, inputs.dependents)
      const irrfVacation = calculateIRRF(annualVacations, inssVacation, inputs.dependents)
      annualIrrf = irrf12 + irrf13 + irrfVacation
    }

    const annualFgts = annualGross * 0.08
    const annualNetGains = annualGross - annualInss - annualIrrf

    // Adicionar dados do ano ao array
    yearlyData.push({
      year,
      monthlySalary: Math.round(currentMonthlySalary * 100) / 100,
      grossSalary12: Math.round(grossSalary12 * 100) / 100,
      thirteenthSalary: Math.round(thirteenthSalary * 100) / 100,
      vacations: Math.round(annualVacations * 100) / 100,
      totalGross: Math.round(annualGross * 100) / 100,
      inss: Math.round(annualInss * 100) / 100,
      irrf: Math.round(annualIrrf * 100) / 100,
      fgts: Math.round(annualFgts * 100) / 100,
      benefits: Math.round(annualBenefitValue * 100) / 100,
      indenization: Math.round(annualIndenization * 100) / 100,
      netGains: Math.round(annualNetGains * 100) / 100,
    })

    // Accumulate totals with precision
    totalGrossGains = Math.round((totalGrossGains + annualGross) * 100) / 100
    totalNetGains = Math.round((totalNetGains + annualGross - annualInss - annualIrrf) * 100) / 100
    totalInss = Math.round((totalInss + annualInss) * 100) / 100
    totalIrrf = Math.round((totalIrrf + annualIrrf) * 100) / 100
    totalFgts = Math.round((totalFgts + annualFgts) * 100) / 100
    totalBenefits = Math.round((totalBenefits + annualBenefitValue) * 100) / 100
    totalVacations = Math.round((totalVacations + annualVacations) * 100) / 100
    totalIndenization = Math.round((totalIndenization + annualIndenization) * 100) / 100

    // Apply annual adjustment for next year
    currentMonthlySalary = Math.round(currentMonthlySalary * adjustmentMultiplier * 100) / 100
  }

  return {
    totalGrossGains,
    totalNetGains,
    totalInss,
    totalIrrf,
    totalFgts,
    totalBenefits,
    totalVacations,
    totalIndenization,
    hasDiscounts: inputs.calculateDiscounts,
    yearlyData,
  }
}
