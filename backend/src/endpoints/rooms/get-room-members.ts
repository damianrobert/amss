import {Request, Response} from 'express';
import {IRoomsRepository} from '../../domain/rooms/IRoomsRepository';
import {HTTPResponses} from '../../endpoints/utils/http-responses';
import {RoomMembersPaginatedQueryResponse} from '../../domain/rooms/RoomsModelTypes';

export const getRoomMembersPaginatedRoomsRequestHandler =
	(roomRepository: IRoomsRepository) =>
	async (req: Request<unknown, GetRoomMembersPaginatedRoomsRequestResponse, unknown, unknown>, res: Response<GetRoomMembersPaginatedRoomsRequestResponse>) => {
		const userData = res.locals.authUserData;

		if (!userData.isAdmin) {
			res.status(HTTPResponses.FORBIDDEN.statusCode).send();
			return;
		}

		const {roomId} = req.params as {roomId: string};
		const {page, limit} = req.query as {roomId: string; page: string; limit: string};

		if (
			!page ||
			!limit ||
			!Number.isInteger(Number(page)) ||
			!Number.isInteger(Number(limit)) ||
			Number(page) < 0 ||
			Number(limit) < 1 ||
			!roomId ||
			!Number.isInteger(Number(roomId))
		) {
			res.status(HTTPResponses.BAD_REQUEST.statusCode).send();
			return;
		}

		const roomMembers = await roomRepository.getRoomMembersPaginated(Number(roomId), Number(page), Number(limit));

		res.status(HTTPResponses.OK.statusCode).send(roomMembers);
	};

type GetRoomMembersPaginatedRoomsRequestResponse = RoomMembersPaginatedQueryResponse;
