import {useState} from 'react';
import Select from 'react-select';

import {RoomAccess} from '../../utils/RoomAccessType';
import ModalSkeleton from './ModalSkeleton';
import {Button} from '@mui/material';
import {defaultSelectStyles} from '../select/DefaultSelectStyle';

type AddNewMemberToRoomModalProps = {
	currentData: {
		userId: number;
		email: string;
		lastName: string;
		firstName: string;
		// add others here
		access: RoomAccess;
	};
	onMemberUpdate: (userId: number, access: RoomAccess) => void;
	isOpen: boolean;
	onClose: () => void;
};
function UpdateRoomMemberModal({currentData, onMemberUpdate, isOpen, onClose}: AddNewMemberToRoomModalProps) {
	const [accessLevel, setAccessLevel] = useState<RoomAccess>(currentData.access);
	return (
		<ModalSkeleton isOpen={isOpen} onClose={onClose}>
			<div className="flex flex-col gap-4 text-black bg-slate-200 py-4 px-8 mx-5">
				<div className="flex flex-col items-center gap-6 text-black py-6 px-6 md:px-8">
					<span className="font-bold text-xl md:text-3xl text-center">
						Update {currentData.firstName} {currentData.lastName}'s room membership
					</span>

					<input type="text" value={currentData.email} className="w-full text-black bg-slate-100 p-2" disabled />

					<Select
						placeholder={'Select access level...'}
						options={[
							{value: RoomAccess.READ_ONLY, label: 'Read-only'},
							{value: RoomAccess.READ_WRITE, label: 'Read-write'},
						]}
						value={{value: accessLevel, label: accessLevel === RoomAccess.READ_ONLY ? 'Read-only' : 'Read-write'}}
						styles={defaultSelectStyles}
						className="w-full"
						onChange={(newValue: unknown) => {
							const selectedOption = newValue as {value: RoomAccess} | null;
							setAccessLevel(selectedOption?.value ?? RoomAccess.READ_ONLY);
						}}
					/>

					<Button variant="contained" onClick={() => onMemberUpdate(currentData.userId, accessLevel)}>
						<span>Update </span>
					</Button>
				</div>
			</div>
		</ModalSkeleton>
	);
}

export default UpdateRoomMemberModal;
