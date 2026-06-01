import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import Swal from 'sweetalert2';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';

import { EstacionesService, Estacion } from '../../services/estaciones.services';
import { LineasService, Linea } from '../../services/lineas.services';

@Component({
  selector: 'app-estaciones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatChipsModule
  ],
  templateUrl: './estaciones.html',
  styleUrl: './estaciones.css'
})
export class EstacionesComponent implements OnInit {

  displayedColumns: string[] = [
    'id',
    'nombre',
    'ubicacion',
    'linea_nombre',
    'estado',
    'acciones'
  ];

  dataSource = new MatTableDataSource<Estacion>([]);
  lineas: Linea[] = [];

  nuevaEstacion: Estacion = {
    nombre: '',
    ubicacion: '',
    linea_id: 0,
    estado: true
  };

  estacionEditando: Estacion | null = null;
  cargando = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private estacionesService: EstacionesService,
    private lineasService: LineasService
  ) {}

  ngOnInit(): void {
    this.cargarLineas();
    this.cargarEstaciones();
  }

  cargarLineas(): void {
    this.lineasService.obtenerLineas().subscribe({
      next: (data: Linea[]) => {
        this.lineas = data;
      },
      error: (error: any) => {
        console.error('Error al cargar líneas:', error);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las líneas'
        });
      }
    });
  }

  cargarEstaciones(): void {
    this.cargando = true;

    this.estacionesService.obtenerEstaciones().subscribe({
      next: (data: Estacion[]) => {
        this.dataSource.data = data;

        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });

        this.cargando = false;
      },
      error: (error: any) => {
        console.error('Error al cargar estaciones:', error);
        this.cargando = false;

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las estaciones'
        });
      }
    });
  }

  aplicarFiltro(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.dataSource.filter = valor.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  guardarEstacion(): void {
    if (
      !this.nuevaEstacion.nombre ||
      !this.nuevaEstacion.ubicacion ||
      !this.nuevaEstacion.linea_id
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Completa todos los campos antes de guardar'
      });
      return;
    }

    this.estacionesService.crearEstacion(this.nuevaEstacion).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Guardado',
          text: 'La estación fue registrada correctamente',
          timer: 1800,
          showConfirmButton: false
        });

        this.cargarEstaciones();
        this.limpiarFormulario();
      },
      error: (error: any) => {
        console.error('Error al guardar estación:', error);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo guardar la estación'
        });
      }
    });
  }

  editarEstacion(estacion: Estacion): void {
    this.estacionEditando = { ...estacion };

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  actualizarEstacion(): void {
    if (!this.estacionEditando || !this.estacionEditando.id) {
      return;
    }

    if (
      !this.estacionEditando.nombre ||
      !this.estacionEditando.ubicacion ||
      !this.estacionEditando.linea_id
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Completa todos los campos antes de actualizar'
      });
      return;
    }

    this.estacionesService.actualizarEstacion(
      this.estacionEditando.id,
      this.estacionEditando
    ).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'La estación fue actualizada correctamente',
          timer: 1800,
          showConfirmButton: false
        });

        this.cargarEstaciones();
        this.estacionEditando = null;
      },
      error: (error: any) => {
        console.error('Error al actualizar estación:', error);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar la estación'
        });
      }
    });
  }

  eliminarEstacion(id: number | undefined): void {
    if (!id) {
      return;
    }

    Swal.fire({
      icon: 'warning',
      title: '¿Eliminar estación?',
      text: 'Esta acción eliminará el registro seleccionado',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        this.estacionesService.eliminarEstacion(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'La estación fue eliminada correctamente',
              timer: 1800,
              showConfirmButton: false
            });

            this.cargarEstaciones();
          },
          error: (error: any) => {
            console.error('Error al eliminar estación:', error);

            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar la estación'
            });
          }
        });
      }
    });
  }

  cancelarEdicion(): void {
    this.estacionEditando = null;
  }

  limpiarFormulario(): void {
    this.nuevaEstacion = {
      nombre: '',
      ubicacion: '',
      linea_id: 0,
      estado: true
    };
  }
}