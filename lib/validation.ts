import type { CalculationInputs } from "@/types/calculator"

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export const validateInputs = (period: number, inputs: CalculationInputs[]): ValidationResult => {
  // Validate period
  if (isNaN(period) || period <= 0 || period > 50) {
    return {
      isValid: false,
      error: "Por favor, insira um prazo de cálculo válido entre 1 e 50 anos.",
    }
  }

  // Validate each scenario
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i]
    const scenarioNumber = inputs.length > 1 ? i + 1 : ""

    let monthlySalary = 0

    if (input.salaryType === "mensal") {
      monthlySalary = input.initialMonthlySalary
      if (isNaN(monthlySalary) || monthlySalary <= 0 || monthlySalary > 1000000) {
        return {
          isValid: false,
          error: `Salário mensal deve estar entre R$ 0,01 e R$ 1.000.000,00${scenarioNumber ? ` no Cenário ${scenarioNumber}` : ""}.`,
        }
      }
    } else {
      if (
        isNaN(input.hourlyRate) ||
        input.hourlyRate <= 0 ||
        input.hourlyRate > 10000 ||
        isNaN(input.hoursPerMonth) ||
        input.hoursPerMonth <= 0 ||
        input.hoursPerMonth > 744
      ) {
        return {
          isValid: false,
          error: `Valores de horista inválidos${scenarioNumber ? ` no Cenário ${scenarioNumber}` : ""}. Valor por hora deve estar entre R$ 0,01 e R$ 10.000,00 e horas entre 1 e 744.`,
        }
      }
      monthlySalary = input.hourlyRate * input.hoursPerMonth
    }

    // Validate adjustment rate
    if (isNaN(input.annualAdjustmentRate) || input.annualAdjustmentRate < 0 || input.annualAdjustmentRate > 100) {
      return {
        isValid: false,
        error: `Taxa de reajuste anual deve estar entre 0% e 100%${scenarioNumber ? ` no Cenário ${scenarioNumber}` : ""}.`,
      }
    }

    // Validate dependents
    if (input.calculateDiscounts && (isNaN(input.dependents) || input.dependents < 0 || input.dependents > 20)) {
      return {
        isValid: false,
        error: `Número de dependentes deve estar entre 0 e 20${scenarioNumber ? ` no Cenário ${scenarioNumber}` : ""}.`,
      }
    }

    // Validate benefits
    for (let j = 0; j < input.benefits.length; j++) {
      const benefit = input.benefits[j]
      if (benefit.value > 0 && (isNaN(benefit.value) || benefit.value > 1000000)) {
        return {
          isValid: false,
          error: `Valor do benefício "${benefit.name || `#${j + 1}`}" deve estar entre R$ 0,01 e R$ 1.000.000,00${scenarioNumber ? ` no Cenário ${scenarioNumber}` : ""}.`,
        }
      }
    }
  }

  return { isValid: true }
}
