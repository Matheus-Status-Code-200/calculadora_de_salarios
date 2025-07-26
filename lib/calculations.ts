import type { CalculationInputs, CalculationResults, YearlyData } from "@/types/calculator"

// Tabelas de INSS e IRRF para 2025
const inssTable = [
  { limit: 1518.0, rate: 0.075 },
  { limit: 2793.88, rate: 0.09 },
  { limit: 4190.83, rate: 0.12 },
  { limit: 8157.41, rate: 0.14 },
]

const inssTeto = 951.62

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
      // Arredondar para 2 casas decimais
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
      // Arredondar para 2 casas decimais e garantir que não seja negativo
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
  const yearlyData: YearlyData[] = [] // Adicionar array para dados anuais

  // Calculate initial monthly salary with precision
  let currentGrossSalary =
    inputs.salaryType === "mensal"
      ? Math.round(inputs.initialMonthlySalary * 100) / 100
      : Math.round(inputs.hourlyRate * inputs.hoursPerMonth * 100) / 100

  const adjustmentMultiplier = 1 + inputs.annualAdjustmentRate / 100

  // Calculate annual benefit value with precision
  const annualBenefitValue = inputs.benefits.reduce((acc, benefit) => {
    const benefitValue = benefit.frequency === "mensal" ? benefit.value * 12 : benefit.value
    return acc + Math.round(benefitValue * 100) / 100
  }, 0)

  for (let year = 0; year < period; year++) {
    // Annual salary (12 months + 13th salary)
    const grossSalary12 = Math.round(currentGrossSalary * 12 * 100) / 100
    const thirteenthSalary = Math.round(currentGrossSalary * 100) / 100

    // Calcular férias (salário + 1/3 constitucional)
    const vacationBase = Math.round(currentGrossSalary * 100) / 100
    const vacationBonus = Math.round((vacationBase / 3) * 100) / 100
    const annualVacations = Math.round((vacationBase + vacationBonus) * 100) / 100

    const annualGross = grossSalary12 + thirteenthSalary + annualVacations

    let annualInss = 0
    let annualIrrf = 0

    if (inputs.calculateDiscounts) {
      // Calculate INSS for 12 months + 13th salary + vacation
      const inss12 = calculateINSS(currentGrossSalary) * 12
      const inss13 = calculateINSS(thirteenthSalary)
      const inssVacation = calculateINSS(annualVacations)
      annualInss = Math.round((inss12 + inss13 + inssVacation) * 100) / 100

      // Calculate IRRF for 12 months + 13th salary + vacation
      const irrf12 = calculateIRRF(currentGrossSalary, inss12 / 12, inputs.dependents) * 12
      const irrf13 = calculateIRRF(thirteenthSalary, inss13, inputs.dependents)
      const irrfVacation = calculateIRRF(annualVacations, inssVacation, inputs.dependents)
      annualIrrf = Math.round((irrf12 + irrf13 + irrfVacation) * 100) / 100
    }

    const annualFgts = Math.round(annualGross * 0.08 * 100) / 100
    const annualNetGains = Math.round((annualGross - annualInss - annualIrrf) * 100) / 100

    // Adicionar dados do ano ao array
    yearlyData.push({
      year: year + 1,
      monthlySalary: currentGrossSalary,
      grossSalary12,
      thirteenthSalary,
      vacations: annualVacations,
      totalGross: annualGross,
      inss: annualInss,
      irrf: annualIrrf,
      fgts: annualFgts,
      benefits: annualBenefitValue,
      netGains: annualNetGains,
    })

    // Accumulate totals with precision
    totalGrossGains = Math.round((totalGrossGains + annualGross) * 100) / 100
    totalNetGains = Math.round((totalNetGains + annualGross - annualInss - annualIrrf) * 100) / 100
    totalInss = Math.round((totalInss + annualInss) * 100) / 100
    totalIrrf = Math.round((totalIrrf + annualIrrf) * 100) / 100
    totalFgts = Math.round((totalFgts + annualFgts) * 100) / 100
    totalBenefits = Math.round((totalBenefits + annualBenefitValue) * 100) / 100
    totalVacations = Math.round((totalVacations + annualVacations) * 100) / 100

    // Apply annual adjustment for next year
    currentGrossSalary = Math.round(currentGrossSalary * adjustmentMultiplier * 100) / 100
  }

  return {
    totalGrossGains,
    totalNetGains,
    totalInss,
    totalIrrf,
    totalFgts,
    totalBenefits,
    totalVacations,
    hasDiscounts: inputs.calculateDiscounts,
    yearlyData, // Adicionar dados anuais ao retorno
  }
}
