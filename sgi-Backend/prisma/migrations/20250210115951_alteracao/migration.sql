/*
  Warnings:

  - You are about to drop the column `faltas` on the `notas` table. All the data in the column will be lost.
  - You are about to alter the column `classe` on the `turmas` table. The data in that column could be lost. The data in that column will be cast from `VarChar(15)` to `Enum(EnumId(7))`.
  - You are about to drop the column `created_at` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the `_alunosprofessoresdisciplina` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `alunos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `professores_detalhes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `solicitacao_usuario` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tipo_de_usuario` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_alunosprofessoresdisciplina` DROP FOREIGN KEY `_AlunosProfessoresDisciplina_A_fkey`;

-- DropForeignKey
ALTER TABLE `_alunosprofessoresdisciplina` DROP FOREIGN KEY `_AlunosProfessoresDisciplina_B_fkey`;

-- DropForeignKey
ALTER TABLE `alunos` DROP FOREIGN KEY `alunos_curso_id_fkey`;

-- DropForeignKey
ALTER TABLE `notas` DROP FOREIGN KEY `notas_aluno_id_fkey`;

-- DropForeignKey
ALTER TABLE `professores_detalhes` DROP FOREIGN KEY `professores_detalhes_usuario_id_fkey`;

-- DropForeignKey
ALTER TABLE `professores_disciplina` DROP FOREIGN KEY `professores_disciplina_disciplina_id_fkey`;

-- DropForeignKey
ALTER TABLE `professores_disciplina` DROP FOREIGN KEY `professores_disciplina_professor_id_fkey`;

-- DropForeignKey
ALTER TABLE `solicitacao_aluno` DROP FOREIGN KEY `solicitacao_aluno_aluno_id_fkey`;

-- DropForeignKey
ALTER TABLE `turma_alunos` DROP FOREIGN KEY `turma_alunos_aluno_id_fkey`;

-- DropForeignKey
ALTER TABLE `turma_alunos` DROP FOREIGN KEY `turma_alunos_turma_id_fkey`;

-- DropForeignKey
ALTER TABLE `turmas` DROP FOREIGN KEY `turmas_diretorTurma_id_fkey`;

-- AlterTable
ALTER TABLE `notas` DROP COLUMN `faltas`;

-- AlterTable
ALTER TABLE `solicitacao_aluno` MODIFY `tipo` ENUM('Certificado', 'Declaracao', 'Transferencia', 'Outros') NOT NULL;

-- AlterTable
ALTER TABLE `turmas` MODIFY `diretorTurma_id` INTEGER NULL,
    MODIFY `classe` ENUM('10ª Classe', '11ª Classe', '12ª Classe', '13ª Classe') NOT NULL;

-- AlterTable
ALTER TABLE `usuarios` DROP COLUMN `created_at`,
    DROP COLUMN `tipo`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `create_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `foto_perfil` VARCHAR(255) NULL,
    ADD COLUMN `tipo_de_usuario` ENUM('Secretaria', 'Coordenação', 'Professor', 'Aluno') NOT NULL,
    ADD COLUMN `update_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `nome` VARCHAR(150) NOT NULL,
    MODIFY `senha` VARCHAR(255) NULL;

-- DropTable
DROP TABLE `_alunosprofessoresdisciplina`;

-- DropTable
DROP TABLE `alunos`;

-- DropTable
DROP TABLE `professores_detalhes`;

-- DropTable
DROP TABLE `solicitacao_usuario`;

-- CreateTable
CREATE TABLE `aluno_detalhes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero_processo` INTEGER NOT NULL,
    `numero_bi` VARCHAR(15) NOT NULL,
    `sexo` ENUM('M', 'F') NULL DEFAULT 'M',
    `data_nasc` DATE NOT NULL,
    `aluno_id` INTEGER NOT NULL,
    `curso_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `numero_processo`(`numero_processo`),
    UNIQUE INDEX `numero_bi`(`numero_bi`),
    INDEX `aluno_id`(`aluno_id`),
    INDEX `curso_id`(`curso_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `professor_detalhes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `cargo` ENUM('Professor', 'Dir. Turma', 'Coordenador') NULL DEFAULT 'Professor',
    `telefone` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `usuario_id`(`usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `solicitacao_escola` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `descricao` TEXT NOT NULL,
    `estado` ENUM('Pendente', 'Aprovado', 'Rejeitado') NULL DEFAULT 'Pendente',
    `data_solicitacao` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `data_resolucao` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `usuario_id`(`usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
