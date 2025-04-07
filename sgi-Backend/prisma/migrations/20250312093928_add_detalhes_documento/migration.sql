-- AlterTable
ALTER TABLE `aluno_detalhes` ADD COLUMN `data_emissao_bi` DATE NULL,
    ADD COLUMN `local_emissao_bi` VARCHAR(100) NULL,
    ADD COLUMN `local_nascimento` VARCHAR(100) NULL;
