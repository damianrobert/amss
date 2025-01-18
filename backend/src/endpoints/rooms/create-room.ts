import {Request, Response} from 'express';
import {IRoomsRepository} from '../../domain/rooms/IRoomsRepository';
import {HTTPResponses} from '../../endpoints/utils/http-responses';
import {isValidHexColor} from '../../domain/rooms/Utils';

export const createNewRoomRequestHandler =
	(roomRepository: IRoomsRepository) =>
	async (req: Request<unknown, CreateNewRoomRequestResponse, CreateNewRoomRequestPayload, unknown>, res: Response<CreateNewRoomRequestResponse>) => {
		const userData = res.locals.authUserData;

		if (!userData.isAdmin) {
			res.status(HTTPResponses.FORBIDDEN.statusCode).send();
			return;
		}

		const {name, color} = req.body;
		if (!name || !color || !name.trim() || !color.trim() || !isValidHexColor(color)) {
			res.status(HTTPResponses.BAD_REQUEST.statusCode).send();
			return;
		}

		const newRoomId = await roomRepository.createRoom({name, color});

		res.status(HTTPResponses.CREATED.statusCode).send(newRoomId);
	};
type CreateNewRoomRequestPayload = {
	name: string;
	color: string;
};

type CreateNewRoomRequestResponse = {
	newRoomId: number;
};
