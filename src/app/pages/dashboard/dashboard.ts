import { Component } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  cards =[
    {
      titulo: 'Líneas',
      valor: 0,
      icono: 'alt_route',
      descripcion: 'Lineas del transmetro registradas'
    },
    {
      titulo: 'Estaciones',
      valor: 36,
      icono: 'location_on',
      descripcion: 'Estaciones asociadas a líneas'
    },
    {
      titulo: 'Buses',
      valor: 58,
      icono: 'directions_bus',
      descripcion: 'Unidades asignadas al servicio'
    },
    {
      titulo: 'Accesos',
      valor: 72,
      icono: 'login',
      descripcion: 'Accesos registrados por estación'
    },
    {
      titulo: 'Pilotos',
      valor: 45,
      icono: 'person',
      descripcion: 'Pilotos registrados en el sistema'
    },
    {
      titulo: 'Guardias',
      valor: 80,
      icono: 'security',
      descripcion: 'Guardias asignados a accesos'
    },
    {
      titulo: 'Alertas',
      valor: 4,
      icono: 'warning',
      descripcion: 'Alertas activas por capacidad'
    },
    {
      titulo: 'Recargas',
      valor: 30,
      icono: 'credit_card',
      descripcion: 'Máquinas de recarga registradas'
    }
  ];
}
