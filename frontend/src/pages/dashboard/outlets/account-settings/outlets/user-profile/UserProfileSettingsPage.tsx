import AccountUpdateForm from '../../../../../../components/forms/AccountUpdateForm';

function UserProfileSettingsPage() {
	return (
		<div className="flex flex-col justify-center items-center mt-3">
			<div className="flex flex-col items-center gap-6 w-full max-w-4xl bg-white rounded-2xl px-6 py-8 shadow">
				<span className="text-2xl font-medium text-gray-800">Update profile</span>
				<AccountUpdateForm />
			</div>
		</div>
	);
}

export default UserProfileSettingsPage;
