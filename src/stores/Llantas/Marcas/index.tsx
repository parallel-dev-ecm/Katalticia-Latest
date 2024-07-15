import { DescripcionRequest } from "Interfaces";
import axiosInstance from "components/Api";
import { create } from "zustand";

export interface Llanta {
  id?: string;
  clave: string;
  descripcion: string;
}

interface State {
  allData: Llanta[];
  readAllData: (route: string) => Promise<Llanta[] | string>;
  addData: (cC: Llanta, route: string) => Promise<Boolean>;
  getOnlyDescripciones: () => Promise<string[]>;
  getIdByDescription: (description: string) => Promise<number>;
}

const useMarcasLlantasStore = create<State>((set, get) => ({
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
  getOnlyDescripciones: async () => {
    try {
      const response = await axiosInstance.get("/llantas/getDescripcionesMarcasLlantas");
      const parsedData = JSON.parse(response.data.result);
      // Update the state with the fetched data
      return parsedData.Table;
    } catch (err) {
      console.error("Error fetching MarcasET: ", err);
      return [];
    }
  },
  getIdByDescription: async (description: string) => {
    const body: DescripcionRequest = { descripcion: description };
    console.log(body);
    try {
      const response = await axiosInstance.post("/llantas/getIdByDescripciones", body);
      const parsedData = JSON.parse(response.data.result);
      console.log(parsedData);
      // Update the state with the fetched data
      return parsedData[0].id;
    } catch (err) {
      console.error("Error fetching MarcasET: ", err);
      return -1;
    }
  },

  addData: async (cC: Llanta, route: string) => {
    try {
      const response = await axiosInstance.post(route, cC);
      return true;
    } catch (error) {
      // Handle the error accordingly.
      console.error("Error updating MarcasET:", error);
      return false;
    }
  },
}));

export { useMarcasLlantasStore };
