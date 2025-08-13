export interface InvestmentInputs {
  initialAmount: number
  monthlyContribution: number
  annualReturn: number
  period: number
  investmentType: "cdb" | "lci" | "lca" | "tesouro" | "poupanca"
  taxRate?: number // Para investimentos tributáveis
}

export interface InvestmentYearlyData {
  year: number
  monthlyContribution: number
  yearlyContribution: number
  grossReturn: number
  taxes: number
  netReturn: number
  accumulatedGross: number
  accumulatedNet: number
}

export interface InvestmentResults {
  yearlyData: InvestmentYearlyData[]
  totalInvested: number
  totalGrossReturn: number
  totalNetReturn: number
  totalTaxes: number
  finalAmount: number
  investmentType: string
}

export interface WithdrawalPlan {
  monthlyWithdrawal: number
  withdrawalPeriod: number
  inflationRate: number
}
