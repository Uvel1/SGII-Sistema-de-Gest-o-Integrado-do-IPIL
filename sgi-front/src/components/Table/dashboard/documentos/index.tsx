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
import { ApagarDocumento } from "@/components/Alerts/apagar/documents";
import axios from "axios";
import { Printer } from "lucide-react";

export type Student = {
  id: number;
  nome: string;
  ano_de_termino: number;
  nome_documento: string;
  tipo_documento: string;
  // Pode-se manter url_documento se necessário, mas neste exemplo usaremos o id
};

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "nome",
    header: "Nome do Aluno",
    cell: ({ row }) => <div>{row.getValue("nome")}</div>,
  },
  {
    accessorKey: "ano_de_termino",
    header: "Ano de Termino",
    cell: ({ row }) => <div>{row.getValue("ano_de_termino")}</div>,
  },
  {
    accessorKey: "nome_documento",
    header: "Nome do Documento",
    cell: ({ row }) => <div>{row.getValue("nome_documento")}</div>,
  },
  {
    accessorKey: "tipo_documento",
    header: "Tipo de Documento",
    cell: ({ row }) => <div>{row.getValue("tipo_documento")}</div>,
  },
  {
    id: "actions",
    header: "Interação",
    cell: ({ row }) => {
      const student = row.original;
      const handlePrint = () => {
        const printUrl = `http://localhost:3333/print/${student.id}`;
        const printWindow = window.open(printUrl, "_blank");
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.print();
          };
        } else {
          console.error("Não foi possível abrir a janela de impressão.");
        }
      };

      return (
        <div className="w-full md:space-x-2 space-y-2 md:space-y-0">
          <Button
            className="h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600"
            onClick={handlePrint}
          >
            <Printer />
          </Button>
          <ApagarDocumento id={student.id} />
        </div>
      );
    },
  },
];

export function TableDocumentosAdmin() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedDocumentos, setSelectedDocumentos] = React.useState("All");
  const [nameFilter, setNameFilter] = React.useState("");
  const [data, setData] = React.useState<Student[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3333/docs`);
        setData(response.data as Student[]);
        console.log("Dados:", response.data);
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      }
    };

    fetchData();
  }, []);

  React.useEffect(() => {
    const socket = new WebSocket("ws://localhost:3333/docs");

    socket.onopen = () => {
      console.log("Conectado ao WebSocket!");
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "updateDocumentos") {
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
      const matchesDocumentos =
        selectedDocumentos === "All" ||
        student.nome_documento === selectedDocumentos;
      const matchesName = student.nome
        .toLowerCase()
        .includes(nameFilter.toLowerCase());

      return matchesDocumentos && matchesName;
    });
  }, [data, selectedDocumentos, nameFilter]);

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
        <div className="flex flex-row items-center py-4 space-x-4 w-full">
          <select
            value={selectedDocumentos}
            onChange={(e) => setSelectedDocumentos(e.target.value)}
            className="border rounded-lg p-2 outline-blue-700"
          >
            <option value="All">Todos anos</option>
            <option value="2017">2017</option>
          </select>
          <Input
            placeholder="Filtrar pelo nome do aluno..."
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="max-w-sm outline-blue-700 border-blue-700"
          />
        </div>
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
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
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
