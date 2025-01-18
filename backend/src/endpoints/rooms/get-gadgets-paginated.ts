import {Request, Response} from 'express';
import {IRoomsRepository} from '../../domain/rooms/IRoomsRepository';
import {HTTPResponses} from '../../endpoints/utils/http-responses';
import {RoomGadgetsPaginatedQueryResponse} from '../../domain/rooms/RoomsModelTypes';

export const getGadgetsPaginatedRequestHandler =
	(roomRepository: IRoomsRepository) =>
	async (req: Request<unknown, GetGadgetsPaginatedRequestResponse, unknown, unknown>, res: Response<GetGadgetsPaginatedRequestResponse>) => {
		const userData = res.locals.authUserData;

		if (!userData.isAdmin) {
			res.status(HTTPResponses.FORBIDDEN.statusCode).send();
			return;
		}

		const {roomId} = req.params as {roomId: string};
		const {page, limit} = req.query as {roomId: string; page: string; limit: string};

		const room = await roomRepository.getRoomById(parseInt(roomId));

		if (!room) {
			res.status(HTTPResponses.NOT_FOUND.statusCode).send();
			return;
		}

		res.status(HTTPResponses.OK.statusCode).send(await roomRepository.getGadgetsPaginated(parseInt(roomId), parseInt(page), parseInt(limit)));
	};

type GetGadgetsPaginatedRequestResponse = RoomGadgetsPaginatedQueryResponse;
