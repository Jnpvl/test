export interface NEWUSER {
  nombre?: string | null | undefined;
  apellidoP?: string | null | undefined;
  apellidoM?: string | null | undefined;
  email?: string | null | undefined;
  password?: string | null | undefined;
  telefono?: string | null | undefined;
}

export interface USER {
  id: number;
  nombre: string;
  apellidoP: string;
  apellidoM: string;
  email: string;
  telefono: string;
}
