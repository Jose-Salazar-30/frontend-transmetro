import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Asignacion,
  CatalogosAsignaciones
} from '../models/asignaciones';

@Injectable({
  providedIn: 'root'
})
export class AsignacionesService {

  private apiUrl = 'https://backend-transmetro.onrender.com/api/asignaciones';

  constructor(private http: HttpClient) {}

  obtenerAsignaciones(): Observable<Asignacion[]> {
    return this.http.get<Asignacion[]>(this.apiUrl);
  }

  obtenerAsignacionPorId(id: number): Observable<Asignacion> {
    return this.http.get<Asignacion>(`${this.apiUrl}/${id}`);
  }

  obtenerCatalogos(): Observable<CatalogosAsignaciones> {
    return this.http.get<CatalogosAsignaciones>(`${this.apiUrl}/catalogos`);
  }

  crearAsignacion(asignacion: Asignacion): Observable<Asignacion> {
    return this.http.post<Asignacion>(this.apiUrl, asignacion);
  }

  actualizarAsignacion(id: number, asignacion: Asignacion): Observable<Asignacion> {
    return this.http.put<Asignacion>(`${this.apiUrl}/${id}`, asignacion);
  }

  eliminarAsignacion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}