"use client"

import { useState } from "react"
import { Calculator, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ScenarioInput from "./scenario-input"
import ResultsDisplay from "./results-display"
import type { CalculationMode, CalculationInputs, CalculationResults } from "@/types/calculator"
import { validateInputs } from "@/lib/validation"
import { performCalculation } from "@/lib/calculations"

export default function CalculatorForm() {
  const [mode, setMode] = useState<CalculationMode>("single")
  const [period, setPeriod] = useState("")
  const [results, setResults] = useState<CalculationResults[] | null>(null)
  const [error, setError] = useState("")
  const [isCalculating, setIsCalculating] = useState(false)

  const handlePeriodChange = (value: string) => {
    // Permitir campo vazio
    if (value === "") {
      setPeriod("")
      return
    }

    // Converter para número e validar
    const numValue = Number.parseInt(value, 10)

    // Só aceitar números válidos entre 1 e 80
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 80) {
      setPeriod(numValue.toString())
    }
  }

  const handleCalculate = async () => {
    setError("")
    setIsCalculating(true)

    try {
      // Validar período
      if (!period || period === "") {
        setError("Por favor, informe o período de cálculo em anos.")
        return
      }

      const periodYears = Number.parseInt(period, 10)
      if (isNaN(periodYears) || periodYears < 1 || periodYears > 80) {
        setError("O período deve ser um número inteiro entre 1 e 80 anos.")
        return
      }

      if (mode === "single") {
        const inputs = getScenarioInputs(0)
        const validation = validateInputs(inputs)

        if (!validation.isValid) {
          setError(validation.error)
          return
        }

        const result = performCalculation(periodYears, inputs)
        setResults([result])
      } else {
        const inputs1 = getScenarioInputs(1)
        const inputs2 = getScenarioInputs(2)

        const validation1 = validateInputs(inputs1)
        const validation2 = validateInputs(inputs2)

        if (!validation1.isValid) {
          setError(`Cenário 1: ${validation1.error}`)
          return
        }

        if (!validation2.isValid) {
          setError(`Cenário 2: ${validation2.error}`)
          return
        }

        const result1 = performCalculation(periodYears, inputs1)
        const result2 = performCalculation(periodYears, inputs2)
        setResults([result1, result2])
      }
    } catch (err) {
      setError("Erro ao realizar o cálculo. Verifique os dados informados.")
    } finally {
      setIsCalculating(false)
    }
  }

  const getScenarioInputs = (scenario: number): CalculationInputs => {
    const salaryType = (document.getElementById(`salaryType${scenario}`) as HTMLSelectElement)?.value as
      | "mensal"
      | "horista"
    const salary = Number.parseFloat((document.getElementById(`salary${scenario}`) as HTMLInputElement)?.value || "0")
    const hourlyRate = Number.parseFloat(
      (document.getElementById(`hourlyRate${scenario}`) as HTMLInputElement)?.value || "0",
    )
    const hoursPerMonth = Number.parseFloat(
      (document.getElementById(`hoursPerMonth${scenario}`) as HTMLInputElement)?.value || "0",
    )
    const annualAdjustmentRate = Number.parseFloat(
      (document.getElementById(`annualAdjustmentRate${scenario}`) as HTMLInputElement)?.value || "0",
    )
    const indenizationPercentage = Number.parseFloat(
      (document.getElementById(`indenizationPercentage${scenario}`) as HTMLInputElement)?.value || "0",
    )
    const calculateDiscounts =
      (document.querySelector(`.calculate-discounts-toggle[data-scenario="${scenario}"]`) as HTMLInputElement)
        ?.checked || false
    const dependents = Number.parseInt(
      (document.getElementById(`dependents${scenario}`) as HTMLInputElement)?.value || "0",
      10,
    )

    // Coletar benefícios
    const benefitRows = document.querySelectorAll(`.benefits-container[data-scenario="${scenario}"] .benefit-row`)
    const benefits = Array.from(benefitRows)
      .map((row) => {
        const nameInput = row.querySelector('input[type="text"]') as HTMLInputElement
        const valueInput = row.querySelector('input[type="number"]') as HTMLInputElement
        const frequencySelect = row.querySelector("select") as HTMLSelectElement

        return {
          name: nameInput?.value || "",
          value: Number.parseFloat(valueInput?.value || "0"),
          frequency: frequencySelect?.value as "mensal" | "anual",
        }
      })
      .filter((benefit) => benefit.value > 0)

    return {
      salaryType,
      initialMonthlySalary: salary,
      hourlyRate,
      hoursPerMonth,
      annualAdjustmentRate,
      indenizationPercentage,
      benefits,
      calculateDiscounts,
      dependents,
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 md:space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Calculadora Trabalhista Completa
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
            Analise e compare cenários de carreira com todos os detalhes
          </p>
        </div>

        {/* Mode Selector */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-3 md:p-6">
            <div className="flex justify-center">
              <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-600 p-1 w-full max-w-md">
                <button
                  onClick={() => setMode("single")}
                  className={`flex-1 px-4 md:px-6 py-2 md:py-3 rounded-md font-medium transition-colors text-sm md:text-base ${
                    mode === "single"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}
                >
                  Cálculo Único
                </button>
                <button
                  onClick={() => setMode("compare")}
                  className={`flex-1 px-4 md:px-6 py-2 md:py-3 rounded-md font-medium transition-colors text-sm md:text-base ${
                    mode === "compare"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}
                >
                  Comparar Cenários
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Period Input */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-3 md:p-6">
            <div className="max-w-md mx-auto">
              <label
                htmlFor="period"
                className="block text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Período de cálculo (anos)
              </label>
              <input
                type="number"
                id="period"
                min="1"
                max="80"
                step="1"
                value={period}
                onChange={(e) => handlePeriodChange(e.target.value)}
                className="w-full px-4 py-3 md:py-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 text-base md:text-lg"
                placeholder="Ex: 10"
              />
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">Entre 1 e 80 anos</p>
            </div>
          </CardContent>
        </Card>

        {/* Scenario Inputs */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
          {mode === "single" ? (
            <div className="xl:col-span-2">
              <ScenarioInput scenario={0} title="Dados do Cenário" />
            </div>
          ) : (
            <>
              <ScenarioInput scenario={1} title="Cenário 1" />
              <ScenarioInput scenario={2} title="Cenário 2" />
            </>
          )}
        </div>

        {/* Calculate Button */}
        <div className="text-center">
          <Button
            onClick={handleCalculate}
            disabled={isCalculating}
            size="lg"
            className="w-full max-w-md px-6 md:px-8 py-3 md:py-4 text-base md:text-lg"
          >
            <Calculator className="w-5 h-5 mr-2" />
            {isCalculating ? "Calculando..." : "Calcular Projeção"}
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3 text-red-800 dark:text-red-400">
                <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span className="font-medium text-sm md:text-base">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {results && <ResultsDisplay mode={mode} results={results} period={Number.parseInt(period)} />}

        {/* Footer */}
        <div className="text-center text-xs md:text-sm text-gray-500 dark:text-gray-400 border-t dark:border-gray-700 pt-6">
          <p>Valores de INSS e IRRF baseados nas tabelas de 2025. Esta é uma ferramenta de simulação.</p>
        </div>
      </div>
    </div>
  )
}
