import axiosInstance from "components/Api";
import { create } from "zustand";

export interface MarcaET {
  id?: string;
  clave: string;
  descripcion: string;
}

interface State {
  allMarcasET: MarcaET[];
  readAllMarcasET: () => Promise<MarcaET[] | string>;
  addMarcaET: (cC: MarcaET) => Promise<Boolean>;
}

const useMarcasETStore = create<State>((set, get) => ({
  allMarcasET: [],

  readAllMarcasET: async () => {
    try {
      const response = await axiosInstance.get("/marcasET/getAllMarcas");
      const parsedData = JSON.parse(response.data.result);
      // Update the state with the fetched data
      set({ allMarcasET: parsedData.Table });
    } catch (err) {
      console.error("Error fetching MarcasET: ", err);
      return "Error fetching MarcasET";
    }
  },
  addMarcaET: async (cC: MarcaET) => {
    try {
      const response = await axiosInstance.post("/marcasET/postMarca", cC);
      return true;
    } catch (error) {
      // Handle the error accordingly.
      console.error("Error updating MarcasET:", error);
      return false;
    }
  },
}));

export { useMarcasETStore };
