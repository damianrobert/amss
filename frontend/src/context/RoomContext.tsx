import {createContext, useContext, useState} from 'react';
import {AuthContext} from './AuthContext';
import {useNavigate} from 'react-router-dom';

type RoomContextType = {
	getSelectedRoomId: () => number | null;
	setSelectedRoomId: (roomId: number) => boolean | null;
};

export const RoomContext = createContext({} as RoomContextType);

type RoomProviderProps = {
	children: React.ReactNode;
};

export const RoomProvider = ({children}: RoomProviderProps) => {
	const {user} = useContext(AuthContext);

	const [roomId, setRoomId] = useState<number | null>(null);

	const getSelectedRoomId = () => {
		if (user === null) {
			return null;
		}

		return roomId ? roomId : parseInt(localStorage.getItem('selectedRoomId') ?? '-1');
	};

	const setSelectedRoomId = (roomId: number) => {
		if (user === null) {
			return null;
		}
		localStorage.setItem('selectedRoomId', roomId.toString());
		setRoomId(roomId);

		return true;
	};

	const contextValue = {
		getSelectedRoomId,
		setSelectedRoomId,
	};

	return <RoomContext.Provider value={contextValue}>{children}</RoomContext.Provider>;
};
