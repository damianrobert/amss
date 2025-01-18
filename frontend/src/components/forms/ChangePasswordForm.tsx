import {ErrorMessage, Form, Formik} from 'formik';
import {request} from '../../api/api-handler';
import {useState} from 'react';
import {Alert, Button, CircularProgress, Snackbar, TextField} from '@mui/material';
import {Cancel, Password} from '@mui/icons-material';
import {ChangePasswordRequest} from '../../api/access/account-security-types';

function ChangePasswordForm() {
	const [snackMesaage, setSnackMessage] = useState<string | null>(null);

	return (
		<div className="flex flex-col gap-6 items-center w-full max-w-xl">
			<Formik
				initialValues={{currentPassword: '', newPassword: '', newPasswordRepeat: ''}}
				validate={(values) => {
					const errors: {currentPassword?: string; newPassword?: string; newPasswordRepeat?: string} = {};

					if (values.currentPassword.length < 8) {
						errors.currentPassword = 'Password must be at least 8 characters long';
					}

					if (values.newPassword.length < 8) {
						errors.newPassword = 'Password must be at least 8 characters long';
					}
					if (values.newPasswordRepeat.length < 8) {
						errors.newPasswordRepeat = 'Password must be at least 8 characters long';
					}
					if (values.newPasswordRepeat.length > 84) {
						errors.newPasswordRepeat = 'Password must be at most 84 characters long';
					}

					if (values.newPassword !== values.newPasswordRepeat) {
						errors.newPasswordRepeat = 'Passwords do not match';
					}

					return errors;
				}}
				onSubmit={(values, {setSubmitting, setValues}) => {
					setSubmitting(true);

					request<never, ChangePasswordRequest['payload'], ChangePasswordRequest['response']>('/user/change-password', {
						method: 'POST',
						body: {
							currentPassword: values.currentPassword,
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
					});
				}}
			>
				{({isSubmitting, handleChange, handleBlur, values, errors, touched}) => (
					<Form className="flex flex-col gap-3 w-full ">
						<div className="flex flex-col gap-4 w-full">
							<div className="flex flex-col gap-1">
								<TextField
									autoComplete="new-password"
									fullWidth
									id="current-password"
									name="currentPassword"
									label="Current Password"
									type="password"
									variant="outlined"
									value={values.currentPassword}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								{values.currentPassword !== '' && touched.currentPassword && errors.currentPassword && (
									<Alert icon={<Cancel fontSize="inherit" />} severity="warning">
										<ErrorMessage name="currentPassword" />
									</Alert>
								)}
							</div>
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
								/>
								{values.newPasswordRepeat !== '' && touched.newPasswordRepeat && errors.newPasswordRepeat && (
									<Alert icon={<Cancel fontSize="inherit" />} severity="warning">
										<ErrorMessage name="newPasswordRepeat" />
									</Alert>
								)}
							</div>
						</div>
						<div className="mt-4">
							<Button
								type="submit"
								className="w-full"
								variant="contained"
								startIcon={isSubmitting ? <CircularProgress color="primary" size={24} /> : <Password />}
								disabled={
									isSubmitting ||
									!!errors.currentPassword ||
									!!errors.newPassword ||
									!!errors.newPasswordRepeat ||
									(!values.currentPassword && !values.newPassword && !values.newPasswordRepeat)
								}
							>
								{isSubmitting ? 'Loading...' : 'Change password'}
							</Button>
						</div>
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

export default ChangePasswordForm;
