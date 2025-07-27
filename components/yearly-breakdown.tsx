"use client"

import { formatCurrency } from "@/lib/utils"
import type { YearlyData } from "@/types/calculator"

interface YearlyBreakdownProps {
  yearlyData: YearlyData[]
  hasDiscounts: boolean
}

export default function YearlyBreakdown({ yearlyData, hasDiscounts }: YearlyBreakdownProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Detalhamento Ano a Ano</h3>

      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header */}
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2 md:gap-4 p-2 md:p-4 bg-gray-100 dark:bg-gray-700 rounded-t-lg font-semibold text-xs md:text-sm">
            <div className="text-gray-700 dark:text-gray-300">Ano</div>
            <div className="text-gray-700 dark:text-gray-300">Salário Mensal</div>
            <div className="text-gray-700 dark:text-gray-300">Ganho Bruto</div>
            {hasDiscounts && <div className="hidden md:block text-gray-700 dark:text-gray-300">Descontos</div>}
            {hasDiscounts && <div className="text-gray-700 dark:text-gray-300">Ganho Líquido</div>}
            <div className="text-gray-700 dark:text-gray-300">FGTS</div>
          </div>

          {/* Data Rows */}
          <div className="space-y-1">
            {yearlyData.map((data, index) => (
              <div
                key={index}
                className="grid grid-cols-4 md:grid-cols-6 gap-2 md:gap-4 p-2 md:p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600 text-xs md:text-sm"
              >
                <div className="font-medium text-gray-900 dark:text-gray-100">{data.year}</div>
                <div className="break-words text-gray-700 dark:text-gray-300">{formatCurrency(data.monthlySalary)}</div>
                <div className="break-words text-green-700 dark:text-green-400 font-medium">
                  {formatCurrency(data.grossGains)}
                </div>
                {hasDiscounts && (
                  <div className="hidden md:block break-words text-red-700 dark:text-red-400">
                    {formatCurrency(data.inss + data.irrf)}
                  </div>
                )}
                {hasDiscounts && (
                  <div className="break-words text-blue-700 dark:text-blue-400 font-medium">
                    {formatCurrency(data.netGains)}
                  </div>
                )}
                <div className="break-words text-purple-700 dark:text-purple-400">{formatCurrency(data.fgts)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Summary */}
      <div className="md:hidden space-y-2">
        <h4 className="font-semibold text-gray-800 dark:text-gray-100">Resumo dos Totais:</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <div className="text-green-800 dark:text-green-300 font-medium">Total Bruto</div>
            <div className="text-green-900 dark:text-green-200 font-bold break-words">
              {formatCurrency(yearlyData.reduce((sum, data) => sum + data.grossGains, 0))}
            </div>
          </div>
          {hasDiscounts && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <div className="text-blue-800 dark:text-blue-300 font-medium">Total Líquido</div>
              <div className="text-blue-900 dark:text-blue-200 font-bold break-words">
                {formatCurrency(yearlyData.reduce((sum, data) => sum + data.netGains, 0))}
              </div>
            </div>
          )}
          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
            <div className="text-purple-800 dark:text-purple-300 font-medium">Total FGTS</div>
            <div className="text-purple-900 dark:text-purple-200 font-bold break-words">
              {formatCurrency(yearlyData.reduce((sum, data) => sum + data.fgts, 0))}
            </div>
          </div>
          {hasDiscounts && (
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              <div className="text-red-800 dark:text-red-300 font-medium">Total Descontos</div>
              <div className="text-red-900 dark:text-red-200 font-bold break-words">
                {formatCurrency(yearlyData.reduce((sum, data) => sum + data.inss + data.irrf, 0))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
