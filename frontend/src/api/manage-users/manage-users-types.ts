export type AllUsersPaginatedRequest = {
	method: 'GET';
	url: '/users-all';
	query: {
		page: number;
		limit: number;
	};
	response: {
		users: Array<{
			id: number;
			email: string;
			firstName: string;
			lastName: string;
			isActive: boolean;
			isAdmin: boolean;
			hasTotp: boolean;
		}>;
		metadata: {
			total: number;
			page: number;
			perPage: number;
		};
	};
};

export type SpecificUserRequest = {
	method: 'GET';
	url: '/users/user/:userId';
	response: {
		id: number;
		email: string;
		firstName: string;
		lastName: string;
		isActive: boolean;
		isAdmin: boolean;
		hasTotp: boolean;
	};
};

export type UpdateUserRequest = {
	method: 'PUT';
	url: '/users/user/:userId';
	payload: {
		email: string;
		firstName: string;
		lastName: string;
		isActive: boolean;
		isAdmin: boolean;
	};
	response: {
		type: 'success';
	};
};

export type DeleteUserRequest = {
	method: 'DELETE';
	url: '/users/user/:userId';
	response: {
		type: 'success';
	};
};

export type RegisterNewUserRequest = {
	method: 'POST';
	url: '/users/user';
	payload: {
		email: string;
		firstName: string;
		lastName: string;
		isActive: boolean;
		isAdmin: boolean;
		password: string;
	};
	response:
		| {
				type: 'success';
				newUserId: number;
		  }
		| {
				type: 'error';
				message: string;
		  };
};

export type ChangeUserPasswordRequest = {
	method: 'POST';
	url: '/users/user/:userId/password';
	payload: {
		newPassword: string;
	};
	response: {
		type: 'success';
	};
};
