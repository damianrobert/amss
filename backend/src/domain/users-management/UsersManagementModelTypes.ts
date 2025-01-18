export type User = {
	id: number;
	email: string;
	firstName: string;
	lastName: string;
	isActive: boolean;
	isAdmin: boolean;
	hasTotp: boolean;
	passwordHash: string;
};

export type AllUsersPaginatedQuery = {
	page: number;
	limit: number;
};

export type AllUsersPaginatedResponse = {
	users: Array<Omit<User, 'passwordHash'>>;
	metadata: {
		total: number;
		page: number;
		perPage: number;
	};
};
