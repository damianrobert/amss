import {jwtDecode} from 'jwt-decode';
import {createContext, useState} from 'react';

type AuthContextType = {
	isUserAuthenticated: boolean;
	user: UserAuthContextType | null;
	loginCallback: (jwtToken: string) => void;
	logoutCallback: () => void;
};

export const AuthContext = createContext({} as AuthContextType);

type AuthProviderProps = {
	children: React.ReactNode;
};

export const AuthProvider = ({children}: AuthProviderProps) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(localStorage.getItem('authToken') ? true : false);
	const [user, setUser] = useState<UserAuthContextType | null>(() => {
		const token = localStorage.getItem('authToken');
		return token ? jwtDecode<UserAuthContextType>(token) : null;
	});

	const loginCallback = (jwtToken: string) => {
		const newUser = jwtDecode<UserAuthContextType>(jwtToken);
		setIsAuthenticated(true);
		setUser(newUser);
		localStorage.setItem('authToken', jwtToken);
		window.location.href = '/';
	};

	const logoutCallback = () => {
		setIsAuthenticated(false);
		setUser(null);
		localStorage.removeItem('authToken');
		localStorage.removeItem('selectedRoomId');
		window.location.href = '/';
	};

	const isUserAuthenticated = isAuthenticated && user !== null;

	const contextValue = {
		isUserAuthenticated,
		user,
		loginCallback,
		logoutCallback,
	};

	return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

type UserAuthContextType = {id: number; email: string; firstName: string; lastName: string; isAdmin: boolean};
