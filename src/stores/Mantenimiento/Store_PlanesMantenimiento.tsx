import { ClaveRequest, DescripcionRequest } from "Interfaces";
import axiosInstance from "components/Api";
import { create } from "zustand";

export interface PlanMantenimiento {
  id?: number;
  cve_plan: string;
  descripcion: string;
  id_actividades: number;
  cve_actvplan: string;
  actividad?: string;
  kms_lim: string;
  dias_lim: string;
  tol_kms: string;
  tol_dias: string;
  tipo_et: string;
}
export type PlanMantenimientoType = {
  id?: number;
  cve_plan?: string;
  descripcion?: string;
  id_actividades?: number;
  cve_actvplan?: string;
  actividad?: string;
  kms_lim: string;
  dias_lim: string;
  tol_kms: string;
  tol_dias: string;
  tipo_et: string;
  horas?: string;
  mecanico?: string;
};

export interface KmReq {
  kms?: number;
  tipo_et?: string;
}
export interface MecanicoHoras {
  id: number;
  mecanico?: string;
  horas?: string;
}

export interface PlanMantenimientoDetalles {
  id?: number;
  clave_plan?: string;
  descripcion?: string;
  identificador?: string;
}

interface State {
  allPuestosDetalles: PlanMantenimientoDetalles[];
  readAllPuestosDetalles: () => Promise<PlanMantenimientoDetalles[] | string>;
  addPuesto: (cC: PlanMantenimiento) => Promise<boolean>;
  getPlanesByETandKms: (req: KmReq) => Promise<PlanMantenimiento[]>;
  getPlanesByETandKmsLessColumns: (req: KmReq) => Promise<PlanMantenimiento[]>;
  updateMecanico: (req: MecanicoHoras) => Promise<boolean>;
  updateHoras: (req: MecanicoHoras) => Promise<boolean>;

  getIdByDescripcion: (req: DescripcionRequest) => Promise<number>;
  getUniqueActividades: () => Promise<string[]>;
  uniqueActividades: string[];
  allPuestos: PlanMantenimiento[];
  readAllPuestos: () => Promise<PlanMantenimiento[] | string>;
}

const usePlanesMantenimientoStore = create<State>((set, get) => ({
  allPuestosDetalles: [],
  readAllPuestosDetalles: async () => {
    try {
      const response = await axiosInstance.get("/planesMantenimiento/getAllPlanesDetalles");
      const parsedData = JSON.parse(response.data.result);
      set({ allPuestosDetalles: parsedData.Table });
      return parsedData.Table;
    } catch (err) {
      console.error("Error fetching Motivo: ", err);
      return "Error fetching Motivo";
    }
  },
  allPuestos: [],
  uniqueActividades: [],
  updateMecanico: async (req: MecanicoHoras) => {
    try {
      const response = await axiosInstance.post("/planesMantenimiento/updateMecanico", req);
      console.log(response);
      return response.data.success;
    } catch (error) {
      console.error("Error updating mecanico:", error);
      return false;
    }
  },
  updateHoras: async (req: MecanicoHoras) => {
    try {
      const response = await axiosInstance.post("/planesMantenimiento/updateHoras", req);
      console.log(response.data.success);
      return response.data.success;
    } catch (error) {
      console.error("Error updating horas:", error);
      return false;
    }
  },
  getUniqueActividades: async () => {
    try {
      const response = await axiosInstance.get("/planesMantenimiento/getAllUniqueActividades");
      const parsedData = JSON.parse(response.data.result);
      set({ uniqueActividades: parsedData });
      return parsedData;
    } catch (error) {
      console.error("Error fetching Motivo: ", error);
      return "Error fetching Motivo";
    }
  },
  getIdByDescripcion: async (req: DescripcionRequest) => {
    try {
      const response = await axiosInstance.post("/planesMantenimiento/getByDescripcion", req);
      const parsedData = JSON.parse(response.data.result.company);
      return parsedData[0].id;
    } catch (error) {
      console.error("Error fetching id from planMantenimiento: ", error);
      return "Error fetching id";
    }
  },
  getPlanesByETandKms: async (req: KmReq) => {
    try {
      console.log(req);
      const response = await axiosInstance.post("/planesMantenimiento/getByETAndKms", req);
      const parsedData = JSON.parse(response.data.result.company);
      console.log(parsedData);
      return parsedData;
      // Update the state with the fetched data
    } catch (err) {
      console.error("Error fetching Motivo: ", err);
      return "Error fetching Motivo";
    }
  },
  getPlanesByETandKmsLessColumns: async (req: KmReq) => {
    console.log(req);
    try {
      const response = await axiosInstance.post(
        "/planesMantenimiento/getByETAndKmsLessColumns",
        req
      );
      console.log(response);
      const parsedData = JSON.parse(response.data.result.company);
      return parsedData;
      // Update the state with the fetched data
    } catch (err) {
      console.error("Error fetching Motivo: ", err);
      return "Error fetching Motivo";
    }
  },
  readAllPuestos: async () => {
    try {
      const response = await axiosInstance.get("/planesMantenimiento/getAll");
      const parsedData = JSON.parse(response.data.result);

      // Update the state with the fetched data
      set({ allPuestos: parsedData.Table });
    } catch (err) {
      console.error("Error fetching Motivo: ", err);
      return "Error fetching Motivo";
    }
  },
  addPuesto: async (cC: PlanMantenimiento) => {
    try {
      const response = await axiosInstance.post("/planesMantenimiento/postPlanMantenimiento", cC);
      return true;
    } catch (error) {
      // Handle the error accordingly.
      console.error("Error updating Motivo:", error);
      return false;
    }
  },
}));

export { usePlanesMantenimientoStore };
