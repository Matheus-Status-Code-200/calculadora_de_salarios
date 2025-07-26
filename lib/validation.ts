import type { CalculationInputs, ValidationResult } from "@/types/calculator"

export const validateInputs = (inputs: CalculationInputs): ValidationResult => {
  // Validar tipo de salário e valores
  if (inputs.salaryType === "mensal") {
    if (!inputs.initialMonthlySalary || inputs.initialMonthlySalary <= 0) {
      return { isValid: false, error: "Informe um salário mensal válido." }
    }
    if (inputs.initialMonthlySalary > 1000000) {
      return { isValid: false, error: "Salário mensal não pode ser superior a R$ 1.000.000,00." }
    }
  } else {
    if (!inputs.hourlyRate || inputs.hourlyRate <= 0) {
      return { isValid: false, error: "Informe um valor por hora válido." }
    }
    if (!inputs.hoursPerMonth || inputs.hoursPerMonth <= 0) {
      return { isValid: false, error: "Informe a quantidade de horas por mês." }
    }
    if (inputs.hourlyRate > 10000) {
      return { isValid: false, error: "Valor por hora não pode ser superior a R$ 10.000,00." }
    }
    if (inputs.hoursPerMonth > 300) {
      return { isValid: false, error: "Horas por mês não pode ser superior a 300." }
    }
  }

  // Validar reajuste anual
  if (inputs.annualAdjustmentRate < 0 || inputs.annualAdjustmentRate > 50) {
    return { isValid: false, error: "Reajuste anual deve estar entre 0% e 50%." }
  }

  // Validar indenização
  if (inputs.indenizationPercentage < 0 || inputs.indenizationPercentage > 100) {
    return { isValid: false, error: "Indenização deve estar entre 0% e 100%." }
  }

  // Validar dependentes
  if (inputs.dependents < 0 || inputs.dependents > 20) {
    return { isValid: false, error: "Número de dependentes deve estar entre 0 e 20." }
  }

  // Validar benefícios
  for (const benefit of inputs.benefits) {
    if (benefit.value < 0) {
      return { isValid: false, error: "Valores de benefícios não podem ser negativos." }
    }
    if (benefit.value > 1000000) {
      return { isValid: false, error: "Valor de benefício não pode ser superior a R$ 1.000.000,00." }
    }
  }

  return { isValid: true, error: "" }
}
