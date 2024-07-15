import { ClaveRequest } from "Interfaces";
import axiosInstance from "components/Api";
import { create } from "zustand";

export interface Colaborador {
  id?: number;
  clave: number;
  nombre: string;
  apellido_pat: string;
  apellido_mat: string;
  fecha_nac: string;
  estatus: string;
  fecha_ingreso: string;
  fecha_baja: string;
  tipo_sanguineo: string;
  tel_contacto: string;
  email: string;
  num_emergencia: string;
  num_ss: string;
  rfc: string;
  id_categoria: number;
  id_area: number;
  id_puesto: number;
  calle: string;
  num_ext: string;
  num_int: string;
  cp: string;
  colonia: string;
  ciudad: string;
  municipio: string;
  estado: string;
}

interface State {
  allPuestos: Colaborador[];
  readAllPuestos: () => Promise<Colaborador[] | string>;
  addPuesto: (cC: Colaborador) => Promise<Boolean>;
  getIdFromName: (name: string) => Promise<number>;

}

const useColaboradoresStore = create<State>((set, get) => ({
  allPuestos: [],
  getIdFromName: async (name: string) => {
    try {
      const body: ClaveRequest = {
        clave: name,
      };
      const response = await axiosInstance.post<any>("/colaboradores/getIdFromName", body);
      const id = JSON.parse(response.data.result.company)
      return id[0].id
    } catch (error) {
      console.error("Error colab:", error);
      return 0;
    }
  },

  readAllPuestos: async () => {
    try {
      const response = await axiosInstance.get("/colaboradores/getAll");
      const parsedData = JSON.parse(response.data.result);
      // Update the state with the fetched data
      set({ allPuestos: parsedData.Table });
    } catch (err) {
      console.error("Error fetching Colab: ", err);
      return "Error fetching colab";
    }
  },
  addPuesto: async (cC: Colaborador) => {
    try {
      const response = await axiosInstance.post("/colaboradores/postColaborador", cC);
      return true;
    } catch (error) {
      // Handle the error accordingly.
      console.error("Error colab:", error);
      return false;
    }
  },
}));

export { useColaboradoresStore };
