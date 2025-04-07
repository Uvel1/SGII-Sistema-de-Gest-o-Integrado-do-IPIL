import { IUsuario } from "../../models/Users.models";

export const Sigin = async (usuario: Omit<IUsuario,'id'|'nome'|'tipo'|'data_criacao'>): Promise<number|Error> => {

    try {
        
        
        return 1;
    } catch (error) {
     
        console.log(error);
        return Error('Error ao processar a solicitação');
    }

    
    

}