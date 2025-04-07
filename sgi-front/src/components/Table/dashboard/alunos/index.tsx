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
import { AvatarImage, Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DetalhesAluno } from "@/components/Dialog/detalhes/aluno";
import { ApagarAluno } from "@/components/Alerts/apagar/aluno";
import { EditarAluno } from "@/components/Dialog/editar/aluno";
import { CriarAluno } from "@/components/Dialog/criar/aluno"
import axios from "axios";

export type Student = {
  id: number;
  foto: string;
  numLista: number;
  numProc: number;
  nome: string;
  numBI: string;
  sexo: string;
  email: string;
  mac: number;
  p1: number;
  p2: number;
  pf: number;
  mt: number;
  turma: string;
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
    accessorKey: "numLista",
    header: "Nº",
    cell: ({ row }) => <div>{row.getValue("numLista")}</div>,
  },
  {
    accessorKey: "numProc",
    header: "Proc",
    cell: ({ row }) => <div>{row.getValue("numProc")}</div>,
  },
  {
    accessorKey: "nome",
    header: "Nome",
    cell: ({ row }) => <div>{row.getValue("nome")}</div>,
  },
  {
    accessorKey: "numBI",
    header: "Nº BI",
    cell: ({ row }) => <div>{row.getValue("numBI")}</div>,
  },
  {
    accessorKey: "sexo",
    header: "Sexo",
    cell: ({ row }) => <div>{row.getValue("sexo")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex flex-row items-center justify-center">
        <p className="text-nowrap text-ellipsis overflow-hidden w-28">
          {row.getValue("email")}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "mac",
    header: "MAC",
    cell: ({ row }) => <div>{row.getValue("mac")}</div>,
  },
  {
    accessorKey: "p1",
    header: "P1",
    cell: ({ row }) => <div>{row.getValue("p1")}</div>,
  },
  {
    accessorKey: "p2",
    header: "P2",
    cell: ({ row }) => <div>{row.getValue("p2")}</div>,
  },
  {
    accessorKey: "pf",
    header: "PF",
    cell: ({ row }) => <div>{row.getValue("pf")}</div>,
  },
  {
    accessorKey: "mt",
    header: "MT",
    cell: ({ row }) => <div>{row.getValue("mt")}</div>,
  },
  {
    id: "actions",
    header: "Interação",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="w-full md:space-x-2 space-y-2 md:space-y-0">
          <DetalhesAluno />
          <EditarAluno />
          <ApagarAluno id={student.id} />
        </div>
      );
    },
  },
];


export function TableAlunos() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedTurma, setSelectedTurma] = React.useState("All");
  const [nameFilter, setNameFilter] = React.useState("");
  const [data, setData] = React.useState<Student[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3333/tabela_alunos");
        console.log("Dados recebidos:", response.data);
        setData(response.data as Student[]);
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      }
    };

    fetchData();
  }, []);

  React.useEffect(() => {
      const socket = new WebSocket("ws://localhost:3333/tabela_alunos");
  
      socket.onopen = () => {
        console.log("Conectado ao WebSocket!");
      };
  
      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === "updateAlunos") {
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
      const matchesTurma =
        selectedTurma === "" || student.turma === selectedTurma;
      const matchesName = student.nome
        .toLowerCase()
        .includes(nameFilter.toLowerCase());

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
      <div className="flex flex-col md:flex-row md:items-center py-4 md:space-x-4">
        <div className="flex flex-row items-center py-4 space-x-4 w-full">
          <select
            value={selectedTurma}
            onChange={(e) => setSelectedTurma(e.target.value)}
            className="border rounded-lg p-2 outline-blue-700"
          >
            <option value="null">Selecione um Turma</option>
            <option value="IG10A">IG10A</option>
          </select>
          <Input
            placeholder="Filtrar por turno..."
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="max-w-sm outline-blue-700 border-blue-700"
          />
        </div>
        <CriarAluno></CriarAluno>
      </div>
      <div className="rounded-lg overflow-hidden shadow">
        <Table className="font-normal overflow-hidden">
          <TableHeader className="bg-blue-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-blue-700">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-white font-bold border-r-2 border-white text-center"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
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
      <Button className="font-bold bg-blue-700 hover:bg-blue-800">
        Submeter Notas
      </Button>
    </>
  );
}
