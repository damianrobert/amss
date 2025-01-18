import {ErrorMessage, Form, Formik} from 'formik';
import {Alert, Button, CircularProgress, Snackbar, Switch, TextField, Tooltip} from '@mui/material';
import {Cancel} from '@mui/icons-material';
import {useContext, useState} from 'react';
import {UpdateUserRequest} from '../../api/manage-users/manage-users-types';
import {request} from '../../api/api-handler';
import {AuthContext} from '../../context/AuthContext';

type AdminUserUpdateFormProps = {
	userId: number;
	email: string;
	firstName: string;
	lastName: string;
	isActive: boolean;
	isAdmin: boolean;
	onSuccess: () => void;
};
function AdminUserUpdateForm(props: AdminUserUpdateFormProps) {
	const {user: userContext} = useContext(AuthContext);

	const [snackMesaage, setSnackMessage] = useState<string | null>(null);

	return (
		<div className="flex flex-col gap-6 items-center justify-center w-full mt-4">
			<Formik
				initialValues={{
					email: props.email ?? '',
					firstName: props?.firstName ?? '',
					lastName: props?.lastName ?? '',
					isAdmin: props.isAdmin,
					isActive: props.isActive,
				}}
				validate={(values) => {
					const errors: {
						email?: string;
						firstName?: string;
						lastName?: string;
						isActive?: string;
					} = {};

					if (!values.email) {
						errors.email = 'Required email';
					} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
						errors.email = 'Invalid email address';
					}

					if (values.firstName.length < 4 || values.firstName.length > 84) {
						errors.firstName = 'First Name must be betwee 4 and 84 characters long';
					}

					if (values.lastName.length < 4 || values.lastName.length > 84) {
						errors.lastName = 'Last Name must be between 4 and 84 characters long';
					}

					if (values.isActive === false && values.isAdmin === true) {
						errors.isActive = 'Admins must be active';
					}

					return errors;
				}}
				onSubmit={(values, {setSubmitting}) => {
					request<never, UpdateUserRequest['payload'], UpdateUserRequest['response']>(`/users/user/${props.userId}`, {
						method: 'PUT',
						body: {
							email: values.email,
							firstName: values.firstName,
							lastName: values.lastName,
							isActive: values.isActive,
							isAdmin: values.isAdmin,
						},
						successCallback: () => {
							setSubmitting(false);
							setSnackMessage('User updated successfully');
							props.onSuccess();
						},
						errorCallback: () => {
							setSubmitting(false);
							setSnackMessage('Failed to update user, please try again');
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
									disabled={userContext?.id == props.userId}
								/>
								{values.email !== '' && touched.email && errors.email && (
									<Alert icon={<Cancel fontSize="inherit" />} severity="warning">
										<ErrorMessage name="email" />
									</Alert>
								)}
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
									disabled={userContext?.id == props.userId}
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
									disabled={userContext?.id == props.userId}
								/>
								{values.lastName !== '' && touched.lastName && errors.lastName && (
									<Alert icon={<Cancel fontSize="inherit" />} severity="warning">
										<ErrorMessage name="lastName" />
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
									disabled={userContext?.id == props.userId}
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
										disabled={userContext?.id == props.userId}
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
							<Tooltip title={userContext?.id == props.userId ? 'You cannot update your own account' : ''}>
								<div className="full-w">
									<Button
										type="submit"
										className="w-full"
										variant="contained"
										startIcon={isSubmitting ? <CircularProgress color="primary" size={24} /> : <></>}
										disabled={
											isSubmitting ||
											Object.keys(errors).some((key) => errors[key as keyof typeof errors] != '') ||
											userContext?.id == props.userId
										}
										fullWidth
									>
										{isSubmitting ? 'Loading...' : 'Update profile'}
									</Button>
								</div>
							</Tooltip>
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

export default AdminUserUpdateForm;
