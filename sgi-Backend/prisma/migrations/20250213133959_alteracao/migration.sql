/*
  Warnings:

  - The values [Declaracao,Transferencia] on the enum `documentos_submetidos_tipo_documento` will be removed. If these variants are still used in the database, this will fail.
  - The values [Dir. Turma] on the enum `professor_detalhes_cargo` will be removed. If these variants are still used in the database, this will fail.
  - The values [Declaracao,Transferencia] on the enum `solicitacao_aluno_tipo` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `documentos_submetidos` MODIFY `tipo_documento` ENUM('Certificado', 'Declaração', 'Transferência', 'Outro') NOT NULL;

-- AlterTable
ALTER TABLE `professor_detalhes` MODIFY `cargo` ENUM('Professor', 'Dir_Turma', 'Coordenador') NULL DEFAULT 'Professor';

-- AlterTable
ALTER TABLE `solicitacao_aluno` MODIFY `tipo` ENUM('Certificado', 'Declaração', 'Transferência', 'Outros') NOT NULL;
