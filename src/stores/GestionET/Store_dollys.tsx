import { ClaveRequest } from "Interfaces";
import axiosInstance from "components/Api";
import { create } from "zustand";

export interface Dolly {
  id?: number;
  clave: string;
  nombre_largo: string;
  modelo: string;
  año: number;
  serie_motor: string;
  num_ejes: string;
  placas: string;
  id_estatus: number;
  id_producto: number;
  id_centrocosto: number;
  id_marcaet: number;
}

interface State {
  currentId: number | null;
  getByClave: (clave: string) => Promise<number | null>;

  allDollys: Dolly[];
  readAllDollys: () => Promise<Dolly[]>;
  addDoly: (cC: Dolly) => Promise<Boolean>;
}

const useDollyStore = create<State>((set, get) => ({
  currentId: null,

  allDollys: [],

  readAllDollys: async () => {
    try {
      const response = await axiosInstance.get("/dollys/getAll");
      const parsedData = JSON.parse(response.data.result);

      // Update the state with the fetched data
      set({ allDollys: parsedData.Table });
      return parsedData.Table;
    } catch (err) {
      console.error("Error fetching dollys: ", err);
      return "Error fetching dollys";
    }
  },
  addDoly: async (cC: Dolly) => {
    try {
      const response = await axiosInstance.post("/dollys/postDolly", cC);
      return true;
    } catch (error) {
      // Handle the error accordingly.
      console.error("Error updating dollys:", error);
      return false;
    }
  },
  getByClave: async (clave: string) => {
    try {
      const body: ClaveRequest = { clave: clave };
      console.log("body", body);
      const response = await axiosInstance.post("/dollys/getIdFromClave", body);
      const result = response.data.result;
      const parsedString = JSON.parse(result.company);
      const id = parsedString[0].id;
      set({ currentId: id });
      return id;
    } catch (error) {
      console.error("Error getting dolly:", error);
      return "Error getting dolly";
    }
  },
}));

export { useDollyStore };
