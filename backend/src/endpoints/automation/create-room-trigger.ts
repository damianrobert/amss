import {Request, Response} from 'express';

import {IAutomationsRepository} from '../../domain/automations/AutomationsRepository';
import {HTTPResponses} from '../../endpoints/utils/http-responses';
import {IRoomsRepository} from '../../domain/rooms/IRoomsRepository';
import {RoomAccess} from '../../domain/rooms/RoomsModelTypes';
import {TriggerCondition, TriggerType} from '../../domain/automations/AutomationsTypes';

export const createRoomTriggerRequestHandler =
	(automationsRepository: IAutomationsRepository, roomRepository: IRoomsRepository) =>
	async (
		req: Request<unknown, CreateRoomTriggerRequestResponse, CreateRoomTriggerRequestPayload, unknown>,
		res: Response<CreateRoomTriggerRequestResponse>
	) => {
		const userData = res.locals.authUserData;

		const {roomId, triggerType, cronExp, selectedSensorId, condition, conditionValue} = req.body;

		if (!roomId || !triggerType) {
			res.status(HTTPResponses.BAD_REQUEST.statusCode).json();
			return;
		}

		if (!userData.isAdmin) {
			const isUserMemberOfRoom = await roomRepository.isUserRoomMember(Number(roomId), userData.id);
			const userRoomAccess = await roomRepository.getUserRoomAccess(Number(roomId), userData.id);
			if (!isUserMemberOfRoom || userRoomAccess != RoomAccess.READ_WRITE) {
				res.status(HTTPResponses.FORBIDDEN.statusCode).json();
				return;
			}
		}
		if (triggerType == TriggerType.SCHEDULE) {
			if (!cronExp || !isValidCronExpression(cronExp)) {
				res.status(HTTPResponses.BAD_REQUEST.statusCode).json();
				return;
			}
			const newTriggerId = await automationsRepository.createScheduleTrigger(Number(roomId), cronExp);
			res.status(HTTPResponses.CREATED.statusCode).json({type: 'success', triggerId: newTriggerId});
			return;
		} else if (triggerType == TriggerType.SENSOR) {
			if (!selectedSensorId || !condition || !conditionValue) {
				res.status(HTTPResponses.BAD_REQUEST.statusCode).json();
				return;
			}
			const newTriggerId = await automationsRepository.createSensorTrigger(Number(roomId), Number(selectedSensorId), condition, Number(conditionValue));
			res.status(HTTPResponses.CREATED.statusCode).json({type: 'success', triggerId: newTriggerId});
			return;
		} else {
			res.status(HTTPResponses.BAD_REQUEST.statusCode).json();
			return;
		}
	};

type CreateRoomTriggerRequestResponse = {
	type: 'success';
	triggerId: number;
};

type CreateRoomTriggerRequestPayload = {
	roomId: number;
	triggerType: string;
	cronExp?: string;
	selectedSensorId?: string;
	condition?: TriggerCondition;
	conditionValue?: string;
};

const isValidCronExpression = (expression: string): boolean => {
	const cronRegex = /^\s*([*/0-9,-]+)\s+([*/0-9,-]+)\s+([*/0-9,-]+)\s+([*/A-Z,-]+)\s+([*/0-9A-Z,-]+)\s*$/i;

	const match = expression.match(cronRegex);
	if (!match) return false;

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, minute, hour, dayOfMonth, month, dayOfWeek] = match || [];

	const isValidRange = (field: string, min: number, max: number): boolean => {
		const parts = field.split(',');
		return parts.every((part) => {
			if (part === '*') return true;
			if (part.includes('/')) {
				const [range, step] = part.split('/');
				if (!step || isNaN(Number(step))) return false;
				return range === '*' || (range !== undefined && isValidRange(range, min, max));
			}
			if (part.includes('-')) {
				const [start, end] = part.split('-').map(Number);
				return start !== undefined && end !== undefined && !isNaN(start) && !isNaN(end) && start >= min && end <= max && start <= end;
			}
			return !isNaN(Number(part)) && Number(part) >= min && Number(part) <= max;
		});
	};

	return (
		minute !== undefined &&
		hour !== undefined &&
		dayOfMonth !== undefined &&
		month !== undefined &&
		dayOfWeek !== undefined &&
		isValidRange(minute, 0, 59) &&
		isValidRange(hour, 0, 23) &&
		isValidRange(dayOfMonth, 1, 31) &&
		isValidRange(month, 1, 12) &&
		isValidRange(dayOfWeek, 0, 7)
	);
};
