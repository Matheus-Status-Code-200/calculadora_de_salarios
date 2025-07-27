import type { CalculationInputs, CalculationResults, YearlyData } from "@/types/calculator"

// Tabelas INSS 2025
const INSS_TABLE_2025 = [
  { min: 0, max: 1412, rate: 0.075 },
  { min: 1412.01, max: 2666.68, rate: 0.09 },
  { min: 2666.69, max: 4000.03, rate: 0.12 },
  { min: 4000.04, max: 7786.02, rate: 0.14 },
]

const INSS_MAX_2025 = 7786.02
const INSS_MAX_CONTRIBUTION_2025 = 908.85

// Tabela IRRF 2025
const IRRF_TABLE_2025 = [
  { min: 0, max: 2259.2, rate: 0, deduction: 0 },
  { min: 2259.21, max: 2826.65, rate: 0.075, deduction: 169.44 },
  { min: 2826.66, max: 3751.05, rate: 0.15, deduction: 381.44 },
  { min: 3751.06, max: 4664.68, rate: 0.225, deduction: 662.77 },
  { min: 4664.69, max: Number.POSITIVE_INFINITY, rate: 0.275, deduction: 896.0 },
]

const DEPENDENT_DEDUCTION_2025 = 189.59

function calculateINSS(salary: number): number {
  if (salary <= 0) return 0
  if (salary > INSS_MAX_2025) return INSS_MAX_CONTRIBUTION_2025

  let inss = 0
  let remainingSalary = salary

  for (const bracket of INSS_TABLE_2025) {
    if (remainingSalary <= 0) break

    const bracketMin = bracket.min
    const bracketMax = bracket.max === Number.POSITIVE_INFINITY ? salary : Math.min(bracket.max, salary)
    const bracketAmount = Math.max(0, bracketMax - Math.max(bracketMin, 0))

    if (bracketAmount > 0) {
      inss += bracketAmount * bracket.rate
      remainingSalary -= bracketAmount
    }
  }

  return Math.min(inss, INSS_MAX_CONTRIBUTION_2025)
}

function calculateIRRF(salary: number, inss: number, dependents: number): number {
  const taxableIncome = salary - inss - dependents * DEPENDENT_DEDUCTION_2025

  if (taxableIncome <= 0) return 0

  for (const bracket of IRRF_TABLE_2025) {
    if (taxableIncome >= bracket.min && taxableIncome <= bracket.max) {
      const irrf = taxableIncome * bracket.rate - bracket.deduction
      return Math.max(0, irrf)
    }
  }

  return 0
}

export function performCalculation(years: number, inputs: CalculationInputs): CalculationResults {
  const yearlyData: YearlyData[] = []
  let totalGrossGains = 0
  let totalNetGains = 0
  let totalVacations = 0
  let totalThirteenthSalary = 0
  let totalInss = 0
  let totalIrrf = 0
  let totalFgts = 0
  let totalBenefits = 0
  let totalIndenization = 0

  // Calcular salário mensal inicial
  let monthlySalary =
    inputs.salaryType === "mensal" ? inputs.initialMonthlySalary : inputs.hourlyRate * inputs.hoursPerMonth

  for (let year = 1; year <= years; year++) {
    // Aplicar reajuste anual (exceto no primeiro ano)
    if (year > 1) {
      monthlySalary *= 1 + inputs.annualAdjustmentRate / 100
    }

    // Cálculos anuais
    const annualSalary = monthlySalary * 12
    const thirteenthSalary = monthlySalary
    const vacationSalary = monthlySalary + monthlySalary / 3 // Férias + 1/3

    const grossGains = annualSalary + thirteenthSalary + vacationSalary

    // Benefícios anuais
    const yearlyBenefits = inputs.benefits.reduce((sum, benefit) => {
      return sum + (benefit.frequency === "mensal" ? benefit.value * 12 : benefit.value)
    }, 0)

    // Cálculo de descontos se habilitado
    let yearlyInss = 0
    let yearlyIrrf = 0
    let netGains = grossGains

    if (inputs.calculateDiscounts) {
      // INSS sobre salário mensal (12x) + 13º
      const monthlyInss = calculateINSS(monthlySalary)
      const thirteenthInss = calculateINSS(thirteenthSalary)
      yearlyInss = monthlyInss * 12 + thirteenthInss

      // IRRF sobre salário mensal (12x) + 13º
      const monthlyIrrf = calculateIRRF(monthlySalary, monthlyInss, inputs.dependents)
      const thirteenthIrrf = calculateIRRF(thirteenthSalary, thirteenthInss, inputs.dependents)
      yearlyIrrf = monthlyIrrf * 12 + thirteenthIrrf

      netGains = grossGains - yearlyInss - yearlyIrrf
    }

    // FGTS (8% sobre salário + 13º, não sobre férias)
    const fgts = (annualSalary + thirteenthSalary) * 0.08

    // Indenização (aplicada sobre salário anual + 13º)
    const indenization = (annualSalary + thirteenthSalary) * (inputs.indenizationPercentage / 100)

    // Armazenar dados do ano
    yearlyData.push({
      year,
      monthlySalary,
      grossGains,
      netGains,
      vacations: vacationSalary,
      thirteenthSalary,
      inss: yearlyInss,
      irrf: yearlyIrrf,
      fgts,
      benefits: yearlyBenefits,
      indenization,
    })

    // Acumular totais
    totalGrossGains += grossGains
    totalNetGains += netGains
    totalVacations += vacationSalary
    totalThirteenthSalary += thirteenthSalary
    totalInss += yearlyInss
    totalIrrf += yearlyIrrf
    totalFgts += fgts
    totalBenefits += yearlyBenefits
    totalIndenization += indenization
  }

  return {
    yearlyData,
    totalGrossGains,
    totalNetGains,
    totalVacations,
    totalThirteenthSalary,
    totalInss,
    totalIrrf,
    totalFgts,
    totalBenefits,
    totalIndenization,
    hasDiscounts: inputs.calculateDiscounts,
  }
}
