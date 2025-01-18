import {QRCodeSVG} from 'qrcode.react';
import {useMemo, useState} from 'react';
import ModalSkeleton from '../modals/ModalSkeleton';
import {CopyAll} from '@mui/icons-material';
import OTPInput from './OtpInput';
import {request} from '../../api/api-handler';
import {jwtDecode} from 'jwt-decode';
import {TotpActivateRequest, TotpInitializeRequest} from '../../api/access/account-security-types';
import {useOutletContext} from 'react-router-dom';
import {AccountSecurityPageOutletProps} from '../../pages/dashboard/outlets/account-settings/AccountSettingsPage';

type ManageUserTotpProps = {
	hasTwoFactorAuth: boolean;
};

function ManageUserTotp({hasTwoFactorAuth}: ManageUserTotpProps) {
	const {forceUpdate} = useOutletContext<AccountSecurityPageOutletProps>();

	const [jwtSignedTotpUri, setJwtSignedTotpUri] = useState<string | null>(null);

	const [loading, setLoading] = useState<boolean>(false);

	const activationUri = useMemo(() => {
		return jwtSignedTotpUri ? jwtDecode<{totpUri: string}>(jwtSignedTotpUri)?.totpUri : null;
	}, [jwtSignedTotpUri]);

	const requestTotpActivation = async () => {
		setLoading(true);

		request<never, never, TotpInitializeRequest['response']>('/user/totp/initialize', {
			method: 'POST',
			successCallback: (response) => {
				setJwtSignedTotpUri(response.jwtSignedTotpUri);
				forceUpdate();
			},
			errorCallback: (error) => {
				console.error(error);
			},
		});

		setLoading(false);
	};

	const activateTotp = async (otpCode: string) => {
		request<never, TotpActivateRequest['payload'], TotpActivateRequest['response']>('/user/totp/activate', {
			method: 'POST',
			body: {
				jwtSignedTotpUri: jwtSignedTotpUri!,
				totpCode: otpCode,
			},
			successCallback: () => {
				forceUpdate();
				setJwtSignedTotpUri(null);
			},
			errorCallback: (error) => {
				console.error(error);
			},
		});
	};

	const requestTotpDisable = async () => {
		setLoading(true);

		request<never, never, TotpInitializeRequest['response']>('/user/totp/disable', {
			method: 'POST',
			successCallback: () => {
				forceUpdate();
				setJwtSignedTotpUri(null);
			},
			errorCallback: (error) => {
				console.error(error);
			},
		});

		setLoading(false);
	};

	return (
		<div>
			<div className="flex flex-col gap-8">
				{hasTwoFactorAuth ? (
					<div className="flex flex-col gap-6">
						<div className="text-sm text-gray-600">
							This account <b>has</b> Two Factor Authentificaton with TOTP activated. You can disable TOTP by clicking
							the button below.
						</div>

						<button
							onClick={requestTotpDisable}
							className="mt-6 px-6 py-3 bg-red-500 text-white text-lg rounded-md shadow hover:bg-red-600 hover:text-white transition-colors self-end"
							disabled={loading}
						>
							<span>{loading ? 'Loading...' : 'Disable TOTP'}</span>
						</button>
					</div>
				) : (
					<div className="flex flex-col gap-6">
						<div className="text-sm text-gray-600">
							This account <b>does not have</b> Two Factor Authentificaton with TOTP activated. You can initialize the
							process of activating TOTP by clicking the button below.
						</div>
						<button
							onClick={requestTotpActivation}
							className="mt-6 px-6 py-3 bg-blue-500 text-white text-lg rounded-md shadow hover:bg-blue-600 hover:text-white transition-colors self-end"
							disabled={loading}
						>
							<span>{loading ? 'Loading...' : 'Activate TOTP'}</span>
						</button>
					</div>
				)}
				{activationUri && (
					<ModalSkeleton isOpen={true} onClose={() => setJwtSignedTotpUri(null)}>
						<div className="flex items-center justify-center min-h-screen p-4">
							<div className="relative w-full max-w-lg bg-slate-200 rounded-lg shadow-lg overflow-hidden">
								<div className="flex flex-col items-center gap-6 text-black py-6 px-6 md:px-8">
									<div className="font-bold text-xl md:text-3xl text-center">Activating Two-Factor Authentication</div>
									<div className="grid gap-6 grid-cols-1 w-full">
										<div className="flex flex-col items-center gap-3">
											<div className="text-lg md:text-2xl font-medium">Step 1</div>
											<div className="text-sm text-center md:text-justify">
												Scan the QR code below with your TOTP app to activate Two Factor Authentication.
											</div>
											<div>
												<QRCodeSVG value={activationUri} />
											</div>
											<div className="w-full">
												<div
													className="flex items-center gap-2 cursor-pointer border border-gray-300 bg-white p-2 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
													onClick={() => navigator.clipboard.writeText(activationUri)}
												>
													<span className="text-gray-700 font-medium truncate w-full">{activationUri}</span>
													<CopyAll className="text-gray-500 hover:text-blue-500 flex-shrink-0" />
												</div>
											</div>
										</div>

										<div className="flex flex-col items-center gap-3">
											<div className="text-lg md:text-2xl font-medium">Step 2</div>
											<div className="text-sm text-center md:text-justify">
												Enter the 6-digit code generated by your TOTP app to confirm the activation.
											</div>
											<OTPInput otpFilledCallback={(otp) => activateTotp(otp)} />
										</div>
									</div>
								</div>
							</div>
						</div>
					</ModalSkeleton>
				)}
			</div>
		</div>
	);
}

export default ManageUserTotp;
