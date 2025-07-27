"use client"

import { useState } from "react"
import { Plus, X, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

interface ScenarioInputProps {
  scenario: number
  title: string
}

export default function ScenarioInput({ scenario, title }: ScenarioInputProps) {
  const [salaryType, setSalaryType] = useState<"mensal" | "horista">("mensal")
  const [calculateDiscounts, setCalculateDiscounts] = useState(false)
  const [benefits, setBenefits] = useState<
    Array<{ id: number; name: string; value: string; frequency: "mensal" | "anual" }>
  >([])

  const addBenefit = () => {
    const newBenefit = {
      id: Date.now(),
      name: "",
      value: "",
      frequency: "mensal" as const,
    }
    setBenefits([...benefits, newBenefit])
  }

  const removeBenefit = (id: number) => {
    setBenefits(benefits.filter((benefit) => benefit.id !== id))
  }

  const updateBenefit = (id: number, field: string, value: string) => {
    setBenefits(benefits.map((benefit) => (benefit.id === id ? { ...benefit, [field]: value } : benefit)))
  }

  const titleColor =
    scenario === 2
      ? "text-teal-700 dark:text-teal-400"
      : scenario === 1
        ? "text-indigo-700 dark:text-indigo-400"
        : "text-blue-700 dark:text-blue-400"
  const buttonColor =
    scenario === 2
      ? "bg-teal-100 hover:bg-teal-200 text-teal-700 dark:bg-teal-900/30 dark:hover:bg-teal-900/50 dark:text-teal-400"
      : scenario === 1
        ? "bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-400"
        : "bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400"

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="pb-4">
        <CardTitle className={`text-center text-lg md:text-xl ${titleColor}`}>
          <DollarSign className="w-5 h-5 inline mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-6 p-3 md:p-6">
        {/* Reajuste Anual */}
        <div>
          <label
            htmlFor={`annualAdjustmentRate${scenario}`}
            className="block text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Reajuste anual (%)
          </label>
          <input
            type="number"
            id={`annualAdjustmentRate${scenario}`}
            step="0.1"
            min="0"
            max="50"
            defaultValue="3.5"
            className="w-full px-4 py-3 md:py-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 text-base md:text-lg"
            placeholder="Ex: 3.5"
          />
        </div>

        {/* Tipo de Salário */}
        <div>
          <label
            htmlFor={`salaryType${scenario}`}
            className="block text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Tipo de Salário
          </label>
          <select
            id={`salaryType${scenario}`}
            value={salaryType}
            onChange={(e) => setSalaryType(e.target.value as "mensal" | "horista")}
            className="w-full px-4 py-3 md:py-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 text-base md:text-lg"
          >
            <option value="mensal">Mensal</option>
            <option value="horista">Horista</option>
          </select>
        </div>

        {/* Inputs de Salário */}
        {salaryType === "mensal" ? (
          <div>
            <label
              htmlFor={`salary${scenario}`}
              className="block text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Salário mensal (R$)
            </label>
            <input
              type="number"
              id={`salary${scenario}`}
              step="0.01"
              min="0"
              max="1000000"
              className="w-full px-4 py-3 md:py-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 text-base md:text-lg"
              placeholder="Ex: 5000,00"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor={`hourlyRate${scenario}`}
                className="block text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Valor por hora (R$)
              </label>
              <input
                type="number"
                id={`hourlyRate${scenario}`}
                step="0.01"
                min="0"
                max="10000"
                className="w-full px-4 py-3 md:py-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 text-base md:text-lg"
                placeholder="Ex: 25,00"
              />
            </div>
            <div>
              <label
                htmlFor={`hoursPerMonth${scenario}`}
                className="block text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Horas por mês
              </label>
              <input
                type="number"
                id={`hoursPerMonth${scenario}`}
                min="1"
                max="300"
                className="w-full px-4 py-3 md:py-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 text-base md:text-lg"
                placeholder="Ex: 200"
              />
            </div>
          </div>
        )}

        {/* Indenização */}
        <div>
          <label
            htmlFor={`indenizationPercentage${scenario}`}
            className="block text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Indenização (% do salário anual)
          </label>
          <input
            type="number"
            id={`indenizationPercentage${scenario}`}
            step="0.1"
            min="0"
            max="100"
            defaultValue="0"
            className="w-full px-4 py-3 md:py-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 text-base md:text-lg"
            placeholder="Ex: 10.0"
          />
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Porcentagem sobre salário anual + 13º (não inclui férias)
          </p>
        </div>

        {/* Benefícios */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300">Benefícios</h4>
            <Button type="button" variant="outline" size="sm" onClick={addBenefit} className={`${buttonColor} text-sm`}>
              <Plus className="w-4 h-4 mr-1" />
              Adicionar
            </Button>
          </div>

          <div className={`benefits-container space-y-3`} data-scenario={scenario}>
            {benefits.map((benefit) => (
              <div
                key={benefit.id}
                className="benefit-row flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center p-2 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <input
                  type="text"
                  value={benefit.name}
                  onChange={(e) => updateBenefit(benefit.id, "name", e.target.value)}
                  className="flex-1 px-3 py-2 md:py-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm md:text-base dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
                  placeholder="Nome do benefício"
                />
                <input
                  type="number"
                  value={benefit.value}
                  onChange={(e) => updateBenefit(benefit.id, "value", e.target.value)}
                  className="w-full sm:w-32 px-3 py-2 md:py-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm md:text-base dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
                  placeholder="Valor"
                  step="0.01"
                  min="0"
                />
                <select
                  value={benefit.frequency}
                  onChange={(e) => updateBenefit(benefit.id, "frequency", e.target.value)}
                  className="w-full sm:w-28 px-3 py-2 md:py-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm md:text-base dark:bg-gray-800 dark:text-gray-100"
                >
                  <option value="mensal">Mensal</option>
                  <option value="anual">Anual</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeBenefit(benefit.id)}
                  className="self-center sm:self-auto text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-bold text-lg p-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Calcular Descontos */}
        <div className="border-t dark:border-gray-600 pt-4 md:pt-6">
          <div className="flex justify-between items-center my-1">
            <div className="flex-1 mr-4">
              <label className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 block">
                Calcular descontos (INSS e IRRF)
              </label>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                Ativar para calcular descontos obrigatórios
              </p>
            </div>
            <Switch
              checked={calculateDiscounts}
              onCheckedChange={setCalculateDiscounts}
              className="calculate-discounts-toggle"
              data-scenario={scenario}
            />
          </div>

          {calculateDiscounts && (
            <div className="mt-4 discounts-options" data-scenario={scenario}>
              <label
                htmlFor={`dependents${scenario}`}
                className="block text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Número de dependentes
              </label>
              <input
                type="number"
                id={`dependents${scenario}`}
                min="0"
                max="20"
                defaultValue="0"
                className="w-full px-4 py-3 md:py-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 text-base md:text-lg"
                placeholder="Ex: 2"
              />
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
                Para cálculo do IRRF (R$ 189,59 por dependente)
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
