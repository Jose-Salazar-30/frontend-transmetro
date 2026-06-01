import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import Swal from 'sweetalert2';

import { AsignacionesService } from '../../services/asignaciones.services';
import {
  Asignacion,
  CatalogoAsignacion
} from '../../models/asignaciones';

@Component({
  selector: 'app-asignaciones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule
  ],
  templateUrl: './asignaciones.html',
  styleUrl: './asignaciones.css'
})
export class Asignaciones implements OnInit, AfterViewInit {

  asignaciones: Asignacion[] = [];

  empleados: CatalogoAsignacion[] = [];
  unidades: CatalogoAsignacion[] = [];
  lineas: CatalogoAsignacion[] = [];

  displayedColumns: string[] = [
    'id',
    'empleado',
    'unidad',
    'linea',
    'fecha',
    'estado',
    'acciones'
  ];

  dataSource = new MatTableDataSource<Asignacion>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  modoEditar = false;
  idAsignacionEditar: number | null = null;

  asignacion: Asignacion = {
    id_empleado: 0,
    id_unidad: 0,
    id_linea: 0,
    fecha_asignacion: '',
    estado: 'Activa'
  };

  constructor(private asignacionesService: AsignacionesService) {
    this.dataSource.filterPredicate = (data: Asignacion, filter: string) => {
      const texto = `
        ${data.id}
        ${data.empleado}
        ${data.unidad}
        ${data.linea}
        ${data.fecha_asignacion_formato}
        ${data.fecha_asignacion}
        ${data.estado}
      `.toLowerCase();

      return texto.includes(filter);
    };
  }

  ngOnInit(): void {
    this.obtenerAsignaciones();
    this.obtenerCatalogos();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  obtenerAsignaciones(): void {
    this.asignacionesService.obtenerAsignaciones().subscribe({
      next: (data) => {
        this.asignaciones = data;
        this.dataSource.data = data;
      },
      error: (error) => {
        console.error('Error al obtener asignaciones:', error);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las asignaciones',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  obtenerCatalogos(): void {
    this.asignacionesService.obtenerCatalogos().subscribe({
      next: (data) => {
        this.empleados = data.empleados;
        this.unidades = data.unidades;
        this.lineas = data.lineas;
      },
      error: (error) => {
        console.error('Error al obtener catálogos:', error);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los catálogos',
          confirmButtonText: 'Aceptar'
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

  guardarAsignacion(): void {
    if (
      !this.asignacion.id_empleado ||
      !this.asignacion.id_unidad ||
      !this.asignacion.id_linea ||
      !this.asignacion.fecha_asignacion
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos obligatorios',
        text: 'Empleado, unidad, línea y fecha de asignación son obligatorios',
        confirmButtonText: 'Aceptar'
      });

      return;
    }

    if (this.modoEditar && this.idAsignacionEditar !== null) {
      this.asignacionesService.actualizarAsignacion(
        this.idAsignacionEditar,
        this.asignacion
      ).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Asignación actualizada',
            text: 'La asignación se actualizó correctamente',
            timer: 1600,
            showConfirmButton: false
          });

          this.obtenerAsignaciones();
          this.limpiarFormulario();
        },
        error: (error) => {
          console.error('Error al actualizar asignación:', error);

          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar',
            text: error.error?.mensaje || 'No se pudo actualizar la asignación',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    } else {
      this.asignacionesService.crearAsignacion(this.asignacion).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Asignación guardada',
            text: 'La asignación se registró correctamente',
            timer: 1600,
            showConfirmButton: false
          });

          this.obtenerAsignaciones();
          this.limpiarFormulario();
        },
        error: (error) => {
          console.error('Error al crear asignación:', error);

          Swal.fire({
            icon: 'error',
            title: 'Error al guardar',
            text: error.error?.mensaje || 'No se pudo registrar la asignación',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    }
  }

  editarAsignacion(asignacionSeleccionada: Asignacion): void {
    this.modoEditar = true;
    this.idAsignacionEditar = asignacionSeleccionada.id || null;

    this.asignacion = {
      id_empleado: asignacionSeleccionada.id_empleado,
      id_unidad: asignacionSeleccionada.id_unidad,
      id_linea: asignacionSeleccionada.id_linea,
      fecha_asignacion:
        asignacionSeleccionada.fecha_asignacion_formato ||
        this.formatearFecha(asignacionSeleccionada.fecha_asignacion),
      estado: asignacionSeleccionada.estado
    };

    Swal.fire({
      icon: 'info',
      title: 'Modo edición',
      text: 'Ahora puedes modificar la asignación seleccionada',
      timer: 1300,
      showConfirmButton: false
    });
  }

  async eliminarAsignacion(id: number | undefined): Promise<void> {
    if (!id) return;

    const resultado = await Swal.fire({
      title: '¿Eliminar asignación?',
      text: 'Esta acción eliminará el registro seleccionado',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!resultado.isConfirmed) return;

    this.asignacionesService.eliminarAsignacion(id).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Asignación eliminada',
          text: 'La asignación se eliminó correctamente',
          timer: 1600,
          showConfirmButton: false
        });

        this.obtenerAsignaciones();
      },
      error: (error) => {
        console.error('Error al eliminar asignación:', error);

        Swal.fire({
          icon: 'error',
          title: 'Error al eliminar',
          text: 'No se pudo eliminar la asignación',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  limpiarFormulario(): void {
    this.modoEditar = false;
    this.idAsignacionEditar = null;

    this.asignacion = {
      id_empleado: 0,
      id_unidad: 0,
      id_linea: 0,
      fecha_asignacion: '',
      estado: 'Activa'
    };
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';

    return fecha.substring(0, 10);
  }
}