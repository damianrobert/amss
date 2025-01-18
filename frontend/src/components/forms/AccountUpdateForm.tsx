import {useContext, useState} from 'react';
import {Cancel} from '@mui/icons-material';
import {TextField, Alert, Button, CircularProgress, Snackbar} from '@mui/material';
import {Formik, ErrorMessage, Form} from 'formik';
import {UpdateProfileRequest} from '../../api/access/account-security-types';
import {request} from '../../api/api-handler';
import {AuthContext} from '../../context/AuthContext';

function AccountUpdateForm() {
	const {user} = useContext(AuthContext);

	const [snackMesaage, setSnackMessage] = useState<string | null>(null);

	return (
		<div className="flex flex-col gap-6 items-center justify-center w-full max-w-xl">
			<Formik
				initialValues={{currentPassword: '', firstName: user?.firstName ?? '', lastName: user?.lastName ?? ''}}
				validate={(values) => {
					const errors: {currentPassword?: string; firstName?: string; lastName?: string} = {};

					if (values.currentPassword.length < 8) {
						errors.currentPassword = 'Password must be at least 8 characters long';
					}
					if (values.currentPassword.length > 84) {
						errors.currentPassword = 'Password must be at most 84 characters long';
					}

					if (values.firstName.length < 4) {
						errors.firstName = 'First Name must be at least 4 characters long';
					}
					if (values.firstName.length > 84) {
						errors.firstName = 'First Name must be most 84 characters long';
					}

					if (values.lastName.length < 4) {
						errors.lastName = 'Last Name must be at least 4 characters long';
					}
					if (values.lastName.length > 84) {
						errors.lastName = 'First Name must be most 84 haracters long';
					}

					return errors;
				}}
				onSubmit={(values, {setSubmitting, setValues}) => {
					setSubmitting(true);

					request<never, UpdateProfileRequest['payload'], UpdateProfileRequest['response']>('/user/update-profile', {
						method: 'PUT',
						body: {
							currentPassword: values.currentPassword,
							lastName: values.lastName,
							firstName: values.firstName,
						},
						successCallback: () => {
							setSubmitting(false);
							setValues({...values, currentPassword: ''});
							setSnackMessage('Profile updated successfully');
						},
						errorCallback: () => {
							// const axiosError: AxiosError = error as unknown as AxiosError;

							// const status = axiosError.response?.status;

							setSubmitting(false);
							setValues({...values, currentPassword: ''});
							setSnackMessage('Failed to change update profile, please try again');
						},
					});
				}}
			>
				{({isSubmitting, handleChange, handleBlur, values, errors, touched}): React.ReactNode => (
					<Form className="flex flex-col gap-3 w-full ">
						<div className="flex flex-col gap-4 w-full">
							<div className="flex flex-col gap-1">
								<TextField
									autoComplete="email"
									fullWidth
									id="email"
									name="email"
									label="Email"
									type="text"
									variant="outlined"
									value={user!.email}
									disabled
								/>
							</div>
							<div className="flex flex-col gap-1">
								<TextField
									autoComplete="first-name"
									fullWidth
									id="first-name"
									name="firstName"
									label="First Name"
									type="text"
									variant="outlined"
									value={values.firstName}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								{values.firstName !== '' && touched.firstName && errors.firstName && (
									<Alert icon={<Cancel fontSize="inherit" />} severity="warning">
										<ErrorMessage name="firstName" />
									</Alert>
								)}
							</div>
							<div className="flex flex-col gap-1">
								<TextField
									autoComplete="last-name"
									fullWidth
									id="last-name"
									name="lastName"
									label="Last Name"
									type="text"
									variant="outlined"
									value={values.lastName}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								{values.lastName !== '' && touched.lastName && errors.lastName && (
									<Alert icon={<Cancel fontSize="inherit" />} severity="warning">
										<ErrorMessage name="lastName" />
									</Alert>
								)}
							</div>
						</div>
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
						<div className="mt-4">
							<Button
								type="submit"
								className="w-full"
								variant="contained"
								startIcon={isSubmitting ? <CircularProgress color="primary" size={24} /> : <></>}
								disabled={
									isSubmitting ||
									!!errors.currentPassword ||
									!!errors.firstName ||
									!!errors.lastName ||
									!values.currentPassword ||
									!values.firstName ||
									!values.lastName
								}
							>
								{isSubmitting ? 'Loading...' : 'Update profile'}
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

export default AccountUpdateForm;
