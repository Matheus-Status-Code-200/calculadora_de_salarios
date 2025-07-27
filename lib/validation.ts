import type { CalculationInputs } from "@/types/calculator"

export interface ValidationResult {
  isValid: boolean
  error: string
}

export function validateInputs(inputs: CalculationInputs): ValidationResult {
  // Validar tipo de salário e valores
  if (inputs.salaryType === "mensal") {
    if (!inputs.initialMonthlySalary || inputs.initialMonthlySalary <= 0) {
      return {
        isValid: false,
        error: "Salário mensal deve ser maior que zero",
      }
    }
    if (inputs.initialMonthlySalary > 1000000) {
      return {
        isValid: false,
        error: "Salário mensal não pode ser maior que R$ 1.000.000",
      }
    }
  } else {
    if (!inputs.hourlyRate || inputs.hourlyRate <= 0) {
      return {
        isValid: false,
        error: "Valor por hora deve ser maior que zero",
      }
    }
    if (!inputs.hoursPerMonth || inputs.hoursPerMonth <= 0) {
      return {
        isValid: false,
        error: "Horas por mês deve ser maior que zero",
      }
    }
    if (inputs.hoursPerMonth > 300) {
      return {
        isValid: false,
        error: "Horas por mês não pode ser maior que 300",
      }
    }
  }

  // Validar reajuste anual
  if (inputs.annualAdjustmentRate < 0 || inputs.annualAdjustmentRate > 50) {
    return {
      isValid: false,
      error: "Reajuste anual deve estar entre 0% e 50%",
    }
  }

  // Validar indenização
  if (inputs.indenizationPercentage < 0 || inputs.indenizationPercentage > 100) {
    return {
      isValid: false,
      error: "Indenização deve estar entre 0% e 100%",
    }
  }

  // Validar dependentes
  if (inputs.dependents < 0 || inputs.dependents > 20) {
    return {
      isValid: false,
      error: "Número de dependentes deve estar entre 0 e 20",
    }
  }

  return {
    isValid: true,
    error: "",
  }
}
