"use client";
import { jwtDecode } from "jwt-decode";
import * as React from "react";
import axios from "axios";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
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

interface TokenPayload {
  uid: number;
  // outros campos, se houver
}

export type Student = {
  id: string;
  numLista: number;
  numProc: number;
  nome: string;
  sexo: string;
  mac: number;
  p1: number;
  p2: number;
  pf: number;
  mt: number;
  faltas: number;
  turma: string;
};

export function TableNotas() {
  const [students, setStudents] = React.useState<Student[]>([]);
  const [loading, setLoading] = React.useState(true);

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
        const response = await axios.get(`http://localhost:3333/tabela_turmas/${id}`);
        const data = response.data.map((aluno: any, index: number) => ({
          id: aluno.id.toString(),
          numLista: aluno.n_lista, // número do aluno conforme a base (n_lista)
          numProc: aluno.numProc,
          nome: aluno.nome,
          sexo: aluno.sexo,
          mac: aluno.mac,
          p1: aluno.p1,
          p2: aluno.p2,
          pf: aluno.pf,
          mt: aluno.mt,
          faltas: aluno.faltas,
          turma: aluno.turma,
        }));
        setStudents(data);
        console.log("Dados dos alunos:", data);
      } catch (error) {
        console.error("Erro ao buscar dados dos alunos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (
    id: string,
    field: keyof Student,
    value: string
  ) => {
    let numericValue = parseFloat(value.replace(/[^0-9]/g, "")) || 0;
    if (numericValue < 0) numericValue = 0;
    if (numericValue > 20) numericValue = 20;

    setStudents((prev) =>
      prev.map((student) =>
        student.id === id
          ? {
              ...student,
              [field]: numericValue,
              mt:
                field === "mt"
                  ? student.mt
                  : parseFloat(calculateAverage(student, field, numericValue)),
            }
          : student
      )
    );
  };

  const calculateAverage = (
    student: Student,
    field: keyof Student,
    value: number
  ) => {
    const updatedStudent = { ...student, [field]: value };
    const { mac, p1, p2, pf } = updatedStudent;
    return ((mac + p1 + p2 + pf) / 4).toFixed(2);
  };

  const columns: ColumnDef<Student>[] = [
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
      accessorKey: "sexo",
      header: "Sexo",
      cell: ({ row }) => <div>{row.getValue("sexo")}</div>,
    },
    {
      accessorKey: "mac",
      header: "MAC",
      cell: ({ row }) => (
        <Input
          type="text"
          className="w-14"
          value={row.original.mac}
          onInput={(e) => {
            const input = e.target as HTMLInputElement;
            input.value = input.value.replace(/[^0-9]/g, "");
          }}
          onChange={(e) =>
            handleInputChange(row.original.id, "mac", e.target.value)
          }
        />
      ),
    },
    {
      accessorKey: "p1",
      header: "P1",
      cell: ({ row }) => (
        <Input
          type="text"
          className="w-14"
          value={row.original.p1}
          onInput={(e) => {
            const input = e.target as HTMLInputElement;
            input.value = input.value.replace(/[^0-9]/g, "");
          }}
          onChange={(e) =>
            handleInputChange(row.original.id, "p1", e.target.value)
          }
        />
      ),
    },
    {
      accessorKey: "p2",
      header: "P2",
      cell: ({ row }) => (
        <Input
          type="text"
          className="w-14"
          value={row.original.p2}
          onInput={(e) => {
            const input = e.target as HTMLInputElement;
            input.value = input.value.replace(/[^0-9]/g, "");
          }}
          onChange={(e) =>
            handleInputChange(row.original.id, "p2", e.target.value)
          }
        />
      ),
    },
    {
      accessorKey: "pf",
      header: "PF",
      cell: ({ row }) => (
        <Input
          type="text"
          className="w-14"
          value={row.original.pf}
          onInput={(e) => {
            const input = e.target as HTMLInputElement;
            input.value = input.value.replace(/[^0-9]/g, "");
          }}
          onChange={(e) =>
            handleInputChange(row.original.id, "pf", e.target.value)
          }
        />
      ),
    },
    {
      accessorKey: "mt",
      header: "MT",
      cell: ({ row }) => <div>{row.original.mt}</div>,
    },
    {
      accessorKey: "faltas",
      header: "Faltas",
      cell: ({ row }) => (
        <Input
          type="text"
          className="w-14"
          value={row.original.faltas}
          onInput={(e) => {
            const input = e.target as HTMLInputElement;
            input.value = input.value.replace(/[^0-9]/g, "");
          }}
          onChange={(e) =>
            handleInputChange(row.original.id, "faltas", e.target.value)
          }
        />
      ),
    },
    {
      accessorKey: "turma",
      header: "Turma",
      cell: ({ row }) => <div>{row.getValue("turma")}</div>,
    },
  ];

  const table = useReactTable({
    data: students,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <div className="rounded-lg overflow-hidden shadow">
        <Table className="font-normal overflow-hidden">
          <TableHeader className="bg-blue-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
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
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          className="font-bold bg-blue-700 hover:bg-blue-800"
          onClick={() => console.log(students)}
        >
          Submeter Notas
        </Button>
      </div>
    </>
  );
}
