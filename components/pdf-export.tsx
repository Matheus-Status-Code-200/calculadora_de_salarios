"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CalculationMode, CalculationResults } from "@/types/calculator"
import { formatCurrency } from "@/lib/utils"

interface PDFExportProps {
  mode: CalculationMode
  results: CalculationResults[]
  period: number
}

export default function PDFExport({ mode, results, period }: PDFExportProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = async () => {
    setIsGenerating(true)

    try {
      // Importação dinâmica do jsPDF
      const { default: jsPDF } = await import("jspdf")

      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.width
      const pageHeight = doc.internal.pageSize.height
      const margin = 20
      let yPosition = margin

      // Header
      doc.setFontSize(20)
      doc.setTextColor(40, 40, 40)
      doc.text("Calculadora Trabalhista - Relatório", pageWidth / 2, yPosition, { align: "center" })
      yPosition += 15

      doc.setFontSize(12)
      doc.setTextColor(100, 100, 100)
      doc.text(`Período: ${period} anos | Data: ${new Date().toLocaleDateString("pt-BR")}`, pageWidth / 2, yPosition, {
        align: "center",
      })
      yPosition += 20

      if (mode === "single") {
        const result = results[0]
        const totalWithBenefits = result.hasDiscounts
          ? result.totalNetGains + result.totalBenefits + result.totalIndenization
          : result.totalGrossGains + result.totalBenefits + result.totalIndenization

        // Resumo Principal
        doc.setFontSize(16)
        doc.setTextColor(40, 40, 40)
        doc.text("GANHO TOTAL NO PERÍODO", margin, yPosition)
        yPosition += 10

        doc.setFontSize(24)
        doc.setTextColor(0, 100, 200)
        doc.text(formatCurrency(totalWithBenefits), margin, yPosition)
        yPosition += 20

        // Detalhes
        doc.setFontSize(14)
        doc.setTextColor(40, 40, 40)
        doc.text("Detalhamento:", margin, yPosition)
        yPosition += 10

        doc.setFontSize(12)
        doc.text(`Total Bruto: ${formatCurrency(result.totalGrossGains)}`, margin, yPosition)
        yPosition += 8
        doc.text(`Férias: ${formatCurrency(result.totalVacations)}`, margin, yPosition)
        yPosition += 8
        doc.text(`Benefícios: ${formatCurrency(result.totalBenefits)}`, margin, yPosition)
        yPosition += 8
        doc.text(`Indenização: ${formatCurrency(result.totalIndenization)}`, margin, yPosition)
        yPosition += 8
        doc.text(`FGTS: ${formatCurrency(result.totalFgts)}`, margin, yPosition)
        yPosition += 8

        if (result.hasDiscounts) {
          doc.text(`Descontos (INSS + IRRF): ${formatCurrency(result.totalInss + result.totalIrrf)}`, margin, yPosition)
          yPosition += 8
          doc.text(`Total Líquido: ${formatCurrency(result.totalNetGains)}`, margin, yPosition)
        }
      } else {
        // Modo comparação
        const [result1, result2] = results
        const gain1 = result1.hasDiscounts
          ? result1.totalNetGains + result1.totalBenefits + result1.totalIndenization
          : result1.totalGrossGains + result1.totalBenefits + result1.totalIndenization
        const gain2 = result2.hasDiscounts
          ? result2.totalNetGains + result2.totalBenefits + result2.totalIndenization
          : result2.totalGrossGains + result2.totalBenefits + result2.totalIndenization

        doc.setFontSize(16)
        doc.setTextColor(40, 40, 40)
        doc.text("COMPARAÇÃO DE CENÁRIOS", margin, yPosition)
        yPosition += 15

        // Cenário 1
        doc.setFontSize(14)
        doc.setTextColor(100, 50, 200)
        doc.text("Cenário 1:", margin, yPosition)
        yPosition += 8
        doc.setFontSize(12)
        doc.setTextColor(40, 40, 40)
        doc.text(formatCurrency(gain1), margin + 20, yPosition)
        yPosition += 15

        // Cenário 2
        doc.setFontSize(14)
        doc.setTextColor(0, 150, 150)
        doc.text("Cenário 2:", margin, yPosition)
        yPosition += 8
        doc.setFontSize(12)
        doc.setTextColor(40, 40, 40)
        doc.text(formatCurrency(gain2), margin + 20, yPosition)
        yPosition += 15

        // Diferença
        const difference = gain2 - gain1
        doc.setFontSize(14)
        doc.setTextColor(40, 40, 40)
        doc.text("Diferença:", margin, yPosition)
        yPosition += 8
        doc.setFontSize(12)
        doc.setTextColor(difference > 0 ? 0 : 200, difference > 0 ? 150 : 0, 0)
        doc.text(
          `${formatCurrency(Math.abs(difference))} ${difference > 0 ? "(Cenário 2 melhor)" : "(Cenário 1 melhor)"}`,
          margin + 20,
          yPosition,
        )
      }

      // Salvar PDF
      const fileName =
        mode === "single" ? `calculadora-trabalhista-${period}anos.pdf` : `comparacao-cenarios-${period}anos.pdf`

      doc.save(fileName)
    } catch (error) {
      console.error("Erro ao gerar PDF:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button
      onClick={generatePDF}
      disabled={isGenerating}
      variant="outline"
      className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:text-green-400 dark:border-green-800"
    >
      <Download className="w-4 h-4 mr-2" />
      {isGenerating ? "Gerando PDF..." : "Exportar PDF"}
    </Button>
  )
}
