import axiosInstance from "components/Api";
import { create } from "zustand";

export interface Combustibles {
  id?: number;
  clave: string;
  descripcion: string;
}

interface State {
  allPuestos: Combustibles[];
  readAllPuestos: () => Promise<Combustibles[] | string>;
  addPuesto: (cC: Combustibles) => Promise<Boolean>;
}

const useCombustiblesStore = create<State>((set, get) => ({
  allPuestos: [],

  readAllPuestos: async () => {
    try {
      const response = await axiosInstance.get("/combustibles/getAll");
      console.log(response);
      const parsedData = JSON.parse(response.data.result);

      console.log(parsedData);
      // Update the state with the fetched data
      set({ allPuestos: parsedData.Table });
    } catch (err) {
      console.error("Error fetching combustible: ", err);
      return "Error fetching combustible";
    }
  },
  addPuesto: async (cC: Combustibles) => {
    try {
      const response = await axiosInstance.post("/combustibles/postCombustible", cC);
      return true;
    } catch (error) {
      // Handle the error accordingly.
      console.error("Error updating combustible:", error);
      return false;
    }
  },
}));

export { useCombustiblesStore };
