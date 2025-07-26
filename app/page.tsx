"use client"

import { useState } from "react"
import { Calculator, TrendingUp, Users } from "lucide-react"
import CalculatorForm from "@/components/calculator-form"
import ResultsDisplay from "@/components/results-display"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800">Calculadora Trabalhista</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Analise e compare cenários de carreira com cálculos precisos de INSS, IRRF, FGTS e benefícios
          </p>

          {/* Features */}
          <div className="flex justify-center gap-8 mt-8 text-sm text-gray-500">
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
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Mode Selector */}
            <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
              <div className="flex justify-center">
                <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                  <button
                    onClick={() => handleModeChange("single")}
                    className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                      mode === "single"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    Cálculo Único
                  </button>
                  <button
                    onClick={() => handleModeChange("compare")}
                    className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                      mode === "compare"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    Comparar Cenários
                  </button>
                </div>
              </div>
            </div>

            {/* Calculator Form */}
            <div className="p-8">
              <CalculatorForm mode={mode} onCalculate={handleCalculate} isLoading={isLoading} error={error} />

              {/* Results */}
              {results && <ResultsDisplay mode={mode} results={results} />}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-sm text-gray-500">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 max-w-2xl mx-auto">
            <p className="font-medium mb-2">⚠️ Importante</p>
            <p>
              Valores de INSS e IRRF baseados nas tabelas de 2025. Esta é uma ferramenta de simulação para fins
              educacionais.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
