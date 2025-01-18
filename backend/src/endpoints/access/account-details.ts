import {Request, Response} from 'express';
import {IAccessRepository} from '../../domain/access/IAccessRepository';

export const accountDetailsRequestHandler =
	(accessRepository: IAccessRepository) =>
	async (_req: Request<unknown, AccountDetailsRequestResponse, unknown, unknown>, res: Response<AccountDetailsRequestResponse>) => {
		const userData = res.locals.authUserData;

		const user = await accessRepository.getUserById(userData.id);
		if (!user) {
			res.status(404).send();
			return;
		}

		res.send({hasTwoFactorAuth: !!user.totpSecret});
	};

type AccountDetailsRequestResponse = {
	hasTwoFactorAuth: boolean;
};
