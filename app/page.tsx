"use client"

import { useState } from "react"
import { Calculator, TrendingUp, Users } from "lucide-react"
import CalculatorForm from "@/components/calculator-form"
import ResultsDisplay from "@/components/results-display"
import { ThemeToggle } from "@/components/theme-toggle"
import type { CalculationMode, CalculationInputs, CalculationResults } from "@/types/calculator"
import { performCalculation } from "@/lib/calculations"

export default function CalculatorPage() {
  const [mode, setMode] = useState<CalculationMode>("single")
  const [results, setResults] = useState<CalculationResults[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCalculate = async (period: number, inputs: CalculationInputs[]) => {
    setIsLoading(true)
    setError(null)

    try {
      const calculationResults = inputs.map((input) => performCalculation(period, input))
      setResults(calculationResults)
    } catch (err) {
      setError("Erro ao realizar os cálculos. Verifique os dados inseridos.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleModeChange = (newMode: CalculationMode) => {
    setMode(newMode)
    setResults(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="container mx-auto py-12 my-0 px-0">
        {/* Header */}
        <div className="text-center mb-12 relative">
          {/* Theme Toggle */}
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>

          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 dark:bg-blue-500 rounded-full">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-100">Calculadora Trabalhista</h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Analise e compare cenários de carreira com cálculos precisos de INSS, IRRF, FGTS e benefícios
          </p>

          {/* Features */}
          <div className="flex justify-center gap-8 mt-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>Projeções de longo prazo</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Comparação de cenários</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
            {/* Mode Selector */}
            

            {/* Calculator Form */}
            <div className="p-8 px-1">
              <CalculatorForm mode={mode} onCalculate={handleCalculate} isLoading={isLoading} error={error} />

              {/* Results */}
              {results && <ResultsDisplay mode={mode} results={results} />}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-sm text-gray-500 dark:text-gray-400">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto transition-colors duration-300">
            <p className="font-medium mb-2">⚠️ Importante</p>
            <p>
              Valores de INSS e IRRF baseados nas tabelas de 2025. Esta é uma ferramenta de simulação.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
