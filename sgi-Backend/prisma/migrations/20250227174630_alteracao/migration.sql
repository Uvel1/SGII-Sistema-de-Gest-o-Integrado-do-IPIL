/*
  Warnings:

  - You are about to drop the column `n_lista` on the `notas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `aluno_detalhes` ADD COLUMN `n_lista` INTEGER NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `notas` DROP COLUMN `n_lista`;
