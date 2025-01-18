import {useEffect, useReducer, useState} from 'react';
import {Outlet, useLocation, useNavigate} from 'react-router-dom';

import {Tabs, Tab} from '@mui/material';

export type AutomationsPageOutletProps = {
	forceUpdate: () => void;
};

function AutomationsPage() {
	const location = useLocation();
	const navigate = useNavigate();

	const [update, forceUpdate] = useReducer((x) => x + 1, 0);

	const [value, setValue] = useState(
		location.pathname.split('/')[location.pathname.split('/').length - 2] === 'routines'
			? ''
			: location.pathname.split('/')[location.pathname.split('/').length - 2]
	);

	useEffect(() => {
		navigate('/automations/routines/all');
		setValue('/automations/routines/all');
	}, []);

	const handleChange = (newValue: string) => {
		navigate(newValue);
		setValue(newValue);
	};

	return (
		<div className="flex flex-col gap-2">
			<span className="text-4xl font-medium text-gray-800">Automations</span>
			<div className="w-full">
				<Tabs className="overflow-x-scroll" value={value}>
					<Tab
						label="Routines"
						value="/automations/routines/all"
						onClick={() => handleChange('/automations/routines/all')}
						id="routines"
					/>
					<Tab
						label="Triggers"
						value="/automations/triggers/all"
						onClick={() => handleChange('/automations/triggers/all')}
						id="triggers"
					/>
				</Tabs>

				<Outlet context={{forceUpdate}} />
			</div>
		</div>
	);
}

export default AutomationsPage;
