import { create } from "zustand";
import axiosInstance from "components/Api";

interface currentUser {
  displayName: string;
  token?: string;
}

interface State {
  currentUser: currentUser;
  isAuthenticated: boolean;
}

type Actions = {
  readCurrentUser: () => currentUser;
  authenticate: (username: string, password: string) => Promise<Boolean>;
  logout: () => void;
};

const useAuthStore = create<State & Actions>((set, get) => ({
  currentUser: { displayName: undefined, token: undefined },
  isAuthenticated: sessionStorage.getItem("authToken") === "true",
  readCurrentUser: () => get().currentUser,
  authenticate: async (username, password) => {
    try {
      const response = await axiosInstance.post("/LdapLogin2", {
        username: username,
        password: password,
      });

      set({ isAuthenticated: true });
      sessionStorage.setItem("authToken", "true");
      set({ currentUser: response.data });
      console.log(get().currentUser);
      sessionStorage.setItem("userName", get().currentUser.displayName);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  logout: () => {
    set({ isAuthenticated: false });
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userName");
  },
}));

export { useAuthStore };
