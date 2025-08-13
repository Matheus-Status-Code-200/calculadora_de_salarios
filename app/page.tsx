"use client"

import { useState } from "react"
import { Calculator, TrendingUp, Users, Sparkles } from "lucide-react"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 transition-colors duration-300">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-12 relative">
          {/* Theme Toggle */}
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>

          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-lg">
              <Calculator className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Calculadora Trabalhista
            </h1>
          </div>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Simule e compare cenários de carreira com cálculos precisos de INSS, IRRF, FGTS e benefícios
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Projeções Precisas</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Cálculos detalhados ano a ano com tabelas atualizadas de 2025
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Comparação Avançada</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Compare diferentes cenários de carreira lado a lado
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Relatórios PDF</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Exporte relatórios profissionais com gráficos e análises
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
            {/* Calculator Form */}
            <div className="p-1">
              <CalculatorForm mode={mode} onCalculate={handleCalculate} isLoading={isLoading} error={error} />

              {/* Results */}
              {results && <ResultsDisplay mode={mode} results={results} />}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 max-w-3xl mx-auto transition-colors duration-300">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">Importante</p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Valores de INSS e IRRF baseados nas tabelas oficiais de 2025. Esta é uma ferramenta de simulação para fins
              educacionais e de planejamento.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
