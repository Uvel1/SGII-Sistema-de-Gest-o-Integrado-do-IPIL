"use client";


import { jwtDecode } from "jwt-decode";
import * as React from "react";
import { useRouter } from "next/navigation";
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
import toast from "react-hot-toast";

interface TokenPayload {
  uid: number; // ou o nome correto da propriedade, caso seja diferente
  // outros campos, se houver
}

export type Student = {
  disciplina: string;
  faltas: number;
  mac: number;
  p1: number;
  p2: number;
  md: number;
};

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "disciplina",
    header: "Disciplina",
    cell: ({ row }) => <div>{row.getValue("disciplina")}</div>,
  },
  {
    accessorKey: "faltas",
    header: "Faltas",
    cell: ({ row }) => <div>{row.getValue("faltas")}</div>,
  },
  {
    accessorKey: "mac",
    header: "MAC",
    cell: ({ row }) => <div>{row.getValue("mac")}</div>,
  },
  {
    accessorKey: "p1",
    header: "PP",
    cell: ({ row }) => <div>{row.getValue("p1")}</div>,
  },
  {
    accessorKey: "p2",
    header: "PT",
    cell: ({ row }) => <div>{row.getValue("p2")}</div>,
  },
  {
    accessorKey: "md",
    header: "Média",
    cell: ({ row }) => <div>{row.getValue("md")}</div>,
  },
];

export function TableBoletim() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [nameFilter, setNameFilter] = React.useState("");
  const [data, setData] = React.useState<Student[]>([]);

  

  const router = useRouter(); 

  React.useEffect(() => {

    const refreshtoken = localStorage.getItem("refreshToken");
        if (!refreshtoken) {
          toast.error("Token não encontrado");
          return router.push("/login");
        }

        const decoded = jwtDecode<TokenPayload>(refreshtoken);
        console.log("Token Decodificado:", decoded);
        const id = decoded.uid;
        console.log("ID Decodificado:", id);
    
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3333/tabela_notas/${id}`);
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
      const matchesTurma = student.disciplina
        .toLowerCase()
        .includes(nameFilter.toLowerCase());
      const matchesName = true; // Adjust this logic as needed

      return matchesTurma && matchesName;
    });
  }, [data, nameFilter]);

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
        <Button className="bg-blue-700 font-bold hover:bg-blue-800">Solicitar Notas</Button>
        <Input
          placeholder="Filtrar por disciplina..."
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
