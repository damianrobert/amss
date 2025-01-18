import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {
	TableContainer,
	Paper,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	TablePagination,
	CircularProgress,
	Chip,
	Button,
} from '@mui/material';
import {request} from '../../../../../api/api-handler';
import {AllUsersPaginatedRequest} from '../../../../../api/manage-users/manage-users-types';
import {PersonAdd} from '@mui/icons-material';

function ManageAllUsersOutlet() {
	const navigate = useNavigate();

	const [usersPage, setUsersPage] = useState<
		Array<{
			id: number;
			email: string;
			firstName: string;
			lastName: string;
			isActive: boolean;
			isAdmin: boolean;
			hasTotp: boolean;
		}>
	>([]);
	const [metadata, setMetadata] = useState<{
		total: number;
		page: number;
		perPage: number;
	}>({total: 0, page: 0, perPage: 0});
	const [loading, setLoading] = useState(true);

	const [page, setPage] = useState(0);
	const [perPage, setPerPage] = useState(10);

	useEffect(() => {
		setLoading(true);
		request<AllUsersPaginatedRequest['query'], never, AllUsersPaginatedRequest['response']>('/users-all', {
			method: 'GET',
			params: {
				page: page + 1,
				limit: perPage,
			},
			successCallback(response) {
				setUsersPage(response.users);
				setMetadata({
					total: response.metadata.total,
					page: response.metadata.page,
					perPage: response.metadata.perPage,
				});
				setLoading(false);
			},
			errorCallback() {
				setLoading(false);
			},
		});
	}, [page, perPage]);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-row justify-between">
				<span className="text-4xl font-medium text-gray-800">Manage users</span>
				<Button
					variant="contained"
					color="primary"
					size="large"
					startIcon={<PersonAdd />}
					onClick={() => navigate('/users/register')}
				>
					Register new user
				</Button>
			</div>
			<TableContainer component={Paper}>
				{loading && (
					<div className="flex flex-row items-center justify-center gap-4 py-8">
						<CircularProgress size={48} />
						Loading...
					</div>
				)}
				{!loading && usersPage.length === 0 && (
					<div className="flex flex-row items-center justify-center gap-4 py-8">No users found</div>
				)}

				{!loading && usersPage.length > 0 && (
					<div>
						<Table sx={{minWidth: 650}} aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell align="right">ID</TableCell>
									<TableCell>Email</TableCell>
									<TableCell>Full name</TableCell>
									<TableCell>Role</TableCell>
									<TableCell>Status</TableCell>
									<TableCell>Action</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{usersPage.map((user) => (
									<TableRow key={user.id} sx={{'&:last-child td, &:last-child th': {border: 0}}}>
										<TableCell align="right">{user.id}</TableCell>
										<TableCell>{user.email}</TableCell>
										<TableCell>
											{user.firstName} {user.lastName}
										</TableCell>
										<TableCell>
											{user.isAdmin ? (
												<Chip color="primary" label="Admin" />
											) : (
												<Chip color="secondary" label="Regular user" />
											)}
										</TableCell>
										<TableCell>
											{user.isActive ? <Chip color="success" label="Active" /> : <Chip label="Inactive" />}
										</TableCell>
										<TableCell>
											<Button variant="outlined" onClick={() => navigate(`/users/user/${user.id}`)}>
												Manage
											</Button>
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
					count={metadata.total}
					page={page}
					onPageChange={(_, newPage) => setPage(newPage)}
					rowsPerPage={perPage}
					onRowsPerPageChange={(event) => setPerPage(parseInt(event.target.value, 10))}
				/>
			</TableContainer>
		</div>
	);
}

export default ManageAllUsersOutlet;
