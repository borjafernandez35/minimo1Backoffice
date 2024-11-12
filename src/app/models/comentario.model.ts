export interface IComentario {
    _id?: string;      // MongoDB genera automáticamente este campo al insertar
    user: string;
    likes: number;     
    description: string;
   
    
  }