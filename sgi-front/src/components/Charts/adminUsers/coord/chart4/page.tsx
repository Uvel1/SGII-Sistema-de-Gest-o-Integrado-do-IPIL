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

// Mapeamento de cores para cada tipo de documento
const colorMap: Record<string, string> = {
  Certificado: "#1d4ed8",    // Azul escuro
  Declaração: "#3b82f6",     // Azul médio
  Transferência: "#22c55e",  // Verde
  Outro: "#f59e0b",          // Laranja
};

export function ChartDocumentosSubmetidosPorTipo() {
  // Supondo que o endpoint retorne um objeto com a propriedade "data"
  // e que "data" seja um array de objetos com { tipo_documento, total }
  const { data, error } = useSWR("http://localhost:3333/chartDocSub", fetcher);

  if (error) return <div>Erro ao carregar dados</div>;
  if (!data) return <div>Carregando...</div>;

  // Garante que os dados estejam encapsulados na propriedade "data"
  const chartData = Array.isArray(data.data) ? data.data : [];
  if (chartData.length === 0) return <div>Formato de dados inesperado.</div>;

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-col items-center">
        <CardTitle>Total de Documentos Submetidos por Tipo</CardTitle>
        <CardDescription>
          Quantidade de documentos submetidos agrupados por tipo.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <PieChart width={300} height={300}>
          <Pie
            data={chartData}
            dataKey="total"
            nameKey="tipo_documento"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colorMap[entry.tipo_documento] || "#ccc"}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </CardContent>
    </Card>
  );
}