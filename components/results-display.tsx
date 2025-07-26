"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Calculator } from "lucide-react"
import type { CalculationMode, CalculationResults } from "@/types/calculator"
import { formatCurrency } from "@/lib/utils"
import YearlyBreakdown from "./yearly-breakdown"
import ComparisonChart from "./comparison-chart"
import PDFExport from "./pdf-export"

interface ResultsDisplayProps {
  mode: CalculationMode
  results: CalculationResults[]
  period: number
}

export default function ResultsDisplay({ mode, results, period }: ResultsDisplayProps) {
  const [showBreakdown1, setShowBreakdown1] = useState(false)
  const [showBreakdown2, setShowBreakdown2] = useState(false)

  if (mode === "single") {
    const result = results[0]
    const totalWithBenefits = result.hasDiscounts
      ? result.totalNetGains + result.totalBenefits + result.totalIndenization
      : result.totalGrossGains + result.totalBenefits + result.totalIndenization

    return (
      <div className="mt-12 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Resultados da Projeção</h2>
          <p className="text-gray-600 dark:text-gray-300">Valores calculados para {result.yearlyData.length} anos</p>
        </div>

        {/* Export Button */}
        <div className="flex justify-center">
          <PDFExport mode={mode} results={results} period={period} />
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-xl font-semibold mb-2">GANHO TOTAL NO PERÍODO</h3>
          <p className="text-sm opacity-90 mb-4">
            {result.hasDiscounts ? "(Líquido + Benefícios + Indenização)" : "(Bruto + Benefícios + Indenização)"}
          </p>
          <p className="text-4xl font-bold">{formatCurrency(totalWithBenefits)}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Total Bruto</h3>
            <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
              {formatCurrency(result.totalGrossGains)}
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Salário + 13º + Férias</p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-100 dark:border-yellow-800">
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">Férias</h3>
            <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
              {formatCurrency(result.totalVacations)}
            </p>
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">Férias + 1/3</p>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6 border border-orange-100 dark:border-orange-800">
            <h3 className="font-semibold text-orange-900 dark:text-orange-300 mb-2">Indenização</h3>
            <p className="text-2xl font-bold text-orange-800 dark:text-orange-200">
              {formatCurrency(result.totalIndenization)}
            </p>
            <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">Valor separado</p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-100 dark:border-green-800">
            <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">Benefícios</h3>
            <p className="text-2xl font-bold text-green-800 dark:text-green-200">
              {formatCurrency(result.totalBenefits)}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">Valor adicional</p>
          </div>

          {result.hasDiscounts && (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-100 dark:border-red-800">
              <h3 className="font-semibold text-red-900 dark:text-red-300 mb-2">Descontos</h3>
              <p className="text-2xl font-bold text-red-800 dark:text-red-200">
                {formatCurrency(result.totalInss + result.totalIrrf)}
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">INSS + IRRF</p>
            </div>
          )}

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-100 dark:border-purple-800">
            <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">FGTS</h3>
            <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
              {formatCurrency(result.totalFgts)}
            </p>
            <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">Depositado</p>
          </div>
        </div>

        {/* Botão para Detalhamento */}
        <div className="text-center">
          <button
            onClick={() => setShowBreakdown1(!showBreakdown1)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
          >
            <Calculator className="w-5 h-5" />
            {showBreakdown1 ? "Ocultar" : "Ver"} detalhamento ano a ano
            {showBreakdown1 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Detalhamento Anual */}
        {showBreakdown1 && <YearlyBreakdown yearlyData={result.yearlyData} hasDiscounts={result.hasDiscounts} />}
      </div>
    )
  }

  // Modo Comparação
  const [result1, result2] = results
  const gain1 = result1.hasDiscounts
    ? result1.totalNetGains + result1.totalBenefits + result1.totalIndenization
    : result1.totalGrossGains + result1.totalBenefits + result1.totalIndenization
  const gain2 = result2.hasDiscounts
    ? result2.totalNetGains + result2.totalBenefits + result2.totalIndenization
    : result2.totalGrossGains + result2.totalBenefits + result2.totalIndenization

  const difference = gain2 - gain1

  return (
    <div className="mt-12 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Comparação de Cenários</h2>
        <p className="text-gray-600 dark:text-gray-300">Análise comparativa dos dois cenários</p>
      </div>

      {/* Export Button */}
      <div className="flex justify-center">
        <PDFExport mode={mode} results={results} period={period} />
      </div>

      {/* Summary */}
      <div
        className={`rounded-2xl p-8 text-center ${
          Math.abs(difference) < 0.01
            ? "bg-gradient-to-r from-gray-600 to-gray-700 dark:from-gray-700 dark:to-gray-800 text-white"
            : difference > 0
              ? "bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-700 dark:to-emerald-700 text-white"
              : "bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-700 dark:to-blue-700 text-white"
        }`}
      >
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
          <h3 className="text-2xl font-bold text-center text-indigo-700 dark:text-indigo-400 mb-6">Cenário 1</h3>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6 border border-indigo-100 dark:border-indigo-800">
            <h4 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-2">
              Ganho Total {result1.hasDiscounts ? "Líquido" : "Bruto"} + Benefícios + Indenização
            </h4>
            <p className="text-3xl font-bold text-indigo-800 dark:text-indigo-200">{formatCurrency(gain1)}</p>
            <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-2">
              Férias: {formatCurrency(result1.totalVacations)} | Indenização:{" "}
              {formatCurrency(result1.totalIndenization)}
            </p>
          </div>

          <button
            onClick={() => setShowBreakdown1(!showBreakdown1)}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 font-medium rounded-lg transition-colors"
          >
            <Calculator className="w-4 h-4" />
            {showBreakdown1 ? "Ocultar" : "Ver"} detalhamento
            {showBreakdown1 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-center text-teal-700 dark:text-teal-400 mb-6">Cenário 2</h3>
          <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-6 border border-teal-100 dark:border-teal-800">
            <h4 className="font-semibold text-teal-900 dark:text-teal-300 mb-2">
              Ganho Total {result2.hasDiscounts ? "Líquido" : "Bruto"} + Benefícios + Indenização
            </h4>
            <p className="text-3xl font-bold text-teal-800 dark:text-teal-200">{formatCurrency(gain2)}</p>
            <p className="text-sm text-teal-600 dark:text-teal-400 mt-2">
              Férias: {formatCurrency(result2.totalVacations)} | Indenização:{" "}
              {formatCurrency(result2.totalIndenization)}
            </p>
          </div>

          <button
            onClick={() => setShowBreakdown2(!showBreakdown2)}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-teal-100 hover:bg-teal-200 dark:bg-teal-900/30 dark:hover:bg-teal-900/50 text-teal-700 dark:text-teal-400 font-medium rounded-lg transition-colors"
          >
            <Calculator className="w-4 h-4" />
            {showBreakdown2 ? "Ocultar" : "Ver"} detalhamento
            {showBreakdown2 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          Gráfico Comparativo de Ganhos
        </h3>
        <ComparisonChart data={[gain1, gain2]} />
      </div>

      {/* Yearly Breakdown for Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {showBreakdown1 && (
          <div>
            <h4 className="text-lg font-bold text-indigo-700 dark:text-indigo-400 mb-4">Detalhamento Cenário 1</h4>
            <YearlyBreakdown yearlyData={result1.yearlyData} hasDiscounts={result1.hasDiscounts} />
          </div>
        )}
        {showBreakdown2 && (
          <div>
            <h4 className="text-lg font-bold text-teal-700 dark:text-teal-400 mb-4">Detalhamento Cenário 2</h4>
            <YearlyBreakdown yearlyData={result2.yearlyData} hasDiscounts={result2.hasDiscounts} />
          </div>
        )}
      </div>
    </div>
  )
}
