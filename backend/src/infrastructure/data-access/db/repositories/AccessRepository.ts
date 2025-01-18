import {AccessUser} from '../../../../domain/access/AccessModelTypes';
import {IAccessRepository} from '../../../../domain/access/IAccessRepository';
import {Pool} from 'pg';

export const PGAccessRepository = (db: Pool): IAccessRepository => {
	const getUserById = async (userId: number): Promise<AccessUser | null> => {
		const result = await db.query('SELECT * FROM iotdb.utilizatori WHERE id = $1', [userId]);
		if (result.rowCount === 0) {
			return null;
		}

		const untypedUser = result.rows[0];

		return untypedUser
			? {
					id: untypedUser.id,
					email: untypedUser.email,
					firstName: untypedUser.nume,
					lastName: untypedUser.prenume,
					passwordHash: untypedUser.hash_parola,
					totpSecret: untypedUser.secret_totp,
					isAdmin: untypedUser.tip_administrator,
					isActive: untypedUser.activ,
				}
			: null;
	};

	const getUserByEmail = async (email: string): Promise<AccessUser | null> => {
		const result = await db.query('SELECT * FROM iotdb.utilizatori WHERE email = $1', [email]);
		if (result.rowCount === 0) {
			return null;
		}

		const untypedUser = result.rows[0];

		return untypedUser
			? {
					id: untypedUser.id,
					email: untypedUser.email,
					firstName: untypedUser.nume,
					lastName: untypedUser.prenume,
					passwordHash: untypedUser.hash_parola,
					totpSecret: untypedUser.secret_totp,
					isAdmin: untypedUser.tip_administrator,
					isActive: untypedUser.activ,
				}
			: null;
	};

	const saveUser = async (user: AccessUser): Promise<void> => {
		await db.query(
			'UPDATE iotdb.utilizatori SET email = $2, nume = $3, prenume = $4, hash_parola = $5, secret_totp = $6, tip_administrator = $7 WHERE id = $1',
			[user.id, user.email, user.firstName, user.lastName, user.passwordHash, user.totpSecret, user.isAdmin]
		);
	};

	const newUser = async (user: Omit<AccessUser, 'id' | 'isActive'>): Promise<void> => {
		await db.query('INSERT INTO iotdb.utilizatori (email, nume, prenume, hash_parola, secret_totp	, tip_administrator) VALUES ($1, $2)', [
			user.email,
			user.passwordHash,
			user.firstName,
			user.lastName,
			user.totpSecret,
			user.isAdmin,
		]);
	};

	return {
		getUserById,
		getUserByEmail,
		saveUser,
		newUser,
	};
};
