import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
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

import { LineasService, Linea } from '../../services/lineas.services';

@Component({
  selector: 'app-lineas',
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
  templateUrl: './lineas.html',
  styleUrl: './lineas.css',
})

export class Lineas implements OnInit {
  
  displayedColumns: string[] = [
    'id',
    'nombre',
    'color',
    'origen',
    'destino',
    'estado',
    'acciones'
  ];
  
  dataSource = new MatTableDataSource<Linea>([]);

  nuevaLinea: Linea = {
    nombre: '',
    color: '',
    origen: '',
    destino: '',
    estado: true
  };

  lineaEditando: Linea | null = null;
  cargando = false;

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private lineasService: LineasService) {}

  ngOnInit(): void {
    this.cargarLineas();
  }

  cargarLineas(): void {
    this.cargando = true;

    this.lineasService.obtenerLineas().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar las lineas:', error);
        this.cargando = false;

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las lineas'
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

  guardarLinea(): void {
    if (
      !this.nuevaLinea.nombre || 
      !this.nuevaLinea.color || 
      !this.nuevaLinea.origen || 
      !this.nuevaLinea.destino
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Completa todos los campos antes de guardar'
      })
      return;
    }

    this.lineasService.crearLinea(this.nuevaLinea).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Guardado',
          text: 'La linea fue registrada correctamente',
          timer: 1800,
          showConfirmButton: false
        });

        this.cargarLineas();
        this.limpiarFormulario();
      },
      error: (error) => {
        console.error('Error al guardar la linea:', error);
        
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo guardar la linea'
        });
      }
    });
  }

  editarLinea(linea: Linea): void {
    this.lineaEditando = { ...linea };

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  actualizarLinea(): void {
    if (!this.lineaEditando || !this.lineaEditando.id) {
      return
    }

    if (
      !this.lineaEditando.nombre ||
      !this.lineaEditando.color ||
      !this.lineaEditando.origen ||
      !this.lineaEditando.destino
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Completa todos los campos antes de actualizar'
      });
      return
    }

    this.lineasService.actualizarLinea(
      this.lineaEditando.id, 
      this.lineaEditando
    ).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'La linea fuea actualizada correctamente',
          timer: 1800,
          showConfirmButton: false
        });

        this.cargarLineas();
        this.lineaEditando = null;
      },
      error: (error) => {
        console.error('Error al actualizar linea:', error);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se ha podido actualizar la linea'
        });
      }
    });
  }

  eliminarLinea(id: number | undefined): void {
    if (!id) {
      return;
    }

    Swal.fire({
      icon: 'warning',
      title: '¿Eliminar línea?',
      text: 'Esta acción eliminará el registro seleccionado',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        this.lineasService.eliminarLinea(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'La linea fue eliminada correctamente',
              timer: 1800,
              showCloseButton: false
            });

            this.cargarLineas();
          },
          error: (error) => {
          console.error('Error al eliminar línea:', error);

            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar la línea'
            });  
          }
        })
      }
    })

    
  }

  cancelarEdicion(): void {
    this.lineaEditando = null;
  }

  limpiarFormulario(): void {
    this.nuevaLinea = {
      nombre: '',
      color: '',
      origen: '',
      destino: '',
      estado: true
    };
  }
}
