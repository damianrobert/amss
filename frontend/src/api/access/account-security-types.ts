export type AccountDetailsRequest = {
	method: 'GET';
	url: '/user/account-details';
	payload: never;
	response: {
		hasTwoFactorAuth: boolean;
	};
};

export type TotpInitializeRequest = {
	method: 'POST';
	url: '/user/totp/initialize';
	payload: never;
	response: {
		jwtSignedTotpUri: string;
	};
};

export type TotpActivateRequest = {
	method: 'POST';
	url: '/user/totp/activate';
	payload: {
		jwtSignedTotpUri: string;
		totpCode: string;
	};
	response: {
		type: 'success';
	};
};

export type ChangePasswordRequest = {
	method: 'POST';
	url: '/user/change-password';
	payload: {
		currentPassword: string;
		newPassword: string;
	};
	response: {
		type: 'success';
	};
};

export type UpdateProfileRequest = {
	method: 'POST';
	url: '/user/update-profile';
	payload: {
		firstName: string;
		lastName: string;
		currentPassword: string;
	};
	response: {
		type: 'success';
	};
};
