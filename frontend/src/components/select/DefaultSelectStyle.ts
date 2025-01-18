import {StylesConfig} from 'react-select';

export const defaultSelectStyles: StylesConfig = {
	control: (base) => ({
		...base,
		display: 'flex',
		alignItems: 'center',
		cursor: 'pointer',
		color: 'white',
		border: 'none',
		paddingBottom: '0.5rem',
		paddingTop: '0.5rem',
		width: '100%',
	}),
	singleValue: (base) => ({
		...base,
		display: 'flex',
		alignItems: 'center',
		gap: '0.5rem',
		width: '100%',
	}),
	menuList: (base) => ({
		...base,
		padding: 0,
		width: '100%',
	}),
	option: (base) => ({
		...base,
		display: 'flex',
		alignItems: 'center',
		gap: '0.5rem',
		cursor: 'pointer',
		width: '100%',
	}),
	menu: (base) => ({
		...base,
		marginTop: '0.1rem',
		paddingBottom: '0.5rem',
		paddingTop: '0.5rem',
		width: '100%',
	}),
	menuPortal: (base) => ({
		...base,
		zIndex: 9999,
		overflow: 'visible',
	}),
};
