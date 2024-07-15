import axiosInstance from "components/Api";
import { create } from "zustand";

export interface CategoriaColaborador {
  id?: number;
  clave: string;
  descripcion: string;
}

interface State {
  allPuestos: CategoriaColaborador[];
  readAllPuestos: () => Promise<CategoriaColaborador[] | string>;
  addPuesto: (cC: CategoriaColaborador) => Promise<Boolean>;
}

const useCategoriaStore = create<State>((set, get) => ({
  allPuestos: [],

  readAllPuestos: async () => {
    try {
      const response = await axiosInstance.get("/categorias/getAll");
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
  addPuesto: async (cC: CategoriaColaborador) => {
    try {
      const response = await axiosInstance.post("/categorias/postCategoria", cC);
      return true;
    } catch (error) {
      // Handle the error accordingly.
      console.error("Error updating remolque:", error);
      return false;
    }
  },
}));

export { useCategoriaStore };
