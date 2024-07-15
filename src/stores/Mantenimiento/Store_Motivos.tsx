import axiosInstance from "components/Api";
import { create } from "zustand";

export interface Motivo {
  id?: number;
  cve_motivo: string;
  descripcion: string;
}

interface State {
  allPuestos: Motivo[];
  readAllPuestos: () => Promise<Motivo[] | string>;
  addPuesto: (cC: Motivo) => Promise<Boolean>;
}

const useMotivosStore = create<State>((set, get) => ({
  allPuestos: [],

  readAllPuestos: async () => {
    try {
      const response = await axiosInstance.get("/motivos/getAll");
      console.log(response);
      const parsedData = JSON.parse(response.data.result);

      console.log(parsedData);
      // Update the state with the fetched data
      set({ allPuestos: parsedData.Table });
    } catch (err) {
      console.error("Error fetching Motivo: ", err);
      return "Error fetching Motivo";
    }
  },
  addPuesto: async (cC: Motivo) => {
    try {
      const response = await axiosInstance.post("/motivos/postMotivo", cC);
      return true;
    } catch (error) {
      // Handle the error accordingly.
      console.error("Error updating Motivo:", error);
      return false;
    }
  },
}));

export { useMotivosStore };
