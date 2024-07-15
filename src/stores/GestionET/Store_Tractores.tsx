import { ClaveRequest } from "Interfaces";
import axiosInstance from "components/Api";
import { create } from "zustand";

export interface Tractor {
  id?: number;
  clave: string;
  nombre_largo: string;
  modelo: string;
  año: number;
  serie_motor: string;
  serie_cabina: string;
  num_ejes: string;
  placas: string;
  transmicion: string;
  dif_trasero: string;
  dif_delantero: string;
  id_estatus: number;
  id_producto: number;
  id_centrocosto: number;
  id_marcaet: number;
  id_marcamotor: number;
}

interface State {
  currentId: number | null;
  getByClave: (clave: string) => Promise<number | null>;

  allTractores: Tractor[];
  readAllMarcas: () => Promise<Tractor[]>;
  addMarca: (cC: Tractor) => Promise<Boolean>;
}

const useTractoresStore = create<State>((set, get) => ({
  currentId: null,
  allTractores: [],

  readAllMarcas: async () => {
    try {
      const response = await axiosInstance.get("/tractores/getAll");
      const parsedData = JSON.parse(response.data.result);
      // Update the state with the fetched data
      set({ allTractores: parsedData.Table });
      return parsedData.Table;
    } catch (err) {
      console.error("Error fetching MarcasValvulas: ", err);
      return "Error fetching MarcasValvulas";
    }
  },
  addMarca: async (cC: Tractor) => {
    try {
      const response = await axiosInstance.post("/tractores/postTractor", cC);
      return true;
    } catch (error) {
      // Handle the error accordingly.
      console.error("Error updating MarcasValvulas:", error);
      return false;
    }
  },

  getByClave: async (clave: string) => {
    try {
      const body: ClaveRequest = { clave: clave };
      const response = await axiosInstance.post("/tractores/getIdFromClave", body);
      const result = response.data.result;
      console.log(result);
      const parsedString = JSON.parse(result.company);
      const id = parsedString[0].id;
      set({ currentId: id });
      return id;
    } catch (error) {
      console.error("Error getting tractor:", error);
      return "Error getting tractor";
    }
  },
}));

export { useTractoresStore };
