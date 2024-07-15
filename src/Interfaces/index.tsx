export default interface OrdenReparacionInterface {
  id?: number;
  compania?: string;
  taller?: string;
  folio?: string;
  motivo?: string;
  estatus?: string;
  fech_entra?: Date;
  fech_sal?: Date;
  operador?: string;
  mecanico?: string;
  tractor?: string;
  remolque?: string;
  dolly?: string;
  observacion?: string;
  id_actividades?: number;
  id_centrocosto: number;
  id_taller?: number;
  id_operador?: number;
  id_remolques?: number;
  id_tractores?: number;
  id_dollys?: number;
  id_compania?: number;
  cve_act?: string;
  descripcion?: string;
  actividad?: string;
  tiempo?: string;
  chek?: string;
  fech_rep?: Date;
  km_remolques?: number;
  km_editable_remolques?: number;
  km_dollys?: number;
  km_editable_dollys?: number;
  km_tractores?: number;
  km_editable_tractores?: number;
  remolque2?: string;
  km_remolque2?: number;
  km_editable_remolque2?: number;
  newFolio?: number;
}

export interface ClaveRequest {
  clave: string;
}

export interface UpdateKmRequest {
  id: string;
  newKm: number;
}

export interface DescripcionRequest {
  descripcion: string;
}

export interface UpdateTableDynamically {
  id: number;
  tableName: string;
  value: string;
  columnName: string;
}
