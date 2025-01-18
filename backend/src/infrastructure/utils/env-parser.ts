import dotenv from 'dotenv';

dotenv.config();

const envStringParser = (envName: string): string => {
	const envValue = process.env[envName];

	if (envValue === undefined) {
		throw new Error('Environment variable type string is not defined: ' + envName);
	}
	return envValue;
};

const envNumberParser = (envName: string): number => {
	const envValue = process.env[envName];
	if (envValue === undefined || isNaN(parseInt(envValue))) {
		throw new Error('Environment variable type number is not defined: ' + envName);
	}
	return parseInt(envValue);
};

// const envBooleanParser = (envName: string): boolean => {
//
// const envValue = process.env[envName];
//
// 	if (envValue === 'TRUE' || envValue === 'true' || envValue === '1') {
// 		return true;
// 	} else if (envValue === 'FALSE' || envValue === 'false' || envValue === '0') {
// 		return false;
// 	}
// 	throw new Error('Environment variable type boolean is not defined: ' + envName);
// };

type EnvValues = {
	PORT: number;
	DB_HOST: string;
	DB_PORT: number;
	DB_USER: string;
	DB_PASSWORD: string;
	DB_NAME: string;
	JWT_SECRET: string;
};

export const envValues: EnvValues = {
	PORT: envNumberParser('PORT'),
	DB_HOST: envStringParser('DB_HOST'),
	DB_PORT: envNumberParser('DB_PORT'),
	DB_USER: envStringParser('DB_USER'),
	DB_NAME: envStringParser('DB_NAME'),
	DB_PASSWORD: envStringParser('DB_PASSWORD'),
	JWT_SECRET: envStringParser('JWT_SECRET'),
};
