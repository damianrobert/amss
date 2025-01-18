import {useContext, useEffect, useReducer, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Button, Chip, CircularProgress, TextField, Tooltip} from '@mui/material';
import {Delete} from '@mui/icons-material';

import {request} from '../../../../../api/api-handler';
import {DeleteUserRequest, SpecificUserRequest} from '../../../../../api/manage-users/manage-users-types';
import AdminUserUpdateForm from '../../../../../components/forms/AdminUserUpdateForm';
import AdminChangeUserPasswordForm from '../../../../../components/forms/AdminChangeUserPasswordForm';
import {AuthContext} from '../../../../../context/AuthContext';

function ManageSpecificUserOutlet() {
	const navigate = useNavigate();

	const {user: userContext} = useContext(AuthContext);

	const [update, forceUpdate] = useReducer((x) => x + 1, 0);

	const {userId} = useParams<{userId: string}>();
	const [user, setUser] = useState<SpecificUserRequest['response'] | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const [userDeleteEmailConfirmation, setUserDeleteEmailConfirmation] = useState<string>('');

	const handleDisableTotp = () => {
		if (user) {
			request<never, never, never>(`/users/user/${Number(userId)}/disable-totp`, {
				method: 'POST',
				successCallback() {
					setUser({...user, hasTotp: false});
				},
				errorCallback(error: Error): void {
					console.error(error);
				},
			});
		}
	};

	useEffect(() => {
		setIsLoading(true);
		request<never, never, SpecificUserRequest['response']>(`/users/user/${Number(userId)}`, {
			method: 'GET',
			successCallback(response) {
				setUser(response);
				setIsLoading(false);
			},
			errorCallback() {
				setIsLoading(false);
			},
		});
	}, [userId, update]);

	const handleDeleteUser = (id: number) => {
		request<never, never, DeleteUserRequest['response']>(`/users/user/${id}`, {
			method: 'DELETE',
			successCallback() {
				navigate('/users');
			},
			errorCallback(error: Error) {
				console.error(error);
			},
		});
	};

	return (
		<div>
			{isLoading || !user ? (
				<div className="flex justify-center items-center align-middle h-full">
					<CircularProgress size="100px" />
				</div>
			) : (
				<div className="flex flex-col gap-3">
					<div className="flex flex-row justify-between items-center gap-4 bg-white rounded-2xl px-10 py-7 shadow">
						<div className="flex flex-col gap-2">
							<div className="font-normal text-4xl">
								{user?.firstName} {user?.lastName}
							</div>
							<div className="font-light text-xl">{user?.email}</div>
						</div>
						<div className="flex flex-row gap-2">
							{user?.isAdmin ? <Chip color="primary" label="Admin" /> : <Chip label="Regular user" />}
							<Chip color={user?.isActive ? 'success' : 'error'} label={user?.isActive ? 'Active' : 'Inactive'} />
						</div>
					</div>
					<div className="grid grid-cols-5 gap-4 max-lg:grid-cols-1">
						<div className="col-span-3 flex flex-col gap-4 bg-white rounded-2xl px-10 py-7 shadow">
							<div className="font-light text-3xl mb-4">Edit user account</div>
							<div>
								<div className="font-light text-2xl">Account details</div>
								<AdminUserUpdateForm
									onSuccess={() => forceUpdate()}
									userId={user.id}
									email={user.email}
									firstName={user.firstName}
									lastName={user.lastName}
									isActive={user.isActive}
									isAdmin={user.isAdmin}
								/>
							</div>
							<hr className="h-px my-2 bg-gray-200 border-0" />
							<div>
								<div className="font-light text-2xl mb-2">Account security</div>
								{user?.hasTotp ? (
									<div className="flex flex-row justify-between w-full">
										<div className="flex flex-row gap-4 items-baseline">
											<div className="font-light text-lg">Two-factor authentication</div>
											<Chip color="success" label="Enabled" />
										</div>

										<Button variant="outlined" color="error" onClick={() => handleDisableTotp()}>
											Disable TOTP
										</Button>
									</div>
								) : (
									<div className="flex flex-row justify-between w-full">
										<div className="flex flex-row gap-4 items-baseline">
											<div className="font-light text-lg">Two-factor authentication</div>
											<Chip color="error" label="Disabled" />
										</div>
									</div>
								)}
							</div>
							<hr className="h-px my-2 bg-gray-200 border-0" />
							<div className="font-bold text-red-600 text-2xl">Danger zone </div>
							<div className="flex flex-col gap-2">
								<div className="font-normal text-lg">Change user password</div>
								<AdminChangeUserPasswordForm userId={user.id} />
							</div>
							<div className="flex flex-col gap-3">
								<div className="flex flex-col gap-1">
									<div className="font-normal text-lg">Delete user account</div>
									<div className="font-light">
										Deleting an user's account will delete all logs related to the account as well.
									</div>
								</div>
								<TextField
									fullWidth
									id="user-email"
									name="user-email"
									label="Email"
									placeholder={user.email}
									variant="outlined"
									value={userDeleteEmailConfirmation}
									onChange={(e) => setUserDeleteEmailConfirmation(e.target.value)}
									disabled={userId == userContext?.id}
								/>
								<Tooltip
									title={
										userId == userContext?.id
											? 'You cannot delete your own account'
											: (userDeleteEmailConfirmation != user.email && 'Confirm the action first') ?? ''
									}
								>
									<div className="w-full">
										<Button
											disabled={userDeleteEmailConfirmation != user.email || userId == userContext?.id}
											variant="contained"
											color="error"
											startIcon={<Delete />}
											onClick={() => handleDeleteUser(user.id)}
											fullWidth
										>
											Delete user account
										</Button>
									</div>
								</Tooltip>
							</div>
						</div>
						<div className="flex col-span-2 flex-col gap-4 bg-white rounded-2xl px-10 py-7 h-fit shadow">
							<div className="flex flex-col gap-4">
								<div className="font-light text-3xl">User logs</div>
								<div className="text-center font- text-sm">Logs are unavailable</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default ManageSpecificUserOutlet;
