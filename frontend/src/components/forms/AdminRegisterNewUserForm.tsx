import {Cancel} from '@mui/icons-material';
import {Alert, Button, CircularProgress, Snackbar, Switch, TextField} from '@mui/material';
import {ErrorMessage, Form, Formik} from 'formik';
import {useState} from 'react';
import {request} from '../../api/api-handler';
import {RegisterNewUserRequest} from '../../api/manage-users/manage-users-types';
import {AxiosError} from 'axios';

function AdminRegisterNewUserForm() {
	const [snackMesaage, setSnackMessage] = useState<string | null>(null);
	return (
		<div className="flex flex-col gap-6 items-center justify-center w-full mt-4">
			<Formik
				initialValues={{
					email: '',
					firstName: '',
					lastName: '',
					isAdmin: false,
					isActive: true,
					newPassword: '',
					newPasswordRepeat: '',
				}}
				validate={(values) => {
					const errors: {
						email?: string;
						firstName?: string;
						lastName?: string;
						isActive?: string;
						newPassword?: string;
						newPasswordRepeat?: string;
					} = {};

					if (!values.email) {
						errors.email = 'Required email';
					} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
						errors.email = 'Invalid email address';
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

					if (values.isActive === false && values.isAdmin === true) {
						errors.isActive = 'Admins must be active';
					}

					if (values.newPassword.length < 8 || values.newPassword.length > 84) {
						errors.newPassword = 'Password length must be between 8 and 84 characters long';
					}

					if (values.newPassword !== values.newPasswordRepeat) {
						errors.newPasswordRepeat = 'Passwords do not match';
					}
					return errors;
				}}
				onSubmit={(values, {setSubmitting, setValues}) => {
					request<never, RegisterNewUserRequest['payload'], RegisterNewUserRequest['response']>('/users/user', {
						method: 'POST',
						body: {
							email: values.email,
							firstName: values.firstName,
							lastName: values.lastName,
							isAdmin: values.isAdmin,
							isActive: values.isActive,
							password: values.newPassword,
						},
						successCallback: () => {
							setSubmitting(false);
							setValues({
								email: '',
								firstName: '',
								lastName: '',
								isAdmin: false,
								isActive: true,
								newPassword: '',
								newPasswordRepeat: '',
							});
							setSnackMessage('User registered successfully');
						},
						errorCallback: (error) => {
							const axiosError: AxiosError = error as unknown as AxiosError;

							setSubmitting(false);
							setValues({
								...values,
								newPassword: '',
								newPasswordRepeat: '',
							});
							const errorData = axiosError.response?.data as {type: string; message: string};
							if (errorData.type === 'error') {
								setSnackMessage(errorData.message);
							} else {
								setSnackMessage('Failed to register user, please try again');
							}
						},
					});

					setSubmitting(true);
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
									value={values.email}
									onChange={handleChange}
									onBlur={handleBlur}
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
							<div className="flex flex-row justify-between items-center">
								<div className="flex flex-col">
									<div className="font-light text-lg">Admin</div>
									<div className="font-light text-sm text-gray-700">
										Admins have access to all the platform's rooms and settings.
									</div>
								</div>
								<Switch
									id="is-admin"
									name="isAdmin"
									checked={values.isAdmin}
									onChange={handleChange}
									onBlur={handleBlur}
									color="info"
								/>
							</div>

							<div>
								<div className="flex flex-row justify-between items-center">
									<div className="flex flex-col">
										<div className="font-light text-lg">Active</div>
										<div className="font-light text-sm text-gray-700">
											Active users can access the platform, while inactive users cannot.
										</div>
									</div>
									<Switch
										id="is-active"
										name="isActive"
										checked={values.isActive}
										onChange={handleChange}
										onBlur={handleBlur}
										color="success"
									/>
								</div>
								{errors.isActive && (
									<Alert icon={<Cancel fontSize="inherit" />} severity="warning">
										<ErrorMessage name="isActive" />
									</Alert>
								)}
							</div>
						</div>

						<div className="mt-4">
							<Button
								type="submit"
								className="w-full"
								variant="contained"
								startIcon={isSubmitting ? <CircularProgress color="primary" size={24} /> : <></>}
								disabled={
									isSubmitting ||
									!!errors.email ||
									!!errors.firstName ||
									!!errors.lastName ||
									!!errors.isActive ||
									!!errors.isAdmin ||
									!!errors.newPassword ||
									!!errors.newPasswordRepeat ||
									!values.email ||
									!values.firstName ||
									!values.lastName ||
									!values.newPassword ||
									!values.newPasswordRepeat
								}
							>
								{isSubmitting ? 'Loading...' : 'Register user'}
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

export default AdminRegisterNewUserForm;
