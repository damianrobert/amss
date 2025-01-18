import {Request, Response} from 'express';
import {IRoomsRepository} from '../../domain/rooms/IRoomsRepository';
import {HTTPResponses} from '../../endpoints/utils/http-responses';

export const roomAssignMemberRequestHandler =
	(roomRepository: IRoomsRepository) =>
	async (req: Request<unknown, RoomAssignMemberRequestResponse, RoomAssignMemberRequestPayload, unknown>, res: Response<RoomAssignMemberRequestResponse>) => {
		const userData = res.locals.authUserData;

		if (!userData.isAdmin) {
			res.status(HTTPResponses.FORBIDDEN.statusCode).send();
			return;
		}

		const {roomId} = req.params as {roomId: string};
		const {userId, accessLevel} = req.body;

		if (!roomId || !userId || !accessLevel || !roomId.trim() || isNaN(Number(userId)) || !accessLevel.trim()) {
			res.status(HTTPResponses.BAD_REQUEST.statusCode).send();
			return;
		}

		if (await roomRepository.isUserRoomMember(Number(roomId), Number(userId))) {
			res.status(HTTPResponses.CONFLICT.statusCode).send();
			return;
		}

		await roomRepository.assignMemberToRoom(Number(roomId), userId, accessLevel);

		res.status(HTTPResponses.OK.statusCode).send({
			type: 'success',
		});
	};

type RoomAssignMemberRequestPayload = {
	userId: string;
	accessLevel: string;
};

type RoomAssignMemberRequestResponse = {
	type: 'success';
};
