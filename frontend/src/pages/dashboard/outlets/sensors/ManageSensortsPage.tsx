import {Outlet} from 'react-router-dom';

function ManageSensorsPage() {
	return (
		<div className="flex flex-col gap-2">
			<div className="pb-4">
				<Outlet />
			</div>
		</div>
	);
}

export default ManageSensorsPage;
