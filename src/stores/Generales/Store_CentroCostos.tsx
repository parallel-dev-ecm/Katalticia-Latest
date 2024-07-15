import { create } from "zustand";
import axiosInstance from "components/Api";

export interface CentroCostos {
  clave: string;
  nombre: string;
  calle: string;
  num_exterior: string;
  num_interior: string;
  colonia: string;
  codigo_postal: string;
  ciudad: string;
  municipio: string;
  estado: string;
  telefono: string;
}

interface State {
  allCentroCostos: CentroCostos[];
  readAllCentroCostos: () => Promise<CentroCostos[] | string>;
  addCentroCostos: (cC: CentroCostos) => Promise<Boolean>;
}

const useCCstore = create<State>((set, get) => ({
  allCentroCostos: [],

  readAllCentroCostos: async () => {
    try {
      const response = await axiosInstance.get("/company/getAllFromCentroCostos");
      const parsedData = JSON.parse(response.data.result);
      // Update the state with the fetched data
      set({ allCentroCostos: parsedData.Table });
    } catch (err) {
      console.error("Error fetching CentroCostos: ", err);
      return "Error fetching CentroCostos";
    }
  },
  addCentroCostos: async (cC: CentroCostos) => {
    try {
      const response = await axiosInstance.post("/company/postCentroCostos", cC);
      return true;
    } catch (error) {
      // Handle the error accordingly.
      console.error("Error updating company:", error);
      return false;
    }
  },
}));

export { useCCstore };
