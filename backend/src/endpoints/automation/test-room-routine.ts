/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import {Request, Response} from 'express';
import {IAutomationsRepository} from '../../domain/automations/AutomationsRepository';

export const testRoomRoutineRequestHandler =
	(_automationsRepository: IAutomationsRepository) =>
	async (_req: Request<unknown, TestRoomRoutineRequestResponse, unknown, unknown>, _res: Response<TestRoomRoutineRequestResponse>) => {
		// const userData = res.locals.authUserData;
		// ...
	};

type TestRoomRoutineRequestResponse = {
	/// ...
};
