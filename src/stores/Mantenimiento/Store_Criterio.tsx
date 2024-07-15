import axiosInstance from "components/Api";
import { create } from "zustand";

export interface Criterio {
  id?: number;
  cve_ctr: string;
  nom_corto: string;
  descripcion: string;
  prioridad: number;
}

interface State {
  allPuestos: Criterio[];
  readAllPuestos: () => Promise<Criterio[] | string>;
  addPuesto: (cC: Criterio) => Promise<Boolean>;
}

const useCriterioStore = create<State>((set, get) => ({
  allPuestos: [],

  readAllPuestos: async () => {
    try {
      const response = await axiosInstance.get("/criterio/getAll");
      console.log(response);
      const parsedData = JSON.parse(response.data.result);

      console.log(parsedData);
      // Update the state with the fetched data
      set({ allPuestos: parsedData.Table });
    } catch (err) {
      console.error("Error fetching Criterio: ", err);
      return "Error fetching Criterio";
    }
  },
  addPuesto: async (cC: Criterio) => {
    try {
      const response = await axiosInstance.post("/criterio/postCriterio", cC);
      return true;
    } catch (error) {
      // Handle the error accordingly.
      console.error("Error updating Criterio:", error);
      return false;
    }
  },
}));

export { useCriterioStore };
