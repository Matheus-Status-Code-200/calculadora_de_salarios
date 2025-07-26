"use client"

import { Calendar, TrendingUp } from "lucide-react"
import type { YearlyData } from "@/types/calculator"
import { formatCurrency } from "@/lib/utils"

interface YearlyBreakdownProps {
  yearlyData: YearlyData[]
  hasDiscounts: boolean
}

export default function YearlyBreakdown({ yearlyData, hasDiscounts }: YearlyBreakdownProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 animate-in slide-in-from-top-4 duration-300">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Detalhamento Ano a Ano</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">({yearlyData.length} anos)</span>
      </div>

      <div className="space-y-4">
        {yearlyData.map((data) => (
          <div
            key={data.year}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Ano {data.year}
              </h4>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Salário mensal: {formatCurrency(data.monthlySalary)}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-sm">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                <div className="font-medium text-blue-800 dark:text-blue-300">12 Salários</div>
                <div className="text-blue-600 dark:text-blue-400">{formatCurrency(data.grossSalary12)}</div>
              </div>

              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg">
                <div className="font-medium text-indigo-800 dark:text-indigo-300">13º Salário</div>
                <div className="text-indigo-600 dark:text-indigo-400">{formatCurrency(data.thirteenthSalary)}</div>
              </div>

              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg">
                <div className="font-medium text-yellow-800 dark:text-yellow-300">Férias + 1/3</div>
                <div className="text-yellow-600 dark:text-yellow-400">{formatCurrency(data.vacations)}</div>
              </div>

              <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg">
                <div className="font-medium text-orange-800 dark:text-orange-300">Indenização</div>
                <div className="text-orange-600 dark:text-orange-400">{formatCurrency(data.indenization)}</div>
              </div>

              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                <div className="font-medium text-green-800 dark:text-green-300">Benefícios</div>
                <div className="text-green-600 dark:text-green-400">{formatCurrency(data.benefits)}</div>
              </div>

              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                <div className="font-medium text-purple-800 dark:text-purple-300">FGTS</div>
                <div className="text-purple-600 dark:text-purple-400">{formatCurrency(data.fgts)}</div>
              </div>

              {hasDiscounts && (
                <>
                  <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
                    <div className="font-medium text-red-800 dark:text-red-300">INSS</div>
                    <div className="text-red-600 dark:text-red-400">-{formatCurrency(data.inss)}</div>
                  </div>

                  <div className="bg-pink-100 dark:bg-pink-900/30 p-3 rounded-lg">
                    <div className="font-medium text-pink-800 dark:text-pink-300">IRRF</div>
                    <div className="text-pink-600 dark:text-pink-400">-{formatCurrency(data.irrf)}</div>
                  </div>
                </>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="font-semibold text-blue-900 dark:text-blue-300">Total Bruto</div>
                  <div className="text-xl font-bold text-blue-800 dark:text-blue-200">
                    {formatCurrency(data.totalGross)}
                  </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="font-semibold text-orange-900 dark:text-orange-300">Indenização (Separada)</div>
                  <div className="text-xl font-bold text-orange-800 dark:text-orange-200">
                    {formatCurrency(data.indenization)}
                  </div>
                </div>

                {hasDiscounts && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="font-semibold text-green-900 dark:text-green-300">Total Líquido</div>
                    <div className="text-xl font-bold text-green-800 dark:text-green-200">
                      {formatCurrency(data.netGains)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legenda */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">📋 Legenda dos Valores:</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-blue-700 dark:text-blue-400">
          <div>
            • <strong>12 Salários:</strong> Salário mensal × 12
          </div>
          <div>
            • <strong>13º Salário:</strong> Gratificação natalina
          </div>
          <div>
            • <strong>Férias + 1/3:</strong> Férias + terço constitucional
          </div>
          <div>
            • <strong>Indenização:</strong> % sobre salário anual
          </div>
          <div>
            • <strong>FGTS:</strong> 8% sobre valores brutos
          </div>
          <div>
            • <strong>INSS/IRRF:</strong> Descontos obrigatórios
          </div>
        </div>
      </div>
    </div>
  )
}
