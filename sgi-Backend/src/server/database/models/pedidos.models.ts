import {documentos_submetidos_tipo_documento} from "@prisma/client";

export interface DocumentosSubmetidos {
    id: number;
    urlDocumento: string;
    nomeDocumento: string;
    tipoDocumento:documentos_submetidos_tipo_documento;
    usuarioId: number;
    createdAt: Date;
    updatedAt: Date;
  }