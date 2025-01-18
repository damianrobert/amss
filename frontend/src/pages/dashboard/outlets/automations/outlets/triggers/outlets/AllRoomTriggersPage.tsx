import {useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {AlarmAdd, AutoAwesome} from '@mui/icons-material';
import {
	Button,
	Chip,
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
import {GetAllRoomTriggersPaginatedRequest} from '../../../../../../../api/automations/AutomationsTypes';
import {request} from '../../../../../../../api/api-handler';
import {RoomContext} from '../../../../../../../context/RoomContext';
import {TriggerCondition, TriggerType} from '../../../../../../../utils/TriggerUtils';

function AllRoomTriggersPage() {
	const navigate = useNavigate();

	const {getSelectedRoomId} = useContext(RoomContext);

	const [triggersPage, setTriggersPage] = useState<GetAllRoomTriggersPaginatedRequest['response']['triggers']>([]);
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
		request<GetAllRoomTriggersPaginatedRequest['query'], never, GetAllRoomTriggersPaginatedRequest['response']>(
			'/automations/triggers/all',
			{
				method: 'GET',
				params: {
					roomId: getSelectedRoomId() ?? -1,
					page: page + 1,
					limit: perPage,
				},
				successCallback(response) {
					setTriggersPage(response.triggers);
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
					startIcon={<AlarmAdd />}
					onClick={() => navigate('/automations/triggers/new')}
				>
					Create a new trigger
				</Button>
			</div>
			<TableContainer component={Paper}>
				{loading && (
					<div className="flex flex-row items-center justify-center gap-4 py-8">
						<CircularProgress size={48} />
						Loading...
					</div>
				)}
				{!loading && triggersPage.length === 0 && (
					<div className="flex flex-row items-center justify-center gap-4 py-8">No triggers found</div>
				)}

				{!loading && triggersPage.length > 0 && (
					<div>
						<Table sx={{minWidth: 650}} aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell align="right">ID</TableCell>
									<TableCell>Type</TableCell>
									<TableCell>Cron expression</TableCell>
									<TableCell>Sensor Id</TableCell>
									<TableCell>Condition</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{triggersPage.map((trigger) =>
									trigger.type == TriggerType.SCHEDULE ? (
										<TableRow key={trigger.id}>
											<TableCell align="right">{trigger.id}</TableCell>
											<TableCell>
												<Chip icon={<AutoAwesome />} label="Schedule" color="primary" variant="outlined" />
											</TableCell>
											<TableCell>{trigger.cronExp}</TableCell>
											<TableCell>None</TableCell>
											<TableCell>None</TableCell>
										</TableRow>
									) : trigger.type == TriggerType.SENSOR ? (
										<TableRow key={trigger.id}>
											<TableCell align="right">{trigger.id}</TableCell>
											<TableCell>
												<Chip icon={<AutoAwesome />} label="Sensor" color="secondary" variant="outlined" />
											</TableCell>
											<TableCell>None</TableCell>
											<TableCell>{trigger.sensorId}</TableCell>
											<TableCell>
												When sensor value{' '}
												{trigger.condition == TriggerCondition.EQUALS ? `EQUALS` : `is ${trigger.condition} then`}{' '}
												{trigger.conditionValue}
											</TableCell>
										</TableRow>
									) : (
										<TableRow key={trigger.id}>Something went wrong</TableRow>
									)
								)}
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

export default AllRoomTriggersPage;
