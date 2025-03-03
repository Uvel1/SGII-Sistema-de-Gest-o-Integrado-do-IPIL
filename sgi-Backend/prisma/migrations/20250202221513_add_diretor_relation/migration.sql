-- AddForeignKey
ALTER TABLE `turmas` ADD CONSTRAINT `turmas_diretorTurma_id_fkey` FOREIGN KEY (`diretorTurma_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
