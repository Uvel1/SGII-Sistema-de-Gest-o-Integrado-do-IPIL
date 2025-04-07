"use client"

import { useEffect, useState } from 'react'
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  recebidos: {
    label: "Recebidos",
    color: "#1d4ed8",
  },
  enviados: {
    label: "Enviados",
    color: "#3b82f6",
  },
} satisfies ChartConfig

export function Chart3() {
  const [chartData, setChartData] = useState([{ recebidos: 0, enviados: 0 }])

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('http://localhost:3333/chart2')
        if (!res.ok) throw new Error('Erro ao buscar os dados')
        const result = await res.json()

        // Transforma o array retornado pela rota para o formato esperado
        let totalRecebidos = 0
        let totalEnviados = 0

        result.forEach((row: { estado: string; total: number }) => {
          totalRecebidos += row.total
          if (row.estado !== 'Pendente') {
            totalEnviados += row.total
          }
        })

        setChartData([{ recebidos: totalRecebidos, enviados: totalEnviados }])
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  const totalPedidos = chartData[0].recebidos + chartData[0].enviados

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-col items-center justify-center">
        <CardTitle>Total de Pedidos</CardTitle>
        <CardDescription className="text-center">
          Total de Pedidos Recebidos e Enviados num certo período
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[200px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalPedidos.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Total de Pedidos
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="recebidos"
              stackId="a"
              cornerRadius={5}
              fill={chartConfig.recebidos.color}
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="enviados"
              fill={chartConfig.enviados.color}
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
        <div className="absolute top-[350px] space-x-12 flex flex-row">
          <span className="flex flex-row items-center justify-center">
            {chartConfig.recebidos.label}
            <div className="w-4 h-4 rounded-md bg-blue-700 ml-2"></div>
          </span>
          <span className="flex flex-row items-center justify-center">
            {chartConfig.enviados.label}
            <div className="w-4 h-4 rounded-md bg-blue-500 ml-2"></div>
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
