import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IComentario } from '../models/comentario.model';
import { IUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  private apiUrl = 'http://localhost:3001/comentario'; 

  constructor(private http: HttpClient) {}

  // Obtener la lista
  getComentario(page: Number, limit: Number): Observable<IComentario[]> {
    return this.http.get<IComentario[]>(`${this.apiUrl}/${page}/${limit}`);
  }

  // Agregar una nueva al backend
  addComentario(Comentario: IComentario): Observable<IComentario> {
    return this.http.post<IComentario>(`${this.apiUrl}/${Comentario.user}`, Comentario);
  }

  // Actualizar un usuario existente
  updateComentario(comentario: IComentario): Observable<IComentario> {
    return this.http.put<IComentario>(`${this.apiUrl}/${comentario._id}`, comentario);
  }

  // Eliminar una por su ID
  deleteComentario(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
