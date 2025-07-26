"use client"

import { useEffect, useRef } from "react"
import { TrendingUp, DollarSign, PiggyBank, Receipt, Award } from "lucide-react"
import type { CalculationMode, CalculationResults } from "@/types/calculator"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import ComparisonChart from "./comparison-chart"
// Adicionar import do novo componente
import YearlyBreakdown from "./yearly-breakdown"

interface ResultsDisplayProps {
  mode: CalculationMode
  results: CalculationResults[]
}

export default function ResultsDisplay({ mode, results }: ResultsDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [results])

  if (mode === "single") {
    const result = results[0]
    const totalWithBenefits = result.hasDiscounts
      ? result.totalNetGains + result.totalBenefits
      : result.totalGrossGains + result.totalBenefits

    return (
      <div ref={containerRef} className="mt-12 space-y-8 animate-in slide-in-from-bottom-4 duration-700">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Resultados da Projeção</h2>
          <p className="text-gray-600">Análise completa dos seus ganhos no período</p>
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white/20 rounded-full">
              <Award className="w-8 h-8" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">GANHO TOTAL NO PERÍODO</h3>
          <p className="text-sm opacity-90 mb-4">
            {result.hasDiscounts ? "(Líquido + Benefícios)" : "(Bruto + Benefícios)"}
          </p>
          <p className="text-4xl font-bold">{formatCurrency(totalWithBenefits)}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-blue-900">Total Bruto</h3>
            </div>
            <p className="text-2xl font-bold text-blue-800">{formatCurrency(result.totalGrossGains)}</p>
            <p className="text-sm text-blue-600 mt-1">Salário + 13º + Férias</p>
          </div>

          <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-yellow-900">Férias</h3>
            </div>
            <p className="text-2xl font-bold text-yellow-800">{formatCurrency(result.totalVacations)}</p>
            <p className="text-sm text-yellow-600 mt-1">Férias + 1/3</p>
          </div>

          <div className="bg-green-50 rounded-xl p-6 border border-green-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-green-900">Benefícios</h3>
            </div>
            <p className="text-2xl font-bold text-green-800">{formatCurrency(result.totalBenefits)}</p>
            <p className="text-sm text-green-600 mt-1">Valor adicional</p>
          </div>

          {result.hasDiscounts && (
            <div className="bg-red-50 rounded-xl p-6 border border-red-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Receipt className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="font-semibold text-red-900">Descontos</h3>
              </div>
              <p className="text-2xl font-bold text-red-800">{formatCurrency(result.totalInss + result.totalIrrf)}</p>
              <p className="text-sm text-red-600 mt-1">INSS + IRRF</p>
            </div>
          )}

          <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <PiggyBank className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-purple-900">FGTS</h3>
            </div>
            <p className="text-2xl font-bold text-purple-800">{formatCurrency(result.totalFgts)}</p>
            <p className="text-sm text-purple-600 mt-1">Depositado</p>
          </div>
        </div>

        {result.hasDiscounts && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="font-medium">INSS sobre bruto: </span>
              {formatPercentage((result.totalInss / result.totalGrossGains) * 100)}
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="font-medium">IRRF sobre bruto: </span>
              {formatPercentage((result.totalIrrf / result.totalGrossGains) * 100)}
            </div>
          </div>
        )}

        {/* Yearly Breakdown */}
        <YearlyBreakdown yearlyData={result.yearlyData} hasDiscounts={result.hasDiscounts} />
      </div>
    )
  }

  // Compare mode
  const [result1, result2] = results
  const gain1 = result1.hasDiscounts
    ? result1.totalNetGains + result1.totalBenefits
    : result1.totalGrossGains + result1.totalBenefits
  const gain2 = result2.hasDiscounts
    ? result2.totalNetGains + result2.totalBenefits
    : result2.totalGrossGains + result2.totalBenefits
  const difference = gain2 - gain1

  return (
    <div ref={containerRef} className="mt-12 space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Comparação de Cenários</h2>
        <p className="text-gray-600">Análise comparativa dos dois cenários</p>
      </div>

      {/* Summary */}
      <div
        className={`rounded-2xl p-8 text-center ${
          Math.abs(difference) < 0.01
            ? "bg-gradient-to-r from-gray-600 to-gray-700 text-white"
            : difference > 0
              ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white"
              : "bg-gradient-to-r from-indigo-600 to-blue-600 text-white"
        }`}
      >
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-white/20 rounded-full">
            <TrendingUp className="w-8 h-8" />
          </div>
        </div>
        {Math.abs(difference) < 0.01 ? (
          <h3 className="text-2xl font-bold">Os cenários são equivalentes!</h3>
        ) : difference > 0 ? (
          <>
            <h3 className="text-2xl font-bold mb-2">Cenário 2 é mais vantajoso!</h3>
            <p className="text-xl">
              Rende <strong>{formatCurrency(difference)}</strong> a mais no período
            </p>
          </>
        ) : (
          <>
            <h3 className="text-2xl font-bold mb-2">Cenário 1 é mais vantajoso!</h3>
            <p className="text-xl">
              Rende <strong>{formatCurrency(Math.abs(difference))}</strong> a mais no período
            </p>
          </>
        )}
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-center text-indigo-700 mb-6">Cenário 1</h3>
          <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
            <h4 className="font-semibold text-indigo-900 mb-2">
              Ganho Total {result1.hasDiscounts ? "Líquido" : "Bruto"} + Benefícios
            </h4>
            <p className="text-3xl font-bold text-indigo-800">{formatCurrency(gain1)}</p>
            <p className="text-sm text-indigo-600 mt-2">Férias no período: {formatCurrency(result1.totalVacations)}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-center text-teal-700 mb-6">Cenário 2</h3>
          <div className="bg-teal-50 rounded-xl p-6 border border-teal-100">
            <h4 className="font-semibold text-teal-900 mb-2">
              Ganho Total {result2.hasDiscounts ? "Líquido" : "Bruto"} + Benefícios
            </h4>
            <p className="text-3xl font-bold text-teal-800">{formatCurrency(gain2)}</p>
            <p className="text-sm text-teal-600 mt-2">Férias no período: {formatCurrency(result2.totalVacations)}</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-xl font-bold text-center text-gray-800 mb-6">Gráfico Comparativo de Ganhos</h3>
        <ComparisonChart data={[gain1, gain2]} />
      </div>

      {/* Yearly Breakdown for Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h4 className="text-lg font-bold text-indigo-700 mb-4">Detalhamento Cenário 1</h4>
          <YearlyBreakdown yearlyData={result1.yearlyData} hasDiscounts={result1.hasDiscounts} />
        </div>
        <div>
          <h4 className="text-lg font-bold text-teal-700 mb-4">Detalhamento Cenário 2</h4>
          <YearlyBreakdown yearlyData={result2.yearlyData} hasDiscounts={result2.hasDiscounts} />
        </div>
      </div>
    </div>
  )
}
