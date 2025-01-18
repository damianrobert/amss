import {AutoMode, Dashboard, DeviceThermostat, ManageAccounts, People, Room, TipsAndUpdates} from '@mui/icons-material';
import {useContext, ReactNode} from 'react';
import {AuthContext} from '../../context/AuthContext';
import {NavLink} from 'react-router-dom';
import RoomSelect from './RoomSelect';
import {RoomContext} from '../../context/RoomContext';

function AsideMenu() {
	const {user} = useContext(AuthContext);
	const {getSelectedRoomId} = useContext(RoomContext);

	const selectedRoomId = getSelectedRoomId();

	return (
		<aside className="px-4 py-6 bg-gray-900 select-none overflow-y-scroll min-h-max h-full">
			<div className="flex flex-col items-center">
				<div className="flex flex-row items-center gap-4 w-full">
					<img src="/logo-big.png" className="max-w-xl w-[50%] object-contain rounded-3xl" alt="Logo big" />
					<div className="flex flex-col">
						<div className="font-bold text-xl text-white">DockIoT</div>
						<div className="text-gray-400 text-sm">
							Dockerized platform for the management and automation of IoT devices
						</div>
					</div>
				</div>
			</div>
			<hr className="h-px my-6 bg-gray-200 border-0 dark:bg-gray-700" />

			<nav className="flex flex-col gap-4 ">
				<RoomSelect />
				<ul className="flex flex-col gap-4">
					<li>
						<NavLink
							key={'Overview'}
							to={'/'}
							className="flex flex-row items-center gap-4 text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-3 text-sm rounded-lg w-full"
							style={({isActive}) => ({
								backgroundColor: isActive ? '#635bff' : '',
								color: isActive ? 'white' : '',
							})}
						>
							{<Dashboard fontSize={'small'} />}
							<span>Overview</span>
						</NavLink>
					</li>
					<hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />

					{getRoomSpefificMenuItems(user?.isAdmin ?? false).map((item) => (
						<li>
							<NavLink
								key={`${item.label}`}
								to={item.path}
								className={`flex flex-row items-center gap-4 text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-3 text-sm rounded-lg w-full ${
									selectedRoomId != -1 ? '' : 'opacity-50 hover:cursor-not-allowed'
								}`}
								style={({isActive}) => ({
									backgroundColor: isActive ? '#635bff' : '',
									color: isActive ? 'white' : '',
								})}
								onClick={(e) => {
									if (selectedRoomId === -1) {
										e.preventDefault();
									}
								}}
							>
								{item.icon}
								{item.label}
							</NavLink>
						</li>
					))}
					<hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />

					{getNonRoomSpecificItems(user?.isAdmin ?? false).map((item) => (
						<li>
							<NavLink
								key={`${item.label}`}
								to={item.path}
								className="flex flex-row items-center gap-4 text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-3 text-sm rounded-lg w-full"
								style={({isActive}) => ({
									backgroundColor: isActive ? '#635bff' : '',
									color: isActive ? 'white' : '',
								})}
							>
								{item.icon}
								{item.label}
							</NavLink>
						</li>
					))}
				</ul>
			</nav>
		</aside>
	);
}

export default AsideMenu;

const getRoomSpefificMenuItems = (isAdmin: boolean): Array<{label: string; icon: ReactNode; path: string}> => {
	const menuItems = [
		{
			label: 'Devices',
			icon: <TipsAndUpdates fontSize={'small'} />,
			path: '/devices',
		},
		{
			label: 'Sensors',
			icon: <DeviceThermostat fontSize={'small'} />,
			path: '/sensors',
		},
		{
			label: 'Automations',
			icon: <AutoMode fontSize={'small'} />,
			path: '/automations/',
		},
	];

	if (isAdmin) {
		menuItems.push();
	}

	return menuItems;
};

const getNonRoomSpecificItems = (isAdmin: boolean): Array<{label: string; icon: ReactNode; path: string}> => {
	const menuItems = [];

	if (isAdmin) {
		menuItems.push(
			{
				label: 'Manage users',
				icon: <People fontSize={'small'} />,
				path: '/users',
			},
			{
				label: 'Manage rooms',
				icon: <Room fontSize={'small'} />,
				path: '/rooms',
			}
		);
	}

	menuItems.push({
		label: 'Account Settings',
		icon: <ManageAccounts fontSize={'small'} />,
		path: '/account-settings',
	});

	return menuItems;
};
