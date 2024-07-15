import { create, useStore } from "zustand";

import axiosInstance from "components/Api";

export interface User {
  id: number;
  username: string;
  password: string;
  role: string;
  name: string;
  email: string;
  editGenerales: boolean;
  editTransporte: boolean;
  editRh: boolean;
  editCombustibles: boolean;
  editMantenimientoEt: boolean;
  editRefacciones: boolean;
  editLogistica: boolean;
  readGenerales: boolean;
  readET: boolean;
  readRH: boolean;
  readGestionC: boolean;
  readMantenimientoET: boolean;
  readInvRefacciones: boolean;
  readLogistics: boolean;
}

interface State {
  allUsers: User[];
}

type Actions = {
  getUsers: () => void;
  readUsers: () => User[];
};

const useUsersStore = create<State & Actions>((set, get) => ({
  allUsers: [],
  getUsers: async () => {
    const response = await axiosInstance.get("/company/getAllUsers");
    
    const parsedData = JSON.parse(response.data.result);
    set({ allUsers: parsedData.Table });
  },
  readUsers: () => {
    return get().allUsers;
  },
}));

export { useUsersStore };
