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

import { EmpleadosService } from '../../services/empleados.services';
import { Empleado, TipoEmpleado } from '../../models/empleados';

@Component({
  selector: 'app-empleados',
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
  templateUrl: './empleados.html',
  styleUrl: './empleados.css'
})
export class Empleados implements OnInit, AfterViewInit {

  empleados: Empleado[] = [];
  tiposEmpleado: TipoEmpleado[] = [];

  displayedColumns: string[] = [
    'id',
    'nombreCompleto',
    'dpi',
    'telefono',
    'correo',
    'direccion',
    'tipo',
    'estado',
    'acciones'
  ];

  dataSource = new MatTableDataSource<Empleado>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  modoEditar = false;
  idEmpleadoEditar: number | null = null;

  empleado: Empleado = {
    nombre: '',
    apellido: '',
    dpi: '',
    telefono: '',
    correo: '',
    direccion: '',
    id_tipo_empleado: 0,
    estado: 'Activo'
  };

  constructor(private empleadosService: EmpleadosService) {
    this.dataSource.filterPredicate = (data: Empleado, filter: string) => {
      const texto = `
        ${data.id}
        ${data.nombre}
        ${data.apellido}
        ${data.dpi}
        ${data.telefono}
        ${data.correo}
        ${data.direccion}
        ${data.tipo_empleado}
        ${data.estado}
      `.toLowerCase();

      return texto.includes(filter);
    };
  }

  ngOnInit(): void {
    this.obtenerEmpleados();
    this.obtenerTiposEmpleado();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  obtenerEmpleados(): void {
    this.empleadosService.obtenerEmpleados().subscribe({
      next: (data) => {
        this.empleados = data;
        this.dataSource.data = data;
      },
      error: (error) => {
        console.error('Error al obtener empleados:', error);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los empleados',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  obtenerTiposEmpleado(): void {
    this.empleadosService.obtenerTiposEmpleado().subscribe({
      next: (data) => {
        this.tiposEmpleado = data;
      },
      error: (error) => {
        console.error('Error al obtener tipos de empleado:', error);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los tipos de empleado',
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

  guardarEmpleado(): void {
    if (
      !this.empleado.nombre ||
      !this.empleado.apellido ||
      !this.empleado.dpi ||
      !this.empleado.id_tipo_empleado
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos obligatorios',
        text: 'Nombre, apellido, DPI y tipo de empleado son obligatorios',
        confirmButtonText: 'Aceptar'
      });

      return;
    }

    if (this.modoEditar && this.idEmpleadoEditar !== null) {
      this.empleadosService.actualizarEmpleado(this.idEmpleadoEditar, this.empleado).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Empleado actualizado',
            text: 'El empleado se actualizó correctamente',
            timer: 1600,
            showConfirmButton: false
          });

          this.obtenerEmpleados();
          this.limpiarFormulario();
        },
        error: (error) => {
          console.error('Error al actualizar empleado:', error);

          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar',
            text: error.error?.mensaje || 'No se pudo actualizar el empleado',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    } else {
      this.empleadosService.crearEmpleado(this.empleado).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Empleado guardado',
            text: 'El empleado se registró correctamente',
            timer: 1600,
            showConfirmButton: false
          });

          this.obtenerEmpleados();
          this.limpiarFormulario();
        },
        error: (error) => {
          console.error('Error al crear empleado:', error);

          Swal.fire({
            icon: 'error',
            title: 'Error al guardar',
            text: error.error?.mensaje || 'No se pudo registrar el empleado',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    }
  }

  editarEmpleado(empleadoSeleccionado: Empleado): void {
    this.modoEditar = true;
    this.idEmpleadoEditar = empleadoSeleccionado.id || null;

    this.empleado = {
      nombre: empleadoSeleccionado.nombre,
      apellido: empleadoSeleccionado.apellido,
      dpi: empleadoSeleccionado.dpi,
      telefono: empleadoSeleccionado.telefono,
      correo: empleadoSeleccionado.correo,
      direccion: empleadoSeleccionado.direccion,
      id_tipo_empleado: empleadoSeleccionado.id_tipo_empleado,
      estado: empleadoSeleccionado.estado
    };

    Swal.fire({
      icon: 'info',
      title: 'Modo edición',
      text: 'Ahora puedes modificar los datos del empleado seleccionado',
      timer: 1300,
      showConfirmButton: false
    });
  }

  async eliminarEmpleado(id: number | undefined): Promise<void> {
    if (!id) return;

    const resultado = await Swal.fire({
      title: '¿Eliminar empleado?',
      text: 'Esta acción eliminará el registro seleccionado',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!resultado.isConfirmed) return;

    this.empleadosService.eliminarEmpleado(id).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Empleado eliminado',
          text: 'El empleado se eliminó correctamente',
          timer: 1600,
          showConfirmButton: false
        });

        this.obtenerEmpleados();
      },
      error: (error) => {
        console.error('Error al eliminar empleado:', error);

        Swal.fire({
          icon: 'error',
          title: 'Error al eliminar',
          text: 'No se pudo eliminar el empleado',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  limpiarFormulario(): void {
    this.modoEditar = false;
    this.idEmpleadoEditar = null;

    this.empleado = {
      nombre: '',
      apellido: '',
      dpi: '',
      telefono: '',
      correo: '',
      direccion: '',
      id_tipo_empleado: 0,
      estado: 'Activo'
    };
  }
}