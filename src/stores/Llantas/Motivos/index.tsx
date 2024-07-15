import axiosInstance from "components/Api";
import { create } from "zustand";

export interface MotivosLlantas {
  id: number;
  descripciom: string;
  Clave: string;
}

interface State {
  allData: MotivosLlantas[];
  readAllData: (route: string) => Promise<MotivosLlantas[] | string>;
  addData: (cC: MotivosLlantas, route: string) => Promise<Boolean>;
}

const useMotivosLlantasStore = create<State>((set, get) => ({
  allData: [],

  readAllData: async (route: string) => {
    try {
      const response = await axiosInstance.get(route);
      const parsedData = JSON.parse(response.data.result);
      // Update the state with the fetched data
      set({ allData: parsedData.Table });
    } catch (err) {
      console.error("Error fetching Movimientos: ", err);
      return "Error fetching movimientos";
    }
  },
  addData: async (cC: MotivosLlantas, route: string) => {
    try {
      const response = await axiosInstance.post(route, cC);
      console.log(response);
      console.log(cC);
      return true;
    } catch (error) {
      // Handle the error accordingly.
      console.error("Error updating MarcasET:", error);
      return false;
    }
  },
}));

export { useMotivosLlantasStore };
