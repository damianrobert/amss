import {useOutletContext} from 'react-router-dom';
import ChangePasswordForm from '../../../../../../components/forms/ChangePasswordForm';
import ManageUserTotp from '../../../../../../components/totp/ManageUserTotp';
import {AccountSecurityPageOutletProps} from '../../AccountSettingsPage';

function AccountSecurityPage() {
	const {hasTwoFactorAuth} = useOutletContext<AccountSecurityPageOutletProps>();

	return (
		<div className="flex flex-col gap-6 py-4 items-center">
			<div className="flex flex-col gap-6 w-10/12 max-w-xl bg-white rounded-2xl px-6 py-8 shadow">
				<span className="text-2xl font-medium text-gray-800">Two Factor Authentificaton</span>
				<ManageUserTotp hasTwoFactorAuth={hasTwoFactorAuth} />
			</div>
			<div className="flex flex-col gap-6 w-10/12 max-w-xl bg-white rounded-2xl px-6 py-8 shadow">
				<span className="text-2xl font-medium text-gray-800">Change password</span>
				<ChangePasswordForm />
			</div>
		</div>
	);
}

export default AccountSecurityPage;
