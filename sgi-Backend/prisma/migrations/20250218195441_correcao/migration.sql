/*
  Warnings:

  - A unique constraint covering the columns `[numero_bi]` on the table `professor_detalhes` will be added. If there are existing duplicate values, this will fail.
  - Made the column `sexo` on table `aluno_detalhes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `aluno_detalhes` MODIFY `sexo` ENUM('M', 'F') NOT NULL DEFAULT 'M';

-- AlterTable
ALTER TABLE `professor_detalhes` ADD COLUMN `numero_bi` VARCHAR(15) NULL,
    ADD COLUMN `sexo` ENUM('M', 'F') NOT NULL DEFAULT 'M';

-- CreateIndex
CREATE UNIQUE INDEX `numero_bi` ON `professor_detalhes`(`numero_bi`);
