export type PasswordLoginRequest = {
	method: 'POST';
	url: '/login';
	payload: {
		email: string;
		password: string;
	};
	response:
		| {
				type: 'logged-in';
				accessToken: string;
		  }
		| {
				type: 'totp-required';
				contiunationToken: string;
		  };
};

export type TotpLoginRequest = {
	method: 'POST';
	url: '/login-totp';
	payload: {
		contiunationToken: string;
		totpCode: string;
	};
	response: {
		type: 'logged-in';
		accessToken: string;
	};
};
