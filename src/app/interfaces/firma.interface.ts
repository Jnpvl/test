export interface Firma {
  message: string;
  data: Data;
}

export interface Data {
  id: number;
  idProyecto: string;
  idTarea: string;
  firmaBase64: string;
  isTaskLevel: boolean;
}
