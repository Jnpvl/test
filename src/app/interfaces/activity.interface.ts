export interface Activity {
  urlImagen: string;
  proyecto: string;
  idTarea: string;
  actividad: string;
  idProyecto: string;
  idCliente: string;
  tipoActividad: string;
  finicio: Date;
  ffinal: Date;
  contieneFoto: string;
  Estatus: string;
  photos: Photo[];
  notas:Notas;
}

export interface Photo {
  idImagen: string;
  urlImagen: string;
  notas: Notas;
}

export enum Notas {
  ImagenTomadaAlFinalizarLaActividadMomento2 = 'Imagen tomada al finalizar la actividad. momento: 2',
  ImagenTomadaAntesDeIniciarLaActividadMomento0 = 'Imagen tomada antes de iniciar la actividad. momento: 0',
  ImagenTomadaDuranteLaActividadMomento1 = 'Imagen tomada durante la actividad. momento: 1',
}
