export type FilterPeriod = 'todo' | 'semana' | 'mes' | 'personalizado';

export interface FilterUnit {
  id: string;
  placa: string;
  codigoMotor: string;
  modelo: string;
}

export interface FilterConfig {
  period: FilterPeriod;
  unitIds: string[];
  fromDate?: Date;
  toDate?: Date;
}
