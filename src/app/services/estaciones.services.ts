import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Estacion {
  id?: number;
  nombre: string;
  ubicacion: string;
  linea_id: number;
  linea_nombre?: string;
  estado: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EstacionesService {

  private apiUrl = 'http://localhost:3000/api/estaciones';

  constructor(private http: HttpClient) { }

  obtenerEstaciones(): Observable<Estacion[]> {
    return this.http.get<Estacion[]>(this.apiUrl);
  }

  crearEstacion(estacion: Estacion): Observable<any> {
    return this.http.post(this.apiUrl, estacion);
  }

  actualizarEstacion(id: number, estacion: Estacion): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, estacion);
  }

  eliminarEstacion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}