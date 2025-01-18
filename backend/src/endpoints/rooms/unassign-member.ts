import {Request, Response} from 'express';
import {IRoomsRepository} from '../../domain/rooms/IRoomsRepository';
import {HTTPResponses} from '../../endpoints/utils/http-responses';

export const unassignRoomMemberRequestHandler =
	(roomRepository: IRoomsRepository) =>
	async (
		req: Request<unknown, RoomUnssignMemberRequestResponse, RoomUnssignMemberRequestPayload, unknown>,
		res: Response<RoomUnssignMemberRequestResponse>
	) => {
		const userData = res.locals.authUserData;

		if (!userData.isAdmin) {
			res.status(HTTPResponses.FORBIDDEN.statusCode).send();
			return;
		}

		const {roomId} = req.params as {roomId: string};
		const {userId} = req.body;

		console.log(!roomId, !userId, !Number.isInteger(Number(roomId)), !Number.isInteger(Number(userId)));

		if (!roomId || !userId || !Number.isInteger(Number(roomId)) || !Number.isInteger(Number(userId))) {
			res.status(HTTPResponses.BAD_REQUEST.statusCode).send();
			return;
		}

		if (!(await roomRepository.isUserRoomMember(Number(roomId), Number(userId)))) {
			res.status(HTTPResponses.CONFLICT.statusCode).send();
			return;
		}

		await roomRepository.unassignMemberFromRoom(Number(roomId), userId);

		res.status(HTTPResponses.OK.statusCode).send({
			type: 'success',
		});
	};

type RoomUnssignMemberRequestPayload = {
	userId: string;
	accessLevel: string;
};

type RoomUnssignMemberRequestResponse = {
	type: 'success';
};
