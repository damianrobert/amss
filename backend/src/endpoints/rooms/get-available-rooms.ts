import {Request, Response} from 'express';
import {IRoomsRepository} from '../../domain/rooms/IRoomsRepository';
import {HTTPResponses} from '../../endpoints/utils/http-responses';
import {Room} from '../../domain/rooms/RoomsModelTypes';

export const getAvailableRoomsRequestHandler =
	(roomRepository: IRoomsRepository) =>
	async (_req: Request<unknown, GetAvailableRoomsRequestResponse, unknown, unknown>, res: Response<GetAvailableRoomsRequestResponse>) => {
		const userData = res.locals.authUserData;

		if (userData.isAdmin) {
			res.status(HTTPResponses.OK.statusCode).send(await roomRepository.getAllRooms());
		} else {
			res.status(HTTPResponses.OK.statusCode).send(await roomRepository.getUserAvailableRooms(userData.id));
		}
	};

type GetAvailableRoomsRequestResponse = Array<Room>;
