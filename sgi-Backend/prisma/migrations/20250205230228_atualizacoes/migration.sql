/*
  Warnings:

  - The values [Admim] on the enum `usuarios_tipo` will be removed. If these variants are still used in the database, this will fail.

*/
-- DropForeignKey
ALTER TABLE `professores_detalhes` DROP FOREIGN KEY `professores_detalhes_aluno_id_fkey`;

-- AlterTable
ALTER TABLE `alunos` ADD COLUMN `faltas` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `usuarios` MODIFY `tipo` ENUM('Admin', 'Coordenacao', 'Professor') NOT NULL;
