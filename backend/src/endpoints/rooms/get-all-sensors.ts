import {Request, Response} from 'express';

import {IRoomsRepository} from '../../domain/rooms/IRoomsRepository';
import {SensorType} from '../../domain/gadgets/GadgetsTypes';
import {HTTPResponses} from '../../endpoints/utils/http-responses';

export const getAllSensorsRequestHandler =
	(roomRepository: IRoomsRepository) =>
	async (req: Request<unknown, GetAllSensorsRequestResponse, unknown, unknown>, res: Response<GetAllSensorsRequestResponse>) => {
		const userData = res.locals.authUserData;

		const {roomId: roomIdString} = req.params as {roomId: string};
		const roomId = parseInt(roomIdString, 10);

		if (!roomId) {
			res.status(HTTPResponses.BAD_REQUEST.statusCode).send();
			return;
		}

		if (!userData.isAdmin) {
			const userRoom = await roomRepository.isUserRoomMember(roomId, userData.id);
			if (!userRoom) {
				res.status(HTTPResponses.FORBIDDEN.statusCode).send();
				return;
			}
		}

		const sensors = await roomRepository.getAllRoomSensors(roomId);
		res.status(HTTPResponses.OK.statusCode).send({sensors});
	};

type GetAllSensorsRequestResponse = {
	sensors: Array<{
		id: number;
		type: SensorType;
		name: string;
	}>;
};
