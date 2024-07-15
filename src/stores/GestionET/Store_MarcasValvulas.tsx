import axiosInstance from "components/Api";
import { create } from "zustand";

export interface MarcaValvulas {
  id?: string;
  clave: string;
  descripcion: string;
}

interface State {
  allMarcas: MarcaValvulas[];
  readAllMarcas: () => Promise<MarcaValvulas[] | string>;
  addMarca: (cC: MarcaValvulas) => Promise<Boolean>;
}

const useMarcaValvulasStore = create<State>((set, get) => ({
  allMarcas: [],

  readAllMarcas: async () => {
    try {
      const response = await axiosInstance.get("/marcasValvulas/getAllMarcas");
      const parsedData = JSON.parse(response.data.result);
      // Update the state with the fetched data
      set({ allMarcas: parsedData.Table });
    } catch (err) {
      console.error("Error fetching MarcasValvulas: ", err);
      return "Error fetching MarcasValvulas";
    }
  },
  addMarca: async (cC: MarcaValvulas) => {
    try {
      const response = await axiosInstance.post("/marcasValvulas/postMarca", cC);
      return true;
    } catch (error) {
      // Handle the error accordingly.
      console.error("Error updating MarcasValvulas:", error);
      return false;
    }
  },
}));

export { useMarcaValvulasStore };
