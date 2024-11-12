import { ROLES_ENUM } from "../enums/roles";
export interface Paciente {
  id:string;
  nombre: string;
  apellido: string,
  edad: number,
  dni: number,
  email:string,
  password: string,
  cuentaHabilitada: boolean;
  obraSocial: string;
  urlFotos: any[],
  rol: ROLES_ENUM
}
export interface Especialista {
  id: string;
  nombre: string;
  apellido: string;
  edad: number;
  dni: number;
  especialidades: Especialidad[];
  email: string;
  password: string;
  cuentaHabilitada: boolean;
  urlFoto: string;
  rol: ROLES_ENUM;
  fechaAlta: string;
}
export interface Administrador {
  id:string;
  nombre: string;
  apellido: string,
  edad: number,
  dni: number,
  email:string,
  password: string,
  cuentaHabilitada: boolean;
  urlFoto: string,
  rol: ROLES_ENUM
}
export interface Especialidad {
  id: string;
  nombre: string;
}
