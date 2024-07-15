import axiosInstance from "components/Api";
import { create } from "zustand";

export interface TipoRemolque {
  id?: string;
  clave: string;
  descripcion: string;
  num_ejes: number;
}

interface State {
  allTipos: TipoRemolque[];
  readAllTipos: () => Promise<TipoRemolque[] | string>;
  addTipo: (cC: TipoRemolque) => Promise<Boolean>;
}

const useTipoRemolquesStore = create<State>((set, get) => ({
  allTipos: [],

  readAllTipos: async () => {
    try {
      const response = await axiosInstance.get("/tiposRemolques/getAllTipos");
      const parsedData = JSON.parse(response.data.result);
      // Update the state with the fetched data
      set({ allTipos: parsedData.Table });
    } catch (err) {
      console.error("Error fetching TiposRemolques: ", err);
      return "Error fetching TiposRemolques";
    }
  },
  addTipo: async (cC: TipoRemolque) => {
    try {
      const response = await axiosInstance.post("/tiposRemolques/postTipo", cC);
      return true;
    } catch (error) {
      // Handle the error accordingly.
      console.error("Error updating MarcasValvulas:", error);
      return false;
    }
  },
}));

export { useTipoRemolquesStore };
