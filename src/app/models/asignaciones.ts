export interface Asignacion {
  id?: number;
  id_empleado: number;
  empleado?: string;
  id_unidad: number;
  unidad?: string;
  id_linea: number;
  linea?: string;
  fecha_asignacion: string;
  fecha_asignacion_formato?: string;
  estado: string;
}

export interface CatalogoAsignacion {
  id: number;
  nombre: string;
}

export interface CatalogosAsignaciones {
  empleados: CatalogoAsignacion[];
  unidades: CatalogoAsignacion[];
  lineas: CatalogoAsignacion[];
}