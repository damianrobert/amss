import {Pool} from 'pg';
import {IRoomsRepository} from '../../../../domain/rooms/IRoomsRepository';
import {
	NonRoomMember,
	Room,
	RoomAccess,
	RoomGadgetsPaginatedQueryResponse,
	RoomMembersPaginatedQueryResponse,
	RoomsPaginatedQueryResponse,
} from '../../../../domain/rooms/RoomsModelTypes';
import {DeviceType, GadgetType, SensorType} from '../../../../domain/gadgets/GadgetsTypes';

export const PGRoomsRepository = (db: Pool): IRoomsRepository => {
	const createRoom = async (room: Omit<Room, 'id'>): Promise<{newRoomId: number}> => {
		const {name, color} = room;
		const result = await db.query('INSERT INTO iotdb.camere (nume, culoare) VALUES ($1, $2) RETURNING id', [name, color]);
		return {newRoomId: result.rows[0].id};
	};

	const getRoomById = async (roomId: number): Promise<Room | null> => {
		const result = await db.query('SELECT * FROM iotdb.camere WHERE id = $1', [roomId]);
		if (result.rows.length === 0) {
			return null;
		}
		return {
			id: result.rows[0].id,
			name: result.rows[0].nume,
			color: result.rows[0].culoare,
		};
	};
	const getPaginatedRooms = async (query: {page: number; limit: number}): Promise<RoomsPaginatedQueryResponse> => {
		const {page, limit} = query;

		const result = await db.query('SELECT * FROM iotdb.camere ORDER BY id OFFSET $1 LIMIT $2', [page * limit, limit]);

		const count = await db.query('SELECT COUNT(*) FROM iotdb.camere');

		const rooms = await Promise.all(
			result.rows.map(async (row) => {
				const membersCount = await db.query('SELECT COUNT(*) FROM iotdb.access_utilizatori_camere WHERE id_camera = $1', [row.id]);

				const devicesCount = await db.query('SELECT COUNT(*) FROM iotdb.dispozitive WHERE id_camera = $1', [row.id]);
				const sensorsCount = await db.query('SELECT COUNT(*) FROM iotdb.senzori WHERE id_camera = $1', [row.id]);
				const gadgetsCount = parseInt(devicesCount.rows[0].count) + parseInt(sensorsCount.rows[0].count);

				return {
					id: row.id,
					name: row.nume,
					color: row.culoare,
					noMembers: parseInt(membersCount.rows[0].count, 10),
					noGadgets: gadgetsCount,
				};
			})
		);

		return {
			rooms,
			metadata: {
				page,
				limit,
				total: count.rows ? Number(count.rows[0].count) : 0,
			},
		};
	};
	const getUserRooms = async (userId: string): Promise<Array<Room & {accessLevel: RoomAccess}> | null> => {
		const result = await db.query('SELECT * FROM iotdb.camere WHERE id IN (SELECT id_camera FROM iotdb.access_utilizatori_camere WHERE id_utilizator = $1)', [
			userId,
		]);

		if (result.rows.length === 0) {
			return null;
		}

		return result.rows.map((row) => ({
			id: row.id,
			name: row.nume,
			color: row.culoare,
			accessLevel: row.tip_access,
		}));
	};
	const getRoomMembersPaginated = async (roomId: number, page: number, limit: number): Promise<RoomMembersPaginatedQueryResponse> => {
		const result = await db.query(
			`SELECT u.id, u.email, u.prenume, u.nume, auc.tip_access, u.activ FROM iotdb.utilizatori AS u LEFT JOIN
			iotdb.access_utilizatori_camere as auc ON auc.id_camera = $1 
			WHERE auc.id_camera = $1 AND u.tip_administrator = FALSE OFFSET $2 LIMIT $3`,
			[roomId, page * limit, limit]
		);

		const count = await db.query(
			`SELECT COUNT(*) FROM iotdb.utilizatori LEFT JOIN
			iotdb.access_utilizatori_camere as auc ON auc.id_camera = $1 WHERE id_camera = $1`,
			[roomId]
		);

		const members = result.rows.map((row) => ({
			userId: row.id,
			email: row.email,
			firstName: row.prenume,
			lastName: row.nume,
			accessLevel: row.tip_access,
			isActive: row.activ,
		}));

		return {
			members: members,
			metadata: {
				page,
				limit,
				total: Number(count.rows[0].count),
			},
		};
	};
	const assignMemberToRoom = async (roomId: number, userId: string, accessLevel: string): Promise<void> => {
		await db.query('INSERT INTO iotdb.access_utilizatori_camere (id_utilizator, id_camera, tip_access) VALUES ($1, $2, $3)', [userId, roomId, accessLevel]);
	};
	const unassignMemberFromRoom = async (roomId: number, userId: string): Promise<void> => {
		await db.query('DELETE FROM iotdb.access_utilizatori_camere WHERE id_utilizator = $1 AND id_camera = $2', [userId, roomId]);
	};
	const updateRoomMember = async (roomId: number, userId: string, data: {accessLevel: string}): Promise<void> => {
		await db.query('UPDATE iotdb.access_utilizatori_camere SET tip_access = $1 WHERE id_utilizator = $2 AND id_camera = $3', [
			data.accessLevel,
			userId,
			roomId,
		]);
	};
	const isUserRoomMember = async (roomId: number, userId: number): Promise<boolean> => {
		const result = await db.query('SELECT * FROM iotdb.access_utilizatori_camere WHERE id_utilizator = $1 AND id_camera = $2', [userId, roomId]);
		return result.rowCount ? result.rowCount > 0 : false;
	};
	const getUsersNotMembers = async (roomId: number): Promise<Array<NonRoomMember>> => {
		const result = await db.query(
			'SELECT * FROM iotdb.utilizatori WHERE id NOT IN (SELECT id_utilizator FROM iotdb.access_utilizatori_camere WHERE id_camera = $1) AND tip_administrator = FALSE',
			[roomId]
		);

		return result.rows.map((row) => ({
			userId: row.id,
			firstName: row.prenume,
			lastName: row.nume,
			email: row.email,
		}));
	};
	const addSensorToRoom = async (roomId: number, sensorType: SensorType, sensorName: string, isSimulated: boolean, gadgetIp: string | null): Promise<void> => {
		const jsonb = {
			tip: sensorType,
			simulat: isSimulated,
			ip: isSimulated ? null : gadgetIp,
		};

		console.log(jsonb);

		await db.query('INSERT INTO iotdb.senzori (id_camera, nume, detalii_json) VALUES ($1, $2, $3)', [roomId, sensorName, jsonb]);
	};

	const addDeviceToRoom = async (roomId: number, deviceType: DeviceType, deviceName: string, isSimulated: boolean, gadgetIp: string | null): Promise<void> => {
		const jsonb = {
			tip: deviceType,
			simulat: isSimulated,
			ip: isSimulated ? null : gadgetIp,
		};

		await db.query('INSERT INTO iotdb.dispozitive (id_camera, nume, detalii_json) VALUES ($1, $2, $3)', [roomId, deviceName, jsonb]);
	};

	const getGadgetsPaginated = async (roomId: number, page: number, limit: number): Promise<RoomGadgetsPaginatedQueryResponse> => {
		const offset = page * limit;

		const result = await db.query(
			`
        WITH combined AS (
            SELECT 
                'DEVICE' AS gadget_type,
                detalii_json->>'tip' AS type,
                nume AS name,
                (detalii_json->>'simulat')::BOOLEAN AS is_simulated,
                detalii_json->>'ip' AS ip
            FROM iotdb.dispozitive
            WHERE id_camera = $1

            UNION ALL

            SELECT 
                'SENSOR' AS gadget_type,
                detalii_json->>'tip' AS type,
                nume AS name,
                (detalii_json->>'simulat')::BOOLEAN AS is_simulated,
                detalii_json->>'ip' AS ip
            FROM iotdb.senzori
            WHERE id_camera = $1
        ),
        total_count AS (
            SELECT COUNT(*) AS total FROM combined
        )
        SELECT * 
        FROM combined
        OFFSET $2 LIMIT $3;
    `,
			[roomId, offset, limit]
		);

		const total = await db.query(
			`
        SELECT COUNT(*) AS total
        FROM (
            SELECT id FROM iotdb.dispozitive WHERE id_camera = $1
            UNION ALL
            SELECT id FROM iotdb.senzori WHERE id_camera = $1
        ) AS combined
    `,
			[roomId]
		);

		const gadgets = result.rows.map((row) => ({
			gadgetType: row.gadget_type === 'DEVICE' ? GadgetType.DEVICE : GadgetType.SENSOR,
			type: row.type,
			name: row.name,
			isSimulated: row.is_simulated,
			ip: row.ip,
		}));

		return {
			gadgets,
			metadata: {
				page,
				limit,
				total: Number(total.rows[0].total),
			},
		};
	};

	const getAllRooms = async (): Promise<Array<Room>> => {
		const result = await db.query('SELECT * FROM iotdb.camere');
		return result.rows.map((row) => ({
			id: row.id,
			name: row.nume,
			color: row.culoare,
		}));
	};

	const getUserAvailableRooms = async (userId: number): Promise<Array<Room>> => {
		const result = await db.query(
			'SELECT * FROM iotdb.camere WHERE id NOT IN (SELECT id_camera FROM iotdb.access_utilizatori_camere WHERE id_utilizator = $1)',
			[userId]
		);

		return result.rows.map((row) => ({
			id: row.id,
			name: row.nume,
			color: row.culoare,
		}));
	};

	const getAllRoomSensors = async (roomId: number): Promise<Array<{id: number; type: SensorType; name: string}>> => {
		const result = await db.query('SELECT * FROM iotdb.senzori WHERE id_camera = $1', [roomId]);
		return result.rows.map((row) => ({
			id: row.id,
			type: row.detalii_json.tip,
			name: row.nume,
		}));
	};

	const getUserRoomAccess = async (roomId: number, userId: number): Promise<RoomAccess | null> => {
		const result = await db.query('SELECT tip_access FROM iotdb.access_utilizatori_camere WHERE id_camera = $1 AND id_utilizator = $2', [roomId, userId]);

		if (result.rows.length === 0) {
			return null;
		}

		return result.rows[0].tip_access;
	};

	return {
		createRoom,
		getRoomById,
		getPaginatedRooms,
		getUserRooms,
		getRoomMembersPaginated,
		assignMemberToRoom,
		unassignMemberFromRoom,
		updateRoomMember,
		isUserRoomMember,
		getUsersNotMembers,
		addSensorToRoom,
		addDeviceToRoom,
		getGadgetsPaginated,
		getAllRooms,
		getUserAvailableRooms,
		getAllRoomSensors,
		getUserRoomAccess,
	};
};
