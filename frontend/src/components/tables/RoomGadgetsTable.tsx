import {useEffect, useState} from 'react';
import {GetRoomGadgetsPaginatedRequest} from '../../api/manage-rooms/manage-rooms-types';
import {request} from '../../api/api-handler';
import {
	Chip,
	CircularProgress,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
} from '@mui/material';

type RoomGadgetsTableProps = {
	roomId: number;
};

function RoomGadgetsTable({roomId}: RoomGadgetsTableProps) {
	const [gadgetsPage, setGadgetsPage] = useState<GetRoomGadgetsPaginatedRequest['response']['gadgets']>([]);
	const [totalGadgets, setTotalGadgets] = useState<number>(0);
	const [loading, setLoading] = useState(true);

	const [page, setPage] = useState(0);
	const [perPage, setPerPage] = useState(4);

	useEffect(() => {
		setLoading(true);
		request<GetRoomGadgetsPaginatedRequest['params'], never, GetRoomGadgetsPaginatedRequest['response']>(
			`/rooms/${roomId}/gadgets`,
			{
				params: {
					page,
					limit: perPage,
				},
				method: 'GET',
				successCallback(response) {
					setGadgetsPage(response.gadgets);
					setTotalGadgets(response.metadata.total);
				},
				errorCallback() {},
			}
		);

		setLoading(false);
	}, [roomId, page, perPage]);

	return (
		<TableContainer>
			{loading && (
				<div className="flex flex-row items-center justify-center gap-4 py-8">
					<CircularProgress size={48} />
				</div>
			)}
			{!loading && gadgetsPage.length === 0 && (
				<div className="flex flex-row items-center justify-center gap-4 py-8">This room has no assigned gadgets</div>
			)}

			{!loading && gadgetsPage.length > 0 && (
				<div>
					<Table sx={{minWidth: 650}} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Gadget Type</TableCell>
								<TableCell>Type</TableCell>
								<TableCell>Name</TableCell>
								<TableCell>Simulated</TableCell>
								<TableCell>IP Address</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{gadgetsPage.map((gadget) => (
								<TableRow key={gadget.gadgetType + gadget.name} sx={{'&:last-child td, &:last-child th': {border: 0}}}>
									<TableCell>
										<Chip label={gadget.gadgetType} />
									</TableCell>
									<TableCell>
										<Chip label={gadget.type} />
									</TableCell>
									<TableCell>
										<Chip label={gadget.name} />
									</TableCell>
									<TableCell>
										<Chip label={gadget.isSimulated == true ? 'Yes' : 'No'} />
									</TableCell>
									<TableCell>
										<Chip label={gadget.isSimulated ? 'None' : gadget.ip} />
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
				count={totalGadgets}
				page={page}
				onPageChange={(_, newPage) => setPage(newPage)}
				rowsPerPage={perPage}
				onRowsPerPageChange={(event) => setPerPage(parseInt(event.target.value, 10))}
				rowsPerPageOptions={[4, 6, 12]}
			/>
		</TableContainer>
	);
}

export default RoomGadgetsTable;
