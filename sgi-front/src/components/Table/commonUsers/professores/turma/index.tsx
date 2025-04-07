"use client";


import { jwtDecode } from "jwt-decode";
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
import axios from "axios";

interface TokenPayload {
  uid: number; // ou o nome correto da propriedade, caso seja diferente
  // outros campos, se houver
}

export type Student = {
  nome_turma: string;
  classe: string;
  sala: string;
  turno: string;
  total_alunos: number;
  curso: string;
  diretor_turma: string;
};

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "nome_turma",
    header: "Turma",
    cell: ({ row }) => <div>{row.getValue("nome_turma")}</div>,
  },
  {
    accessorKey: "classe",
    header: "classe",
    cell: ({ row }) => <div>{row.getValue("classe")}</div>,
  },
  {
    accessorKey: "total_alunos",
    header: "Total de Alunos",
    cell: ({ row }) => <div>{row.getValue("total_alunos")}</div>,
  },
  {
    accessorKey: "sala",
    header: "Sala",
    cell: ({ row }) => <div>{row.getValue("sala")}</div>,
  },
  {
    accessorKey: "turno",
    header: "Turno",
    cell: ({ row }) => <div>{row.getValue("turno")}</div>,
  },
  {
    accessorKey: "curso",
    header: "Curso",
    cell: ({ row }) => <div>{row.getValue("curso")}</div>,
  },
  {
    accessorKey: "diretor_turma",
    header: "Diretor de Turma",
    cell: ({ row }) => <div>{row.getValue("diretor_turma")}</div>,
  },
];

export function TableProfTurma() {
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

      const refreshtoken = localStorage.getItem("refreshToken");
          if (!refreshtoken) {
            throw new Error("Token não encontrado");
          }
  
          const decoded = jwtDecode<TokenPayload>(refreshtoken);
          console.log("Token Decodificado:", decoded);
          const id = decoded.uid;
          console.log("ID Decodificado:", id);
      
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:3333/tabela_prof/${id}`);
          console.log("Dados recebidos:", response.data);
          setData(response.data as Student[]);
        } catch (error) {
          console.error("Erro ao buscar os dados:", error);
        } 
      };
  
      fetchData();
    }, []);

  const filteredData = React.useMemo(() => {
    return data.filter((student) => {
      const matchesTurma =
        selectedTurma === "All" || student.classe === selectedTurma;
      const matchesName = student.turno
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
      <div className="flex items-center py-4 space-x-4">
        <select
          value={selectedTurma}
          onChange={(e) => setSelectedTurma(e.target.value)}
          className="border rounded-lg p-2 outline-blue-700"
        >
          <option value="All">Todas Classes</option>
          <option value="10ª Classe">10ª Classe</option>
          <option value="11ª Classe">11ª Classe</option>
          <option value="12ª Classe">12ª Classe</option>
          <option value="13ª Classe">13ª Classe</option>
        </select>
        <Input
          placeholder="Filtrar por turno..."
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
    </>
  );
}
