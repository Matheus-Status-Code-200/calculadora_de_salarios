"use client"

import { useState } from "react"
import { Download, FileText, Loader2, CheckCircle, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { CalculationMode, CalculationResults } from "@/types/calculator"
import { formatCurrency } from "@/lib/utils"

// Helper to fetch an image and return a dataURL for jsPDF
async function toDataURL(path: string): Promise<string | null> {
  try {
    const res = await fetch(path)
    const blob = await res.blob()
    return await new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

type RGB = [number, number, number]

const COLORS = {
  primary: [37, 99, 235] as RGB, // blue-600
  primaryDark: [29, 78, 216] as RGB, // blue-700
  indigo: [79, 70, 229] as RGB, // indigo-600
  teal: [13, 148, 136] as RGB, // teal-600
  emerald: [16, 185, 129] as RGB, // emerald-500
  amber: [245, 158, 11] as RGB, // amber-500
  orange: [234, 88, 12] as RGB, // orange-600
  purple: [139, 92, 246] as RGB, // purple-500
  red: [239, 68, 68] as RGB, // red-500
  text: [31, 41, 55] as RGB, // gray-800
  textLight: [107, 114, 128] as RGB, // gray-500
  divider: [229, 231, 235] as RGB, // gray-200
  panel: [249, 250, 251] as RGB, // gray-50
}

function setFill(doc: any, [r, g, b]: RGB) {
  doc.setFillColor(r, g, b)
}
function setText(doc: any, [r, g, b]: RGB) {
  doc.setTextColor(r, g, b)
}
function roundedPanel(doc: any, x: number, y: number, w: number, h: number, fill: RGB, border?: RGB) {
  if (border) {
    doc.setDrawColor(border[0], border[1], border[2])
  }
  setFill(doc, fill)
  doc.roundedRect(x, y, w, h, 8, 8, "FD")
}

interface PDFExportProps {
  mode: CalculationMode
  results: CalculationResults[]
  period: number
}

export default function PDFExport({ mode, results, period }: PDFExportProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [progress, setProgress] = useState(0)

  const generatePDF = async () => {
    setIsGenerating(true)
    setProgress(0)
    setShowSuccess(false)

    try {
      setProgress(10)
      const { default: jsPDF } = await import("jspdf")
      setProgress(25)
      const { default: autoTable } = await import("jspdf-autotable")
      setProgress(40)

      const doc = new jsPDF({ unit: "pt", format: "a4" })
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 36
      const contentWidth = pageWidth - margin * 2

      doc.setFont("helvetica", "normal")
      setProgress(50)

      // Brand header
      const headerH = 90
      setFill(doc, COLORS.primary)
      doc.rect(0, 0, pageWidth, headerH, "F")

      // Logo (optional)
      const logoData = await toDataURL("/placeholder-logo.png")
      if (logoData) {
        try {
          doc.addImage(logoData, "PNG", margin, 22, 44, 44)
        } catch {
          // ignore image failures
        }
      }
      setProgress(60)

      // Title + subtitle
      doc.setFont("helvetica", "bold")
      doc.setFontSize(20)
      setText(doc, [255, 255, 255])
      doc.text("Calculadora Trabalhista — Relatório", margin + 60, 40)

      doc.setFont("helvetica", "normal")
      doc.setFontSize(12)
      const dateStr = new Date().toLocaleDateString("pt-BR")
      doc.text(`Período: ${period} ${period === 1 ? "ano" : "anos"}  |  Gerado em: ${dateStr}`, margin + 60, 62)

      // Accent stripe
      setFill(doc, COLORS.indigo)
      doc.rect(0, headerH - 6, pageWidth, 6, "F")

      let y = headerH + 24
      setProgress(70)

      // Helper to add section headings
      const sectionTitle = (txt: string) => {
        doc.setFont("helvetica", "bold")
        doc.setFontSize(14)
        setText(doc, COLORS.text)
        doc.text(txt, margin, y)
        y += 12
        setText(doc, COLORS.textLight)
        doc.setLineWidth(1)
        doc.setDrawColor(COLORS.divider[0], COLORS.divider[1], COLORS.divider[2])
        doc.line(margin, y + 6, pageWidth - margin, y + 6)
        y += 16
      }

      // Single mode layout
      if (mode === "single") {
        const r = results[0]
        const totalWithBenefits = r.hasDiscounts
          ? r.totalNetGains + r.totalBenefits + r.totalIndenization
          : r.totalGrossGains + r.totalBenefits + r.totalIndenization

        const pct = typeof r.percentageOfTotal === "number" ? Math.max(0, Math.min(100, r.percentageOfTotal)) : 0
        const pctAmount = (totalWithBenefits * pct) / 100

        // Big summary panel
        roundedPanel(doc, margin, y, contentWidth, 110, COLORS.panel, COLORS.divider)
        doc.setFont("helvetica", "bold")
        doc.setFontSize(13)
        setText(doc, COLORS.text)
        doc.text("Ganho total no período", margin + 18, y + 28)

        doc.setFontSize(26)
        setText(doc, COLORS.primaryDark)
        doc.text(formatCurrency(totalWithBenefits), margin + 18, y + 66)

        doc.setFont("helvetica", "normal")
        doc.setFontSize(10)
        setText(doc, COLORS.textLight)
        doc.text(
          r.hasDiscounts ? "Líquido + Benefícios + Indenização" : "Bruto + Benefícios + Indenização",
          margin + 18,
          y + 88,
        )

        // Percentage badge
        if (pct > 0) {
          setFill(doc, COLORS.emerald)
          const badgeW = 220
          const badgeH = 26
          const bx = pageWidth - margin - badgeW - 14
          const by = y + 26
          doc.roundedRect(bx, by, badgeW, badgeH, 6, 6, "F")
          doc.setFont("helvetica", "bold")
          doc.setFontSize(11)
          setText(doc, [255, 255, 255])
          doc.text(`${pct.toFixed(2)}% do total: ${formatCurrency(pctAmount)}`, bx + 10, by + 17)
        }

        y += 130
        setProgress(80)

        // Metric cards (grid of 3x2)
        sectionTitle("Resumo detalhado")

        const cards = [
          { label: "Total Bruto", value: r.totalGrossGains, color: COLORS.indigo },
          { label: "Férias", value: r.totalVacations, color: COLORS.amber },
          { label: "Benefícios", value: r.totalBenefits, color: COLORS.emerald },
          { label: "Indenização", value: r.totalIndenization, color: COLORS.orange },
          ...(r.hasDiscounts
            ? [{ label: "Descontos (INSS + IRRF)", value: r.totalInss + r.totalIrrf, color: COLORS.red } as const]
            : []),
          { label: "FGTS", value: r.totalFgts, color: COLORS.purple },
        ]

        const cols = 3
        const gap = 14
        const cardW = (contentWidth - gap * (cols - 1)) / cols
        const cardH = 80

        cards.forEach((c, idx) => {
          const row = Math.floor(idx / cols)
          const col = idx % cols
          const cx = margin + col * (cardW + gap)
          const cy = y + row * (cardH + gap)

          roundedPanel(doc, cx, cy, cardW, cardH, COLORS.panel, COLORS.divider)
          // colored stripe
          setFill(doc, c.color)
          doc.roundedRect(cx, cy, 6, cardH, 6, 6, "F")

          doc.setFont("helvetica", "bold")
          doc.setFontSize(11)
          setText(doc, COLORS.textLight)
          doc.text(c.label, cx + 16, cy + 22)

          doc.setFont("helvetica", "bold")
          doc.setFontSize(16)
          setText(doc, COLORS.text)
          doc.text(formatCurrency(c.value), cx + 16, cy + 48)
        })

        const rows = Math.ceil(cards.length / cols)
        y += rows * (cardH + gap) + 8

        // Yearly table
        sectionTitle("Detalhamento ano a ano")
        setText(doc, COLORS.text)
        doc.setFont("helvetica", "normal")
        doc.setFontSize(10)
        autoTable(doc, {
          startY: y,
          headStyles: { fillColor: COLORS.primary, textColor: [255, 255, 255], halign: "left" },
          styles: { font: "helvetica", fontSize: 9, cellPadding: 6 },
          alternateRowStyles: { fillColor: [248, 250, 252] },
          margin: { left: margin, right: margin },
          head: [
            [
              "Ano",
              "Salário Mensal",
              "Bruto",
              ...(r.hasDiscounts ? (["Descontos"] as const) : ([] as const)),
              ...(r.hasDiscounts ? (["Líquido"] as const) : ([] as const)),
              "FGTS",
            ],
          ],
          body: r.yearlyData.map((d) => {
            const base = [String(d.year), formatCurrency(d.monthlySalary), formatCurrency(d.grossGains)] as (
              | string
              | number
            )[]
            const middle = r.hasDiscounts ? [formatCurrency(d.inss + d.irrf), formatCurrency(d.netGains)] : []
            const end = [formatCurrency(d.fgts)]
            return base.concat(middle).concat(end)
          }),
          didDrawPage: (data: any) => {
            // footer on each page
            footer(doc, pageWidth, pageHeight, margin)
          },
        })
      } else {
        // Compare layout
        const [r1, r2] = results
        const gain1 = r1.hasDiscounts
          ? r1.totalNetGains + r1.totalBenefits + r1.totalIndenization
          : r1.totalGrossGains + r1.totalBenefits + r1.totalIndenization
        const gain2 = r2.hasDiscounts
          ? r2.totalNetGains + r2.totalBenefits + r2.totalIndenization
          : r2.totalGrossGains + r2.totalBenefits + r2.totalIndenization
        const diff = gain2 - gain1

        const pct1 = typeof r1.percentageOfTotal === "number" ? Math.max(0, Math.min(100, r1.percentageOfTotal)) : 0
        const pct2 = typeof r2.percentageOfTotal === "number" ? Math.max(0, Math.min(100, r2.percentageOfTotal)) : 0

        // Side-by-side summary cards
        const cardW = (contentWidth - 16) / 2
        const cardH = 120

        // Card 1
        roundedPanel(doc, margin, y, cardW, cardH, COLORS.panel, COLORS.divider)
        setFill(doc, COLORS.indigo)
        doc.roundedRect(margin, y, 6, cardH, 6, 6, "F")
        doc.setFont("helvetica", "bold")
        setText(doc, COLORS.text)
        doc.setFontSize(13)
        doc.text("Cenário 1 — Ganho Total", margin + 16, y + 24)
        doc.setFontSize(22)
        setText(doc, COLORS.indigo)
        doc.text(formatCurrency(gain1), margin + 16, y + 56)
        if (pct1 > 0) {
          setFill(doc, COLORS.indigo)
          doc.roundedRect(margin + 16, y + 70, 220, 24, 6, 6, "F")
          setText(doc, [255, 255, 255])
          doc.setFontSize(11)
          doc.text(`${pct1.toFixed(2)}% do total: ${formatCurrency((gain1 * pct1) / 100)}`, margin + 24, y + 87)
        }

        // Card 2
        const rightX = margin + cardW + 16
        roundedPanel(doc, rightX, y, cardW, cardH, COLORS.panel, COLORS.divider)
        setFill(doc, COLORS.teal)
        doc.roundedRect(rightX, y, 6, cardH, 6, 6, "F")
        doc.setFont("helvetica", "bold")
        setText(doc, COLORS.text)
        doc.setFontSize(13)
        doc.text("Cenário 2 — Ganho Total", rightX + 16, y + 24)
        doc.setFontSize(22)
        setText(doc, COLORS.teal)
        doc.text(formatCurrency(gain2), rightX + 16, y + 56)
        if (pct2 > 0) {
          setFill(doc, COLORS.teal)
          doc.roundedRect(rightX + 16, y + 70, 220, 24, 6, 6, "F")
          setText(doc, [255, 255, 255])
          doc.setFontSize(11)
          doc.text(`${pct2.toFixed(2)}% do total: ${formatCurrency((gain2 * pct2) / 100)}`, rightX + 24, y + 87)
        }

        // Difference callout
        const cx = pageWidth / 2
        const calloutY = y + cardH + 18
        doc.setFont("helvetica", "bold")
        doc.setFontSize(14)
        setText(doc, COLORS.text)
        doc.text("Diferença entre os cenários", cx, calloutY, { align: "center" })

        const badgeColor = Math.abs(diff) < 0.005 ? COLORS.textLight : diff > 0 ? COLORS.teal : COLORS.indigo
        setFill(doc, badgeColor)
        doc.roundedRect(cx - 120, calloutY + 10, 240, 28, 8, 8, "F")
        setText(doc, [255, 255, 255])
        doc.setFontSize(12)
        doc.text(
          `${formatCurrency(Math.abs(diff))} ${diff === 0 ? "" : diff > 0 ? "(Cenário 2 melhor)" : "(Cenário 1 melhor)"}`,
          cx,
          calloutY + 28,
          { align: "center" },
        )

        y = calloutY + 54

        // Comparison table (compact)
        sectionTitle("Resumo comparativo")
        autoTable(doc, {
          startY: y,
          headStyles: { fillColor: COLORS.primary, textColor: [255, 255, 255], halign: "left" },
          styles: { font: "helvetica", fontSize: 9, cellPadding: 6 },
          alternateRowStyles: { fillColor: [248, 250, 252] },
          margin: { left: margin, right: margin },
          head: [["Métrica", "Cenário 1", "Cenário 2"]],
          body: [
            ["Ganho Total", formatCurrency(gain1), formatCurrency(gain2)],
            ["Férias", formatCurrency(r1.totalVacations), formatCurrency(r2.totalVacations)],
            ["Benefícios", formatCurrency(r1.totalBenefits), formatCurrency(r2.totalBenefits)],
            ["Indenização", formatCurrency(r1.totalIndenization), formatCurrency(r2.totalIndenization)],
            [
              "Descontos (INSS + IRRF)",
              r1.hasDiscounts ? formatCurrency(r1.totalInss + r1.totalIrrf) : "—",
              r2.hasDiscounts ? formatCurrency(r2.totalInss + r2.totalIrrf) : "—",
            ],
            ["FGTS", formatCurrency(r1.totalFgts), formatCurrency(r2.totalFgts)],
          ],
          didDrawPage: () => {
            footer(doc, pageWidth, pageHeight, margin)
          },
        })

        // Yearly breakdown on separate pages (one table per scenario)
        doc.addPage()
        y = margin
        sectionTitle("Detalhamento: Cenário 1")
        autoTable(doc, {
          startY: y,
          headStyles: { fillColor: COLORS.indigo, textColor: [255, 255, 255], halign: "left" },
          styles: { font: "helvetica", fontSize: 9, cellPadding: 6 },
          alternateRowStyles: { fillColor: [248, 250, 252] },
          margin: { left: margin, right: margin },
          head: [
            [
              "Ano",
              "Salário Mensal",
              "Bruto",
              ...(r1.hasDiscounts ? (["Descontos"] as const) : ([] as const)),
              ...(r1.hasDiscounts ? (["Líquido"] as const) : ([] as const)),
              "FGTS",
            ],
          ],
          body: r1.yearlyData.map((d) => {
            const base = [String(d.year), formatCurrency(d.monthlySalary), formatCurrency(d.grossGains)] as (
              | string
              | number
            )[]
            const middle = r1.hasDiscounts ? [formatCurrency(d.inss + d.irrf), formatCurrency(d.netGains)] : []
            const end = [formatCurrency(d.fgts)]
            return base.concat(middle).concat(end)
          }),
          didDrawPage: () => footer(doc, pageWidth, pageHeight, margin),
        })

        doc.addPage()
        y = margin
        sectionTitle("Detalhamento: Cenário 2")
        autoTable(doc, {
          startY: y,
          headStyles: { fillColor: COLORS.teal, textColor: [255, 255, 255], halign: "left" },
          styles: { font: "helvetica", fontSize: 9, cellPadding: 6 },
          alternateRowStyles: { fillColor: [248, 250, 252] },
          margin: { left: margin, right: margin },
          head: [
            [
              "Ano",
              "Salário Mensal",
              "Bruto",
              ...(r2.hasDiscounts ? (["Descontos"] as const) : ([] as const)),
              ...(r2.hasDiscounts ? (["Líquido"] as const) : ([] as const)),
              "FGTS",
            ],
          ],
          body: r2.yearlyData.map((d) => {
            const base = [String(d.year), formatCurrency(d.monthlySalary), formatCurrency(d.grossGains)] as (
              | string
              | number
            )[]
            const middle = r2.hasDiscounts ? [formatCurrency(d.inss + d.irrf), formatCurrency(d.netGains)] : []
            const end = [formatCurrency(d.fgts)]
            return base.concat(middle).concat(end)
          }),
          didDrawPage: () => footer(doc, pageWidth, pageHeight, margin),
        })
      }

      setProgress(90)
      // Ensure footer on the last page if no table was drawn last
      footer(doc, pageWidth, pageHeight, margin)

      const filename =
        mode === "single" ? `relatorio-calculadora-${period}anos.pdf` : `relatorio-comparativo-${period}anos.pdf`

      setProgress(100)
      doc.save(filename)

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (err) {
      console.error("Erro ao gerar PDF:", err)
    } finally {
      setIsGenerating(false)
      setProgress(0)
    }
  }

  const totalResults = results.length
  const totalPages = mode === "single" ? 1 : 3
  const hasPercentages = results.some((r) => typeof r.percentageOfTotal === "number" && r.percentageOfTotal > 0)

  return (
    <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800">
      <CardContent className="p-4 md:p-6">
        <div className="text-center space-y-4">
          {/* Header */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100">Relatório Profissional</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Exportação completa em PDF</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              {totalResults} {totalResults === 1 ? "cenário" : "cenários"}
            </Badge>
            <Badge
              variant="secondary"
              className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
            >
              {totalPages} {totalPages === 1 ? "página" : "páginas"}
            </Badge>
            {hasPercentages && (
              <Badge
                variant="secondary"
                className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
              >
                Com % personalizada
              </Badge>
            )}
          </div>

          {/* Progress Bar */}
          {isGenerating && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
              <div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Success Message */}
          {showSuccess && (
            <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 mb-4">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">PDF gerado com sucesso!</span>
            </div>
          )}

          {/* Export Button */}
          <Button
            onClick={generatePDF}
            disabled={isGenerating}
            size="lg"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Gerando PDF... {progress}%
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Exportar Relatório PDF
              </>
            )}
          </Button>

          {/* Features List */}
          <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p className="flex items-center justify-center gap-1">
              <Settings className="w-3 h-3" />
              Inclui gráficos, tabelas detalhadas e formatação profissional
            </p>
            {hasPercentages && (
              <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                ✨ Com cálculos de porcentagem personalizados
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function footer(doc: any, pageWidth: number, pageHeight: number, margin: number) {
  const pageCount = doc.getNumberOfPages()
  const pageCurrent = (doc as any).internal.getCurrentPageInfo().pageNumber
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(120, 120, 120)

  // divider line
  doc.setDrawColor(229, 231, 235)
  doc.setLineWidth(0.5)
  doc.line(margin, pageHeight - 36, pageWidth - 36, pageHeight - 36)

  // left: watermark text
  doc.text("Relatório gerado por Calculadora Trabalhista", margin, pageHeight - 18)

  // right: page numbers
  doc.text(`Página ${pageCurrent} de ${pageCount}`, pageWidth - margin, pageHeight - 18, { align: "right" })
}
