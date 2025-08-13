"use client"

import { useState } from "react"
import { PieChart, BarChart3, TrendingUp, Target, Calendar, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CalculationResults } from "@/types/calculator"
import type { InvestmentResults } from "@/types/investment"
import { formatCurrency } from "@/lib/utils"

interface FinancialDashboardProps {
  laborResults: CalculationResults
  investmentResults?: InvestmentResults
  period: number
}

export default function FinancialDashboard({ laborResults, investmentResults, period }: FinancialDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "projections" | "comparison">("overview")

  const totalLabor = laborResults.hasDiscounts
    ? laborResults.totalNetGains + laborResults.totalBenefits + laborResults.totalIndenization
    : laborResults.totalGrossGains + laborResults.totalBenefits + laborResults.totalIndenization

  const totalWealth = totalLabor + (investmentResults?.finalAmount || 0)
  const investmentGrowth = investmentResults ? investmentResults.finalAmount - investmentResults.totalInvested : 0

  const tabs = [
    { id: "overview", label: "Visão Geral", icon: PieChart },
    { id: "projections", label: "Projeções", icon: TrendingUp },
    { id: "comparison", label: "Comparativo", icon: BarChart3 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Dashboard Financeiro Completo
        </h2>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
          Análise integrada dos seus ganhos trabalhistas e investimentos
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-600 p-1 bg-gray-50 dark:bg-gray-800">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors text-sm ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Wealth Summary */}
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700 text-white">
            <CardContent className="p-6 md:p-8 text-center">
              <h3 className="text-xl md:text-2xl font-bold mb-2">Patrimônio Total Projetado</h3>
              <p className="text-sm opacity-90 mb-4">Ganhos trabalhistas + Investimentos em {period} anos</p>
              <div className="text-3xl md:text-4xl font-bold mb-4">{formatCurrency(totalWealth)}</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="opacity-80">Ganhos do Trabalho</p>
                  <p className="font-semibold">{formatCurrency(totalLabor)}</p>
                </div>
                <div>
                  <p className="opacity-80">Crescimento Investimentos</p>
                  <p className="font-semibold">{formatCurrency(investmentGrowth)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 text-center">
                <DollarSign className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">Renda Mensal Média</h4>
                <p className="text-lg font-bold text-blue-800 dark:text-blue-200">
                  {formatCurrency(totalLabor / (period * 12))}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <h4 className="font-semibold text-green-900 dark:text-green-300 mb-1">Crescimento Anual</h4>
                <p className="text-lg font-bold text-green-800 dark:text-green-200">
                  {investmentResults
                    ? `${(((investmentResults.finalAmount / investmentResults.totalInvested) ** (1 / period) - 1) * 100).toFixed(1)}%`
                    : "N/A"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                <h4 className="font-semibold text-orange-900 dark:text-orange-300 mb-1">Meta Aposentadoria</h4>
                <p className="text-lg font-bold text-orange-800 dark:text-orange-200">
                  {formatCurrency((totalWealth * 0.04) / 12)}
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400">Regra 4% mensal</p>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-1">Tempo para Meta</h4>
                <p className="text-lg font-bold text-purple-800 dark:text-purple-200">{period} anos</p>
              </CardContent>
            </Card>
          </div>

          {/* Breakdown Chart */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-center">Composição do Patrimônio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="font-medium">Ganhos Trabalhistas</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(totalLabor)}</p>
                    <p className="text-sm text-gray-500">{((totalLabor / totalWealth) * 100).toFixed(1)}%</p>
                  </div>
                </div>

                {investmentResults && (
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="font-medium">Investimentos</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(investmentResults.finalAmount)}</p>
                      <p className="text-sm text-gray-500">
                        {((investmentResults.finalAmount / totalWealth) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Projections Tab */}
      {activeTab === "projections" && (
        <div className="space-y-6">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Projeção de Crescimento Patrimonial</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: Math.min(period, 10) }, (_, i) => {
                  const year = i + 1
                  const laborYear = laborResults.yearlyData[i]
                  const investmentYear = investmentResults?.yearlyData[i]
                  const yearlyTotal =
                    (laborYear?.grossGains || 0) +
                    (investmentYear?.accumulatedNet || 0) -
                    (investmentYear?.accumulatedNet || 0) / year

                  return (
                    <div
                      key={year}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{year}</span>
                        </div>
                        <span className="font-medium">Ano {year}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(yearlyTotal)}</p>
                        <p className="text-sm text-gray-500">Patrimônio acumulado</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Comparison Tab */}
      {activeTab === "comparison" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-blue-700 dark:text-blue-400">Cenário Sem Investimentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(totalLabor)}</p>
                    <p className="text-sm text-gray-500">Total em {period} anos</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Renda mensal média:</span>
                      <span className="font-medium">{formatCurrency(totalLabor / (period * 12))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Crescimento:</span>
                      <span className="font-medium">0% (apenas trabalho)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-green-700 dark:text-green-400">Cenário Com Investimentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(totalWealth)}
                    </p>
                    <p className="text-sm text-gray-500">Total em {period} anos</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Renda mensal potencial:</span>
                      <span className="font-medium">{formatCurrency((totalWealth * 0.04) / 12)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Multiplicador:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {(totalWealth / totalLabor).toFixed(1)}x
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Advantage Card */}
          <Card className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700 text-white">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Vantagem dos Investimentos</h3>
              <p className="text-3xl font-bold mb-2">{formatCurrency(totalWealth - totalLabor)}</p>
              <p className="text-sm opacity-90">
                Ganho adicional de {((totalWealth / totalLabor - 1) * 100).toFixed(1)}% sobre os ganhos trabalhistas
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
