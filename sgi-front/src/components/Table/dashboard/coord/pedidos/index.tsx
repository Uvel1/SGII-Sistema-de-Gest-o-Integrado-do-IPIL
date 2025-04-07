"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DetalhesPedidosRecebidos } from "@/components/Dialog/detalhes/pedido/recebido";
import { ApagarPedidoRecebido } from "@/components/Alerts/apagar/pedidos/recebido";
import axios from "axios";
import { ResponderPedido } from "@/components/Dialog/responderPedidos";

// Acrescentamos a propriedade "id" para identificação única do registro
export type Student = {
  id: number;
  tipo: string;
  estado: string;
  aluno: {
    nome: string;
    numero_bi: string;
    email: string;
    curso: {
      nome: string;
    };
  };
};

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "tipo",
    header: "Tipo",
    cell: ({ row }) => <div>{row.getValue("tipo")}</div>,
  },
  {
    accessorKey: "aluno.nome",
    header: "Nome",
    cell: ({ row }) => <div>{row.original.aluno.nome}</div>,
  },
  {
    accessorKey: "aluno.numero_bi",
    header: "Nº BI",
    cell: ({ row }) => <div>{row.original.aluno.numero_bi}</div>,
  },
  {
    accessorKey: "aluno.email",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex flex-row items-center justify-center">
        <p className="text-nowrap text-ellipsis overflow-hidden w-28">
          {row.original.aluno.email}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "aluno.curso.nome",
    header: "Curso",
    cell: ({ row }) => <div>{row.original.aluno.curso.nome}</div>,
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => <div>{row.getValue("estado")}</div>,
  },
  {
    id: "actions",
    header: "Interação",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="w-full md:space-x-2 space-y-2 md:space-y-0">
          <DetalhesPedidosRecebidos />
          <ResponderPedido />
          {/* Aqui passamos o id da linha para o componente de deleção */}
          <ApagarPedidoRecebido id={student.id} />
        </div>
      );
    },
  },
];

export function TableCoordPedidos() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedTurma, setSelectedTurma] = React.useState("All");
  const [nameFilter, setNameFilter] = React.useState("");
  const [data, setData] = React.useState<Student[]>([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3333/tabela_pedidos_alunos");
      setData(response.data as Student[]);
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  React.useEffect(() => {
    const socket = new WebSocket("ws://localhost:3333/tabela_pedidos_alunos");

    socket.onopen = () => {
      console.log("Conectado ao WebSocket!");
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "updateSolicitacoes") {
          console.log("Atualização recebida via WebSocket:", message.data);
          setData(message.data);
        }
      } catch (error) {
        console.error("Erro ao processar a mensagem do WebSocket:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("Erro na conexão WebSocket:", error);
    };

    return () => {
      socket.close();
    };
  }, []);

  const filteredData = React.useMemo(() => {
    return data.filter((student) => {
      const matchesTurma = selectedTurma === "All" || student.tipo === selectedTurma;
      const matchesName = student.tipo.toLowerCase().includes(nameFilter.toLowerCase());
      return matchesTurma && matchesName;
    });
  }, [data, selectedTurma, nameFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between py-4 md:space-x-4">
        <select
          value={selectedTurma}
          onChange={(e) => setSelectedTurma(e.target.value)}
          className="border rounded-lg p-2 outline-blue-700"
        >
          <option value="All">Todos Pedidos</option>
          <option value="Certificado">Certificados</option>
          <option value="Declaracao">Declarações</option>
          <option value="Transferência">Transferências</option>
          <option value="Outros">Outros</option>
        </select>
        <Input
          placeholder="Filtrar por tipo..."
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="max-w-sm outline-blue-700 border-blue-700"
        />
      </div>
      <div className="rounded-lg overflow-hidden shadow">
        <Table className="font-normal overflow-hidden">
          <TableHeader className="bg-blue-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-blue-700">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-white font-bold border-r-2 border-white text-center"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={
                    row.index % 2 === 0
                      ? "bg-white hover:bg-white"
                      : "bg-blue-400 hover:bg-blue-400"
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="border-r-2 text-center">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
        </div>
        <div className="space-x-2">
          <Button
            className="bg-blue-700 font-semibold hover:bg-blue-800"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            className="bg-blue-700 font-semibold hover:bg-blue-800"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próximo
          </Button>
        </div>
      </div>
    </>
  );
}
