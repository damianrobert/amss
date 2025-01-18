export enum TriggerType {
	SCHEDULE = 'SCHEDULE',
	SENSOR = 'SENSOR',
}

export enum TriggerCondition {
	EQUALS = 'EQUALS',
	GREATER_THAN = 'GREATER_THAN',
	LESS_THAN = 'LESS_THAN',
}

export type RoomTrigger = {
	id: number;
	roomId: number;
	type: TriggerType;
	sensorId?: number;
	condition?: TriggerCondition;
	conditionValue?: number;
	cronExp?: string;
};

export type RoomTriggersPaginatedReponse = {
	triggers: Array<RoomTrigger>;
	metadata: {
		total: number;
		page: number;
		limit: number;
	};
};
