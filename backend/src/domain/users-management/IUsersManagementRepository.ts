import {AllUsersPaginatedQuery, AllUsersPaginatedResponse, User} from './UsersManagementModelTypes';

export interface IUsersManagementRepository {
	registerUser(user: Omit<User, 'id' | 'hasTotp'>): Promise<{userId: number}>;
	getUsersPaginated(query: AllUsersPaginatedQuery): Promise<AllUsersPaginatedResponse>;
	deleteUser(userId: number): Promise<void>;
	disableUserTotp(userId: number): Promise<void>;
	getUserById(userId: number): Promise<User>;
	updateUser(user: Omit<User, 'hasTotp'>): Promise<User>;
}
