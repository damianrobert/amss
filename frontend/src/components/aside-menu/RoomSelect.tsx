import {useContext, useEffect, useMemo, useReducer, useState} from 'react';
import Select, {StylesConfig} from 'react-select';
import {request} from '../../api/api-handler';
import {RoomContext} from '../../context/RoomContext';
import {GetAvailableRoomsRequest} from '../../api/manage-rooms/manage-rooms-types';
import {useNavigate} from 'react-router-dom';

interface OptionType {
	value: number;
	label: string;
	color: string;
}

const customStyles: StylesConfig<OptionType, false> = {
	control: (base) => ({
		...base,
		display: 'flex',
		alignItems: 'center',
		cursor: 'pointer',
		background: '#182435',
		color: 'white',
		border: 'none',
		paddingBottom: '0.5rem',
		paddingTop: '0.5rem',
	}),
	singleValue: (base) => ({
		...base,
		display: 'flex',
		alignItems: 'center',
		gap: '0.5rem',
		color: '#f7f7f7',
	}),
	menuList: (base) => ({
		...base,
		backgroundColor: '#182435',
		padding: 0,
	}),
	option: (base, {data, isSelected, isFocused}) => ({
		...base,
		display: 'flex',
		alignItems: 'center',
		gap: '0.5rem',
		backgroundColor: isSelected ? '#253243' : isFocused ? toAlphaColor(data.color, 0.05) : '',
		color: '#f7f7f7',
		cursor: 'pointer',
	}),
	menu: (base) => ({
		...base,
		marginTop: '0.1rem',
		paddingBottom: '0.5rem',
		paddingTop: '0.5rem',
		backgroundColor: '#182435',
	}),
};

const formatOptionLabel = ({label, color}: OptionType) => (
	<div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
		<span
			style={{
				width: '10px',
				height: '10px',
				borderRadius: '50%',
				backgroundColor: color,
			}}
		/>
		{label}
	</div>
);

function RoomSelect() {
	const navigate = useNavigate();

	const {getSelectedRoomId, setSelectedRoomId} = useContext(RoomContext);

	const [availableRooms, setAvailableRooms] = useState<GetAvailableRoomsRequest['response']>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [update, forceUpdate] = useReducer((x) => x + 1, 0);

	useEffect(() => {
		setIsLoading(true);
		request<never, never, GetAvailableRoomsRequest['response']>('/rooms/available', {
			method: 'GET',
			successCallback(response) {
				setAvailableRooms(response);
				setIsLoading(false);
			},
			errorCallback() {
				setIsLoading(false);
			},
		});
	}, [update]);

	const handleRoomChange = (selectedOption: OptionType) => {
		setSelectedRoomId(selectedOption.value);
		navigate('/');
	};

	const roomOptions = useMemo(() => {
		return availableRooms.map((room: GetAvailableRoomsRequest['response'][0]) => ({
			value: room.id,
			label: room.name,
			color: room.color,
		}));
	}, [availableRooms]);

	return (
		<Select
			placeholder={'Select room...'}
			formatOptionLabel={formatOptionLabel}
			options={roomOptions}
			noOptionsMessage={() => 'You do not have access to any rooms'}
			styles={customStyles}
			isLoading={isLoading}
			onMenuClose={() => setIsLoading(false)}
			onMenuOpen={() => forceUpdate()}
			value={roomOptions.find((option) => option.value == getSelectedRoomId())}
			onChange={(newValue: unknown) => {
				const selectedOption = newValue as {value: number} | null;
				if (selectedOption) {
					handleRoomChange(roomOptions.find((option) => option.value === selectedOption.value)!);
				}
			}}
		/>
	);
}

export default RoomSelect;

const toAlphaColor = (hex: string, alpha: number): string => {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
