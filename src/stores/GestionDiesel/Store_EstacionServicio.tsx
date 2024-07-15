import axiosInstance from "components/Api";
import { create } from "zustand";

export interface EstacionServicio {
  id?: number;
  clave: string;
  num_est: string;
  ubicacion: string;
  clave_proveedor: string;
}

interface State {
  allPuestos: EstacionServicio[];
  readAllPuestos: () => Promise<EstacionServicio[] | string>;
  addPuesto: (cC: EstacionServicio) => Promise<Boolean>;
}

const useEstacionServicioStore = create<State>((set, get) => ({
  allPuestos: [],

  readAllPuestos: async () => {
    try {
      const response = await axiosInstance.get("/estacionServicio/getAll");
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
  addPuesto: async (cC: EstacionServicio) => {
    try {
      const response = await axiosInstance.post("/estacionServicio/postEstacionServicio", cC);
      return true;
    } catch (error) {
      // Handle the error accordingly.
      console.error("Error updating estacionServicio:", error);
      return false;
    }
  },
}));

export { useEstacionServicioStore };
