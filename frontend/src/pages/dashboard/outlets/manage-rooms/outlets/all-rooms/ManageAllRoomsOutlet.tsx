import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {Button, TablePagination} from '@mui/material';
import {AddLocation, ArrowForwardIos} from '@mui/icons-material';
import {request} from '../../../../../../api/api-handler';
import {GetAllRoomsPaginatedRequest} from '../../../../../../api/manage-rooms/manage-rooms-types';

function ManageAllRoomsOutlet() {
	const navigate = useNavigate();

	const [rooms, setRooms] = useState<
		Array<{id: number; name: string; color: string; noMembers: number; noGadgets: number}>
	>([]);
	const [page, setPage] = useState(0);
	const [perPage, setPerPage] = useState(9);
	const [noRooms, setNoRooms] = useState<number | null>(null);

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);

		request<GetAllRoomsPaginatedRequest['params'], unknown, GetAllRoomsPaginatedRequest['response']>('/rooms/all', {
			method: 'GET',
			params: {
				page,
				limit: perPage,
			},
			successCallback(response) {
				setRooms(response.rooms);
				setNoRooms(response.metadata.total);
			},
			errorCallback() {
				setRooms([]);
				setNoRooms(0);
			},
		});

		setLoading(false);
	}, [page, perPage]);

	return (
		<div className="flex flex-col gap-6  bg-gray-100 min-h-max">
			<header className="flex justify-between ">
				<span className="text-4xl font-medium text-gray-800">Manage rooms</span>
				<Button size="large" variant="contained" startIcon={<AddLocation />} onClick={() => navigate('/rooms/new')}>
					Register New Room
				</Button>
			</header>

			<section className="mt-auto">
				<TablePagination
					component="div"
					count={noRooms || 0}
					page={page}
					onPageChange={(_, newPage) => setPage(newPage)}
					rowsPerPage={perPage}
					rowsPerPageOptions={[9, 12, 15]}
					onRowsPerPageChange={(event) => setPerPage(parseInt(event.target.value, 10))}
					disabled={loading}
					className="bg-white p-4 rounded-lg shadow-sm"
				/>
			</section>

			<section className="flex flex-col gap-4">
				{loading ? (
					<p className="text-center text-gray-500">Loading rooms...</p>
				) : rooms && rooms.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{rooms.map((room) => (
							<div
								key={room.id}
								className="group relative p-6 bg-white rounded-xl shadow hover:shadow-md transform transition duration-200 select-none"
								onClick={() => navigate(`/rooms/${room.id}`)}
								role="button"
								tabIndex={0}
							>
								<div
									className="absolute top-0 left-0 w-full h-3 rounded-b rounded-t-3xl"
									style={{backgroundColor: `${room.color}77`}}
								/>

								<h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 text-center">
									{room.name}
								</h2>
								<div className="mt-4 flex justify-around text-gray-600">
									<div className="text-center">
										<p className="text-sm">Members</p>
										<p className="text-lg font-bold">{room.noMembers}</p>
									</div>
									<div className="text-center">
										<p className="text-sm">Gadgets</p>
										<p className="text-lg font-bold">{room.noGadgets}</p>
									</div>
								</div>

								<div className="absolute top-6 right-4 text-transparent group-hover:text-blue-500 transition">
									<ArrowForwardIos fontSize="small" />
								</div>
							</div>
						))}
					</div>
				) : (
					<p className="text-center text-lg font-medium text-gray-800">
						No rooms found. Click "Register New Room" to add one.
					</p>
				)}
			</section>
		</div>
	);
}

export default ManageAllRoomsOutlet;
