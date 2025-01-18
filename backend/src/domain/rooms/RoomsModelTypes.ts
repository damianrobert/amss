import {GadgetType, DeviceType, SensorType} from 'domain/gadgets/GadgetsTypes';

export enum RoomAccess {
	READ_ONLY = 'R',
	READ_WRITE = 'RW',
}

export type Room = {
	id: string;
	name: string;
	color: string;
};

export type RoomMember = {
	userId: string;
	email: string;
	firstName: string;
	lastName: string;
	isActive: boolean;
	accessLevel: RoomAccess;
};

export type RoomsPaginatedQueryResponse = {
	rooms: Array<
		Room & {
			noMembers: number;
			noGadgets: number;
		}
	>;
	metadata: {
		page: number;
		limit: number;
		total: number;
	};
};

export type RoomMembersPaginatedQueryResponse = {
	members: Array<RoomMember>;
	metadata: {
		page: number;
		limit: number;
		total: number;
	};
};

export type NonRoomMember = {
	userId: number;
	firstName: string;
	lastName: string;
	email: string;
};

export type RoomGadgetsPaginatedQueryResponse = {
	gadgets: Array<{
		gadgetType: GadgetType;
		type: DeviceType | SensorType;
		name: string;
		isSimulated: boolean;
		ip: string | null;
	}>;
	metadata: {
		page: number;
		limit: number;
		total: number;
	};
};
