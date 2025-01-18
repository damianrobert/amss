import {useEffect, useReducer, useState} from 'react';
import {data, Outlet, useLocation, useNavigate} from 'react-router-dom';
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts';

import SensorsIcon from '@mui/icons-material/Sensors';
import {CircularProgress, TablePagination} from '@mui/material';
import {SensorType} from '../../../../../utils/GadgetsTypes';
import {ArrowForwardIos, Cloud, Thermostat} from '@mui/icons-material';

function SensorsPage() {
	const location = useLocation();
	const navigate = useNavigate();

	const [update, forceUpdate] = useReducer((x) => x + 1, 0);

	const [value, setValue] = useState(
		location.pathname.split('/')[location.pathname.split('/').length - 1] === 'devices-sensors'
			? ''
			: location.pathname.split('/')[location.pathname.split('/').length - 1]
	);

	const [sensors, setSensors] = useState<
		Array<{
			id: number;
			name: string;
			type: SensorType;
			value: number;
			history: Array<{
				name: string;
				value: number;
			}>;
		}>
	>([]);
	const [page, setPage] = useState(0);
	const [perPage, setPerPage] = useState(9);
	const [noSensors, setNoSensors] = useState<number | null>(null);

	const [loading, setLoading] = useState<boolean>(true); // true by default

	useEffect(() => {
		setLoading(true);
		setSensors(dummySensors);
		setLoading(false);
	}, [page, perPage]);

	const handleChange = (newValue: string) => {
		navigate(newValue);
		setValue(newValue);
	};

	return (
		<div className="flex flex-col gap-6 min-h-max">
			<header className="flex justify-between ">
				<span className="text-4xl font-medium text-gray-800">Manage sensors</span>
			</header>

			<section className="mt-auto">
				<TablePagination
					component="div"
					count={noSensors || 0}
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
				) : sensors && sensors.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{sensors.map((sensor) => (
							<div
								key={sensor.id}
								className="group relative p-6 bg-white rounded-xl shadow hover:shadow-md transform transition duration-200 select-none"
								onClick={() => navigate(`/sensors/${sensor.type}`)}
								role="button"
								tabIndex={0}
							>
								<div
									className="absolute top-0 left-0 w-full h-3 rounded-b rounded-t-3xl"
									style={{backgroundColor: `#4174BB`}}
								/>

								<div className="flex flex-row items-center gap-2">
									{sensor.type === SensorType.TEMPERATURE ? (
										<Thermostat fontSize="large" />
									) : sensor.type === SensorType.HUMIDITY ? (
										<Cloud fontSize="large" />
									) : (
										<SensorsIcon fontSize="large" />
									)}

									<span className="font-semibold text-lg">{sensor.name}</span>
								</div>

								<div className="text-3xl font-bold text-center text-gray-900">
									{sensor.type === SensorType.TEMPERATURE
										? sensor.value + '°C'
										: sensor.type === SensorType.HUMIDITY
										? sensor.value + '%'
										: sensor.value}
								</div>

								<ResponsiveContainer width="100%" height={200}>
									<LineChart width={500} height={300} data={sensor.history}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="name" />
										<Tooltip />
										<Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{r: 8}} />
									</LineChart>
								</ResponsiveContainer>

								<div className="absolute top-6 right-4 text-transparent group-hover:text-blue-500 transition">
									<ArrowForwardIos fontSize="small" />
								</div>
							</div>
						))}
					</div>
				) : (
					<Outlet context={{forceUpdate}} />
				)}
			</section>
		</div>
	);
}

export default SensorsPage;

const dummySensors: Array<{
	id: number;
	name: string;
	type: SensorType;
	value: number;
	history: Array<{name: string; value: number}>;
}> = [
	{
		id: 1,
		name: 'Senzor x',
		type: SensorType.TEMPERATURE,
		value: 23.5,
		history: [
			{name: '14:00', value: 29.8},
			{name: '15:00', value: 28.9},
			{name: '16:00', value: 27.5},
			{name: '17:00', value: 26.1},
			{name: '18:00', value: 24.8},
			{name: '19:00', value: 23.2},
			{name: '20:00', value: 22.1},
			{name: '21:00', value: 21.5},
			{name: '22:00', value: 21.0},
			{name: '23:00', value: 20.6},
		],
	},
	{
		id: 2,
		name: 'Senzor 2',
		type: SensorType.HUMIDITY,
		value: 50,
		history: [
			{name: '14:00', value: 39},
			{name: '15:00', value: 41},
			{name: '16:00', value: 44},
			{name: '17:00', value: 47},
			{name: '18:00', value: 50},
			{name: '19:00', value: 54},
			{name: '20:00', value: 57},
			{name: '21:00', value: 60},
			{name: '22:00', value: 63},
			{name: '23:00', value: 65},
		],
	},
	{
		id: 3,
		name: 'Senzor 3',
		type: SensorType.HUMIDITY,
		value: 50,
		history: [
			{name: '14:00', value: 39},
			{name: '15:00', value: 41},
			{name: '16:00', value: 44},
			{name: '17:00', value: 47},
			{name: '18:00', value: 50},
			{name: '19:00', value: 54},
			{name: '20:00', value: 57},
			{name: '21:00', value: 60},
			{name: '22:00', value: 63},
			{name: '23:00', value: 65},
		],
	},
	{
		id: 4,
		name: 'Senzor 4',
		type: SensorType.TEMPERATURE,
		value: 20,
		history: [
			{name: '14:00', value: 29.8},
			{name: '15:00', value: 28.9},
			{name: '16:00', value: 27.5},
			{name: '17:00', value: 26.1},
			{name: '18:00', value: 24.8},
			{name: '19:00', value: 23.2},
			{name: '20:00', value: 22.1},
			{name: '21:00', value: 21.5},
			{name: '22:00', value: 21.0},
			{name: '23:00', value: 20.6},
		],
	},
];
