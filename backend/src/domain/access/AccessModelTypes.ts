export type AccessUser = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	passwordHash: string;
	totpSecret: string | null;
	isAdmin: boolean;
	isActive: boolean;
};
