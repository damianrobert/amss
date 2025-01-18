import {Request, Response} from 'express';
import {IRoomsRepository} from '../../domain/rooms/IRoomsRepository';
import {HTTPResponses} from '../../endpoints/utils/http-responses';
import {RoomsPaginatedQueryResponse} from '../../domain/rooms/RoomsModelTypes';

export const getPaginatedRoomsRequestHandler =
	(roomRepository: IRoomsRepository) =>
	async (req: Request<unknown, GetPaginatedRoomsRequestResponse, unknown, unknown>, res: Response<GetPaginatedRoomsRequestResponse>) => {
		const userData = res.locals.authUserData;

		if (!userData.isAdmin) {
			res.status(HTTPResponses.FORBIDDEN.statusCode).send();
			return;
		}

		const {page, limit} = req.query as {page: string; limit: string};

		if (!page || !limit || !Number.isInteger(Number(page)) || !Number.isInteger(Number(limit)) || Number(page) < 0 || Number(limit) < 1) {
			res.status(HTTPResponses.BAD_REQUEST.statusCode).send();
			return;
		}

		const rooms = await roomRepository.getPaginatedRooms({page: Number(page), limit: Number(limit)});

		res.status(HTTPResponses.OK.statusCode).send(rooms);
	};

type GetPaginatedRoomsRequestResponse = RoomsPaginatedQueryResponse;
