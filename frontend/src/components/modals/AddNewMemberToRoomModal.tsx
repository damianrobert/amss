import {useEffect, useMemo, useState} from 'react';
import Select, {StylesConfig} from 'react-select';

import {RoomAccess} from '../../utils/RoomAccessType';
import ModalSkeleton from './ModalSkeleton';
import {request} from '../../api/api-handler';
import {GetUsersNotRoomMembersRequest} from '../../api/manage-rooms/manage-rooms-types';
import {Button} from '@mui/material';

type AddNewMemberToRoomModalProps = {
	roomId: number;
	onMemberAssign: (userId: number, access: RoomAccess) => void;
	isOpen: boolean;
	onClose: () => void;
};

function AddNewMemberToRoomModal({roomId, onMemberAssign, isOpen, onClose}: AddNewMemberToRoomModalProps) {
	const [userIdToAssign, setUserIdToAssign] = useState(-1);
	const [accessLevel, setAccessLevel] = useState<RoomAccess>(RoomAccess.READ_ONLY);

	const [nonMembersEmails, setNonMembersEmails] = useState<Array<{
		userId: string;
		firstName: string;
		lastName: string;
		email: string;
	}> | null>(null);

	useEffect(() => {
		request<never, never, GetUsersNotRoomMembersRequest['response']>(`/rooms/${roomId}/non-members`, {
			method: 'GET',
			successCallback(response) {
				setNonMembersEmails(response);
			},
			errorCallback() {
				console.error('Failed to fetch non-members emails');
			},
		});
	}, [roomId]);

	const emailOptions = useMemo(
		() =>
			nonMembersEmails?.map((user) => ({
				value: user.userId,
				label: `${user.email} - ${user.firstName} ${user.lastName}`,
			})) ?? [],
		[nonMembersEmails]
	);

	return (
		<ModalSkeleton isOpen={isOpen} onClose={onClose}>
			<div className="flex flex-col gap-4 text-black bg-slate-200 py-4 px-8 mx-5">
				<div className="flex flex-col items-center gap-6 text-black py-6 px-6 md:px-8">
					<span className="font-bold text-xl md:text-3xl text-center">Assign new member to room</span>

					<Select
						placeholder={'Select user...'}
						noOptionsMessage={() => 'No users left to add'}
						options={emailOptions}
						styles={customStyles}
						className="w-full"
						onChange={(newValue: unknown) => {
							const selectedOption = newValue as {value: number} | null;
							setUserIdToAssign(selectedOption?.value ?? -1);
						}}
					/>

					<Select
						placeholder={'Select access level...'}
						options={[
							{value: RoomAccess.READ_ONLY, label: 'Read only'},
							{value: RoomAccess.READ_WRITE, label: 'Read write'},
						]}
						styles={customStyles}
						className="w-full"
						onChange={(newValue: unknown) => {
							const selectedOption = newValue as {value: RoomAccess} | null;
							setAccessLevel(selectedOption?.value ?? RoomAccess.READ_ONLY);
						}}
					/>

					<Button
						disabled={userIdToAssign == -1 || !accessLevel}
						variant="contained"
						onClick={() => onMemberAssign(userIdToAssign, accessLevel)}
					>
						Assign member
					</Button>
				</div>
			</div>
		</ModalSkeleton>
	);
}

export default AddNewMemberToRoomModal;

const customStyles: StylesConfig = {
	control: (base) => ({
		...base,
		display: 'flex',
		alignItems: 'center',
		cursor: 'pointer',
		color: 'white',
		border: 'none',
		paddingBottom: '0.5rem',
		paddingTop: '0.5rem',
		width: '100%',
	}),
	singleValue: (base) => ({
		...base,
		display: 'flex',
		alignItems: 'center',
		gap: '0.5rem',
		width: '100%',
	}),
	menuList: (base) => ({
		...base,
		padding: 0,
		width: '100%',
	}),
	option: (base) => ({
		...base,
		display: 'flex',
		alignItems: 'center',
		gap: '0.5rem',
		cursor: 'pointer',
		width: '100%',
	}),
	menu: (base) => ({
		...base,
		marginTop: '0.1rem',
		paddingBottom: '0.5rem',
		paddingTop: '0.5rem',
		width: '100%',
	}),
};
