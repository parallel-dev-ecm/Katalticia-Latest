import { create } from "zustand";

import axiosInstance from "components/Api";

export interface Company {
  id: number;
  clave_compania: string;
  rfc: string;
  razon_social: string;
  nombre_corto: string;
  nombre_largo: string;
  calle: string;
  colonia: string;
  estado: string;
  codigo_postal: string;
  contacto_persona: string;
  telefono: string;
}

type State = {
  allCompanies: Company[];
  updateData: (company: Company) => void;
  getCompanyById: (id: string) => Promise<Company>;
  getAllCompanies: () => Promise<Company[]>;
  updateCompanyById: (company: Company) => Promise<Boolean>;
};

const currentCompanyStore = create<State>((set, get) => ({
  allCompanies: [],
  getCompanyById: async (Id: string) => {
    try {
      const body = {
        Id: Id,
      };
      const response = await axiosInstance.post<any>("/company/getCompanyById", body);
      if (response.data && response.data.result) {
        const result: string = response.data.result.company.toString();
        const modifiedResult = result.replace("[", "").replace("]", "");

        const parsedData = JSON.parse(modifiedResult);

        return parsedData;
      }
    } catch (error) {
      console.error("Error fetching company by ID:", error);
    }
  },

  getAllCompanies: async () => {
    try {
      const response = await axiosInstance.get<any>("/company/getAllCompanies");
      const parsedData = JSON.parse(response.data.result);
      set({ allCompanies: parsedData.Table });
      return parsedData;
    } catch (error) {}
  },

  updateData: (company: Company) => {},
  updateCompanyById: async (company: Company) => {
    try {
      get().updateData(company);
      const response = await axiosInstance.post("/company/updateCompany", company);
      return true;
    } catch (error) {
      // Handle the error accordingly.
      console.error("Error updating company:", error);
      return false;
    }
  },
}));

export { currentCompanyStore };
