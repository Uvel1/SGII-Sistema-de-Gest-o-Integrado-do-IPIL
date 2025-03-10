/*
  Warnings:

  - Made the column `nome_mae` on table `aluno_detalhes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nome_pai` on table `aluno_detalhes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `aluno_detalhes` MODIFY `nome_mae` VARCHAR(100) NOT NULL,
    MODIFY `nome_pai` VARCHAR(100) NOT NULL;
