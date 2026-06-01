import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Unidad {
  id?: number;
  codigo: string;
  placa: string;
  modelo: string;
  capacidad: number;
  linea_id: number;
  linea_nombre?: string;
  estado: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UnidadesService {

  private apiUrl = 'http://localhost:3000/api/unidades';

  constructor(private http: HttpClient) { }

  obtenerUnidades(): Observable<Unidad[]> {
    return this.http.get<Unidad[]>(this.apiUrl);
  }

  crearUnidad(unidad: Unidad): Observable<any> {
    return this.http.post(this.apiUrl, unidad);
  }

  actualizarUnidad(id: number, unidad: Unidad): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, unidad);
  }

  eliminarUnidad(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}