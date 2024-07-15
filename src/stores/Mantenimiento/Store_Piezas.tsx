import axiosInstance from "components/Api";
import { create } from "zustand";

export interface Pieza {
  id?: number;
  cve_pza: string;
  nom_corto: string;
  descripcion: string;
}

interface State {
  allPuestos: Pieza[];
  readAllPuestos: () => Promise<Pieza[] | string>;
  addPuesto: (cC: Pieza) => Promise<Boolean>;
}

const usePiezasStore = create<State>((set, get) => ({
  allPuestos: [],

  readAllPuestos: async () => {
    try {
      const response = await axiosInstance.get("/piezas/getAll");
      console.log(response);
      const parsedData = JSON.parse(response.data.result);

      console.log(parsedData);
      // Update the state with the fetched data
      set({ allPuestos: parsedData.Table });
    } catch (err) {
      console.error("Error fetching Taller: ", err);
      return "Error fetching Taller";
    }
  },
  addPuesto: async (cC: Pieza) => {
    try {
      const response = await axiosInstance.post("/piezas/postPieza", cC);
      return true;
    } catch (error) {
      // Handle the error accordingly.
      console.error("Error updating Taller:", error);
      return false;
    }
  },
}));

export { usePiezasStore };
