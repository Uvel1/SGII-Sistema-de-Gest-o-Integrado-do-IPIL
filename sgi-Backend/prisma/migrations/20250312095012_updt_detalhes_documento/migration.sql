/*
  Warnings:

  - Made the column `data_emissao_bi` on table `aluno_detalhes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `local_emissao_bi` on table `aluno_detalhes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `local_nascimento` on table `aluno_detalhes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `aluno_detalhes` MODIFY `data_emissao_bi` DATE NOT NULL,
    MODIFY `local_emissao_bi` VARCHAR(100) NOT NULL,
    MODIFY `local_nascimento` VARCHAR(100) NOT NULL;
