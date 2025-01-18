import {Request, Response} from 'express';
import {IRoomsRepository} from '../../domain/rooms/IRoomsRepository';
import {HTTPResponses} from '../../endpoints/utils/http-responses';
import {NonRoomMember} from '../../domain/rooms/RoomsModelTypes';

export const getUsersNotRoomMembersRequestHandler =
	(roomRepository: IRoomsRepository) =>
	async (req: Request<unknown, GetUsersNotRoomMembersRequestResponse, unknown, unknown>, res: Response<GetUsersNotRoomMembersRequestResponse>) => {
		const userData = res.locals.authUserData;

		if (!userData.isAdmin) {
			res.status(HTTPResponses.FORBIDDEN.statusCode).send();
			return;
		}

		const {roomId} = req.params as {roomId: string};

		if (!roomId || !Number.isInteger(Number(roomId)) || Number(roomId) < 0) {
			res.status(HTTPResponses.BAD_REQUEST.statusCode).send();
			return;
		}

		const users = await roomRepository.getUsersNotMembers(Number(roomId));

		res.status(HTTPResponses.OK.statusCode).send(users);
	};

type GetUsersNotRoomMembersRequestResponse = Array<NonRoomMember>;
