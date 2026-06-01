import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Tarjeta } from '../models/tarjetas';

@Injectable({
  providedIn: 'root'
})
export class TarjetasService {

  private apiUrl = 'http://localhost:3000/api/tarjetas';

  constructor(private http: HttpClient) {}

  obtenerTarjetas(): Observable<Tarjeta[]> {
    return this.http.get<Tarjeta[]>(this.apiUrl);
  }

  obtenerTarjetaPorId(id: number): Observable<Tarjeta> {
    return this.http.get<Tarjeta>(`${this.apiUrl}/${id}`);
  }

  crearTarjeta(tarjeta: Tarjeta): Observable<Tarjeta> {
    return this.http.post<Tarjeta>(this.apiUrl, tarjeta);
  }

  actualizarTarjeta(id: number, tarjeta: Tarjeta): Observable<Tarjeta> {
    return this.http.put<Tarjeta>(`${this.apiUrl}/${id}`, tarjeta);
  }

  eliminarTarjeta(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}