"use client"

import { useState } from "react"
import { TrendingUp, DollarSign, Target, Calendar, ChevronDown, ChevronUp, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { InvestmentResults as InvestmentResultsType } from "@/types/investment"
import type { CalculationResults } from "@/types/calculator"
import { formatCurrency } from "@/lib/utils"
import WithdrawalPlanner from "./withdrawal-planner"
import FinancialDashboard from "./financial-dashboard"

interface InvestmentResultsProps {
  results: InvestmentResultsType
  laborResults?: CalculationResults
  period?: number
}

export default function InvestmentResults({ results, laborResults, period }: InvestmentResultsProps) {
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [showWithdrawalPlanner, setShowWithdrawalPlanner] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)

  const profitability = ((results.finalAmount - results.totalInvested) / results.totalInvested) * 100

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700 text-white">
        <CardContent className="p-6 md:p-8 text-center">
          <h3 className="text-xl md:text-2xl font-bold mb-2">Resultado do Investimento</h3>
          <p className="text-sm opacity-90 mb-4">
            {results.investmentType} - {results.yearlyData.length} anos
          </p>
          <div className="text-3xl md:text-4xl font-bold mb-4">{formatCurrency(results.finalAmount)}</div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="opacity-80">Total Investido</p>
              <p className="font-semibold">{formatCurrency(results.totalInvested)}</p>
            </div>
            <div>
              <p className="opacity-80">Lucro Líquido</p>
              <p className="font-semibold">{formatCurrency(results.totalNetReturn)}</p>
            </div>
          </div>
          <div className="mt-4 bg-white/20 rounded-lg inline-block px-4 py-2">
            <p className="font-bold">Rentabilidade: {profitability.toFixed(1)}%</p>
          </div>
        </CardContent>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">Valor Final</h4>
            <p className="text-lg font-bold text-blue-800 dark:text-blue-200">{formatCurrency(results.finalAmount)}</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <h4 className="font-semibold text-green-900 dark:text-green-300 mb-1">Rendimento Bruto</h4>
            <p className="text-lg font-bold text-green-800 dark:text-green-200">
              {formatCurrency(results.totalGrossReturn)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
            <h4 className="font-semibold text-orange-900 dark:text-orange-300 mb-1">Impostos</h4>
            <p className="text-lg font-bold text-orange-800 dark:text-orange-200">
              {formatCurrency(results.totalTaxes)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
            <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-1">Período</h4>
            <p className="text-lg font-bold text-purple-800 dark:text-purple-200">{results.yearlyData.length} anos</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
        >
          <TrendingUp className="w-5 h-5" />
          {showBreakdown ? "Ocultar" : "Ver"} evolução anual
          {showBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <button
          onClick={() => setShowWithdrawalPlanner(!showWithdrawalPlanner)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-400 font-medium rounded-lg transition-colors"
        >
          <Target className="w-5 h-5" />
          {showWithdrawalPlanner ? "Ocultar" : "Planejar"} retiradas mensais
        </button>

        {laborResults && (
          <button
            onClick={() => setShowDashboard(!showDashboard)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-400 font-medium rounded-lg transition-colors"
          >
            <BarChart3 className="w-5 h-5" />
            {showDashboard ? "Ocultar" : "Ver"} dashboard completo
          </button>
        )}
      </div>

      {/* Yearly Breakdown */}
      {showBreakdown && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-center text-green-700 dark:text-green-400">
              Evolução Anual do Investimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b dark:border-gray-600">
                    <th className="text-left py-3 px-2">Ano</th>
                    <th className="text-right py-3 px-2">Contribuição</th>
                    <th className="text-right py-3 px-2">Rendimento</th>
                    <th className="text-right py-3 px-2">Impostos</th>
                    <th className="text-right py-3 px-2">Total Acumulado</th>
                  </tr>
                </thead>
                <tbody>
                  {results.yearlyData.map((data) => (
                    <tr
                      key={data.year}
                      className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="py-3 px-2 font-medium">{data.year}</td>
                      <td className="py-3 px-2 text-right text-blue-600 dark:text-blue-400">
                        {formatCurrency(data.yearlyContribution)}
                      </td>
                      <td className="py-3 px-2 text-right text-green-600 dark:text-green-400">
                        {formatCurrency(data.grossReturn)}
                      </td>
                      <td className="py-3 px-2 text-right text-red-600 dark:text-red-400">
                        {formatCurrency(data.taxes)}
                      </td>
                      <td className="py-3 px-2 text-right font-bold">{formatCurrency(data.accumulatedNet)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Withdrawal Planner */}
      {showWithdrawalPlanner && <WithdrawalPlanner finalAmount={results.finalAmount} />}

      {showDashboard && laborResults && (
        <FinancialDashboard
          laborResults={laborResults}
          investmentResults={results}
          period={period || results.yearlyData.length}
        />
      )}
    </div>
  )
}
