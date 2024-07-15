import axiosInstance from "components/Api";
import { create } from "zustand";

export interface ValvulaPresion {
  id?: number;
  clave: string;
  nomo13_dlc: string;
  nomo13_fec: string;
  nomo13_uv: string;
  nomo07_dlc: string;
  nomo07_fec: string;
  nomo07_uv: string;
  fec_vertor: string;
  uv_vertor: string;
  fec_revvl: string;
  rev_valuv: string;
  vef01_dia: string;
  vef01_marca: string;
  vef01_ffab: string;
  vef01_fins: string;
  vef02_dia: string;
  vef02_marca: string;
  vef02_ffab: string;
  vef02_fins: string;
  vef03_dia: string;
  vef03_marca: string;
  vef03_ffab: string;
  vef03_fins: string;
  vseg01_dia: string;
  vseg01_marca: string;
  vseg01_serie: string;
  vseg01_ffab: string;
  vseg01_fins: string;
  vseg02_dia: string;
  vseg02_marca: string;
  vseg02_serie: string;
  vseg02_ffab: string;
  vseg02_fins: string;
  vnor01_dia: string;
  vnor01_marca: string;
  vnor01_ffab: string;
  vnor01_fins: string;
  ins_part_fel: string;
  ins_part_reg: string;
  ins_part_inf: string;
  id_remolques: string;
  id_marcavl: string;
}

interface State {
  allValvulas: ValvulaPresion[];
  readAllValvulas: () => Promise<ValvulaPresion[] | string>;
  addValvula: (cC: ValvulaPresion) => Promise<Boolean>;
}

const useValvulasPresionStore = create<State>((set, get) => ({
  allValvulas: [],

  readAllValvulas: async () => {
    try {
      const response = await axiosInstance.get("/valvulasPresion/getAll");
      const parsedData = JSON.parse(response.data.result);
      console.log(parsedData);
      // Update the state with the fetched data
      set({ allValvulas: parsedData.Table });
    } catch (err) {
      console.error("Error fetching dollys: ", err);
      return "Error fetching dollys";
    }
  },
  addValvula: async (cC: ValvulaPresion) => {
    try {
      const response = await axiosInstance.post("/valvulasPresion/postValvula", cC);
      return true;
    } catch (error) {
      // Handle the error accordingly.
      console.error("Error updating Valvulas:", error);
      return false;
    }
  },
}));

export { useValvulasPresionStore };
