import axiosInstance from "components/Api";
import { create } from "zustand";

export interface VehiculoAdmin {
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
  allVehiculos: VehiculoAdmin[];
  readAllVehiculos: () => Promise<VehiculoAdmin[] | string>;
  addVehiculo: (cC: VehiculoAdmin) => Promise<Boolean>;
}

const useVehicleStore = create<State>((set, get) => ({
  allVehiculos: [],

  readAllVehiculos: async () => {
    try {
      const response = await axiosInstance.get("/vehiculosAdmin/getAll");
      const parsedData = JSON.parse(response.data.result);
      console.log(parsedData);
      // Update the state with the fetched data
      set({ allVehiculos: parsedData.Table });
    } catch (err) {
      console.error("Error fetching dollys: ", err);
      return "Error fetching dollys";
    }
  },
  addVehiculo: async (cC: VehiculoAdmin) => {
    try {
      const response = await axiosInstance.post("/vehiculosAdmin/postVehiculo", cC);
      return true;
    } catch (error) {
      // Handle the error accordingly.
      console.error("Error updating dollys:", error);
      return false;
    }
  },
}));

export { useVehicleStore };
