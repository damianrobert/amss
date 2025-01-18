import {useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {AutoAwesome} from '@mui/icons-material';
import {
	Button,
	CircularProgress,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
} from '@mui/material';
import {GetAllRoomRoutinesPaginatedRequest} from '../../../../../../../api/automations/AutomationsTypes';
import {request} from '../../../../../../../api/api-handler';
import {RoomContext} from '../../../../../../../context/RoomContext';

function AllRoomRoutinesPage() {
	const navigate = useNavigate();

	const {getSelectedRoomId} = useContext(RoomContext);

	const [routinesPage, setRoutinesPage] = useState<Array<{}>>([]);
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
		request<GetAllRoomRoutinesPaginatedRequest['query'], never, GetAllRoomRoutinesPaginatedRequest['response']>(
			'/automations/routines/all',
			{
				method: 'GET',
				params: {
					roomId: getSelectedRoomId() ?? -1,
					page: page + 1,
					limit: perPage,
				},
				successCallback(response) {
					setRoutinesPage(response.routines);
					setMetadata({
						total: response.metadata.total,
						page: response.metadata.page,
						perPage: response.metadata.limit,
					});
					setLoading(false);
				},
				errorCallback() {
					setLoading(false);
				},
			}
		);
	}, [page, perPage]);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-row justify-end">
				<Button
					variant="contained"
					color="primary"
					size="large"
					startIcon={<AutoAwesome />}
					onClick={() => navigate('/automations/routines/new')}
				>
					Create a new routine
				</Button>
			</div>
			<TableContainer component={Paper}>
				{loading && (
					<div className="flex flex-row items-center justify-center gap-4 py-8">
						<CircularProgress size={48} />
						Loading...
					</div>
				)}
				{!loading && routinesPage.length === 0 && (
					<div className="flex flex-row items-center justify-center gap-4 py-8">No routines found</div>
				)}

				{!loading && routinesPage.length > 0 && (
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
								{routinesPage.map((routine, index) => (
									<TableRow key={index} sx={{'&:last-child td, &:last-child th': {border: 0}}}>
										<TableCell align="right"></TableCell>
										<TableCell></TableCell>
										<TableCell></TableCell>
										<TableCell></TableCell>
										<TableCell></TableCell>
										<TableCell></TableCell>
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

export default AllRoomRoutinesPage;
