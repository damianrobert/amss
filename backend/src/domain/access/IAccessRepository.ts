import {AccessUser} from './AccessModelTypes';

export interface IAccessRepository {
	getUserById(userId: number): Promise<AccessUser | null>;
	getUserByEmail(email: string): Promise<AccessUser | null>;
	saveUser(user: AccessUser): Promise<void>;
	newUser(user: Omit<AccessUser, 'id'>): Promise<void>;
}
