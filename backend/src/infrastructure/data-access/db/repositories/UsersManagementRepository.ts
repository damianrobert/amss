import {Pool} from 'pg';
import {AllUsersPaginatedQuery, AllUsersPaginatedResponse, User} from '../../../../domain/users-management/UsersManagementModelTypes';
import {IUsersManagementRepository} from '../../../../domain/users-management/IUsersManagementRepository';

export const PGUsersManagementRepository = (db: Pool): IUsersManagementRepository => {
	const registerUser = async (user: Omit<User, 'id' | 'hasTotp'>): Promise<{userId: number}> => {
		const result = await db.query(
			'INSERT INTO iotdb.utilizatori (email, nume, prenume, tip_administrator, activ, hash_parola) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
			[user.email, user.firstName, user.lastName, user.isAdmin, user.isActive, user.passwordHash]
		);

		return {userId: Number(result.rows[0].id)};
	};

	const getUsersPaginated = async (query: AllUsersPaginatedQuery): Promise<AllUsersPaginatedResponse> => {
		const result = await db.query('SELECT * FROM iotdb.utilizatori ORDER BY id OFFSET $1 LIMIT $2', [(query.page - 1) * query.limit, query.limit]);

		return {
			users: result.rows.map((untypedUser) => ({
				id: untypedUser.id,
				email: untypedUser.email,
				firstName: untypedUser.nume,
				lastName: untypedUser.prenume,
				isActive: untypedUser.activ,
				isAdmin: untypedUser.tip_administrator,
				hasTotp: untypedUser.totpSecret != null,
			})),
			metadata: {
				total: Number(result.rowCount ?? 0),
				page: Number(query.page),
				perPage: Number(query.limit),
			},
		};
	};

	const deleteUser = async (userId: number): Promise<void> => {
		await db.query('DELETE FROM iotdb.utilizatori WHERE id = $1', [userId]);
	};

	const disableUserTotp = async (userId: number): Promise<void> => {
		await db.query('UPDATE iotdb.utilizatori SET secret_totp = NULL WHERE id = $1', [userId]);
	};

	const getUserById = async (userId: number): Promise<User> => {
		const result = await db.query('SELECT * FROM iotdb.utilizatori WHERE id = $1', [userId]);

		const untypedUser = result.rows[0];

		return {
			id: untypedUser.id,
			email: untypedUser.email,
			firstName: untypedUser.nume,
			lastName: untypedUser.prenume,
			hasTotp: untypedUser.secret_totp != null,
			isAdmin: untypedUser.tip_administrator,
			isActive: untypedUser.activ,
			passwordHash: untypedUser.hash_parola,
		};
	};

	const updateUser = async (user: Omit<User, 'hasTotp'>): Promise<User> => {
		await db.query('UPDATE iotdb.utilizatori SET email = $2, nume = $3, prenume = $4, activ = $5, tip_administrator = $6, hash_parola = $7 WHERE id = $1', [
			user.id,
			user.email,
			user.firstName,
			user.lastName,
			user.isActive,
			user.isAdmin,
			user.passwordHash,
		]);

		return getUserById(user.id);
	};

	return {
		registerUser,
		getUsersPaginated,
		deleteUser,
		disableUserTotp,
		getUserById,
		updateUser,
	};
};
