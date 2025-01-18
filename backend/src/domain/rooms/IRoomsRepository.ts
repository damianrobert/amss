import {DeviceType, SensorType} from '../../domain/gadgets/GadgetsTypes';
import {
	NonRoomMember,
	Room,
	RoomAccess,
	RoomGadgetsPaginatedQueryResponse,
	RoomMembersPaginatedQueryResponse,
	RoomsPaginatedQueryResponse,
} from './RoomsModelTypes';

export interface IRoomsRepository {
	createRoom(room: Omit<Room, 'id'>): Promise<{newRoomId: number}>;
	getRoomById(roomId: number): Promise<Room | null>;
	getPaginatedRooms(query: {page: number; limit: number}): Promise<RoomsPaginatedQueryResponse>;
	getUserRooms(userId: string): Promise<Array<Room & {accessLevel: RoomAccess}> | null>;
	getRoomMembersPaginated(roomId: number, page: number, limit: number): Promise<RoomMembersPaginatedQueryResponse>;
	assignMemberToRoom(roomId: number, userId: string, accessLevel: string): Promise<void>;
	unassignMemberFromRoom(roomId: number, userId: string): Promise<void>;
	updateRoomMember(roomId: number, userId: string, data: {accessLevel: string}): Promise<void>;
	isUserRoomMember(roomId: number, userId: number): Promise<boolean>;
	getUsersNotMembers(roomId: number): Promise<Array<NonRoomMember>>;
	addSensorToRoom(roomId: number, sensorType: SensorType, sensorName: string, isSimulated: boolean, gadgetIp: string | null): Promise<void>;
	addDeviceToRoom(roomId: number, deviceType: DeviceType, deviceName: string, isSimulated: boolean, gadgetIp: string | null): Promise<void>;
	getGadgetsPaginated(roomId: number, page: number, limit: number): Promise<RoomGadgetsPaginatedQueryResponse>;
	getAllRooms(): Promise<Array<Room>>;
	getUserAvailableRooms(userId: number): Promise<Array<Room>>;
	getAllRoomSensors(roomId: number): Promise<Array<{id: number; type: SensorType; name: string}>>;
	getUserRoomAccess(roomId: number, userId: number): Promise<RoomAccess | null>;
}
