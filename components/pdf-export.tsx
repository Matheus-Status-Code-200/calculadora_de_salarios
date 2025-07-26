"use client"

import { useState } from "react"
import { FileDown, Loader2 } from "lucide-react"
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
      // Importar jsPDF dinamicamente
      const { jsPDF } = await import("jspdf")
      const doc = new jsPDF()

      // Configurações
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 20
      const lineHeight = 7
      let yPosition = margin

      // Função para adicionar nova página se necessário
      const checkPageBreak = (neededSpace: number) => {
        if (yPosition + neededSpace > pageHeight - margin) {
          doc.addPage()
          yPosition = margin
        }
      }

      // Função para adicionar texto com quebra de linha
      const addText = (text: string, x: number, fontSize = 10, style = "normal") => {
        doc.setFontSize(fontSize)
        doc.setFont("helvetica", style)
        doc.text(text, x, yPosition)
        yPosition += lineHeight
      }

      // Cabeçalho
      doc.setFillColor(59, 130, 246) // Blue-600
      doc.rect(0, 0, pageWidth, 40, "F")

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(20)
      doc.setFont("helvetica", "bold")
      doc.text("RELATÓRIO DE PROJEÇÃO TRABALHISTA", pageWidth / 2, 25, { align: "center" })

      yPosition = 50
      doc.setTextColor(0, 0, 0)

      // Informações gerais
      addText(`Data de geração: ${new Date().toLocaleDateString("pt-BR")}`, margin, 12, "bold")
      addText(`Período analisado: ${period} anos`, margin, 12, "bold")
      addText(`Tipo de análise: ${mode === "single" ? "Cálculo Único" : "Comparação de Cenários"}`, margin, 12, "bold")
      yPosition += 10

      if (mode === "single") {
        // Relatório para cálculo único
        const result = results[0]
        const totalWithBenefits = result.hasDiscounts
          ? result.totalNetGains + result.totalBenefits + result.totalIndenization
          : result.totalGrossGains + result.totalBenefits + result.totalIndenization

        // Resumo executivo
        doc.setFillColor(240, 249, 255)
        doc.rect(margin, yPosition, pageWidth - 2 * margin, 30, "F")
        yPosition += 10
        addText("RESUMO EXECUTIVO", margin + 5, 14, "bold")
        addText(`Ganho total no período: ${formatCurrency(totalWithBenefits)}`, margin + 5, 12, "bold")
        addText(
          `Tipo: ${result.hasDiscounts ? "Líquido + Benefícios + Indenização" : "Bruto + Benefícios + Indenização"}`,
          margin + 5,
          10,
        )
        yPosition += 15

        // Detalhamento dos totais
        checkPageBreak(80)
        addText("DETALHAMENTO DOS TOTAIS", margin, 14, "bold")
        yPosition += 5

        const totalsData = [
          ["Total Bruto (Salário + 13º + Férias)", formatCurrency(result.totalGrossGains)],
          ["Total em Férias", formatCurrency(result.totalVacations)],
          ["Total em Benefícios", formatCurrency(result.totalBenefits)],
          ["Total Indenização", formatCurrency(result.totalIndenization)],
          ["Total FGTS Depositado", formatCurrency(result.totalFgts)],
        ]

        if (result.hasDiscounts) {
          totalsData.push(
            ["Total INSS Descontado", formatCurrency(result.totalInss)],
            ["Total IRRF Descontado", formatCurrency(result.totalIrrf)],
            ["Total Líquido", formatCurrency(result.totalNetGains)],
          )
        }

        totalsData.forEach(([label, value]) => {
          doc.setFont("helvetica", "normal")
          doc.text(label, margin + 5, yPosition)
          doc.setFont("helvetica", "bold")
          doc.text(value, pageWidth - margin - 5, yPosition, { align: "right" })
          yPosition += lineHeight
        })

        // Detalhamento ano a ano
        yPosition += 10
        checkPageBreak(20)
        addText("DETALHAMENTO ANO A ANO", margin, 14, "bold")
        yPosition += 5

        result.yearlyData.forEach((yearData) => {
          checkPageBreak(60)

          // Cabeçalho do ano
          doc.setFillColor(249, 250, 251)
          doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 15, "F")
          addText(
            `ANO ${yearData.year} - Salário Mensal: ${formatCurrency(yearData.monthlySalary)}`,
            margin + 5,
            12,
            "bold",
          )
          yPosition += 5

          // Dados do ano
          const yearlyDetails = [
            ["12 Salários", formatCurrency(yearData.grossSalary12)],
            ["13º Salário", formatCurrency(yearData.thirteenthSalary)],
            ["Férias + 1/3", formatCurrency(yearData.vacations)],
            ["Benefícios", formatCurrency(yearData.benefits)],
            ["Indenização", formatCurrency(yearData.indenization)],
            ["FGTS (8%)", formatCurrency(yearData.fgts)],
            ["Total Bruto", formatCurrency(yearData.totalGross)],
          ]

          if (result.hasDiscounts) {
            yearlyDetails.push(
              ["INSS Descontado", `- ${formatCurrency(yearData.inss)}`],
              ["IRRF Descontado", `- ${formatCurrency(yearData.irrf)}`],
              ["Total Líquido", formatCurrency(yearData.netGains)],
            )
          }

          yearlyDetails.forEach(([label, value]) => {
            doc.setFont("helvetica", "normal")
            doc.text(label, margin + 10, yPosition)
            doc.setFont("helvetica", "normal")
            doc.text(value, pageWidth - margin - 5, yPosition, { align: "right" })
            yPosition += lineHeight - 1
          })

          yPosition += 5
        })
      } else {
        // Relatório para comparação
        const [result1, result2] = results
        const gain1 = result1.hasDiscounts
          ? result1.totalNetGains + result1.totalBenefits + result1.totalIndenization
          : result1.totalGrossGains + result1.totalBenefits + result1.totalIndenization
        const gain2 = result2.hasDiscounts
          ? result2.totalNetGains + result2.totalBenefits + result2.totalIndenization
          : result2.totalGrossGains + result2.totalBenefits + result2.totalIndenization

        const difference = gain2 - gain1
        const betterScenario = difference > 0 ? 2 : difference < 0 ? 1 : 0

        // Resumo da comparação
        doc.setFillColor(240, 249, 255)
        doc.rect(margin, yPosition, pageWidth - 2 * margin, 40, "F")
        yPosition += 10
        addText("RESULTADO DA COMPARAÇÃO", margin + 5, 14, "bold")

        if (betterScenario === 0) {
          addText("Os cenários são equivalentes!", margin + 5, 12, "bold")
          addText("Ambos resultam no mesmo ganho total", margin + 5, 10)
        } else if (betterScenario === 2) {
          addText("O Cenário 2 é mais vantajoso!", margin + 5, 12, "bold")
          addText(`Rende ${formatCurrency(difference)} a mais no período`, margin + 5, 10)
        } else {
          addText("O Cenário 1 é mais vantajoso!", margin + 5, 12, "bold")
          addText(`Rende ${formatCurrency(Math.abs(difference))} a mais no período`, margin + 5, 10)
        }
        yPosition += 25

        // Comparação lado a lado
        checkPageBreak(100)
        addText("COMPARAÇÃO DETALHADA", margin, 14, "bold")
        yPosition += 10

        // Cenário 1
        doc.setFillColor(238, 242, 255) // Indigo-50
        doc.rect(margin, yPosition, (pageWidth - 3 * margin) / 2, 80, "F")
        addText("CENÁRIO 1", margin + 5, 12, "bold")
        yPosition += 5

        const scenario1Data = [
          ["Ganho Total", formatCurrency(gain1)],
          ["Total Bruto", formatCurrency(result1.totalGrossGains)],
          ["Total Férias", formatCurrency(result1.totalVacations)],
          ["Total Benefícios", formatCurrency(result1.totalBenefits)],
          ["Total Indenização", formatCurrency(result1.totalIndenization)],
          ["Total FGTS", formatCurrency(result1.totalFgts)],
        ]

        if (result1.hasDiscounts) {
          scenario1Data.push(
            ["Total INSS", formatCurrency(result1.totalInss)],
            ["Total IRRF", formatCurrency(result1.totalIrrf)],
          )
        }

        const startY = yPosition
        scenario1Data.forEach(([label, value]) => {
          doc.setFont("helvetica", "normal")
          doc.text(label, margin + 10, yPosition, { maxWidth: 60 })
          doc.text(value, margin + 90, yPosition)
          yPosition += lineHeight
        })

        // Cenário 2
        yPosition = startY
        const scenario2X = margin + (pageWidth - 3 * margin) / 2 + 10
        doc.setFillColor(240, 253, 250) // Teal-50
        doc.rect(scenario2X, yPosition - 5, (pageWidth - 3 * margin) / 2, 80, "F")
        addText("CENÁRIO 2", scenario2X + 5, 12, "bold")
        yPosition += 5

        const scenario2Data = [
          ["Ganho Total", formatCurrency(gain2)],
          ["Total Bruto", formatCurrency(result2.totalGrossGains)],
          ["Total Férias", formatCurrency(result2.totalVacations)],
          ["Total Benefícios", formatCurrency(result2.totalBenefits)],
          ["Total Indenização", formatCurrency(result2.totalIndenization)],
          ["Total FGTS", formatCurrency(result2.totalFgts)],
        ]

        if (result2.hasDiscounts) {
          scenario2Data.push(
            ["Total INSS", formatCurrency(result2.totalInss)],
            ["Total IRRF", formatCurrency(result2.totalIrrf)],
          )
        }

        scenario2Data.forEach(([label, value]) => {
          doc.setFont("helvetica", "normal")
          doc.text(label, scenario2X + 10, yPosition, { maxWidth: 60 })
          doc.text(value, scenario2X + 90, yPosition)
          yPosition += lineHeight
        })

        yPosition += 20
      }

      // Rodapé informativo
      checkPageBreak(30)
      yPosition += 10
      doc.setFillColor(249, 250, 251)
      doc.rect(margin, yPosition, pageWidth - 2 * margin, 25, "F")
      yPosition += 10
      addText("INFORMAÇÕES IMPORTANTES", margin + 5, 12, "bold")
      addText("• Valores de INSS e IRRF baseados nas tabelas de 2025", margin + 5, 9)
      addText("• Esta é uma ferramenta de simulação para fins educacionais", margin + 5, 9)
      addText("• Consulte sempre um contador para cálculos oficiais", margin + 5, 9)

      // Salvar o PDF
      const fileName =
        mode === "single"
          ? `relatorio-trabalhista-${period}anos-${new Date().toISOString().split("T")[0]}.pdf`
          : `comparacao-trabalhista-${period}anos-${new Date().toISOString().split("T")[0]}.pdf`

      doc.save(fileName)
    } catch (error) {
      console.error("Erro ao gerar PDF:", error)
      alert("Erro ao gerar o relatório PDF. Tente novamente.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button
      onClick={generatePDF}
      disabled={isGenerating}
      variant="outline"
      className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Gerando PDF...
        </>
      ) : (
        <>
          <FileDown className="w-4 h-4 mr-2" />
          Exportar PDF
        </>
      )}
    </Button>
  )
}
