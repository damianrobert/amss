import {Request, Response} from 'express';
import {IRoomsRepository} from '../../domain/rooms/IRoomsRepository';
import {HTTPResponses} from '../../endpoints/utils/http-responses';
import {Room} from '../../domain/rooms/RoomsModelTypes';

export const getUserRoomsRequestHandler =
	(roomRepository: IRoomsRepository) =>
	async (req: Request<unknown, GetUserRoomsRequestResponse, unknown, unknown>, res: Response<GetUserRoomsRequestResponse>) => {
		const userData = res.locals.authUserData;

		if (!userData.isAdmin) {
			res.status(HTTPResponses.FORBIDDEN.statusCode).send();
			return;
		}

		const {userId} = req.params as {userId: string};

		if (!userId) {
			res.status(HTTPResponses.BAD_REQUEST.statusCode).send();
			return;
		}

		const rooms = await roomRepository.getUserRooms(userId);

		if (!rooms) {
			res.status(HTTPResponses.NOT_FOUND.statusCode).send();
			return;
		}

		res.status(HTTPResponses.OK.statusCode).send(rooms);
	};

type GetUserRoomsRequestResponse = Array<Room> | null;
