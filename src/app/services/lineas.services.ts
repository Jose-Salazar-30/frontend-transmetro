import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Linea {
  id?: number;
  nombre: string;
  color: string;
  origen: string;
  destino: string;
  estado: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LineasService {

  private apiUrl = 'https://backend-transmetro.onrender.com/api/lineas';

  constructor(private http: HttpClient) { }

  obtenerLineas(): Observable<Linea[]> {
    return this.http.get<Linea[]>(this.apiUrl);
  }

  crearLinea(linea: Linea): Observable<any> {
    return this.http.post(this.apiUrl, linea);
  }

  actualizarLinea(id: number, linea: Linea): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, linea);
  }

  eliminarLinea(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}