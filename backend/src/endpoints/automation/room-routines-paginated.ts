/* eslint-disable @typescript-eslint/no-empty-object-type */
import {Request, Response} from 'express';

import {IAutomationsRepository} from '../../domain/automations/AutomationsRepository';
import {HTTPResponses} from '../../endpoints/utils/http-responses';
import {IRoomsRepository} from '../../domain/rooms/IRoomsRepository';

export const getAllRoomRoutinesPaginatedRequestHandler =
	(automationsRepository: IAutomationsRepository, roomsRepository: IRoomsRepository) =>
	async (req: Request<unknown, GetAllRoomRoutinesRequestResponse, unknown, unknown>, res: Response<GetAllRoomRoutinesRequestResponse>) => {
		const userData = res.locals.authUserData;

		const {roomId, page, limit} = req.query as {roomId: string; page: string; limit: string};

		if (!roomId || !page || !limit) {
			res.status(HTTPResponses.BAD_REQUEST.statusCode).json();
			return;
		}

		if (!userData.isAdmin) {
			if (await roomsRepository.isUserRoomMember(Number(roomId), userData.id)) {
				res.status(HTTPResponses.FORBIDDEN.statusCode).json();
				return;
			}
		}

		const triggers = await automationsRepository.getAllRoomTriggersPaginated(Number(roomId), Number(page), Number(limit));

		console.log(triggers);

		res.status(HTTPResponses.OK.statusCode).json({
			routines: [],
			metadata: {
				total: 0,
				page: 0,
				limit: 0,
			},
		});
	};

type GetAllRoomRoutinesRequestResponse = {
	/// ...
};
