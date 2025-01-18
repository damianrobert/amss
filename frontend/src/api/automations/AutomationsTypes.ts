import {TriggerCondition, TriggerType} from '../../utils/TriggerUtils';

export type GetAllRoomTriggersPaginatedRequest = {
	method: 'GET';
	url: '/automations/triggers/all';
	query: {
		roomId: number;
		page: number;
		limit: number;
	};
	response: {
		triggers: Array<{
			id: number;
			roomId: number;
			type: TriggerType;
			sensorId?: number;
			condition?: TriggerCondition;
			conditionValue?: number;
			cronExp?: string;
		}>;
		metadata: {
			total: number;
			page: number;
			limit: number;
		};
	};
};

export type GetAllRoomRoutinesPaginatedRequest = {
	method: 'GET';
	url: '/automations/routines/all';
	query: {
		roomId: number;
		page: number;
		limit: number;
	};
	response: {
		routines: Array<{
			// to be changed
			id: number;
			roomId: number;
			triggerId: number;
			actionId: number;
			enabled: boolean;
		}>;
		metadata: {
			total: number;
			page: number;
			limit: number;
		};
	};
};

export type CreateScheduleTriggerRequest = {
	method: 'POST';
	url: '/automations/triggers/new';
	payload: {
		roomId: number;
		triggerType: string;
		cronExp?: string;
		selectedSensorId?: string;
		condition?: TriggerCondition;
		conditionValue?: string;
	};
	response: {
		type: 'success';
		triggerId: number;
	};
};
