import {Request, Response} from 'express';
import {IRoomsRepository} from '../../domain/rooms/IRoomsRepository';
import {HTTPResponses} from '../../endpoints/utils/http-responses';
import {Room} from '../../domain/rooms/RoomsModelTypes';

export const getSpefificRoomRequestHandler =
	(roomRepository: IRoomsRepository) =>
	async (req: Request<unknown, GetSpecificRoomRequestResponse, unknown, unknown>, res: Response<GetSpecificRoomRequestResponse>) => {
		const userData = res.locals.authUserData;

		if (!userData.isAdmin) {
			res.status(HTTPResponses.FORBIDDEN.statusCode).send();
			return;
		}

		const {roomId} = req.params as {roomId: string};

		if (!roomId || isNaN(parseInt(roomId)) || parseInt(roomId) < 0) {
			res.status(HTTPResponses.BAD_REQUEST.statusCode).send();
			return;
		}

		const room = await roomRepository.getRoomById(parseInt(roomId));

		if (!room) {
			res.status(HTTPResponses.NOT_FOUND.statusCode).send();
			return;
		}

		res.status(HTTPResponses.OK.statusCode).send(room);
	};

type GetSpecificRoomRequestResponse = Room;
