import axiosInstance from "components/Api";
import { create } from "zustand";

export interface CargasCombustibles {
  id?: number;
  serie: string;
  fecha_carga: string;
  fecha_captura: string;
  id_combustible: number;
  id_estacionservicio: number;
  litros: string;
  odometro: string;
  id_tractores: number;
  id_autoadmin: number;
  id_centrocostos: number;
  id_colaborador: number;
  tipo_et: string;
}

interface State {
  allPuestos: CargasCombustibles[];
  readAllPuestos: () => Promise<CargasCombustibles[] | string>;
  addPuesto: (cC: CargasCombustibles) => Promise<Boolean>;
}

const useCargasCombustiblesStore = create<State>((set, get) => ({
  allPuestos: [],

  readAllPuestos: async () => {
    try {
      const response = await axiosInstance.get("/cargasCombustible/getAll");
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
  addPuesto: async (cC: CargasCombustibles) => {
    try {
      const response = await axiosInstance.post("/cargasCombustible/postCargaCombustible", cC);
      return true;
    } catch (error) {
      // Handle the error accordingly.
      console.error("Error updating estacionServicio:", error);
      return false;
    }
  },
}));

export { useCargasCombustiblesStore };
