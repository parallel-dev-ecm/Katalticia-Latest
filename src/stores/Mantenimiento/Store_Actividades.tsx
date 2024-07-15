import { ClaveRequest, DescripcionRequest } from "Interfaces";
import axiosInstance from "components/Api";
import { create } from "zustand";

export interface Actividad {
  id?: number;
  id_criterio: number;
  id_pieza: number;
  descripcion: string;
}

interface State {
  allPuestos: Actividad[];
  readAllPuestos: () => Promise<Actividad[] | string>;
  addPuesto: (cC: Actividad) => Promise<Boolean>;
  getIdByDescripcion: (descripcion: ClaveRequest) => Promise<number | null>;
  allDescripciones: string[];
  getAllDescripciones: () => Promise<string[] | null>;
}

const useActividadesStore = create<State>((set, get) => ({
  allPuestos: [],
  allDescripciones: [],

  readAllPuestos: async () => {
    try {
      const response = await axiosInstance.get("/actividades/getAll");
      const parsedData = JSON.parse(response.data.result);

      // Update the state with the fetched data
      set({ allPuestos: parsedData.Table });
    } catch (err) {
      console.error("Error fetching Actividades: ", err);
      return "Error fetching Actividades";
    }
  },
  addPuesto: async (cC: Actividad) => {
    try {
      const response = await axiosInstance.post("/actividades/postActividad", cC);
      return true;
    } catch (error) {
      // Handle the error accordingly.
      console.error("Error updating Criterio:", error);
      return false;
    }
  },

  getIdByDescripcion: async (clave: ClaveRequest) => {
    try {
      const response = await axiosInstance.post("/actividades/getByDescripcion", clave);
      const result = response.data.result;
      const parsedString = JSON.parse(result.company);
      const id = parsedString[0].id;
      return id;
    } catch (error) {
      console.error("Error getting remolque:", error);
      return "Error getting remolque";
    }
  },

  getAllDescripciones: async () => {
    try {
      const response = await axiosInstance.get("/actividades/getAllDescripciones");
      const parsedData = JSON.parse(response.data.result);
      const parsedString = JSON.parse(parsedData.company);
      set({ allDescripciones: parsedString });
      return parsedData;
    } catch (err) {
      console.error("Error fetching Actividades: ", err);
      return "Error fetching Actividades";
    }
  },
}));

export { useActividadesStore };
