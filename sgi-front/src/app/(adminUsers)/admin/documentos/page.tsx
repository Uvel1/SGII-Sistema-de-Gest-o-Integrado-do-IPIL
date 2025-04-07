import { TableDocumentosAdmin } from "@/components/Table/dashboard/documentos";


export default function DocumentosAdmin() {
    return (
        <>
            <div className="w-full p-2 pt-14 md:pt-2">
                <h2 className="text-2xl font-bold text-blue-700">Documentos</h2>
                <TableDocumentosAdmin></TableDocumentosAdmin>
            </div>
        </>
    )
}