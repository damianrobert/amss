import {useContext, useState} from 'react';
import {Cancel, Password} from '@mui/icons-material';
import {ErrorMessage, Form, Formik} from 'formik';

import {Alert, Button, CircularProgress, Snackbar, TextField, Tooltip} from '@mui/material';
import {AuthContext} from '../../context/AuthContext';
import {ChangeUserPasswordRequest} from '../../api/manage-users/manage-users-types';
import {request} from '../../api/api-handler';

type AdminChangeUserPasswordFormProps = {
	userId: number;
};

function AdminChangeUserPasswordForm({userId}: AdminChangeUserPasswordFormProps) {
	const {user: userContext} = useContext(AuthContext);

	const [snackMesaage, setSnackMessage] = useState<string | null>(null);

	return (
		<div className="flex flex-col gap-6 items-center w-full">
			<Formik
				initialValues={{newPassword: '', newPasswordRepeat: ''}}
				validate={(values) => {
					const errors: {newPassword?: string; newPasswordRepeat?: string} = {};

					if (values.newPassword.length < 8 || values.newPassword.length > 84) {
						errors.newPassword = 'Password length must be between 8 and 84 characters long';
					}

					if (values.newPassword !== values.newPasswordRepeat) {
						errors.newPasswordRepeat = 'Passwords do not match';
					}

					return errors;
				}}
				onSubmit={(values, {setSubmitting, setValues}) => {
					setSubmitting(true);

					request<never, ChangeUserPasswordRequest['payload'], ChangeUserPasswordRequest['response']>(
						`/users/user/${userId}/password`,
						{
							method: 'PUT',
							body: {
								newPassword: values.newPassword,
							},
							successCallback: () => {
								setSubmitting(false);
								setValues({...values, newPassword: '', newPasswordRepeat: ''});
								setSnackMessage('Password changed successfully');
							},
							errorCallback: () => {
								// const axiosError: AxiosError = error as unknown as AxiosError;

								// const status = axiosError.response?.status;

								setSubmitting(false);
								setValues({...values, newPassword: '', newPasswordRepeat: ''});
								setSnackMessage('Failed to change password, please try again');
							},
						}
					);
				}}
			>
				{({isSubmitting, handleChange, handleBlur, values, errors, touched}) => (
					<Form className="flex flex-col gap-3 w-full ">
						<div className="flex flex-col gap-4 w-full">
							<div className="flex flex-col gap-1">
								<TextField
									autoComplete="new-password"
									fullWidth
									id="new-password"
									name="newPassword"
									label="New Password"
									type="password"
									variant="outlined"
									value={values.newPassword}
									onChange={handleChange}
									onBlur={handleBlur}
									disabled={userContext?.id == userId}
								/>
								{values.newPassword !== '' && touched.newPassword && errors.newPassword && (
									<Alert icon={<Cancel fontSize="inherit" />} severity="warning">
										<ErrorMessage name="newPassword" />
									</Alert>
								)}
							</div>
							<div className="flex flex-col gap-1">
								<TextField
									autoComplete="new-password"
									fullWidth
									id="new-password-repeat"
									name="newPasswordRepeat"
									label="New Password Repeat"
									type="password"
									variant="outlined"
									value={values.newPasswordRepeat}
									onChange={handleChange}
									onBlur={handleBlur}
									disabled={userContext?.id == userId}
								/>
								{values.newPasswordRepeat !== '' && touched.newPasswordRepeat && errors.newPasswordRepeat && (
									<Alert icon={<Cancel fontSize="inherit" />} severity="warning">
										<ErrorMessage name="newPasswordRepeat" />
									</Alert>
								)}
							</div>
						</div>
						<Tooltip title={userContext?.id == userId ? 'You cannot update your own account' : ''}>
							<div className="full-w">
								<Button
									type="submit"
									className="w-full"
									variant="contained"
									startIcon={isSubmitting ? <CircularProgress color="primary" size={24} /> : <Password />}
									disabled={
										isSubmitting ||
										!!errors.newPassword ||
										!!errors.newPasswordRepeat ||
										!values.newPassword ||
										!values.newPasswordRepeat
									}
								>
									{isSubmitting ? 'Loading...' : 'Change password'}
								</Button>
							</div>
						</Tooltip>
					</Form>
				)}
			</Formik>
			{snackMesaage && (
				<Snackbar open={snackMesaage != null} autoHideDuration={6000} onClose={() => setSnackMessage(null)}>
					<Alert severity="warning">{snackMesaage}</Alert>
				</Snackbar>
			)}
		</div>
	);
}

export default AdminChangeUserPasswordForm;
