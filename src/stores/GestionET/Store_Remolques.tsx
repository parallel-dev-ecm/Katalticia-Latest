import { ClaveRequest } from "Interfaces";
import axiosInstance from "components/Api";
import { create } from "zustand";

export interface Remolque {
  id?: number;
  clave: string;
  nombre_largo: string;
  modelo: string;
  año: number;
  serie: string;
  num_ejes: string;
  placas: string;
  capacidad_litros: string;
  pq: string;
  id_estatus: number;
  id_producto: number;
  id_centrocosto: number;
  id_marcaet: number;
}

interface State {
  allRemolques: Remolque[];
  currentId: number | null;
  readAllRemolques: () => Promise<Remolque[]>;
  addRemolque: (cC: Remolque) => Promise<Boolean>;
  getByClave: (clave: string) => Promise<number | null>;
}

const useRemolquesStore = create<State>((set, get) => ({
  allRemolques: [],

  readAllRemolques: async () => {
    try {
      const response = await axiosInstance.get("/remolques/getAll");
      const parsedData = JSON.parse(response.data.result);
      // Update the state with the fetched data
      set({ allRemolques: parsedData.Table });
      return parsedData.Table;
    } catch (err) {
      console.error("Error fetching remolque: ", err);
      return "Error fetching remolque";
    }
  },
  addRemolque: async (cC: Remolque) => {
    try {
      const response = await axiosInstance.post("/remolques/postRemolque", cC);
      return true;
    } catch (error) {
      // Handle the error accordingly.
      console.error("Error updating remolque:", error);
      return false;
    }
  },
  currentId: null,

  getByClave: async (clave: string) => {
    try {
      const body: ClaveRequest = { clave: clave };
      const response = await axiosInstance.post("/remolques/getIdFromClave", body);
      const result = response.data.result;
      const parsedString = JSON.parse(result.company);
      const id = parsedString[0].id;
      set({ currentId: id });
      return id;
    } catch (error) {
      console.error("Error getting remolque:", error);
      return "Error getting remolque";
    }
  },
}));

export { useRemolquesStore };
