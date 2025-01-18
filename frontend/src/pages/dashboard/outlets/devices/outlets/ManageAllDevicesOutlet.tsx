import {useEffect, useReducer, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

import {CircularProgress, TablePagination, Button} from '@mui/material';
import {DeviceType} from '../../../../../utils/GadgetsTypes';
import {AcUnit, AddBox, ArrowForwardIos, Hvac, Lightbulb, Power, Sensors, WbIncandescent} from '@mui/icons-material';

function DevicesPage() {
	const location = useLocation();
	const navigate = useNavigate();

	const [update, forceUpdate] = useReducer((x) => x + 1, 0);

	const [value, setValue] = useState(
		location.pathname.split('/')[location.pathname.split('/').length - 1] === 'devices-sensors'
			? ''
			: location.pathname.split('/')[location.pathname.split('/').length - 1]
	);

	const [devices, setDevices] = useState<Array<{id: number; name: string; type: DeviceType; isOn: boolean}>>([]);
	const [page, setPage] = useState(0);
	const [perPage, setPerPage] = useState(9);
	const [noDevices, setNoDevices] = useState<number | null>(null);

	const [loading, setLoading] = useState<boolean>(true); // true by default

	useEffect(() => {
		setLoading(true);
		setDevices(dummyDevices);
		setLoading(false);
	}, [page, perPage]);

	const handleChange = (newValue: string) => {
		navigate(newValue);
		setValue(newValue);
	};

	return (
		<div className="flex flex-col gap-6 min-h-max">
			<header className="flex justify-between ">
				<span className="text-4xl font-medium text-gray-800">Manage devices</span>
			</header>

			<section className="mt-auto">
				<TablePagination
					component="div"
					count={noDevices || 0}
					page={page}
					onPageChange={(_, newPage) => setPage(newPage)}
					rowsPerPage={perPage}
					rowsPerPageOptions={[9, 12, 15]}
					onRowsPerPageChange={(event) => setPerPage(parseInt(event.target.value, 10))}
					disabled={loading}
					className="bg-white p-4 rounded-lg shadow-sm"
				/>
			</section>

			<section className="flex flex-col gap-4">
				{loading ? (
					<div className="flex flex-col items-center justify-center">
						<CircularProgress size={48} />
					</div>
				) : devices && devices.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{devices.map((device) => (
							<div
								key={device.id}
								className="group relative p-6 bg-white rounded-xl shadow hover:shadow-md transform transition duration-200 select-none"
								onClick={() => navigate(`/devices/${device.id}`)}
								role="button"
								tabIndex={0}
							>
								<div
									className="absolute top-0 left-0 w-full h-3 rounded-b rounded-t-3xl"
									style={{backgroundColor: `#4174BB`}}
								/>

								{device.type === DeviceType.AC ? (
									<AcUnit fontSize="large" />
								) : device.type === DeviceType.FAN ? (
									<Hvac fontSize="large" />
								) : device.type === DeviceType.LIGHT_BULB ? (
									<Lightbulb fontSize="large" />
								) : device.type === DeviceType.SMART_LIGHT ? (
									<WbIncandescent fontSize="large" />
								) : device.type === DeviceType.SOCKET ? (
									<Power fontSize="large" />
								) : (
									<Sensors fontSize="large" />
								)}
								<div className="flex flex-col">
									<span className="font-semibold text-lg">{device.name}</span>
								</div>

								<div
									className={`absolute bottom-3 right-2 w-4 h-4 rounded-full ${
										device.isOn ? 'bg-green-500' : 'bg-red-500'
									}`}
								></div>
								<div className="absolute top-6 right-4 text-transparent group-hover:text-blue-500 transition">
									<ArrowForwardIos fontSize="small" />
								</div>
							</div>
						))}
					</div>
				) : (
					<p className="text-center text-lg font-medium text-gray-800">
						No devices found. Click "Register New Device" to add one.
					</p>
				)}
			</section>
		</div>
	);
}

export default DevicesPage;

const dummyDevices: Array<{
	id: number;
	name: string;
	type: DeviceType;
	isOn: boolean;
}> = [
	{
		id: 1,
		name: 'Device 1',
		type: DeviceType.AC,
		isOn: true,
	},
	{
		id: 2,
		name: 'Device 2',
		type: DeviceType.SMART_LIGHT,
		isOn: false,
	},
	{
		id: 3,
		name: 'Device 3',
		type: DeviceType.FAN,
		isOn: true,
	},
	{
		id: 4,
		name: 'Device 4',
		type: DeviceType.LIGHT_BULB,
		isOn: false,
	},
	{
		id: 5,
		name: 'Device 5',
		type: DeviceType.SOCKET,
		isOn: false,
	},
];
