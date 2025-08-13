"use client"

import { useState } from "react"
import { TrendingUp, Calculator, PiggyBank } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { InvestmentInputs } from "@/types/investment"
import type { CalculationResults } from "@/types/calculator"
import { calculateInvestment } from "@/lib/investment-calculations"
import { formatCurrency } from "@/lib/utils"
import InvestmentResultsComponent from "./investment-results"

interface InvestmentSimulatorProps {
  suggestedAmount?: number
  onClose?: () => void
  laborResults?: CalculationResults
  period?: number
}

export default function InvestmentSimulator({
  suggestedAmount = 0,
  onClose,
  laborResults,
  period,
}: InvestmentSimulatorProps) {
  const [calculationMode, setCalculationMode] = useState<"amount" | "time">("amount")
  const [inputs, setInputs] = useState<InvestmentInputs>({
    initialAmount: suggestedAmount,
    monthlyContribution: 0,
    annualReturn: 10.5,
    period: period || 10,
    investmentType: "cdb",
  })

  const [targetAmount, setTargetAmount] = useState<number>(0)
  const [targetMonthlyIncome, setTargetMonthlyIncome] = useState<number>(0)

  const [results, setResults] = useState<any | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const handleCalculate = () => {
    setIsCalculating(true)
    try {
      let calculationResults

      if (calculationMode === "amount") {
        // Cálculo tradicional por valor e tempo
        calculationResults = calculateInvestment(inputs)
      } else {
        // Cálculo reverso: quanto tempo/valor mensal para atingir meta
        calculationResults = calculateInvestmentReverse(inputs, targetAmount, targetMonthlyIncome)
      }

      setResults(calculationResults)
    } catch (error) {
      console.error("Erro no cálculo de investimento:", error)
    } finally {
      setIsCalculating(false)
    }
  }

  const investmentTypes = [
    { value: "cdb", label: "CDB", rate: "10.5%", description: "Certificado de Depósito Bancário" },
    { value: "lci", label: "LCI", rate: "9.5%", description: "Letra de Crédito Imobiliário (Isento IR)" },
    { value: "lca", label: "LCA", rate: "9.5%", description: "Letra de Crédito do Agronegócio (Isento IR)" },
    { value: "tesouro", label: "Tesouro Direto", rate: "11.2%", description: "Títulos públicos federais" },
    { value: "poupanca", label: "Poupança", rate: "6.2%", description: "Caderneta de poupança tradicional" },
  ]

  const selectedType = investmentTypes.find((type) => type.value === inputs.investmentType)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
            Simulador de Investimentos
          </h2>
        </div>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
          Simule o crescimento dos seus ganhos trabalhistas através de investimentos
        </p>
        {suggestedAmount > 0 && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-green-800 dark:text-green-300 font-medium">
              💡 Sugestão: Invista {formatCurrency(suggestedAmount)} dos seus ganhos trabalhistas
            </p>
          </div>
        )}
      </div>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-center text-gray-800 dark:text-gray-100">Como você quer calcular?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setCalculationMode("amount")}
              className={`p-4 rounded-lg border-2 transition-all text-center ${
                calculationMode === "amount"
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : "border-gray-200 dark:border-gray-600 hover:border-green-300"
              }`}
            >
              <Calculator className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="font-semibold text-gray-800 dark:text-gray-200">Por Valor e Tempo</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Defina quanto investir e por quanto tempo
              </div>
            </button>

            <button
              onClick={() => setCalculationMode("time")}
              className={`p-4 rounded-lg border-2 transition-all text-center ${
                calculationMode === "time"
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : "border-gray-200 dark:border-gray-600 hover:border-green-300"
              }`}
            >
              <PiggyBank className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="font-semibold text-gray-800 dark:text-gray-200">Por Meta Financeira</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Defina quanto quer acumular ou retirar mensalmente
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Investment Form */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <PiggyBank className="w-5 h-5" />
            {calculationMode === "amount" ? "Configuração do Investimento" : "Defina sua Meta Financeira"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {calculationMode === "amount" ? (
            <>
              {/* Modo tradicional - por valor e tempo */}
              {/* Valor Inicial */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Valor inicial para investir (R$)
                </label>
                <input
                  type="number"
                  value={inputs.initialAmount}
                  onChange={(e) => setInputs({ ...inputs, initialAmount: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Ex: 50000"
                  min="0"
                  step="100"
                />
              </div>

              {/* Contribuição Mensal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contribuição mensal (R$)
                </label>
                <input
                  type="number"
                  value={inputs.monthlyContribution}
                  onChange={(e) => setInputs({ ...inputs, monthlyContribution: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Ex: 1000"
                  min="0"
                  step="50"
                />
              </div>

              {/* Período */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Período do investimento (anos)
                </label>
                <input
                  type="number"
                  value={inputs.period}
                  onChange={(e) => setInputs({ ...inputs, period: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Ex: 10"
                  min="1"
                  max="50"
                  step="1"
                />
              </div>
            </>
          ) : (
            <>
              {/* Modo por meta - calcular tempo/valor necessário */}
              {/* Valor Inicial */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Valor inicial disponível (R$)
                </label>
                <input
                  type="number"
                  value={inputs.initialAmount}
                  onChange={(e) => setInputs({ ...inputs, initialAmount: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Ex: 50000"
                  min="0"
                  step="100"
                />
              </div>

              {/* Meta de Acumulação */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quanto você quer acumular? (R$)
                </label>
                <input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Ex: 500000"
                  min="0"
                  step="1000"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Valor total que deseja ter no final do investimento
                </p>
              </div>

              {/* OU Renda Mensal Desejada */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">OU</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Renda mensal desejada na aposentadoria (R$)
                </label>
                <input
                  type="number"
                  value={targetMonthlyIncome}
                  onChange={(e) => setTargetMonthlyIncome(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Ex: 5000"
                  min="0"
                  step="100"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Valor mensal que deseja retirar do investimento (considerando 4% ao ano)
                </p>
              </div>

              {/* Contribuição Mensal Disponível */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quanto pode investir mensalmente? (R$)
                </label>
                <input
                  type="number"
                  value={inputs.monthlyContribution}
                  onChange={(e) => setInputs({ ...inputs, monthlyContribution: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Ex: 1000"
                  min="0"
                  step="50"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Deixe em branco para calcular o valor necessário
                </p>
              </div>
            </>
          )}

          {/* Tipo de Investimento - comum para ambos os modos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Tipo de Investimento
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {investmentTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() =>
                    setInputs({
                      ...inputs,
                      investmentType: type.value as any,
                      annualReturn: Number.parseFloat(type.rate.replace("%", "")),
                    })
                  }
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    inputs.investmentType === type.value
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-200 dark:border-gray-600 hover:border-green-300"
                  }`}
                >
                  <div className="font-semibold text-gray-800 dark:text-gray-200">{type.label}</div>
                  <div className="text-sm text-green-600 dark:text-green-400 font-medium">{type.rate} a.a.</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{type.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Rentabilidade Personalizada */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rentabilidade anual (%) - {selectedType?.label}
            </label>
            <input
              type="number"
              value={inputs.annualReturn}
              onChange={(e) => setInputs({ ...inputs, annualReturn: Number(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="Ex: 10.5"
              min="0"
              max="50"
              step="0.1"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Taxa sugerida para {selectedType?.label}: {selectedType?.rate} ao ano
            </p>
          </div>

          {/* Botão Calcular */}
          <Button
            onClick={handleCalculate}
            disabled={isCalculating}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Calculator className="w-5 h-5 mr-2" />
            {isCalculating ? "Calculando..." : calculationMode === "amount" ? "SIMULAR INVESTIMENTO" : "CALCULAR META"}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {results && <InvestmentResultsComponent results={results} laborResults={laborResults} period={period} />}

      {/* Close Button */}
      {onClose && (
        <div className="text-center">
          <Button variant="outline" onClick={onClose} className="px-8 bg-transparent">
            Voltar aos Resultados Trabalhistas
          </Button>
        </div>
      )}
    </div>
  )
}

function calculateInvestmentReverse(inputs: InvestmentInputs, targetAmount: number, targetMonthlyIncome: number) {
  const monthlyRate = inputs.annualReturn / 100 / 12

  // Se foi definida renda mensal, calcular o valor total necessário (regra dos 4%)
  const finalTargetAmount =
    targetMonthlyIncome > 0
      ? (targetMonthlyIncome * 12) / 0.04 // Regra dos 4% para aposentadoria
      : targetAmount

  if (inputs.monthlyContribution > 0) {
    // Calcular tempo necessário
    const pv = inputs.initialAmount
    const pmt = inputs.monthlyContribution
    const fv = finalTargetAmount

    // Fórmula para calcular número de períodos
    const timeNeeded = Math.log((fv * monthlyRate + pmt) / (pv * monthlyRate + pmt)) / Math.log(1 + monthlyRate)
    const yearsNeeded = timeNeeded / 12

    return {
      type: "reverse-time",
      timeNeeded: yearsNeeded,
      targetAmount: finalTargetAmount,
      monthlyContribution: inputs.monthlyContribution,
      initialAmount: inputs.initialAmount,
      annualReturn: inputs.annualReturn,
      targetMonthlyIncome: targetMonthlyIncome,
    }
  } else {
    // Calcular contribuição mensal necessária
    const pv = inputs.initialAmount
    const fv = finalTargetAmount
    const n = (inputs.period || 10) * 12 // Default 10 anos se não especificado

    // Fórmula para calcular PMT necessário
    const monthlyContributionNeeded =
      (fv - pv * Math.pow(1 + monthlyRate, n)) / ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate)

    return {
      type: "reverse-amount",
      monthlyContributionNeeded,
      targetAmount: finalTargetAmount,
      period: inputs.period || 10,
      initialAmount: inputs.initialAmount,
      annualReturn: inputs.annualReturn,
      targetMonthlyIncome: targetMonthlyIncome,
    }
  }
}
