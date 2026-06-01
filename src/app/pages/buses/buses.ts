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

import { UnidadesService, Unidad } from '../../services/unidades.services';
import { LineasService, Linea } from '../../services/lineas.services';

@Component({
  selector: 'app-unidades',
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
  templateUrl: './buses.html',
  styleUrl: './buses.css'
})
export class UnidadesComponent implements OnInit {

  displayedColumns: string[] = [
    'id',
    'codigo',
    'placa',
    'modelo',
    'capacidad',
    'linea_nombre',
    'estado',
    'acciones'
  ];

  dataSource = new MatTableDataSource<Unidad>([]);
  lineas: Linea[] = [];

  nuevaUnidad: Unidad = {
    codigo: '',
    placa: '',
    modelo: '',
    capacidad: 0,
    linea_id: 0,
    estado: true
  };

  unidadEditando: Unidad | null = null;
  cargando = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private unidadesService: UnidadesService,
    private lineasService: LineasService
  ) {}

  ngOnInit(): void {
    this.cargarLineas();
    this.cargarUnidades();
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

  cargarUnidades(): void {
    this.cargando = true;

    this.unidadesService.obtenerUnidades().subscribe({
      next: (data: Unidad[]) => {
        this.dataSource.data = data;

        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });

        this.cargando = false;
      },
      error: (error: any) => {
        console.error('Error al cargar unidades:', error);
        this.cargando = false;

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las unidades'
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

  guardarUnidad(): void {
    if (
      !this.nuevaUnidad.codigo ||
      !this.nuevaUnidad.placa ||
      !this.nuevaUnidad.modelo ||
      !this.nuevaUnidad.capacidad ||
      !this.nuevaUnidad.linea_id
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Completa todos los campos antes de guardar'
      });
      return;
    }

    this.unidadesService.crearUnidad(this.nuevaUnidad).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Guardado',
          text: 'La unidad fue registrada correctamente',
          timer: 1800,
          showConfirmButton: false
        });

        this.cargarUnidades();
        this.limpiarFormulario();
      },
      error: (error: any) => {
        console.error('Error al guardar unidad:', error);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error?.error?.mensaje || 'No se pudo guardar la unidad'
        });
      }
    });
  }

  editarUnidad(unidad: Unidad): void {
    this.unidadEditando = { ...unidad };

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  actualizarUnidad(): void {
    if (!this.unidadEditando || !this.unidadEditando.id) {
      return;
    }

    if (
      !this.unidadEditando.codigo ||
      !this.unidadEditando.placa ||
      !this.unidadEditando.modelo ||
      !this.unidadEditando.capacidad ||
      !this.unidadEditando.linea_id
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Completa todos los campos antes de actualizar'
      });
      return;
    }

    this.unidadesService.actualizarUnidad(
      this.unidadEditando.id,
      this.unidadEditando
    ).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'La unidad fue actualizada correctamente',
          timer: 1800,
          showConfirmButton: false
        });

        this.cargarUnidades();
        this.unidadEditando = null;
      },
      error: (error: any) => {
        console.error('Error al actualizar unidad:', error);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error?.error?.mensaje || 'No se pudo actualizar la unidad'
        });
      }
    });
  }

  eliminarUnidad(id: number | undefined): void {
    if (!id) {
      return;
    }

    Swal.fire({
      icon: 'warning',
      title: '¿Eliminar unidad?',
      text: 'Esta acción eliminará el registro seleccionado',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        this.unidadesService.eliminarUnidad(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'La unidad fue eliminada correctamente',
              timer: 1800,
              showConfirmButton: false
            });

            this.cargarUnidades();
          },
          error: (error: any) => {
            console.error('Error al eliminar unidad:', error);

            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar la unidad'
            });
          }
        });
      }
    });
  }

  cancelarEdicion(): void {
    this.unidadEditando = null;
  }

  limpiarFormulario(): void {
    this.nuevaUnidad = {
      codigo: '',
      placa: '',
      modelo: '',
      capacidad: 0,
      linea_id: 0,
      estado: true
    };
  }
}