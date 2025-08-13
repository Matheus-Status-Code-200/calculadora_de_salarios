"use client"

import { useState } from "react"
import { Target, AlertTriangle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { WithdrawalPlan } from "@/types/investment"
import { calculateWithdrawalPlan } from "@/lib/investment-calculations"
import { formatCurrency } from "@/lib/utils"

interface WithdrawalPlannerProps {
  finalAmount: number
}

export default function WithdrawalPlanner({ finalAmount }: WithdrawalPlannerProps) {
  const [plan, setPlan] = useState<WithdrawalPlan>({
    monthlyWithdrawal: 5000,
    withdrawalPeriod: 20,
    inflationRate: 4.5,
  })

  const [results, setResults] = useState<any>(null)

  const handleCalculate = () => {
    const calculationResults = calculateWithdrawalPlan(finalAmount, plan)
    setResults(calculationResults)
  }

  const maxSafeWithdrawal = (finalAmount * 0.04) / 12 // Regra dos 4%

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
          <Target className="w-5 h-5" />
          Planejador de Retiradas Mensais
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Simule retiradas mensais do seu investimento considerando inflação
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Suggestion */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-blue-800 dark:text-blue-300 text-sm">
            💡 <strong>Regra dos 4%:</strong> Para preservar o capital, recomenda-se retirar no máximo{" "}
            <strong>{formatCurrency(maxSafeWithdrawal)}/mês</strong> ({formatCurrency(maxSafeWithdrawal * 12)}/ano)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          {/* Retirada Mensal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Retirada mensal (R$)
            </label>
            <input
              type="number"
              value={plan.monthlyWithdrawal}
              onChange={(e) => setPlan({ ...plan, monthlyWithdrawal: Number(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="Ex: 5000"
              min="100"
              step="100"
            />
          </div>

          {/* Período */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Por quantos anos (período)
            </label>
            <input
              type="number"
              value={plan.withdrawalPeriod}
              onChange={(e) => setPlan({ ...plan, withdrawalPeriod: Number(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="Ex: 20"
              min="1"
              max="50"
              step="1"
            />
          </div>

          {/* Inflação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Inflação anual estimada (%)
            </label>
            <input
              type="number"
              value={plan.inflationRate}
              onChange={(e) => setPlan({ ...plan, inflationRate: Number(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="Ex: 4.5"
              min="0"
              max="20"
              step="0.1"
            />
          </div>
        </div>

        <Button
          onClick={handleCalculate}
          className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-3"
        >
          <Target className="w-5 h-5 mr-2" />
          SIMULAR RETIRADAS
        </Button>

        {/* Results */}
        {results && (
          <div className="space-y-4">
            <div
              className={`p-4 rounded-lg border ${
                results.canWithdraw
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {results.canWithdraw ? (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                )}
                <h4
                  className={`font-semibold ${
                    results.canWithdraw ? "text-green-800 dark:text-green-300" : "text-red-800 dark:text-red-300"
                  }`}
                >
                  {results.canWithdraw ? "Plano Viável!" : "Plano Inviável"}
                </h4>
              </div>
              <p
                className={`text-sm ${
                  results.canWithdraw ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
                }`}
              >
                {results.canWithdraw
                  ? "Você conseguirá manter as retiradas pelo período desejado."
                  : "O valor investido não será suficiente para manter as retiradas pelo período completo."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h5 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Total Retirado</h5>
                <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                  {formatCurrency(results.totalWithdrawn)}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h5 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Valor Restante</h5>
                <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                  {formatCurrency(results.remainingAmount)}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h5 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Poder de Compra Real</h5>
                <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                  {formatCurrency(results.realPurchasingPower)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Descontando inflação de {plan.inflationRate}% a.a.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
