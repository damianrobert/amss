import {useContext, useEffect, useState} from 'react';
import ModalSkeleton from '../modals/ModalSkeleton';
import {LinearProgress, Button, Alert, Snackbar} from '@mui/material';
import {jwtDecode} from 'jwt-decode';
import OTPInput from './OtpInput';
import {formatSecondsToMMSS} from '../../utils/date-utils';
import {request} from '../../api/api-handler';
import {TotpLoginRequest} from '../../api/access/login-api-types';
import {AxiosError} from 'axios';
import {AuthContext} from '../../context/AuthContext';

type TotpRequestModalProps = {
	jwtContinuationToken: string;
	cancelCallback: () => void;
};

function TotpRequestModal({jwtContinuationToken, cancelCallback}: TotpRequestModalProps) {
	const {loginCallback} = useContext(AuthContext);

	const decodedToken = jwtDecode<{exp: number}>(jwtContinuationToken);

	const [timeRemaining, setTimeRemaining] = useState<number | null>(
		decodedToken.exp ? decodedToken.exp - Date.now() / 1000 : null
	);
	const [error, setError] = useState<string | null>(null);

	if (timeRemaining !== null && timeRemaining <= 0) {
		cancelCallback();
	}

	const handleSendOTP = (otp: string) => {
		request<never, TotpLoginRequest['payload'], TotpLoginRequest['response']>('/login-totp', {
			method: 'POST',
			body: {contiunationToken: jwtContinuationToken, totpCode: otp},
			successCallback: (response) => {
				if (response.type === 'logged-in') {
					loginCallback(response.accessToken);
				} else {
					setError('There was a problem logging in, the server returned an unexpected response');
				}
			},
			errorCallback: (error) => {
				const axiosError: AxiosError = error as unknown as AxiosError;

				if (axiosError) {
					setError((axiosError.response?.data as {message: string}).message);
				} else {
					setError('There was a problem logging in, the server returned an unexpected response');
				}
			},
		});
	};

	useEffect(() => {
		if (timeRemaining !== null && timeRemaining > 0) {
			const interval = setInterval(() => {
				if (timeRemaining) {
					setTimeRemaining(timeRemaining - 1);
				}
			}, 1000);

			return () => clearInterval(interval);
		}
	}, [timeRemaining]);

	return (
		<>
			{decodedToken && timeRemaining && (
				<ModalSkeleton isOpen={true} onClose={() => {}}>
					<div className="flex flex-col gap-4 text-black bg-slate-200 py-4 px-8 mx-5">
						<div className="font-bold text-3xl text-center">Two-Factor Authentication Required</div>
						<div className="text-sm text-justify">
							The account associated with the email address {jwtDecode<{email: string}>(jwtContinuationToken).email}{' '}
							needs to be verified with a two-factor authentication TOTP code.
						</div>
						<div>
							<div className="flex flex-row justify-between">
								<span>Time remaining</span>
								<span>{formatSecondsToMMSS(timeRemaining)}</span>
							</div>
							<LinearProgress variant="determinate" value={Math.floor((timeRemaining / 300) * 100)} />
						</div>
						<div>
							<OTPInput otpFilledCallback={(otp) => handleSendOTP(otp)} />
						</div>
						<div className="flex flex-row justify-end">
							<Button variant="outlined" color={'secondary'} onClick={() => cancelCallback()}>
								Cancel
							</Button>
						</div>
					</div>
				</ModalSkeleton>
			)}
			{error && (
				<Snackbar open={error != null} autoHideDuration={6000} onClose={() => setError(null)}>
					<Alert severity="warning">{error}</Alert>
				</Snackbar>
			)}
		</>
	);
}

export default TotpRequestModal;
