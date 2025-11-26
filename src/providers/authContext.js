import { createContext, useContext } from "react";

export const AuthContext = createContext({
	user: null,
	isAuthenticated: false,
	token: null,
	login: async () => { },
	register: async () => { },
	loginByPlateNumber: async () => { },
	logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);
export const useUserContext = useAuth;
