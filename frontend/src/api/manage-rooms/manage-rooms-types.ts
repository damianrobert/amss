import {SensorType} from '../../utils/GadgetsTypes';
import {RoomAccess} from '../../utils/RoomAccessType';

export type CreateNewRoomRequest = {
	method: 'POST';
	url: '/rooms/new';
	payload: {
		name: string;
		color: string;
	};
	response: {
		newRoomId: number;
	};
};

export type GetAllRoomsPaginatedRequest = {
	method: 'GET';
	url: '/rooms/all';
	params: {
		page: number;
		limit: number;
	};
	response: {
		rooms: Array<{
			id: number;
			name: string;
			color: string;
			noMembers: number;
			noGadgets: number;
		}>;
		metadata: {
			page: number;
			limit: number;
			total: number;
		};
	};
};

export type GetRoomRequest = {
	method: 'GET';
	url: '/rooms/:roomId';
	response: {
		id: number;
		name: string;
		color: string;
	};
};

export type GetRoomMembersPaginatedRequest = {
	method: 'GET';
	url: '/rooms/:roomId/members';
	params: {
		page: number;
		limit: number;
	};
	response: {
		members: Array<{
			userId: number;
			email: string;
			firstName: string;
			lastName: string;
			isActive: boolean;
			accessLevel: RoomAccess;
		}>;
		metadata: {
			page: number;
			limit: number;
			total: number;
		};
	};
};

export type AssignRoomMemberRequest = {
	method: 'POST';
	url: '/rooms/:roomId/assign-member';
	payload: {
		userId: number;
		accessLevel: RoomAccess;
	};
	response: {
		success: boolean;
	};
};

export type UnassignRoomMemberRequest = {
	method: 'POST';
	url: '/rooms/:roomId/unassign-member';
	payload: {
		userId: number;
	};
	response: {
		success: boolean;
	};
};

export type UpdateRoomMemberRequest = {
	method: 'PUT';
	url: '/rooms/:roomId/update-member-access';
	payload: {
		userId: number;
		accessLevel: RoomAccess;
	};
	response: {
		success: boolean;
	};
};

export type GetUsersNotRoomMembersRequest = {
	method: 'GET';
	url: '/rooms/:roomId/non-members';
	response: Array<{
		userId: string;
		firstName: string;
		lastName: string;
		email: string;
	}>;
};

//
export type GetUserRoomsRequest = {
	method: 'GET';
	url: '/rooms/members/:userId/rooms';
	response: {
		rooms: Array<{
			id: string;
			name: string;
			color: string;
			accessLevel: RoomAccess;
		}>;
	};
};

export type AddGadgetRequest = {
	method: 'POST';
	url: '/rooms/:roomId/new-gadget';
	payload: {
		gadgetType: string;
		isSimulated: boolean;
		deviceType?: string;
		sensorType?: string;
		gadgetName: string;
		gadgetIp: string;
	};
	response: {
		success: boolean;
	};
};

export type GetRoomGadgetsPaginatedRequest = {
	method: 'GET';
	url: '/rooms/:roomId/gadgets';
	params: {
		page: number;
		limit: number;
	};
	response: {
		gadgets: Array<{
			gadgetType: string;
			type: string;
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
};

export type GetAvailableRoomsRequest = {
	method: 'GET';
	url: '/rooms/available';
	response: Array<{
		id: number;
		name: string;
		color: string;
	}>;
};

export type GetAllRoomSensorsRequest = {
	method: 'GET';
	url: '/rooms/:roomId/all-sensors';
	response: {
		sensors: Array<{
			id: number;
			type: SensorType;
			name: string;
		}>;
	};
};
