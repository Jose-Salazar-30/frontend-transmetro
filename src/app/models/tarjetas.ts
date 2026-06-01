export interface Tarjeta {
  id?: number;
  numero_tarjeta: string;
  nombre_usuario: string;
  dpi_usuario: string;
  telefono: string;
  correo: string;
  saldo: number;
  estado: string;
  fecha_registro: string;
  fecha_registro_formato?: string;
}