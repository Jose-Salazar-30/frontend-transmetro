export interface Empleado {
  id?: number;
  nombre: string;
  apellido: string;
  dpi: string;
  telefono: string;
  correo: string;
  direccion: string;
  id_tipo_empleado: number;
  tipo_empleado?: string;
  estado: string;
}

export interface TipoEmpleado {
  id: number;
  nombre: string;
}