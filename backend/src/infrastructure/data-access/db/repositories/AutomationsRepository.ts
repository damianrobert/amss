/* eslint-disable @typescript-eslint/no-unused-vars */
import {Pool} from 'pg';
import {IAutomationsRepository} from '../../../../domain/automations/AutomationsRepository';
import {RoomTrigger, RoomTriggersPaginatedReponse, TriggerCondition, TriggerType} from '../../../../domain/automations/AutomationsTypes';

export const PGAutomationsRepository = (db: Pool): IAutomationsRepository => {
	// const createRoomRoutine = async (_roomRoutine) => {
	// 	// ...
	// };

	const createScheduleTrigger = async (roomId: number, cronExp: string) => {
		console.log('INSERT INTO iotdb.declansatori_rutine (tip, id_camera, cron_exp) VALUES ($1, $2, $3) RETURNING id', ['SCHEDULE', roomId, cronExp]);
		const {rows} = await db.query('INSERT INTO iotdb.declansatori_rutine (tip, id_camera, cron_exp) VALUES ($1, $2, $3) RETURNING id', [
			'SCHEDULE',
			roomId,
			cronExp,
		]);

		return rows[0].id;
	};

	const createSensorTrigger = async (roomId: number, sensorId: number, condition: TriggerCondition, conditionValue: number) => {
		const {rows} = await db.query(
			'INSERT INTO iotdb.declansatori_rutine (tip, id_camera, id_senzor, conditie, valoare_conditie) VALUES ($1, $2, $3, $4, $5) RETURNING id',
			['SENSOR', roomId, sensorId, condition, conditionValue]
		);

		return rows[0].id;
	};

	// const getAllRoomRoutinesPaginated = async (roomId: number, page: number, limit: number) => {
	// 	// ...
	// };

	const getAllRoomTriggersPaginated = async (roomId: number, page: number, limit: number): Promise<RoomTriggersPaginatedReponse> => {
		const {rows} = await db.query('SELECT * FROM iotdb.declansatori_rutine WHERE id_camera = $1 LIMIT $2 OFFSET $3', [roomId, limit, (page - 1) * limit]);

		const {rows: totalRows} = await db.query('SELECT COUNT(*) AS total FROM iotdb.declansatori_rutine WHERE id_camera = $1', [roomId]);

		const triggers: Array<RoomTrigger> = rows.map((row) => ({
			id: row.id,
			roomId: row.id_camera,
			type: row.tip,
			cronExp: row.cron_exp,
			condition: row.conditie,
			conditionValue: row.valoare_conditie,
			sensorId: row.id_senzor,
		}));

		return {
			triggers,
			metadata: {
				total: Number(totalRows[0].total),
				page: Number(page),
				limit: Number(limit),
			},
		};
	};

	return {
		// createRoomRoutine,
		createScheduleTrigger,
		createSensorTrigger,
		// getAllRoomRoutinesPaginated,
		getAllRoomTriggersPaginated,
	};
};
