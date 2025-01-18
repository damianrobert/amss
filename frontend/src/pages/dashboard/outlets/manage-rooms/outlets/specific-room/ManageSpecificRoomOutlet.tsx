import {AddCircle, PersonAdd} from '@mui/icons-material';
import {Button, CircularProgress} from '@mui/material';
import {useEffect, useReducer, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import RoomMembersTable from '../../../../../../components/tables/RoomMembersTable';
import {
	AssignRoomMemberRequest,
	GetRoomRequest,
	UnassignRoomMemberRequest,
	UpdateRoomMemberRequest,
} from '../../../../../../api/manage-rooms/manage-rooms-types';
import {request} from '../../../../../../api/api-handler';
import AddNewMemberToRoomModal from '../../../../../../components/modals/AddNewMemberToRoomModal';
import {RoomAccess} from '../../../../../../utils/RoomAccessType';
import UpdateRoomMemberModal from '../../../../../../components/modals/UpdateRoomMemberModal';
import RoomGadgetsTable from '../../../../../../components/tables/RoomGadgetsTable';

function ManageSpecificRoomOutlet() {
	const navigate = useNavigate();

	const {roomId} = useParams<{roomId: string}>();

	const [room, setRoom] = useState<GetRoomRequest['response'] | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
	const [updateMemberData, setUpdateMemberData] = useState<{
		userId: number;
		email: string;
		lastName: string;
		firstName: string;
		// add others here
		access: RoomAccess;
	} | null>(null);

	const [update, forceUpdate] = useReducer((x) => x + 1, 0);

	useEffect(() => {
		setIsLoading(true);
		request<never, never, GetRoomRequest['response']>(`/rooms/${Number(roomId)}`, {
			method: 'GET',
			successCallback(response) {
				setRoom(response);
				setIsLoading(false);
			},
			errorCallback() {
				setIsLoading(false);
			},
		});
		setIsLoading(false);
	}, [roomId]);

	const onMemberAccessUpdate = (userId: number, access: RoomAccess) => {
		request<never, UpdateRoomMemberRequest['payload'], UpdateRoomMemberRequest['response']>(
			`/rooms/${roomId}/update-member-access`,
			{
				method: 'PUT',
				body: {
					userId: userId,
					accessLevel: access,
				},
				successCallback() {
					setUpdateMemberData(null);
				},
				errorCallback() {
					console.error('Failed to unassign member');
				},
			}
		);

		forceUpdate();
	};

	const onMemberAssign = (userId: number, access: RoomAccess) => {
		request<never, AssignRoomMemberRequest['payload'], AssignRoomMemberRequest['response']>(
			`/rooms/${roomId}/assign-member`,
			{
				method: 'POST',
				body: {
					userId: userId,
					accessLevel: access,
				},
				successCallback() {
					setAddMemberModalOpen(false);
				},
				errorCallback() {
					console.error('Failed to assign member to room');
				},
			}
		);
		forceUpdate();
	};

	const onMemberUnassign = (userId: number) => {
		request<never, UnassignRoomMemberRequest['payload'], never>(`/rooms/${roomId}/unassign-member`, {
			method: 'POST',
			body: {
				userId: userId,
			},
			successCallback() {
				console.log('Member unassigned');
			},
			errorCallback() {
				console.error('Failed to unassign member');
			},
		});
		forceUpdate();
	};

	return (
		<div>
			{isLoading || !room ? (
				<div className="flex flex-row justify-center items-center align-middle h-full">
					{<CircularProgress size="84px" />}
				</div>
			) : (
				<div className="flex flex-col gap-6">
					<div className="flex flex-col justify-between items-center gap-4 bg-white rounded-3xl px-10 py-7 shadow relative">
						<div
							className="absolute top-0 left-0 w-full h-5 rounded-b rounded-t-full"
							style={{backgroundColor: `${room.color}77`}}
						/>
						<span className="font-semibold mt-3 text-4xl">{room?.name}</span>
					</div>
					<div className="flex flex-col gap-3">
						<div className="flex flex-row justify-between items-center gap-3">
							<span className="text-2xl font-semibold text-gray-800">Members</span>
							<Button
								size="large"
								variant="contained"
								startIcon={<PersonAdd />}
								onClick={() => setAddMemberModalOpen(true)}
							>
								Assign member
							</Button>
						</div>
						<div className="flex flex-col justify-between gap-4 bg-white rounded-3xl px-10 py-7 shadow relative">
							<RoomMembersTable
								update={update}
								roomId={room.id}
								onMemberAccessUpdate={(userData) => setUpdateMemberData(userData)}
								onMemberUnassign={(userId) => onMemberUnassign(userId)}
							/>
						</div>
					</div>
					<div className="flex flex-col gap-3">
						<div className="flex flex-row justify-between items-center gap-3">
							<span className="text-2xl font-semibold text-gray-800">Devices and Sensors</span>
							<Button
								size="large"
								variant="contained"
								startIcon={<AddCircle />}
								onClick={() => navigate(`/rooms/${roomId}/new-gadget`)}
							>
								Add new device or sensor
							</Button>
						</div>
						<div className="flex flex-col justify-between gap-4 bg-white rounded-3xl px-10 py-7 shadow relative">
							<RoomGadgetsTable roomId={room.id} />
						</div>
					</div>
				</div>
			)}
			{addMemberModalOpen && roomId && (
				<AddNewMemberToRoomModal
					onMemberAssign={onMemberAssign}
					roomId={Number(roomId)}
					isOpen={addMemberModalOpen}
					onClose={() => setAddMemberModalOpen(false)}
				/>
			)}
			{updateMemberData && roomId && (
				<UpdateRoomMemberModal
					onMemberUpdate={onMemberAccessUpdate}
					currentData={updateMemberData}
					isOpen={true}
					onClose={() => setUpdateMemberData(null)}
				/>
			)}
		</div>
	);
}

export default ManageSpecificRoomOutlet;
