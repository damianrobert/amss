/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import {Request, Response} from 'express';

import {IAutomationsRepository} from '../../domain/automations/AutomationsRepository';

export const toggleActiveRoomRoutineRequestHandler =
	(_automationsRepository: IAutomationsRepository) =>
	async (_req: Request<unknown, ToggleActiveRoomRoutineRequestResponse, unknown, unknown>, _res: Response<ToggleActiveRoomRoutineRequestResponse>) => {
		// const userData = res.locals.authUserData;
		// ...
	};

type ToggleActiveRoomRoutineRequestResponse = {
	/// ...
};
