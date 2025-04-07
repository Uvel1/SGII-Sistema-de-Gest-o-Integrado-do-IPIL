/*
  Warnings:

  - A unique constraint covering the columns `[usuario_id]` on the table `professores_detalhes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[numero_bi]` on the table `professores_detalhes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `numero_bi` to the `professores_detalhes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `professores_detalhes` ADD COLUMN `numero_bi` VARCHAR(15) NOT NULL,
    ADD COLUMN `sexo` ENUM('M', 'F') NULL;

-- CreateTable
CREATE TABLE `_AlunosProfessoresDisciplina` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_AlunosProfessoresDisciplina_AB_unique`(`A`, `B`),
    INDEX `_AlunosProfessoresDisciplina_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `professores_detalhes_usuario_id_key` ON `professores_detalhes`(`usuario_id`);

-- CreateIndex
CREATE UNIQUE INDEX `numero_bi` ON `professores_detalhes`(`numero_bi`);

-- AddForeignKey
ALTER TABLE `alunos` ADD CONSTRAINT `alunos_curso_id_fkey` FOREIGN KEY (`curso_id`) REFERENCES `cursos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notas` ADD CONSTRAINT `notas_aluno_id_fkey` FOREIGN KEY (`aluno_id`) REFERENCES `alunos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `professores_detalhes` ADD CONSTRAINT `professores_detalhes_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `professores_detalhes` ADD CONSTRAINT `professores_detalhes_aluno_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `alunos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `professores_disciplina` ADD CONSTRAINT `professores_disciplina_professor_id_fkey` FOREIGN KEY (`professor_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `professores_disciplina` ADD CONSTRAINT `professores_disciplina_disciplina_id_fkey` FOREIGN KEY (`disciplina_id`) REFERENCES `disciplinas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitacao_aluno` ADD CONSTRAINT `solicitacao_aluno_aluno_id_fkey` FOREIGN KEY (`aluno_id`) REFERENCES `alunos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `turma_alunos` ADD CONSTRAINT `turma_alunos_turma_id_fkey` FOREIGN KEY (`turma_id`) REFERENCES `turmas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `turma_alunos` ADD CONSTRAINT `turma_alunos_aluno_id_fkey` FOREIGN KEY (`aluno_id`) REFERENCES `alunos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AlunosProfessoresDisciplina` ADD CONSTRAINT `_AlunosProfessoresDisciplina_A_fkey` FOREIGN KEY (`A`) REFERENCES `alunos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AlunosProfessoresDisciplina` ADD CONSTRAINT `_AlunosProfessoresDisciplina_B_fkey` FOREIGN KEY (`B`) REFERENCES `professores_disciplina`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
