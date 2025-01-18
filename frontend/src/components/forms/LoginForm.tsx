import {Alert, Button, CircularProgress, Snackbar, TextField} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import {ErrorMessage, Form, Formik} from 'formik';
import {Cancel} from '@mui/icons-material';
import {request} from '../../api/api-handler';
import {PasswordLoginRequest} from '../../api/access/login-api-types';
import {useContext, useState} from 'react';
import {AxiosError} from 'axios';
import {AuthContext} from '../../context/AuthContext';

type LoginFormProps = {
	needsTotpCallback: (jwtContinuationToken: string) => void;
};

function LoginForm({needsTotpCallback}: LoginFormProps) {
	const {loginCallback} = useContext(AuthContext);

	const [snackMesaage, setSnackMessage] = useState<string | null>(null);

	return (
		<div className="flex flex-col gap-6 items-center w-full max-w-xl px-12">
			<Formik
				initialValues={{email: '', password: ''}}
				validate={(values) => {
					const errors: {email?: string; password?: string} = {};

					if (!values.email) {
						errors.email = 'Required email';
					} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
						errors.email = 'Invalid email address';
					}
					if (!values.password) {
						errors.password = 'Required password';
					} else if (values.password.length < 8) {
						errors.password = 'Password must be at least 8 characters long';
					}

					return errors;
				}}
				onSubmit={(values, {setSubmitting, setValues}) => {
					setSubmitting(true);

					request<never, PasswordLoginRequest['payload'], PasswordLoginRequest['response']>('/login', {
						method: 'POST',
						body: {
							email: values.email,
							password: values.password,
						},
						successCallback: (response) => {
							if (response.type === 'logged-in') {
								loginCallback(response.accessToken);
							} else if (response.type === 'totp-required') {
								needsTotpCallback(response.contiunationToken);
							} else {
								setSnackMessage('There was a problem logging in, the server returned an unexpected response');
							}
							setSubmitting(false);
						},
						errorCallback: (error) => {
							const axiosError: AxiosError = error as unknown as AxiosError;

							const status = axiosError.response?.status;
							switch (status) {
								case 400:
									setSnackMessage('Invalid email or password');
									break;
								case 404:
									setSnackMessage('User not found');
									break;
								case 403:
									setSnackMessage('Incorrect password');
									break;
								default:
									setValues({email: '', password: ''});
									setSnackMessage('There was a problem logging in');
									break;
							}
							setSubmitting(false);
						},
					});
				}}
			>
				{({isSubmitting, handleChange, handleBlur, values, errors, touched}) => (
					<Form className="flex flex-col gap-3 w-full ">
						<div className="flex flex-col gap-4 w-full">
							<div className="flex flex-col gap-1">
								<TextField
									fullWidth
									id="email"
									name="email"
									label="Email"
									variant="outlined"
									value={values.email}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								{touched.email && errors.email && (
									<Alert icon={<Cancel fontSize="inherit" />} severity="warning">
										<ErrorMessage name="email" />
									</Alert>
								)}
							</div>
							<div className="flex flex-col gap-1">
								<TextField
									fullWidth
									id="password"
									name="password"
									label="Password"
									type="password"
									variant="outlined"
									value={values.password}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								{touched.password && errors.password && (
									<Alert icon={<Cancel fontSize="inherit" />} severity="warning">
										<ErrorMessage name="password" />
									</Alert>
								)}
							</div>
						</div>
						<div className="mt-4">
							<Button
								type="submit"
								className="w-full"
								variant="contained"
								startIcon={isSubmitting ? <CircularProgress color="primary" size={24} /> : <LoginIcon />}
								disabled={isSubmitting}
							>
								{isSubmitting ? 'Logging in...' : 'Log in'}
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

export default LoginForm;
