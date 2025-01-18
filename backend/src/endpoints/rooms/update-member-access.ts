import {Request, Response} from 'express';
import {IRoomsRepository} from '../../domain/rooms/IRoomsRepository';
import {HTTPResponses} from '../../endpoints/utils/http-responses';
import {RoomAccess} from '../../domain/rooms/RoomsModelTypes';

export const updateRoomMemberRequestHandler =
	(roomRepository: IRoomsRepository) =>
	async (req: Request<unknown, UpdateRoomMemberRequestResponse, UpdateRoomMemberRequestPayload, unknown>, res: Response<UpdateRoomMemberRequestResponse>) => {
		const userData = res.locals.authUserData;

		if (!userData.isAdmin) {
			res.status(HTTPResponses.FORBIDDEN.statusCode).send();
			return;
		}

		const {roomId} = req.params as {roomId: string};
		const {userId, accessLevel} = req.body;

		if (
			!roomId ||
			!userId ||
			!accessLevel ||
			!Object.values(RoomAccess).some((value) => value === accessLevel) ||
			isNaN(Number(roomId)) ||
			isNaN(Number(userId)) ||
			Number(userId) < 0 ||
			Number(roomId) < 0
		) {
			res.status(HTTPResponses.BAD_REQUEST.statusCode).send();
			return;
		}

		if (!(await roomRepository.isUserRoomMember(Number(roomId), Number(userId)))) {
			res.status(HTTPResponses.CONFLICT.statusCode).send();
			return;
		}

		await roomRepository.updateRoomMember(Number(roomId), userId, {accessLevel});

		res.status(HTTPResponses.OK.statusCode).send({
			type: 'success',
		});
	};

type UpdateRoomMemberRequestPayload = {
	userId: string;
	accessLevel: string;
};

type UpdateRoomMemberRequestResponse = {
	type: 'success';
};
