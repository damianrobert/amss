import {Express} from 'express';
import {asyncHandler} from '../../endpoints/utils/async-handler';
import {IRoomsRepository} from '../../domain/rooms/IRoomsRepository';

import {authenticatedUserEndpoint} from '../../middlewares/authenticated-user-endpoint';
import {getPaginatedRoomsRequestHandler} from './get-paginated-rooms';
import {roomAssignMemberRequestHandler} from './assign-member';
import {createNewRoomRequestHandler} from './create-room';
import {getRoomMembersPaginatedRoomsRequestHandler} from './get-room-members';
import {getSpefificRoomRequestHandler} from './get-specific-room';
import {getUserRoomsRequestHandler} from './get-user-rooms';
import {unassignRoomMemberRequestHandler} from './unassign-member';
import {updateRoomMemberRequestHandler} from './update-member-access';
import {getUsersNotRoomMembersRequestHandler} from './get-users-not-room-members';
import {addNewGadgetRequestHandler} from './add-gadget';
import {getGadgetsPaginatedRequestHandler} from './get-gadgets-paginated';
import {getAvailableRoomsRequestHandler} from './get-available-rooms';
import {getAllSensorsRequestHandler} from './get-all-sensors';

export const registerRoomsEndpoints = (app: Express, roomRepository: IRoomsRepository) => {
	app.get('/rooms/available', authenticatedUserEndpoint, asyncHandler(getAvailableRoomsRequestHandler(roomRepository)));
	app.post('/rooms/new', authenticatedUserEndpoint, asyncHandler(createNewRoomRequestHandler(roomRepository)));
	app.get('/rooms/all', authenticatedUserEndpoint, asyncHandler(getPaginatedRoomsRequestHandler(roomRepository)));
	app.get('/rooms/:roomId', authenticatedUserEndpoint, asyncHandler(getSpefificRoomRequestHandler(roomRepository)));

	app.get('/rooms/:roomId/members', authenticatedUserEndpoint, asyncHandler(getRoomMembersPaginatedRoomsRequestHandler(roomRepository)));
	app.post('/rooms/:roomId/assign-member', authenticatedUserEndpoint, asyncHandler(roomAssignMemberRequestHandler(roomRepository)));
	app.post('/rooms/:roomId/unassign-member', authenticatedUserEndpoint, asyncHandler(unassignRoomMemberRequestHandler(roomRepository)));
	app.put('/rooms/:roomId/update-member-access', authenticatedUserEndpoint, asyncHandler(updateRoomMemberRequestHandler(roomRepository)));

	app.get('/rooms/members/:userId/rooms', authenticatedUserEndpoint, asyncHandler(getUserRoomsRequestHandler(roomRepository)));

	app.get('/rooms/:roomId/non-members', authenticatedUserEndpoint, asyncHandler(getUsersNotRoomMembersRequestHandler(roomRepository)));

	app.post('/rooms/:roomId/new-gadget', authenticatedUserEndpoint, asyncHandler(addNewGadgetRequestHandler(roomRepository)));

	app.get('/rooms/:roomId/gadgets', authenticatedUserEndpoint, asyncHandler(getGadgetsPaginatedRequestHandler(roomRepository)));

	app.get('/rooms/:roomId/all-sensors', authenticatedUserEndpoint, asyncHandler(getAllSensorsRequestHandler(roomRepository)));
};
