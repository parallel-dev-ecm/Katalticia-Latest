import { ClaveRequest, DescripcionRequest, UpdateTableDynamically } from "Interfaces";
import axiosInstance from "components/Api";
import { create } from "zustand";

interface State {
  updateTable: (req: UpdateTableDynamically) => Promise<boolean>;
}

const useGeneralesStore = create<State>((set, get) => ({
  updateTable: async (req: UpdateTableDynamically) => {
    try {
      console.log(req);
      const res = await axiosInstance.post(`/general/updateTableDynamically`, req);
      console.log(res);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
}));

export { useGeneralesStore };
