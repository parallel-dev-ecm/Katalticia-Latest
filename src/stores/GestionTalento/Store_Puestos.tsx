import axiosInstance from "components/Api";
import { create } from "zustand";

export interface Puesto {
  id?: number;
  clave: string;
  descripcion: string;
}

interface State {
  allPuestos: Puesto[];
  readAllPuestos: () => Promise<Puesto[] | string>;
  addPuesto: (cC: Puesto) => Promise<Boolean>;
}

const usePuestoStore = create<State>((set, get) => ({
  allPuestos: [],

  readAllPuestos: async () => {
    try {
      const response = await axiosInstance.get("/puestos/getAll");
      console.log(response);
      const parsedData = JSON.parse(response.data.result);

      console.log(parsedData);
      // Update the state with the fetched data
      set({ allPuestos: parsedData.Table });
    } catch (err) {
      console.error("Error fetching remolque: ", err);
      return "Error fetching remolque";
    }
  },
  addPuesto: async (cC: Puesto) => {
    try {
      const response = await axiosInstance.post("/puestos/postPuesto", cC);
      return true;
    } catch (error) {
      // Handle the error accordingly.
      console.error("Error updating remolque:", error);
      return false;
    }
  },
}));

export { usePuestoStore };
