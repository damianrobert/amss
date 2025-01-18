import {RoomAccess} from '../../utils/RoomAccessType';
import {useEffect, useState} from 'react';
import {
	TableContainer,
	CircularProgress,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Chip,
	Button,
	TablePagination,
} from '@mui/material';
import {PersonRemove} from '@mui/icons-material';
import {GetRoomMembersPaginatedRequest} from '../../api/manage-rooms/manage-rooms-types';
import {request} from '../../api/api-handler';

type RoomMembersTableProps = {
	update: number;
	roomId: number;
	onMemberAccessUpdate(userData: {
		userId: number;
		email: string;
		lastName: string;
		firstName: string;
		// add others here
		access: RoomAccess;
	}): void;
	onMemberUnassign: (userId: number) => void;
};

function RoomMembersTable({update, roomId, onMemberAccessUpdate, onMemberUnassign}: RoomMembersTableProps) {
	const [usersPage, setUsersPage] = useState<GetRoomMembersPaginatedRequest['response']['members']>([]);
	const [totalUsers, setTotalUsers] = useState<number>(0);
	const [loading, setLoading] = useState(true);

	const [page, setPage] = useState(0);
	const [perPage, setPerPage] = useState(4);

	useEffect(() => {
		setLoading(true);
		request<GetRoomMembersPaginatedRequest['params'], never, GetRoomMembersPaginatedRequest['response']>(
			`/rooms/${roomId}/members`,
			{
				params: {
					page,
					limit: perPage,
				},
				method: 'GET',
				successCallback(response) {
					setUsersPage(response.members);
					setTotalUsers(response.metadata.total);
				},
				errorCallback() {},
			}
		);

		setLoading(false);
	}, [roomId, page, perPage, update]);

	return (
		<TableContainer>
			{loading && (
				<div className="flex flex-row items-center justify-center gap-4 py-8">
					<CircularProgress size={48} />
				</div>
			)}
			{!loading && usersPage.length === 0 && (
				<div className="flex flex-row items-center justify-center gap-4 py-8">This room has no assigned members</div>
			)}

			{!loading && usersPage.length > 0 && (
				<div>
					<Table sx={{minWidth: 650}} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell align="right">ID</TableCell>
								<TableCell>Email</TableCell>
								<TableCell>Full name</TableCell>
								<TableCell>Rights</TableCell>
								<TableCell>Status</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{usersPage.map((user) => (
								<TableRow key={user.userId} sx={{'&:last-child td, &:last-child th': {border: 0}}}>
									<TableCell align="right">{user.userId}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>
										{user.firstName} {user.lastName}
									</TableCell>
									<TableCell>
										{user.accessLevel == RoomAccess.READ_WRITE && <Chip color="primary" label="Read-Write" />}
										{user.accessLevel == RoomAccess.READ_ONLY && <Chip color="secondary" label="Read Only" />}
									</TableCell>
									<TableCell>
										{user.isActive ? <Chip color="success" label="Active" /> : <Chip label="Inactive" />}
									</TableCell>
									<TableCell>
										<div className="flex flex-row justify-center gap-4">
											<Button
												onClick={() =>
													onMemberAccessUpdate({
														userId: user.userId,
														email: user.email,
														lastName: user.lastName,
														firstName: user.firstName,
														access: user.accessLevel,
													})
												}
												variant="outlined"
											>
												Manage
											</Button>
											<Button
												variant="outlined"
												startIcon={<PersonRemove />}
												onClick={() => onMemberUnassign(user.userId)}
												color="error"
											>
												Unassign
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}
			<TablePagination
				disabled={loading}
				component="div"
				count={totalUsers}
				page={page}
				onPageChange={(_, newPage) => setPage(newPage)}
				rowsPerPage={perPage}
				onRowsPerPageChange={(event) => setPerPage(parseInt(event.target.value, 10))}
				rowsPerPageOptions={[4, 6, 12]}
			/>
		</TableContainer>
	);
}

export default RoomMembersTable;
