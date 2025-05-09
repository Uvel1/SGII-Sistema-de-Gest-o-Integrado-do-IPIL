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
import { AvatarImage, Avatar, AvatarFallback } from "@/components/ui/avatar";
import axios from "axios";
import { ResponderPedido } from "@/components/Dialog/responderPedidos";

export type Student = {
  id: number;
  nome: string;
  email: string;
  senha: string;
  foto: string;
  tipo: string;
  created_at:number;
  updated_at:number;
};

export const columns: ColumnDef<Student>[] = [
  {
      accessorKey: "foto",
      header: "Foto",
      cell: ({ row }) => {
        let photoUrl = row.getValue("foto") as string;
    
        // Se o valor estiver vazio, use um fallback local (ou uma imagem padrão)
        if (!photoUrl) {
          photoUrl = "/fallback.png";
        } else if (!photoUrl.startsWith("http")) {
          // Se for um caminho relativo, concatene com a URL base
          photoUrl = `http://localhost:3333/uploads/${photoUrl}`;
        }
    
        return (
          <div>
            <Avatar>
              <AvatarImage
                src={photoUrl}
                alt={`Foto de ${row.getValue("nome")}`}
              />
              <AvatarFallback className="bg-blue-700 text-white">
                {(row.getValue("nome") as string)?.[0]?.toUpperCase() || "NA"}
              </AvatarFallback>
            </Avatar>
          </div>
        );
      },
    },
  {
    accessorKey: "nome",
    header: "Nome",
    cell: ({ row }) => <div>{row.getValue("nome")}</div>,
  },
  {
    accessorKey: "Email",
    header: "Email",
    cell: ({ row }) => <div>{row.original.email}</div>,
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
    cell: ({ row }) => <div>{row.getValue("tipo")}</div>,
  },
  {
    id: "actions",
    header: "Interação",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="w-full md:space-x-2 space-y-2 md:space-y-0">
          <DetalhesPedidosRecebidos id={student.id} />
          <ResponderPedido />
          <ApagarPedidoRecebido id={student.id} />
        </div>
      );
    },
  },
];

export function TableUsuarios() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedTipo, setSelectedTipo] = React.useState("All");
  const [nameFilter, setNameFilter] = React.useState("");
  const [data, setData] = React.useState<Student[]>([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3333/tabela_usuarios");
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

    return () => {
      socket.close();
    };
  }, []);

  const filteredData = React.useMemo(() => {
    return data.filter((student) => {
      const matchesTurma = selectedTipo === "All" || student.tipo === selectedTipo;
      const matchesName = student.nome.toLowerCase().includes(nameFilter.toLowerCase());
      return matchesTurma && matchesName;
    });
  }, [data, selectedTipo, nameFilter]);

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
          value={selectedTipo}
          onChange={(e) => setSelectedTipo(e.target.value)}
          className="border rounded-lg p-2 outline-blue-700"
        >
          <option value="All">Todos usuários</option>
          <option value="Secretaria">secretario/a</option>
          <option value="Coordenação">Coordenador/a</option>
          <option value="Professor">Professor/a</option>
          <option value="Aluno">Aluno/a</option>
        </select>
        <Input
          placeholder="Filtrar por nome..."
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
