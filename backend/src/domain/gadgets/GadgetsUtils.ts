import {DeviceType, GadgetType, SensorType} from './GadgetsTypes';

export const isValidGadgetType = (gadgetType: string): gadgetType is GadgetType => {
	return Object.values(GadgetType).includes(gadgetType as GadgetType);
};

export const isValidDeviceType = (deviceType: string): deviceType is DeviceType => {
	return Object.values(DeviceType).some((type) => type.toLowerCase() === deviceType.toLowerCase());
};

export const isValidSensorType = (sensorType: string): sensorType is SensorType => {
	return Object.values(SensorType).some((type) => type.toLowerCase() === sensorType.toLowerCase());
};

export const fromDeviceStringToType = (deviceType: string): DeviceType => {
	switch (deviceType.toLocaleLowerCase()) {
		case 'ac':
			return DeviceType.AC;
		case 'fan':
			return DeviceType.FAN;
		case 'lightbulb':
			return DeviceType.LIGHT_BULB;
		case 'smartlight':
			return DeviceType.SMART_LIGHT;
		case 'socket':
			return DeviceType.SOCKET;
		default:
			throw new Error('Invalid device type');
	}
};

export const fromSensorStringToType = (sensorType: string): SensorType => {
	switch (sensorType.toLocaleLowerCase()) {
		case 'temperature':
			return SensorType.TEMPERATURE;
		case 'humidity':
			return SensorType.HUMIDITY;
		default:
			throw new Error('Invalid sensor type');
	}
};
