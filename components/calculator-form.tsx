"use client"

import type React from "react"

import { useState } from "react"
import { Calculator, Loader2 } from "lucide-react"
import ScenarioInput from "./scenario-input"
import type { CalculationMode, CalculationInputs } from "@/types/calculator"
import { validateInputs } from "@/lib/validation"

interface CalculatorFormProps {
  mode: CalculationMode
  onCalculate: (period: number, inputs: CalculationInputs[]) => void
  isLoading: boolean
  error: string | null
}

export default function CalculatorForm({ mode, onCalculate, isLoading, error }: CalculatorFormProps) {
  const [period, setPeriod] = useState<number>(10)
  const [scenario1, setScenario1] = useState<CalculationInputs>({
    annualAdjustmentRate: 3.5,
    salaryType: "mensal",
    initialMonthlySalary: 0,
    hourlyRate: 0,
    hoursPerMonth: 0,
    benefits: [],
    calculateDiscounts: false,
    dependents: 0,
  })
  const [scenario2, setScenario2] = useState<CalculationInputs>({
    annualAdjustmentRate: 3.5,
    salaryType: "mensal",
    initialMonthlySalary: 0,
    hourlyRate: 0,
    hoursPerMonth: 0,
    benefits: [],
    calculateDiscounts: false,
    dependents: 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const inputs = mode === "single" ? [scenario1] : [scenario1, scenario2]
    const validation = validateInputs(period, inputs)

    if (!validation.isValid) {
      return
    }

    onCalculate(period, inputs)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Period Input */}
      <div className="bg-blue-50 rounded-lg p-6">
        <label htmlFor="period" className="block text-sm font-semibold text-blue-900 mb-2">
          Prazo do cálculo (em anos)
        </label>
        <input
          type="number"
          id="period"
          value={period}
          onChange={(e) => setPeriod(Number.parseFloat(e.target.value) || 0)}
          className="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ex: 10,5"
          min="0.1"
          max="50"
          step="0.1"
          required
        />
        <p className="text-xs text-blue-700 mt-1">Período para projeção dos ganhos e descontos</p>
      </div>

      {/* Scenarios */}
      <div className={mode === "compare" ? "grid grid-cols-1 lg:grid-cols-2 gap-8" : ""}>
        <ScenarioInput scenario={1} inputs={scenario1} onChange={setScenario1} isCompareMode={mode === "compare"} />

        {mode === "compare" && (
          <ScenarioInput scenario={2} inputs={scenario2} onChange={setScenario2} isCompareMode={true} />
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Calculando...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Calculator className="w-5 h-5" />
              <span>Calcular Projeção</span>
            </div>
          )}
        </button>
      </div>
    </form>
  )
}
