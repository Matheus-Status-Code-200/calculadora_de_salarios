"use client"

import { useEffect, useRef } from "react"
import { Chart, type ChartConfiguration, registerables } from "chart.js"
import { formatCurrency } from "@/lib/utils"

Chart.register(...registerables)

interface ComparisonChartProps {
  data: number[]
}

export default function ComparisonChart({ data }: ComparisonChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy()
    }

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    const config: ChartConfiguration = {
      type: "bar",
      data: {
        labels: ["Cenário 1", "Cenário 2"],
        datasets: [
          {
            label: "Ganho Total no Período",
            data: data,
            backgroundColor: ["rgba(99, 102, 241, 0.8)", "rgba(15, 118, 110, 0.8)"],
            borderColor: ["rgb(99, 102, 241)", "rgb(15, 118, 110)"],
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "white",
            bodyColor: "white",
            borderColor: "rgba(255, 255, 255, 0.1)",
            borderWidth: 1,
            cornerRadius: 8,
            callbacks: {
              label: (context) => `Ganho Total: ${formatCurrency(context.parsed.y)}`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.1)",
            },
            ticks: {
              callback: (value) => formatCurrency(Number(value)),
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
        animation: {
          duration: 1000,
          easing: "easeOutQuart",
        },
      },
    }

    chartRef.current = new Chart(ctx, config)

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, [data])

  return (
    <div className="relative h-80">
      <canvas ref={canvasRef} />
    </div>
  )
}
