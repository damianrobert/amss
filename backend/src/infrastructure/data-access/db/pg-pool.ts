import {Pool} from 'pg';

type PoolConfig = {
	user: string;
	host: string;
	database: string;
	password: string;
	port: number;
};

export const createPool = (config: PoolConfig) => {
	const pool = new Pool(config);

	return pool;
};
