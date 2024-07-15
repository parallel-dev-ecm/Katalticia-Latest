import axiosInstance from "components/Api";
import { create } from "zustand";

export interface LlantasCatalogoInterface {
  id: number;
  clavell: string;
  clave_et: string;
  posicion: string;
  milimetros: string;
  kms_ant: string;
  kms_act: string;
  presion: string;
  presion_est: string;
  fecha_act: Date;
  observaciones: string;
  id_marcall: number;
  id_modeloll: number;
  id_tipopiso: number;
  id_medidall: number;
  id_estatusll: number;
  milimetros_act?: string;
}

interface State {
  allData: LlantasCatalogoInterface[];
  readAllData: (route: string) => Promise<LlantasCatalogoInterface[] | string>;
  addData: (cC: LlantasCatalogoInterface, route: string) => Promise<Boolean>;
}

const useLlantasCatalogoStore = create<State>((set, get) => ({
  allData: [],

  readAllData: async (route: string) => {
    try {
      const response = await axiosInstance.get(route);
      const parsedData = JSON.parse(response.data.result);
      // Update the state with the fetched data
      set({ allData: parsedData.Table });
    } catch (err) {
      console.error("Error fetching MarcasET: ", err);
      return "Error fetching MarcasET";
    }
  },
  addData: async (cC: LlantasCatalogoInterface, route: string) => {
    try {
      console.log("cC: ", cC);
      const response = await axiosInstance.post(route, cC);
      return true;
    } catch (error) {
      // Handle the error accordingly.
      console.error("Error updating MarcasET:", error);
      return false;
    }
  },
}));

export { useLlantasCatalogoStore };
