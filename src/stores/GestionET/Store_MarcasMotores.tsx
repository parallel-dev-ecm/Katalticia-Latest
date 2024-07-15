import axiosInstance from "components/Api";
import { create } from "zustand";

export interface MarcaMotor {
  id?: string;
  clave: string;
  descripcion: string;
}

interface State {
  allMarcasMotores: MarcaMotor[];
  readAllMarcasMotores: () => Promise<MarcaMotor[] | string>;
  addMarcaMotores: (cC: MarcaMotor) => Promise<Boolean>;
}

const useMarcasMotoresStore = create<State>((set, get) => ({
  allMarcasMotores: [],

  readAllMarcasMotores: async () => {
    try {
      const response = await axiosInstance.get("/marcasMotores/getAllMarcas");
      const parsedData = JSON.parse(response.data.result);
      // Update the state with the fetched data
      set({ allMarcasMotores: parsedData.Table });
    } catch (err) {
      console.error("Error fetching MarcasMotores: ", err);
      return "Error fetching MarcasMotores";
    }
  },
  addMarcaMotores: async (cC: MarcaMotor) => {
    try {
      const response = await axiosInstance.post("/marcasMotores/postMarca", cC);
      console.log(response);
      return true;
    } catch (error) {
      // Handle the error accordingly.
      console.error("Error updating MarcasMotores:", error);
      return false;
    }
  },
}));

export { useMarcasMotoresStore };
