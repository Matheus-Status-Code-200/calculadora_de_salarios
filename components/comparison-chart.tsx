"use client"

import { formatCurrency } from "@/lib/utils"

interface ComparisonChartProps {
  data: number[]
}

export default function ComparisonChart({ data }: ComparisonChartProps) {
  const [value1, value2] = data
  const maxValue = Math.max(value1, value2)
  const percentage1 = (value1 / maxValue) * 100
  const percentage2 = (value2 / maxValue) * 100

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* Cenário 1 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base font-medium text-indigo-700 dark:text-indigo-400">Cenário 1</span>
            <span className="text-sm md:text-base font-bold text-indigo-800 dark:text-indigo-300 break-words">
              {formatCurrency(value1)}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 md:h-6">
            <div
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-4 md:h-6 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${percentage1}%` }}
            />
          </div>
        </div>

        {/* Cenário 2 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base font-medium text-teal-700 dark:text-teal-400">Cenário 2</span>
            <span className="text-sm md:text-base font-bold text-teal-800 dark:text-teal-300 break-words">
              {formatCurrency(value2)}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 md:h-6">
            <div
              className="bg-gradient-to-r from-teal-500 to-teal-600 h-4 md:h-6 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${percentage2}%` }}
            />
          </div>
        </div>
      </div>

      {/* Diferença */}
      <div className="text-center p-3 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="text-sm md:text-base text-gray-600 dark:text-gray-400">Diferença</div>
        <div className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-200 break-words">
          {formatCurrency(Math.abs(value2 - value1))}
        </div>
        <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
          {value2 > value1 ? "Cenário 2 é melhor" : value1 > value2 ? "Cenário 1 é melhor" : "Empate"}
        </div>
      </div>
    </div>
  )
}
