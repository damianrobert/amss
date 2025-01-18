import {Request, Response} from 'express';
import {IRoomsRepository} from '../../domain/rooms/IRoomsRepository';
import {HTTPResponses} from '../../endpoints/utils/http-responses';
import {GadgetType} from '../../domain/gadgets/GadgetsTypes';
import {fromDeviceStringToType, fromSensorStringToType, isValidDeviceType, isValidGadgetType, isValidSensorType} from '../../domain/gadgets/GadgetsUtils';

export const addNewGadgetRequestHandler =
	(roomRepository: IRoomsRepository) =>
	async (req: Request<unknown, AddGadgetRequestResponse, AddGadgetRequestPayload, unknown>, res: Response<AddGadgetRequestResponse>) => {
		const userData = res.locals.authUserData;

		if (!userData.isAdmin) {
			res.status(HTTPResponses.FORBIDDEN.statusCode).send();
			return;
		}

		const {roomId} = req.params as {roomId: string};
		const {gadgetType, isSimulated, deviceType, sensorType, gadgetName, gadgetIp} = req.body;
		if (
			!roomId ||
			!gadgetType ||
			!isValidGadgetType(gadgetType) ||
			(!sensorType && !deviceType) ||
			(gadgetType === GadgetType.SENSOR && (!sensorType || !isValidSensorType(sensorType))) ||
			(gadgetType === GadgetType.DEVICE && (!deviceType || !isValidDeviceType(deviceType))) ||
			!gadgetName ||
			gadgetName.length < 3 ||
			isSimulated === undefined ||
			(!isSimulated && !gadgetIp)
		) {
			res.status(HTTPResponses.BAD_REQUEST.statusCode).send();
			return;
		}

		const room = await roomRepository.getRoomById(parseInt(roomId));

		if (!room) {
			res.status(HTTPResponses.NOT_FOUND.statusCode).send();
			return;
		}

		if (gadgetType === GadgetType.DEVICE) {
			await roomRepository.addDeviceToRoom(parseInt(roomId), fromDeviceStringToType(deviceType), gadgetName, Boolean(isSimulated), gadgetIp);
			res.status(HTTPResponses.CREATED.statusCode).send({type: 'success'});
			return;
		} else if (gadgetType === GadgetType.SENSOR) {
			await roomRepository.addSensorToRoom(parseInt(roomId), fromSensorStringToType(sensorType), gadgetName, Boolean(isSimulated), gadgetIp);
			res.status(HTTPResponses.CREATED.statusCode).send({type: 'success'});
			return;
		} else {
			res.status(HTTPResponses.BAD_REQUEST.statusCode).send();
			return;
		}

		res.status(HTTPResponses.SERVER_ERROR.statusCode).send();
	};

type AddGadgetRequestPayload = {
	gadgetType: string;
	isSimulated: string;
	deviceType: string;
	sensorType: string;
	gadgetName: string;
	gadgetIp: string;
};

type AddGadgetRequestResponse = {
	type: 'success';
};
