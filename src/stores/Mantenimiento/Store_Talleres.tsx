import axiosInstance from "components/Api";
import { create } from "zustand";

export interface Taller {
  id?: number;
  cve_taller: string;
  nom_corto: string;
  descripcion: string;
  compania: string;
  id_centrocostos: number;
}

interface State {
  allPuestos: Taller[];
  readAllPuestos: () => Promise<Taller[] | string>;
  addPuesto: (cC: Taller) => Promise<Boolean>;
}

const useTalleresStore = create<State>((set, get) => ({
  allPuestos: [],

  readAllPuestos: async () => {
    try {
      const response = await axiosInstance.get("/talleres/getAll");

      const parsedData = JSON.parse(response.data.result);

      // Update the state with the fetched data
      set({ allPuestos: parsedData.Table });
    } catch (err) {
      console.error("Error fetching Taller: ", err);
      return "Error fetching Taller";
    }
  },
  addPuesto: async (cC: Taller) => {
    try {
      const response = await axiosInstance.post("/talleres/postTaller", cC);
      return true;
    } catch (error) {
      // Handle the error accordingly.
      console.error("Error updating Taller:", error);
      return false;
    }
  },
}));

export { useTalleresStore };
