import {Outlet} from 'react-router-dom';

function ManageRoomsPage() {
	return (
		<div className="flex flex-col gap-2">
			<div className="pb-4">
				<Outlet />
			</div>
		</div>
	);
}

export default ManageRoomsPage;
