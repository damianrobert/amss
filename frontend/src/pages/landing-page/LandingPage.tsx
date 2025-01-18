import {useEffect, useState} from 'react';
import LoginForm from '../../components/forms/LoginForm';
import TotpRequestModal from '../../components/totp/TotpRequestModal';
import {Alert, Snackbar} from '@mui/material';

function LandingPage() {
	const [jwtContinuationToken, setJwtContinuationToken] = useState<string | null>(null);
	const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
	const [error, setError] = useState<string | null>(null);

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
		<div className="flex flex-row items-center min-h-[calc(100vh-4rem)] max-lg:gap-4 max-lg:flex-col py-4">
			<div className="flex justify-center items-center w-full max-lg:w-fit max-lg:h-fit">
				<img src="/hero.png" className="max-w-xl w-[70%] object-contain rounded-3xl" alt="Hero" />
			</div>
			<div className="flex justify-center items-center w-full h-full">
				<div className="max-w-[80%]">
					<div className="flex flex-col items-center bg-cyan-50 rounded-2xl pb-8">
						<div className="flex justify-center items-center w-[55%]">
							<div className="flex flex-col items-center">
								<div className="flex flex-row items-center gap-4 my-4 w-full select-none">
									<img src="/logo-big.png" className="max-w-xl w-[50%] object-contain rounded-3xl" alt="Logo big" />
									<div className="flex flex-col">
										<div className="font-bold text-3xl text-black ">DockIoT</div>
										<div className="text-black text-lg ">
											Dockerized platform for the management and automation of IoT devices
										</div>
									</div>
								</div>
							</div>
						</div>
						<LoginForm needsTotpCallback={(jwtContinuationToken) => setJwtContinuationToken(jwtContinuationToken)} />
					</div>
				</div>
			</div>
			{jwtContinuationToken && (
				<TotpRequestModal
					jwtContinuationToken={jwtContinuationToken}
					cancelCallback={() => {
						setError('Totp request cancelled or expired');
						setJwtContinuationToken(null);
					}}
				/>
			)}
			{error && (
				<Snackbar open={error != null} onClose={() => setError(null)}>
					<Alert severity="error">{error}</Alert>
				</Snackbar>
			)}
		</div>
	);
}

export default LandingPage;
