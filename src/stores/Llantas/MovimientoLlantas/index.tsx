import axiosInstance from "components/Api";
import { create } from "zustand";

export interface MovimientoLlantas {
  id: number;
  num_orden: string;
  fecha: Date;
  pos_montada: string;
  num_montada: string;
  dot_montada: string;
  mm_montada: string;
  marca_montada: string;
  piso_montada: string;
  motivo_montada: string;
  destino_montada: string;
  num_montadar: string;
  dot_montadar: string;
  mm_montadar: string;
  marca_montadar: string;
  piso_montadar: string;
  id_estatus: number;
  id_motivo: number;
  id_dolly: number;
  id_remolque: number;
  id_tractor: number;
  id_llanta: number;
}

interface State {
  allData: MovimientoLlantas[];
  readAllData: (route: string) => Promise<MovimientoLlantas[] | string>;
  addData: (cC: MovimientoLlantas, route: string) => Promise<Boolean>;
}

const useMovimientoLlantasStore = create<State>((set, get) => ({
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
  addData: async (cC: MovimientoLlantas, route: string) => {
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

export { useMovimientoLlantasStore };
