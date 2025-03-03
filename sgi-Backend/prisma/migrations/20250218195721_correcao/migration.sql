/*
  Warnings:

  - Made the column `numero_bi` on table `professor_detalhes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `professor_detalhes` MODIFY `numero_bi` VARCHAR(15) NOT NULL;
