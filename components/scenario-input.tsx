"use client"

import { Plus, X, DollarSign, Clock, Gift, Users } from "lucide-react"
import type { CalculationInputs, Benefit } from "@/types/calculator"

interface ScenarioInputProps {
  scenario: number
  inputs: CalculationInputs
  onChange: (inputs: CalculationInputs) => void
  isCompareMode: boolean
}

export default function ScenarioInput({ scenario, inputs, onChange, isCompareMode }: ScenarioInputProps) {
  const title = isCompareMode ? `Cenário ${scenario}` : "Dados do Cenário"
  const colorClasses = scenario === 2 ? "border-teal-200 bg-teal-50" : "border-indigo-200 bg-indigo-50"
  const accentColor = scenario === 2 ? "teal" : "indigo"

  const updateInputs = (updates: Partial<CalculationInputs>) => {
    onChange({ ...inputs, ...updates })
  }

  const addBenefit = () => {
    const newBenefit: Benefit = {
      name: "",
      value: 0,
      frequency: "mensal",
    }
    updateInputs({ benefits: [...inputs.benefits, newBenefit] })
  }

  const updateBenefit = (index: number, benefit: Benefit) => {
    const newBenefits = [...inputs.benefits]
    newBenefits[index] = benefit
    updateInputs({ benefits: newBenefits })
  }

  const removeBenefit = (index: number) => {
    const newBenefits = inputs.benefits.filter((_, i) => i !== index)
    updateInputs({ benefits: newBenefits })
  }

  return (
    <div className={`border-2 rounded-xl p-6 space-y-6 ${colorClasses}`}>
      <div className="text-center">
        <h3 className={`text-xl font-bold text-${accentColor}-800 mb-2`}>{title}</h3>
        <div className={`w-16 h-1 bg-${accentColor}-400 mx-auto rounded-full`}></div>
      </div>

      {/* Annual Adjustment Rate */}
      <div className="space-y-2">
        <label className={`flex items-center gap-2 text-sm font-semibold text-${accentColor}-900`}>
          <DollarSign className="w-4 h-4" />
          Reajuste anual (%)
        </label>
        <input
          type="number"
          value={inputs.annualAdjustmentRate}
          onChange={(e) => updateInputs({ annualAdjustmentRate: Number.parseFloat(e.target.value) || 0 })}
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          step="0.01"
          min="0"
          max="20"
        />
      </div>

      {/* Salary Type */}
      <div className="space-y-2">
        <label className={`flex items-center gap-2 text-sm font-semibold text-${accentColor}-900`}>
          <Clock className="w-4 h-4" />
          Tipo de Salário
        </label>
        <select
          value={inputs.salaryType}
          onChange={(e) => updateInputs({ salaryType: e.target.value as "mensal" | "horista" })}
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="mensal">Mensal</option>
          <option value="horista">Horista</option>
        </select>
      </div>

      {/* Salary Inputs */}
      {inputs.salaryType === "mensal" ? (
        <div className="space-y-2">
          <label className={`text-sm font-semibold text-${accentColor}-900`}>Salário mensal (R$)</label>
          <input
            type="number"
            value={inputs.initialMonthlySalary || ""}
            onChange={(e) => updateInputs({ initialMonthlySalary: Number.parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: 5000,50"
            min="0"
            step="0.01"
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className={`text-sm font-semibold text-${accentColor}-900`}>Valor por hora (R$)</label>
            <input
              type="number"
              value={inputs.hourlyRate || ""}
              onChange={(e) => updateInputs({ hourlyRate: Number.parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: 25,75"
              min="0"
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <label className={`text-sm font-semibold text-${accentColor}-900`}>Horas no mês</label>
            <input
              type="number"
              value={inputs.hoursPerMonth || ""}
              onChange={(e) => updateInputs({ hoursPerMonth: Number(e.target.value) })}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: 200"
              min="0"
            />
          </div>
        </div>
      )}

      {/* Benefits */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className={`flex items-center gap-2 text-sm font-semibold text-${accentColor}-900`}>
            <Gift className="w-4 h-4" />
            Benefícios
          </label>
          <button
            type="button"
            onClick={addBenefit}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-${accentColor}-700 bg-${accentColor}-100 hover:bg-${accentColor}-200 rounded-md transition-colors`}
          >
            <Plus className="w-3 h-3" />
            Adicionar
          </button>
        </div>

        <div className="space-y-3">
          {inputs.benefits.map((benefit, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-2 items-center bg-white p-3 rounded-lg border border-gray-200"
            >
              <input
                type="text"
                value={benefit.name}
                onChange={(e) => updateBenefit(index, { ...benefit, name: e.target.value })}
                className="col-span-4 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nome do benefício"
              />
              <input
                type="number"
                value={benefit.value || ""}
                onChange={(e) => updateBenefit(index, { ...benefit, value: Number.parseFloat(e.target.value) || 0 })}
                className="col-span-3 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                placeholder="Valor"
                min="0"
                step="0.01"
              />
              <select
                value={benefit.frequency}
                onChange={(e) => updateBenefit(index, { ...benefit, frequency: e.target.value as "mensal" | "anual" })}
                className="col-span-4 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="mensal">Mensal</option>
                <option value="anual">Anual</option>
              </select>
              <button
                type="button"
                onClick={() => removeBenefit(index)}
                className="col-span-1 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Discounts Toggle */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <label className={`flex items-center gap-2 text-sm font-semibold text-${accentColor}-900`}>
            <Users className="w-4 h-4" />
            Calcular descontos (INSS/IRRF)?
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={inputs.calculateDiscounts}
              onChange={(e) => updateInputs({ calculateDiscounts: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {inputs.calculateDiscounts && (
          <div className="space-y-2">
            <label className={`text-sm font-semibold text-${accentColor}-900`}>Número de dependentes</label>
            <input
              type="number"
              value={inputs.dependents}
              onChange={(e) => updateInputs({ dependents: Number(e.target.value) })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              max="10"
            />
          </div>
        )}
      </div>
    </div>
  )
}
