"use client";

import * as React from "react";
import useSWR from "swr";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Paleta de cores fixas (hex)
const colorPalette = [
  "#36A2EB",
  "#FF6384",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#D4A373",
  "#8B5CF6",
];

export function ChartAlunosPorArea() {
  const { data, error } = useSWR("http://localhost:3333/chartArea", fetcher);

  // Define os dados padrão enquanto carrega
  const chartData = data && Array.isArray(data.data) ? data.data : [];

  // Obtém as áreas únicas dos dados
  const uniqueAreas = React.useMemo(() => {
    return [...new Set(chartData.map((item: { area: string }) => item.area))];
  }, [chartData]);

  // Mapeia cada área para uma cor da paleta (cíclica)
  const areaColorMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    uniqueAreas.forEach((area, index) => {
      map[area] = colorPalette[index % colorPalette.length];
    });
    return map;
  }, [uniqueAreas]);

  // Adiciona a cor correspondente para cada item
  const areasData = chartData.map((item: { area: string; total: number }) => ({
    ...item,
    fill: areaColorMap[item.area],
  }));

  // Estado para a área ativa. "all" significa que todas serão exibidas.
  const [activeArea, setActiveArea] = React.useState<string>("all");

  React.useEffect(() => {
    // Se a área ativa não estiver presente nos dados, seta a primeira disponível (exceto "all")
    if (
      activeArea !== "all" &&
      chartData.length > 0 &&
      !chartData.some((item: { area: string }) => item.area === activeArea)
    ) {
      setActiveArea(chartData[0].area);
    }
  }, [chartData, activeArea]);

  const activeIndex = React.useMemo(() => {
    if (activeArea === "all") return -1;
    return areasData.findIndex((item) => item.area === activeArea);
  }, [activeArea, areasData]);

  // Total de alunos em todas as áreas (usado no rótulo quando "Todas" estão selecionadas)
  const totalAlunos = React.useMemo(
    () => areasData.reduce((sum, item) => sum + item.total, 0),
    [areasData]
  );

  // Configuração para o chart
  const chartConfig = areasData.reduce((acc: any, areaItem: { area: string; fill: string }) => {
    acc[areaItem.area] = {
      label: areaItem.area,
      color: areaItem.fill,
    };
    return acc;
  }, {});

  // Renderização condicional para erros ou dados inválidos
  if (error) return <div>Erro ao carregar dados</div>;
  if (!data) return <div>Carregando...</div>;
  if (chartData.length === 0) return <div>Formato de dados inesperado.</div>;

  const id = "pie-alunos-por-area";

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Pie Chart - Alunos por Área de Formação</CardTitle>
          <CardDescription>Dados atualizados</CardDescription>
        </div>
        <Select value={activeArea} onValueChange={setActiveArea}>
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Selecione uma área"
          >
            <SelectValue placeholder="Selecione a área" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {/* Opção para visualizar todas as áreas */}
            <SelectItem value="all" className="rounded-lg [&_span]:flex">
              <div className="flex items-center gap-2 text-xs">
                <span
                  className="flex h-3 w-3 shrink-0 rounded-sm"
                  style={{ backgroundColor: "#000" }}
                />
                Todas
              </div>
            </SelectItem>
            {uniqueAreas.map((area) => {
              const config = chartConfig[area];
              if (!config) return null;
              return (
                <SelectItem key={area} value={area} className="rounded-lg [&_span]:flex">
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-sm"
                      style={{ backgroundColor: config.color }}
                    />
                    {config.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={areasData}
              dataKey="total"
              nameKey="area"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={(props: PieSectorDataItem) => {
                const { outerRadius = 0, ...restProps } = props;
                return (
                  <g>
                    <Sector {...restProps} outerRadius={outerRadius + 10} />
                    <Sector
                      {...restProps}
                      outerRadius={outerRadius + 25}
                      innerRadius={outerRadius + 12}
                    />
                  </g>
                );
              }}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    if (activeArea === "all") {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalAlunos.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Alunos
                          </tspan>
                        </text>
                      );
                    } else if (areasData[activeIndex]) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {areasData[activeIndex].total.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Alunos
                          </tspan>
                        </text>
                      );
                    }
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
