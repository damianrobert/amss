import {useEffect, useReducer, useState} from 'react';
import {Outlet, useLocation, useNavigate} from 'react-router-dom';

import {Tabs, Tab, CircularProgress} from '@mui/material';
import {request} from '../../../../api/api-handler';
import {AccountDetailsRequest} from '../../../../api/access/account-security-types';

export type AccountSecurityPageOutletProps = {
	hasTwoFactorAuth: boolean;
	forceUpdate: () => void;
};

function AccountSettingsPage() {
	const location = useLocation();
	const navigate = useNavigate();

	const [update, forceUpdate] = useReducer((x) => x + 1, 0);

	const [value, setValue] = useState(
		location.pathname.split('/')[location.pathname.split('/').length - 1] === 'account-settings'
			? ''
			: location.pathname.split('/')[location.pathname.split('/').length - 1]
	);

	const [accountDetails, setAccountDetails] = useState<AccountDetailsRequest['response'] | null>(null);

	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		setLoading(true);
		request<never, never, AccountDetailsRequest['response']>('/user/account-details', {
			method: 'GET',
			successCallback: (response) => {
				setAccountDetails(response);
			},
			errorCallback: (error) => {
				console.error(error);
			},
		});
		setLoading(false);
	}, [update]);

	const handleChange = (newValue: string) => {
		navigate(newValue);
		setValue(newValue);
	};

	return (
		<div className="flex flex-col gap-2">
			<span className="text-4xl font-medium text-gray-800">Account settings</span>
			<div className="w-full">
				<Tabs className="overflow-x-scroll" value={value} onChange={(_, value) => handleChange(value)}>
					<Tab label="User profile" value="" id="profile" />
					<Tab label="Security" value="security" id="security" />
				</Tabs>
				{loading || !accountDetails ? (
					<div className="flex flex-col items-center justify-center">
						<CircularProgress size={48} />
					</div>
				) : (
					<Outlet context={{...accountDetails, forceUpdate}} />
				)}
			</div>
		</div>
	);
}

export default AccountSettingsPage;
