"use client"

import { formatCurrency } from "@/lib/utils"
import type { YearlyData } from "@/types/calculator"
import { Calendar } from "lucide-react"

interface YearlyBreakdownProps {
  yearlyData: YearlyData[]
  hasDiscounts: boolean
}

export default function YearlyBreakdown({ yearlyData, hasDiscounts }: YearlyBreakdownProps) {
  const dataWithCumulative = yearlyData.map((data, index) => {
    const cumulativeGross = yearlyData.slice(0, index + 1).reduce((sum, item) => sum + item.grossGains, 0)
    const cumulativeFgts = yearlyData.slice(0, index + 1).reduce((sum, item) => sum + item.fgts, 0)
    return {
      ...data,
      cumulativeGross,
      cumulativeFgts,
    }
  })

  const totalGross = yearlyData.reduce((sum, data) => sum + data.grossGains, 0)
  const totalFgts = yearlyData.reduce((sum, data) => sum + data.fgts, 0)
  const totalNet = yearlyData.reduce((sum, data) => sum + data.netGains, 0)
  const totalDiscounts = yearlyData.reduce((sum, data) => sum + data.inss + data.irrf, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100">Detalhamento Ano a Ano</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Evolução detalhada dos valores com acumulados</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div
              className={`grid ${hasDiscounts ? "grid-cols-7 md:grid-cols-8" : "grid-cols-6"} gap-2 md:gap-4 p-3 md:p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 font-semibold text-xs md:text-sm`}
              style={{
                gridTemplateColumns: hasDiscounts ? "60px 1fr 1fr 1fr 1fr 1fr 1fr 1fr" : "60px 1fr 1fr 1fr 1fr 1fr",
              }}
            >
              <div className="text-gray-700 dark:text-gray-300">Ano</div>
              <div className="text-gray-700 dark:text-gray-300">Salário Mensal</div>
              <div className="text-gray-700 dark:text-gray-300">Ganho Bruto</div>
              <div className="text-green-700 dark:text-green-400 font-bold">Bruto Acumulado</div>
              {hasDiscounts && <div className="hidden md:block text-gray-700 dark:text-gray-300">Descontos</div>}
              {hasDiscounts && <div className="text-gray-700 dark:text-gray-300">Ganho Líquido</div>}
              <div className="text-gray-700 dark:text-gray-300">FGTS</div>
              <div className="text-purple-700 dark:text-purple-400 font-bold">FGTS Acumulado</div>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {dataWithCumulative.map((data, index) => (
                <div
                  key={index}
                  className={`grid ${hasDiscounts ? "grid-cols-7 md:grid-cols-8" : "grid-cols-6"} gap-2 md:gap-4 p-3 md:p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xs md:text-sm`}
                  style={{
                    gridTemplateColumns: hasDiscounts ? "60px 1fr 1fr 1fr 1fr 1fr 1fr 1fr" : "60px 1fr 1fr 1fr 1fr 1fr",
                  }}
                >
                  <div className="font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-1.5 py-0.5 rounded text-xs font-bold">
                      {data.year}
                    </span>
                  </div>
                  <div className="break-all text-gray-700 dark:text-gray-300 font-medium text-xs md:text-sm">
                    {formatCurrency(data.monthlySalary)}
                  </div>
                  <div className="break-all text-green-700 dark:text-green-400 font-semibold text-xs md:text-sm">
                    {formatCurrency(data.grossGains)}
                  </div>
                  <div className="break-all text-green-800 dark:text-green-300 font-bold bg-green-50 dark:bg-green-900/20 px-1.5 py-1 rounded text-xs md:text-sm">
                    {formatCurrency(data.cumulativeGross)}
                  </div>
                  {hasDiscounts && (
                    <div className="hidden md:block break-all text-red-700 dark:text-red-400 font-medium text-xs md:text-sm">
                      {formatCurrency(data.inss + data.irrf)}
                    </div>
                  )}
                  {hasDiscounts && (
                    <div className="break-all text-blue-700 dark:text-blue-400 font-semibold text-xs md:text-sm">
                      {formatCurrency(data.netGains)}
                    </div>
                  )}
                  <div className="break-all text-purple-700 dark:text-purple-400 font-medium text-xs md:text-sm">
                    {formatCurrency(data.fgts)}
                  </div>
                  <div className="break-all text-purple-800 dark:text-purple-300 font-bold bg-purple-50 dark:bg-purple-900/20 px-1.5 py-1 rounded text-xs md:text-sm">
                    {formatCurrency(data.cumulativeFgts)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        <h4 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Resumo por Ano
        </h4>
        <div className="space-y-4">
          {dataWithCumulative.map((data, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-bold">
                  Ano {data.year}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {formatCurrency(data.monthlySalary)}/mês
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                  <div className="text-green-800 dark:text-green-300 font-medium">Bruto</div>
                  <div className="text-green-900 dark:text-green-200 font-bold break-words">
                    {formatCurrency(data.grossGains)}
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-400 mt-1">
                    Acum: {formatCurrency(data.cumulativeGross)}
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg">
                  <div className="text-purple-800 dark:text-purple-300 font-medium">FGTS</div>
                  <div className="text-purple-900 dark:text-purple-200 font-bold break-words">
                    {formatCurrency(data.fgts)}
                  </div>
                  <div className="text-xs text-purple-700 dark:text-purple-400 mt-1">
                    Acum: {formatCurrency(data.cumulativeFgts)}
                  </div>
                </div>

                {hasDiscounts && (
                  <>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                      <div className="text-blue-800 dark:text-blue-300 font-medium">Líquido</div>
                      <div className="text-blue-900 dark:text-blue-200 font-bold break-words">
                        {formatCurrency(data.netGains)}
                      </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                      <div className="text-red-800 dark:text-red-300 font-medium">Descontos</div>
                      <div className="text-red-900 dark:text-red-200 font-bold break-words">
                        {formatCurrency(data.inss + data.irrf)}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
