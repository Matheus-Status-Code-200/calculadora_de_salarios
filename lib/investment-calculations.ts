import type { InvestmentInputs, InvestmentResults, InvestmentYearlyData, WithdrawalPlan } from "@/types/investment"

// Tabela de IR para investimentos (regressiva)
const IR_TABLE = [
  { minDays: 0, maxDays: 180, rate: 0.225 },
  { minDays: 181, maxDays: 360, rate: 0.2 },
  { minDays: 361, maxDays: 720, rate: 0.175 },
  { minDays: 721, maxDays: Number.POSITIVE_INFINITY, rate: 0.15 },
]

function calculateTaxRate(years: number): number {
  const days = years * 365
  for (const bracket of IR_TABLE) {
    if (days >= bracket.minDays && days <= bracket.maxDays) {
      return bracket.rate
    }
  }
  return 0.15 // Taxa mínima
}

export function calculateInvestment(inputs: InvestmentInputs): InvestmentResults {
  const yearlyData: InvestmentYearlyData[] = []
  let accumulatedGross = inputs.initialAmount
  let accumulatedNet = inputs.initialAmount
  let totalInvested = inputs.initialAmount
  let totalTaxes = 0

  const monthlyReturn = inputs.annualReturn / 100 / 12
  const yearlyContribution = inputs.monthlyContribution * 12

  for (let year = 1; year <= inputs.period; year++) {
    // Aplicar rendimento sobre valor acumulado
    const grossReturn = accumulatedGross * (inputs.annualReturn / 100)

    // Adicionar contribuições mensais com rendimento proporcional
    const contributionReturn = yearlyContribution * (1 + inputs.annualReturn / 100 / 2) // Rendimento médio das contribuições

    accumulatedGross += yearlyContribution + grossReturn

    // Calcular impostos (apenas para investimentos tributáveis)
    let taxes = 0
    if (inputs.investmentType !== "lci" && inputs.investmentType !== "lca" && inputs.investmentType !== "poupanca") {
      const taxRate = inputs.taxRate || calculateTaxRate(year)
      taxes = grossReturn * taxRate
    }

    const netReturn = grossReturn - taxes
    accumulatedNet += yearlyContribution + netReturn

    totalInvested += yearlyContribution
    totalTaxes += taxes

    yearlyData.push({
      year,
      monthlyContribution: inputs.monthlyContribution,
      yearlyContribution,
      grossReturn,
      taxes,
      netReturn,
      accumulatedGross,
      accumulatedNet,
    })
  }

  const investmentTypeNames = {
    cdb: "CDB",
    lci: "LCI",
    lca: "LCA",
    tesouro: "Tesouro Direto",
    poupanca: "Poupança",
  }

  return {
    yearlyData,
    totalInvested,
    totalGrossReturn: accumulatedGross - totalInvested,
    totalNetReturn: accumulatedNet - totalInvested,
    totalTaxes,
    finalAmount: accumulatedNet,
    investmentType: investmentTypeNames[inputs.investmentType],
  }
}

export function calculateWithdrawalPlan(
  finalAmount: number,
  plan: WithdrawalPlan,
): { canWithdraw: boolean; totalWithdrawn: number; remainingAmount: number; realPurchasingPower: number } {
  const monthlyInflation = plan.inflationRate / 100 / 12
  const totalMonths = plan.withdrawalPeriod * 12
  let remainingAmount = finalAmount
  let totalWithdrawn = 0
  let realPurchasingPower = 0

  for (let month = 1; month <= totalMonths; month++) {
    if (remainingAmount <= 0) break

    const withdrawal = Math.min(plan.monthlyWithdrawal, remainingAmount)
    remainingAmount -= withdrawal
    totalWithdrawn += withdrawal

    // Calcular poder de compra real (descontando inflação)
    const inflationFactor = Math.pow(1 + monthlyInflation, month)
    realPurchasingPower += withdrawal / inflationFactor
  }

  return {
    canWithdraw: totalWithdrawn >= plan.monthlyWithdrawal * totalMonths * 0.95, // 95% de tolerância
    totalWithdrawn,
    remainingAmount,
    realPurchasingPower,
  }
}
