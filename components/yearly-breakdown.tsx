"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Calendar, DollarSign } from "lucide-react"
import type { YearlyData } from "@/types/calculator"
import { formatCurrency } from "@/lib/utils"

interface YearlyBreakdownProps {
  yearlyData: YearlyData[]
  hasDiscounts: boolean
}

export default function YearlyBreakdown({ yearlyData, hasDiscounts }: YearlyBreakdownProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="mt-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border border-gray-200 rounded-lg p-4 transition-all duration-200 flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-800">Ver Detalhamento Ano a Ano</h3>
            <p className="text-sm text-gray-600">Clique para expandir os valores detalhados por período</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 font-medium">
            {yearlyData.length} {yearlyData.length === 1 ? "ano" : "anos"}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Legenda dos Valores</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-blue-700">
              <div>
                • <strong>Salário 12x:</strong> 12 meses
              </div>
              <div>
                • <strong>13º:</strong> Décimo terceiro
              </div>
              <div>
                • <strong>Férias:</strong> Férias + 1/3
              </div>
              <div>
                • <strong>FGTS:</strong> 8% sobre bruto
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {yearlyData.map((data) => (
              <div
                key={data.year}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Ano {data.year}
                    </span>
                  </h4>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Salário mensal</p>
                    <p className="font-bold text-gray-800">{formatCurrency(data.monthlySalary)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs font-medium text-blue-700 mb-1">Salário 12x</p>
                    <p className="font-bold text-blue-900">{formatCurrency(data.grossSalary12)}</p>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs font-medium text-green-700 mb-1">13º Salário</p>
                    <p className="font-bold text-green-900">{formatCurrency(data.thirteenthSalary)}</p>
                  </div>

                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-xs font-medium text-yellow-700 mb-1">Férias + 1/3</p>
                    <p className="font-bold text-yellow-900">{formatCurrency(data.vacations)}</p>
                  </div>

                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-xs font-medium text-purple-700 mb-1">FGTS</p>
                    <p className="font-bold text-purple-900">{formatCurrency(data.fgts)}</p>
                  </div>

                  {hasDiscounts && (
                    <>
                      <div className="bg-red-50 p-3 rounded-lg">
                        <p className="text-xs font-medium text-red-700 mb-1">INSS</p>
                        <p className="font-bold text-red-900">{formatCurrency(data.inss)}</p>
                      </div>

                      <div className="bg-orange-50 p-3 rounded-lg">
                        <p className="text-xs font-medium text-orange-700 mb-1">IRRF</p>
                        <p className="font-bold text-orange-900">{formatCurrency(data.irrf)}</p>
                      </div>
                    </>
                  )}

                  {data.benefits > 0 && (
                    <div className="bg-emerald-50 p-3 rounded-lg">
                      <p className="text-xs font-medium text-emerald-700 mb-1">Benefícios</p>
                      <p className="font-bold text-emerald-900">{formatCurrency(data.benefits)}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">Total Bruto no Ano</p>
                      <p className="text-xl font-bold text-gray-900">{formatCurrency(data.totalGross)}</p>
                    </div>

                    {hasDiscounts && (
                      <div className="bg-indigo-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-indigo-700 mb-1">Total Líquido no Ano</p>
                        <p className="text-xl font-bold text-indigo-900">{formatCurrency(data.netGains)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-4 text-white text-center">
            <p className="text-sm opacity-90 mb-1">Valores já incluem reajustes anuais aplicados</p>
            <p className="font-semibold">
              📊 Detalhamento completo de {yearlyData.length} {yearlyData.length === 1 ? "ano" : "anos"}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
