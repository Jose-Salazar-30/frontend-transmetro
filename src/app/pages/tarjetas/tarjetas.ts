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

import { TarjetasService } from '../../services/tarjetas.services';
import { Tarjeta } from '../../models/tarjetas';

@Component({
  selector: 'app-tarjetas',
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
  templateUrl: './tarjetas.html',
  styleUrl: './tarjetas.css'
})
export class Tarjetas implements OnInit, AfterViewInit {

  tarjetas: Tarjeta[] = [];

  displayedColumns: string[] = [
    'id',
    'numero_tarjeta',
    'nombre_usuario',
    'dpi_usuario',
    'telefono',
    'correo',
    'saldo',
    'estado',
    'fecha_registro',
    'acciones'
  ];

  dataSource = new MatTableDataSource<Tarjeta>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  modoEditar = false;
  idTarjetaEditar: number | null = null;

  tarjeta: Tarjeta = {
    numero_tarjeta: '',
    nombre_usuario: '',
    dpi_usuario: '',
    telefono: '',
    correo: '',
    saldo: 0,
    estado: 'Activa',
    fecha_registro: ''
  };

  constructor(private tarjetasService: TarjetasService) {
    this.dataSource.filterPredicate = (data: Tarjeta, filter: string) => {
      const texto = `
        ${data.id}
        ${data.numero_tarjeta}
        ${data.nombre_usuario}
        ${data.dpi_usuario}
        ${data.telefono}
        ${data.correo}
        ${data.saldo}
        ${data.estado}
        ${data.fecha_registro}
        ${data.fecha_registro_formato}
      `.toLowerCase();

      return texto.includes(filter);
    };
  }

  ngOnInit(): void {
    this.obtenerTarjetas();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  obtenerTarjetas(): void {
    this.tarjetasService.obtenerTarjetas().subscribe({
      next: (data) => {
        this.tarjetas = data;
        this.dataSource.data = data;
      },
      error: (error) => {
        console.error('Error al obtener tarjetas:', error);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las tarjetas',
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

  guardarTarjeta(): void {
    if (!this.tarjeta.numero_tarjeta || !this.tarjeta.nombre_usuario) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos obligatorios',
        text: 'El número de tarjeta y el nombre del usuario son obligatorios',
        confirmButtonText: 'Aceptar'
      });

      return;
    }

    if (this.modoEditar && this.idTarjetaEditar !== null) {
      this.tarjetasService.actualizarTarjeta(this.idTarjetaEditar, this.tarjeta).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Tarjeta actualizada',
            text: 'La tarjeta se actualizó correctamente',
            timer: 1600,
            showConfirmButton: false
          });

          this.obtenerTarjetas();
          this.limpiarFormulario();
        },
        error: (error) => {
          console.error('Error al actualizar tarjeta:', error);

          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar',
            text: error.error?.mensaje || 'No se pudo actualizar la tarjeta',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    } else {
      this.tarjetasService.crearTarjeta(this.tarjeta).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Tarjeta guardada',
            text: 'La tarjeta se registró correctamente',
            timer: 1600,
            showConfirmButton: false
          });

          this.obtenerTarjetas();
          this.limpiarFormulario();
        },
        error: (error) => {
          console.error('Error al crear tarjeta:', error);

          Swal.fire({
            icon: 'error',
            title: 'Error al guardar',
            text: error.error?.mensaje || 'No se pudo registrar la tarjeta',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    }
  }

  editarTarjeta(tarjetaSeleccionada: Tarjeta): void {
    this.modoEditar = true;
    this.idTarjetaEditar = tarjetaSeleccionada.id || null;

    this.tarjeta = {
      numero_tarjeta: tarjetaSeleccionada.numero_tarjeta,
      nombre_usuario: tarjetaSeleccionada.nombre_usuario,
      dpi_usuario: tarjetaSeleccionada.dpi_usuario,
      telefono: tarjetaSeleccionada.telefono,
      correo: tarjetaSeleccionada.correo,
      saldo: Number(tarjetaSeleccionada.saldo),
      estado: tarjetaSeleccionada.estado,
      fecha_registro:
        tarjetaSeleccionada.fecha_registro_formato ||
        this.formatearFecha(tarjetaSeleccionada.fecha_registro)
    };

    Swal.fire({
      icon: 'info',
      title: 'Modo edición',
      text: 'Ahora puedes modificar la tarjeta seleccionada',
      timer: 1300,
      showConfirmButton: false
    });
  }

  async eliminarTarjeta(id: number | undefined): Promise<void> {
    if (!id) return;

    const resultado = await Swal.fire({
      title: '¿Eliminar tarjeta?',
      text: 'Esta acción eliminará el registro seleccionado',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!resultado.isConfirmed) return;

    this.tarjetasService.eliminarTarjeta(id).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Tarjeta eliminada',
          text: 'La tarjeta se eliminó correctamente',
          timer: 1600,
          showConfirmButton: false
        });

        this.obtenerTarjetas();
      },
      error: (error) => {
        console.error('Error al eliminar tarjeta:', error);

        Swal.fire({
          icon: 'error',
          title: 'Error al eliminar',
          text: 'No se pudo eliminar la tarjeta',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  limpiarFormulario(): void {
    this.modoEditar = false;
    this.idTarjetaEditar = null;

    this.tarjeta = {
      numero_tarjeta: '',
      nombre_usuario: '',
      dpi_usuario: '',
      telefono: '',
      correo: '',
      saldo: 0,
      estado: 'Activa',
      fecha_registro: ''
    };
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    return fecha.substring(0, 10);
  }
}