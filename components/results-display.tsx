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
  period?: number
}

export default function ResultsDisplay({ mode, results, period }: ResultsDisplayProps) {
  const [showBreakdown1, setShowBreakdown1] = useState(false)
  const [showBreakdown2, setShowBreakdown2] = useState(false)

  if (mode === "single") {
    const result = results[0]
    const totalWithBenefits = result.hasDiscounts
      ? result.totalNetGains + result.totalBenefits + result.totalIndenization
      : result.totalGrossGains + result.totalBenefits + result.totalIndenization

    const pct = typeof result.percentageOfTotal === "number" ? Math.max(0, Math.min(100, result.percentageOfTotal)) : 0
    const percentageAmount = (totalWithBenefits * pct) / 100

    return (
      <div className="mt-8 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        <div className="text-center px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Resultados da Projeção
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
            Valores calculados para {result.yearlyData.length} anos
          </p>
        </div>

        {/* Export Button */}
        <div className="flex justify-center px-4">
          <PDFExport mode={mode} results={results} period={period ?? result.yearlyData.length} />
        </div>

        {/* Summary Card */}
        <div className="mx-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 rounded-2xl p-4 md:p-8 text-white text-center">
          <h3 className="text-lg md:text-xl font-semibold mb-2">GANHO TOTAL NO PERÍODO</h3>
          <p className="text-xs md:text-sm opacity-90 mb-4">
            {result.hasDiscounts ? "(Líquido + Benefícios + Indenização)" : "(Bruto + Benefícios + Indenização)"}
          </p>
          <div className="break-words">
            <p className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
              {formatCurrency(totalWithBenefits)}
            </p>
          </div>

          {/* Percentage of total (if provided) */}
          {pct > 0 && (
            <div className="mt-4 bg-white/15 dark:bg-black/20 rounded-lg inline-block px-3 py-2">
              <p className="text-sm md:text-base font-medium">
                {pct.toFixed(2)}% do total: <span className="font-bold">{formatCurrency(percentageAmount)}</span>
              </p>
            </div>
          )}
        </div>

        {/* Details Grid */}
        <div className="px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 md:p-6 border border-blue-100 dark:border-blue-800">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 text-sm md:text-base">Total Bruto</h3>
              <div className="break-words">
                <p className="text-lg md:text-2xl font-bold text-blue-800 dark:text-blue-200 leading-tight">
                  {formatCurrency(result.totalGrossGains)}
                </p>
              </div>
              <p className="text-xs md:text-sm text-blue-600 dark:text-blue-400 mt-1">Salário + 13º + Férias</p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-3 md:p-6 border border-yellow-100 dark:border-yellow-800">
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2 text-sm md:text-base">Férias</h3>
              <div className="break-words">
                <p className="text-lg md:text-2xl font-bold text-yellow-800 dark:text-yellow-200 leading-tight">
                  {formatCurrency(result.totalVacations)}
                </p>
              </div>
              <p className="text-xs md:text-sm text-yellow-600 dark:text-yellow-400 mt-1">Férias + 1/3</p>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-3 md:p-6 border border-orange-100 dark:border-orange-800">
              <h3 className="font-semibold text-orange-900 dark:text-orange-300 mb-2 text-sm md:text-base">
                Indenização
              </h3>
              <div className="break-words">
                <p className="text-lg md:text-2xl font-bold text-orange-800 dark:text-orange-200 leading-tight">
                  {formatCurrency(result.totalIndenization)}
                </p>
              </div>
              <p className="text-xs md:text-sm text-orange-600 dark:text-orange-400 mt-1">Valor separado</p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 md:p-6 border border-green-100 dark:border-green-800">
              <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2 text-sm md:text-base">Benefícios</h3>
              <div className="break-words">
                <p className="text-lg md:text-2xl font-bold text-green-800 dark:text-green-200 leading-tight">
                  {formatCurrency(result.totalBenefits)}
                </p>
              </div>
              <p className="text-xs md:text-sm text-green-600 dark:text-green-400 mt-1">Valor adicional</p>
            </div>

            {result.hasDiscounts && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 md:p-6 border border-red-100 dark:border-red-800">
                <h3 className="font-semibold text-red-900 dark:text-red-300 mb-2 text-sm md:text-base">Descontos</h3>
                <div className="break-words">
                  <p className="text-lg md:text-2xl font-bold text-red-800 dark:text-red-200 leading-tight">
                    {formatCurrency(result.totalInss + result.totalIrrf)}
                  </p>
                </div>
                <p className="text-xs md:text-sm text-red-600 dark:text-red-400 mt-1">INSS + IRRF</p>
              </div>
            )}

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 md:p-6 border border-purple-100 dark:border-purple-800">
              <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-2 text-sm md:text-base">FGTS</h3>
              <div className="break-words">
                <p className="text-lg md:text-2xl font-bold text-purple-800 dark:text-purple-200 leading-tight">
                  {formatCurrency(result.totalFgts)}
                </p>
              </div>
              <p className="text-xs md:text-sm text-purple-600 dark:text-purple-400 mt-1">Depositado</p>
            </div>
          </div>
        </div>

        {/* Botão para Detalhamento */}
        <div className="text-center px-4">
          <button
            onClick={() => setShowBreakdown1(!showBreakdown1)}
            className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors text-sm md:text-base"
          >
            <Calculator className="w-4 h-4 md:w-5 md:h-5" />
            {showBreakdown1 ? "Ocultar" : "Ver"} detalhamento ano a ano
            {showBreakdown1 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Detalhamento Anual */}
        {showBreakdown1 && (
          <div className="leading-3 px-0">
            <YearlyBreakdown yearlyData={result.yearlyData} hasDiscounts={result.hasDiscounts} />
          </div>
        )}
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

  const pct1 = typeof result1.percentageOfTotal === "number" ? Math.max(0, Math.min(100, result1.percentageOfTotal)) : 0
  const pct2 = typeof result2.percentageOfTotal === "number" ? Math.max(0, Math.min(100, result2.percentageOfTotal)) : 0

  const percentageAmount1 = (gain1 * pct1) / 100
  const percentageAmount2 = (gain2 * pct2) / 100

  return (
    <div className="mt-8 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="text-center px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Comparação de Cenários</h2>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">Análise comparativa dos dois cenários</p>
      </div>

      {/* Export Button */}
      <div className="flex justify-center px-4">
        <PDFExport mode={mode} results={results} period={period ?? result1.yearlyData.length} />
      </div>

      {/* Summary */}
      <div className="px-4">
        <div
          className={`rounded-2xl p-4 md:p-8 text-center ${
            Math.abs(difference) < 0.01
              ? "bg-gradient-to-r from-gray-600 to-gray-700 dark:from-gray-700 dark:to-gray-800 text-white"
              : difference > 0
                ? "bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-700 dark:to-emerald-700 text-white"
                : "bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-700 dark:to-blue-700 text-white"
          }`}
        >
          {Math.abs(difference) < 0.01 ? (
            <h3 className="text-xl md:text-2xl font-bold">Os cenários são equivalentes!</h3>
          ) : difference > 0 ? (
            <>
              <h3 className="text-xl md:text-2xl font-bold mb-2">Cenário 2 é mais vantajoso!</h3>
              <div className="break-words">
                <p className="text-lg md:text-xl">
                  Rende <strong>{formatCurrency(difference)}</strong> a mais no período
                </p>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-xl md:text-2xl font-bold mb-2">Cenário 1 é mais vantajoso!</h3>
              <div className="break-words">
                <p className="text-lg md:text-xl">
                  Rende <strong>{formatCurrency(Math.abs(difference))}</strong> a mais no período
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-bold text-center text-indigo-700 dark:text-indigo-400 mb-4 md:mb-6">
              Cenário 1
            </h3>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-3 md:p-6 border border-indigo-100 dark:border-indigo-800">
              <h4 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-2 text-sm md:text-base">
                Ganho Total {result1.hasDiscounts ? "Líquido" : "Bruto"} + Benefícios + Indenização
              </h4>
              <div className="break-words">
                <p className="text-xl md:text-3xl font-bold text-indigo-800 dark:text-indigo-200 leading-tight">
                  {formatCurrency(gain1)}
                </p>
              </div>
              {pct1 > 0 && (
                <div className="text-xs md:text-sm text-indigo-700 dark:text-indigo-300 mt-3 bg-white/50 dark:bg-white/10 rounded-md inline-block px-2 py-1">
                  {pct1.toFixed(2)}% do total: <strong>{formatCurrency(percentageAmount1)}</strong>
                </div>
              )}
              <div className="text-xs md:text-sm text-indigo-600 dark:text-indigo-400 mt-3 break-words">
                <p>Férias: {formatCurrency(result1.totalVacations)}</p>
                <p>Indenização: {formatCurrency(result1.totalIndenization)}</p>
              </div>
            </div>

            <button
              onClick={() => setShowBreakdown1(!showBreakdown1)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 font-medium rounded-lg transition-colors text-sm md:text-base"
            >
              <Calculator className="w-4 h-4" />
              {showBreakdown1 ? "Ocultar" : "Ver"} detalhamento
              {showBreakdown1 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-bold text-center text-teal-700 dark:text-teal-400 mb-4 md:mb-6">
              Cenário 2
            </h3>
            <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-3 md:p-6 border border-teal-100 dark:border-teal-800">
              <h4 className="font-semibold text-teal-900 dark:text-teal-300 mb-2 text-sm md:text-base">
                Ganho Total {result2.hasDiscounts ? "Líquido" : "Bruto"} + Benefícios + Indenização
              </h4>
              <div className="break-words">
                <p className="text-xl md:text-3xl font-bold text-teal-800 dark:text-teal-200 leading-tight">
                  {formatCurrency(gain2)}
                </p>
              </div>
              {pct2 > 0 && (
                <div className="text-xs md:text-sm text-teal-700 dark:text-teal-300 mt-3 bg-white/50 dark:bg-white/10 rounded-md inline-block px-2 py-1">
                  {pct2.toFixed(2)}% do total: <strong>{formatCurrency(percentageAmount2)}</strong>
                </div>
              )}
              <div className="text-xs md:text-sm text-teal-600 dark:text-teal-400 mt-3 break-words">
                <p>Férias: {formatCurrency(result2.totalVacations)}</p>
                <p>Indenização: {formatCurrency(result2.totalIndenization)}</p>
              </div>
            </div>

            <button
              onClick={() => setShowBreakdown2(!showBreakdown2)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-teal-100 hover:bg-teal-200 dark:bg-teal-900/30 dark:hover:bg-teal-900/50 text-teal-700 dark:text-teal-400 font-medium rounded-lg transition-colors text-sm md:text-base"
            >
              <Calculator className="w-4 h-4" />
              {showBreakdown2 ? "Ocultar" : "Ver"} detalhamento
              {showBreakdown2 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="px-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg md:text-xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4 md:mb-6">
            Gráfico Comparativo de Ganhos
          </h3>
          <ComparisonChart data={[gain1, gain2]} />
        </div>
      </div>

      {/* Yearly Breakdown for Comparison */}
      <div className="px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
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
    </div>
  )
}
