import {Request, Response} from 'express';
import {IAccessRepository} from '../../domain/access/IAccessRepository';

export const totpDisableRequestHandler =
	(accessRepository: IAccessRepository) =>
	async (_req: Request<unknown, TotpDisableRequestResponse, unknown, unknown>, res: Response<TotpDisableRequestResponse>) => {
		const userData = res.locals.authUserData;

		const user = await accessRepository.getUserById(userData.id);
		if (!user) {
			res.status(404).send();
			return;
		}

		if (!user.totpSecret) {
			res.status(400).send();
			return;
		}

		await accessRepository.saveUser({...user, totpSecret: null});

		res.send({type: 'success'});
	};

type TotpDisableRequestResponse = {
	type: 'success';
};
