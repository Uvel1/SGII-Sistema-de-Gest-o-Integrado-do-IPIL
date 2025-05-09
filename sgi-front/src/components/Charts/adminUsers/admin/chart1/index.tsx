"use client"

import { useEffect, useState } from "react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp } from "lucide-react"

interface DocumentoData {
  tipo_documento: string
  total: number
}

const chartConfig: ChartConfig = {
  documentos: {
    label: "Documentos",
    color: "#1d4ed8",
  },
}

export function Chart1() {
  const [chartData, setChartData] = useState<DocumentoData[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:3333/chartDocSub")
        if (!response.ok) {
          const errorText = await response.text()
          console.error("Erro na requisição:", errorText)
          return
        }
        const data = await response.json()
        
        const safeData = data.data.map((row: any) => ({
          tipo_documento: row.tipo_documento,
          total: Number(row.total),
        }))
        setChartData(safeData)
      } catch (error) {
        console.error("Erro ao buscar dados de documentos:", error)
      }
    }
    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Documentos por Tipo</CardTitle>
        <CardDescription>
          Quantidade de documentos submetidos por tipo
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarGrid className="fill-[--color-documentos] opacity-20" gridType="circle" />
            <PolarAngleAxis dataKey="tipo_documento" />
            <Radar
              dataKey="total"
              fill="var(--color-documentos)"
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