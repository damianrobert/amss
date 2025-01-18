import express, {Express} from 'express';
import cors from 'cors';

import {envValues} from './infrastructure/utils/env-parser';
import {createPool} from './infrastructure/data-access/db/pg-pool';
import {registerAccessEndpoints} from './endpoints/access/access-routes';
import {PGAccessRepository} from './infrastructure/data-access/db/repositories/AccessRepository';
import {registerUsersManagementEndpoints} from './endpoints/users-management/users-management-routets';
import {PGUsersManagementRepository} from './infrastructure/data-access/db/repositories/UsersManagementRepository';
import {registerRoomsEndpoints} from './endpoints/rooms/rooms-routes';
import {PGRoomsRepository} from './infrastructure/data-access/db/repositories/RoomsRepository';
import {registerAutomationRoutesEndpoints} from './endpoints/automation/automation-routes';
import {PGAutomationsRepository} from './infrastructure/data-access/db/repositories/AutomationsRepository';

const app: Express = express();

app.use(express.json());
app.use(cors());

const dbPool = createPool({
	user: envValues.DB_USER,
	host: envValues.DB_HOST,
	database: envValues.DB_NAME,
	password: envValues.DB_PASSWORD,
	port: envValues.DB_PORT,
});

const accessRepository = PGAccessRepository(dbPool);
const usersManagementRepository = PGUsersManagementRepository(dbPool);
const roomsRepository = PGRoomsRepository(dbPool);
const automationsRepository = PGAutomationsRepository(dbPool);

registerAccessEndpoints(app, accessRepository);
registerUsersManagementEndpoints(app, usersManagementRepository, accessRepository);
registerRoomsEndpoints(app, roomsRepository);
registerAutomationRoutesEndpoints(app, automationsRepository, roomsRepository);

// define error catcher middleware

app.listen(envValues.PORT, () => {
	console.log(`[Server]: Server is running on port: ${envValues.PORT} 🚀`);
});
