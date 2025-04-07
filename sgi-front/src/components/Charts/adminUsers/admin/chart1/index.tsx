"use client"

import { useEffect, useState } from "react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp } from "lucide-react"

interface SolicitacaoData {
  estado: string
  total: number
}

const chartConfig: ChartConfig = {
  pedidos: {
    label: "Pedidos",
    color: "#1d4ed8",
  },
}

export function Chart1() {
  const [chartData, setChartData] = useState<SolicitacaoData[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:3333/Chart_pedidos")
if (!response.ok) {
  // Se a resposta não for ok, obtenha o texto e logue para depurar
  const errorText = await response.text()
  console.error("Erro na requisição:", errorText)
  return
}
const data = await response.json()

        // Caso haja conversão de BigInt, garantimos que total seja Number.
        const safeData = data.map((row: any) => ({
          estado: row.estado,
          total: Number(row.total),
        }))
        setChartData(safeData)
      } catch (error) {
        console.error("Erro ao buscar dados de solicitações:", error)
      }
    }
    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Pedidos por Estado</CardTitle>
        <CardDescription>
          Quantidade de pedidos agrupados por estado
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarGrid className="fill-[--color-pedidos] opacity-20" gridType="circle" />
            <PolarAngleAxis dataKey="estado" />
            <Radar
              dataKey="total"
              fill="var(--color-pedidos)"
              fillOpacity={0.5}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Atualizado recentemente <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          Dados atualizados em tempo real
        </div>
      </CardFooter>
    </Card>
  )
}
