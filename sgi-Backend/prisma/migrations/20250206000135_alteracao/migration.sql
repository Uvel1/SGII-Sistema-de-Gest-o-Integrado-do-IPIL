/*
  Warnings:

  - You are about to drop the column `faltas` on the `alunos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `alunos` DROP COLUMN `faltas`;

-- AlterTable
ALTER TABLE `notas` ADD COLUMN `faltas` INTEGER NOT NULL DEFAULT 0;
