import {Express} from 'express';
import {IRoomsRepository} from '../../domain/rooms/IRoomsRepository';
import {IAutomationsRepository} from '../../domain/automations/AutomationsRepository';

import {asyncHandler} from '../../endpoints/utils/async-handler';
import {authenticatedUserEndpoint} from '../../middlewares/authenticated-user-endpoint';
import {getAllRoomRoutinesPaginatedRequestHandler} from './room-routines-paginated';
import {getAllRoomTriggersPaginatedRequestHandler} from './room-trigger-paginated';
import {createRoomRoutineRequestHandler} from './create-room-routine';
import {createRoomTriggerRequestHandler} from './create-room-trigger';
import {toggleActiveRoomRoutineRequestHandler} from './toggle-active-room-routine';
import {testRoomRoutineRequestHandler} from './test-room-routine';

export const registerAutomationRoutesEndpoints = (app: Express, automationsRepository: IAutomationsRepository, roomRepository: IRoomsRepository) => {
	app.get(
		'/automations/routines/all',
		authenticatedUserEndpoint,
		asyncHandler(getAllRoomRoutinesPaginatedRequestHandler(automationsRepository, roomRepository))
	);
	app.get(
		'/automations/triggers/all',
		authenticatedUserEndpoint,
		asyncHandler(getAllRoomTriggersPaginatedRequestHandler(automationsRepository, roomRepository))
	);
	app.post('/automations/routines/new', authenticatedUserEndpoint, asyncHandler(createRoomRoutineRequestHandler(automationsRepository)));
	app.post('/automations/triggers/new', authenticatedUserEndpoint, asyncHandler(createRoomTriggerRequestHandler(automationsRepository, roomRepository)));
	app.post('/automations/routines/:id/toggle', authenticatedUserEndpoint, asyncHandler(toggleActiveRoomRoutineRequestHandler(automationsRepository)));
	app.post('/automations/routines/:id/test', authenticatedUserEndpoint, asyncHandler(testRoomRoutineRequestHandler(automationsRepository)));
};
