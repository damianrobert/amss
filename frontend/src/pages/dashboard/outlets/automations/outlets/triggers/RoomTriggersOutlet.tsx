import {Outlet, useOutletContext} from 'react-router-dom';
import {AutomationsPageOutletProps} from '../../AutomationsPage';

function RoomTriggersOutlet() {
	const {forceUpdate} = useOutletContext<AutomationsPageOutletProps>();

	return (
		<div>
			<Outlet />
		</div>
	);
}

export default RoomTriggersOutlet;
