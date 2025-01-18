/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import {Request, Response} from 'express';

import {IAutomationsRepository} from '../../domain/automations/AutomationsRepository';

export const createRoomRoutineRequestHandler =
	(_automationsRepository: IAutomationsRepository) =>
	async (_req: Request<unknown, CreateRoomRoutineRequestResponse, unknown, unknown>, _res: Response<CreateRoomRoutineRequestResponse>) => {
		// const userData = res.locals.authUserData;
		// ...
	};

type CreateRoomRoutineRequestResponse = {
	/// ...
};
