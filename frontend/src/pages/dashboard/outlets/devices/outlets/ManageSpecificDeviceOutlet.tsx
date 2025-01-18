import {useParams} from 'react-router-dom';
import {DeviceType} from '../../../../../utils/GadgetsTypes';
import {useEffect, useState} from 'react';
import {CircularProgress} from '@mui/material';

import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

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

export default function ManageSpecificDeviceOutlet() {
	const {deviceId} = useParams<{deviceId: string}>();

	const [device, setDevice] = useState<{id: number; name: string; type: DeviceType; isOn: boolean} | null>(null);

	const [loading, setLoading] = useState<boolean>(true); // true by default

	//
	const [isOn, setIsOn] = useState(false); //switch light
	// Function to toggle switch state
	const toggleSwitch = () => {
		setIsOn((prev) => !prev);
	};
	//

	useEffect(() => {
		setLoading(true);
		if (deviceId) {
			console.log(deviceId.toString());
			setDevice(dummyDevices[+deviceId - 1]); // + if for changeing from string to int and -1 is to get it back to the initial number
		} else {
			setDevice(null);
		}
		setLoading(false);
	}, [deviceId]);

	return (
		<section>
			{loading ? (
				<div className="flex flex-col items-center justify-center">
					<CircularProgress size={48} />
				</div>
			) : device ? (
				device.type === DeviceType.AC ? (
					<div className="">
						<div className="flex flex-col mb-6">
							{/* Device Name */}
							<span className="font-bold text-2xl">{device.name}</span>
						</div>

						{/* Controls Section */}
						<div className="flex justify-between items-center mb-6">
							{/* Power Button */}
							<button className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-300 transition">
								<PowerSettingsNewIcon style={{fontSize: '2rem', color: 'white'}} />
							</button>

							{/* Cool Mode */}
							<div className="flex flex-col items-center">
								<div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-300 hover:bg-gray-500 transition">
									<AcUnitIcon style={{fontSize: '2rem', color: '#333'}} />
								</div>
								<span className="text-sm text-gray-500 mt-2">Cool</span>
							</div>

							{/* Heat Mode */}
							<div className="flex flex-col items-center">
								<div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-300 hover:bg-gray-500 transition">
									<LocalFireDepartmentIcon style={{fontSize: '2rem', color: '#333'}} />
								</div>
								<span className="text-sm text-gray-500 mt-2">Heat</span>
							</div>
						</div>

						{/* Temperature Display */}
						<div className="text-center mb-6">
							<div className="text-gray-400 text-lg mb-2">Set To</div>
							<div className="text-8xl font-extrabold text-gray-700">22&deg;</div>
							<div className="text-gray-500 text-lg mt-2">
								<span className="inline-block align-middle mr-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="gray"
										className="w-6 h-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm0 0V3m0 9a6 6 0 11-12 0 6 6 0 0112 0z"
										/>
									</svg>
								</span>
								24°
							</div>
						</div>

						{/* Plus and Minus Buttons */}
						<div className="flex justify-center items-center space-x-12">
							<button className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center hover:bg-gray-500 transition">
								<span className="text-5xl font-bold text-white">-</span>
							</button>
							<button className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center hover:bg-gray-500 transition">
								<span className="text-5xl font-bold text-white">+</span>
							</button>
						</div>
					</div>
				) : device.type === DeviceType.FAN ? (
					<div className="">
						<div className="flex flex-col mb-6">
							{/* Device Name */}
							<span className="font-bold text-2xl">{device.name}</span>
						</div>

						{/* Controls Section */}
						<div className="flex justify-between items-center mb-6">
							{/* Power Button */}
							<button className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
								<PowerSettingsNewIcon style={{fontSize: '2rem', color: 'white'}} />
							</button>
						</div>

						{/* Temperature Display */}
						<div className="text-center mb-6">
							<div className="text-gray-400 text-lg mb-2">Set To</div>
							<div className="text-8xl font-extrabold text-gray-700">22&deg;</div>
							<div className="text-gray-500 text-lg mt-2">
								<span className="inline-block align-middle mr-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="gray"
										className="w-6 h-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm0 0V3m0 9a6 6 0 11-12 0 6 6 0 0112 0z"
										/>
									</svg>
								</span>
								24°
							</div>
						</div>

						{/* Plus and Minus Buttons */}
						<div className="flex justify-center items-center space-x-12">
							<button className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center hover:bg-gray-500 transition">
								<span className="text-5xl font-bold text-white">-</span>
							</button>
							<button className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center hover:bg-gray-500 transition">
								<span className="text-5xl font-bold text-white">+</span>
							</button>
						</div>
					</div>
				) : device.type === DeviceType.LIGHT_BULB ? (
					// <div className="flex justify-center items-center space-x-12">
					// 	<button className="w-30 h-16 bg-gray-400 rounded-full flex items-center justify-center hover:bg-gray-500 transition">
					// 		<span className="text-5xl font-bold text-white">On</span>

					// 		<span className="text-5xl font-bold text-white">OFF</span>
					// 	</button>
					// </div>
					<div className="">
						<div className="flex flex-col mb-6">
							{/* Device Name */}
							<span className="font-bold text-2xl">{device.name}</span>
						</div>
						<div className="flex justify-center items-center space-x-12">
							<div
								className={`relative w-32 h-16 rounded-full cursor-pointer transition-colors duration-300 ${
									isOn ? 'bg-blue-500' : 'bg-gray-400'
								}`}
								onClick={toggleSwitch}
							>
								{/* The animated circle */}
								<div
									className={`absolute top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white rounded-full shadow-md transition-transform duration-300 ${
										isOn ? 'translate-x-16' : 'translate-x-0'
									}`}
								></div>
								{/* Optional: On/Off Labels */}
								<div className="absolute inset-0 flex justify-between items-center px-4 text-xs font-semibold text-white">
									<span>Off</span>
									<span>On</span>
								</div>
							</div>
						</div>
					</div>
				) : device.type === DeviceType.SMART_LIGHT ? (
					<div>SMART_LIGHT</div>
				) : device.type === DeviceType.SOCKET ? (
					<div className="">
						<div className="flex flex-col mb-6">
							{/* Device Name */}
							<span className="font-bold text-2xl">{device.name}</span>
						</div>
						<div className="flex justify-center items-center space-x-12">
							<div
								className={`relative w-32 h-16 rounded-full cursor-pointer transition-colors duration-300 ${
									isOn ? 'bg-blue-500' : 'bg-gray-400'
								}`}
								onClick={toggleSwitch}
							>
								{/* The animated circle */}
								<div
									className={`absolute top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white rounded-full shadow-md transition-transform duration-300 ${
										isOn ? 'translate-x-16' : 'translate-x-0'
									}`}
								></div>
								{/* Optional: On/Off Labels */}
								<div className="absolute inset-0 flex justify-between items-center px-4 text-xs font-semibold text-white">
									<span>Off</span>
									<span>On</span>
								</div>
							</div>
						</div>
					</div>
				) : (
					<div>Error</div>
				)
			) : (
				<div>Error</div>
			)}
		</section>
	);
}
