"use client";

import * as React from "react";
import useSWR from "swr";
import { Pie, PieChart, Cell, Tooltip, Legend } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Cores para diferentes estados
const colorMap: Record<string, string> = {
  Pendente: "#f59e0b",
  Aprovado: "#22c55e",
  Rejeitado: "#ef4444",
  Processando: "#3b82f6"
};

export function ChartDocumentosSubmetidosPorTipo() {
  const { data, error } = useSWR("http://localhost:3333/Chart_pedidos", fetcher);

  if (error) return <div>Erro ao carregar dados</div>;
  if (!data) return <div>Carregando...</div>;

  const chartData = Array.isArray(data) ? data.map((item: any) => ({
    estado: item.estado,
    total: Number(item.total)
  })) : [];

  if (chartData.length === 0) return <div>Nenhum dado disponível</div>;

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-col items-center">
        <CardTitle>Pedidos por Estado</CardTitle>
        <CardDescription>
          Distribuição de pedidos por estado atual
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <PieChart width={300} height={300}>
          <Pie
            data={chartData}
            dataKey="total"
            nameKey="estado"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colorMap[entry.estado] || "#94a3b8"} 
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </CardContent>
    </Card>
  );
}