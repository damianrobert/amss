import {RoomTriggersPaginatedReponse, TriggerCondition} from './AutomationsTypes';

export interface IAutomationsRepository {
	// createRoomRoutine: (roomRoutine: RoomRoutine) => Promise<void>;
	createScheduleTrigger: (roomId: number, cronExp: string) => Promise<number>;
	createSensorTrigger: (roomId: number, sensorId: number, condition: TriggerCondition, conditionValue: number) => Promise<number>;

	// getAllRoomRoutinesPaginated: (roomId: number, page: number, limit: number) => Promise<[]>;
	getAllRoomTriggersPaginated: (roomId: number, page: number, limit: number) => Promise<RoomTriggersPaginatedReponse>;
}
