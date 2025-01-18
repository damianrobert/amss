import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import {authenticator} from 'otplib';

import {IAccessRepository} from '../../domain/access/IAccessRepository';
import {envValues} from '../../infrastructure/utils/env-parser';

export const totpInitializeActivationRequestHandler =
	(accessRepository: IAccessRepository) =>
	async (_req: Request<unknown, TotpInitializeRequestResponse, unknown, unknown>, res: Response<TotpInitializeRequestResponse>) => {
		const userData = res.locals.authUserData;

		const user = await accessRepository.getUserById(userData.id);
		if (!user) {
			res.status(404).send();
			return;
		}

		if (user.totpSecret) {
			res.status(400).send();
			return;
		}

		const userSecret = authenticator.generateSecret(20);
		const totpUri = authenticator.keyuri(`${user.firstName} ${user.lastName}`, 'DockIoT', userSecret);

		const jwtSignedTotpUri = jwt.sign({totpUri}, envValues.JWT_SECRET, {expiresIn: '5m'});

		res.send({jwtSignedTotpUri});
	};

type TotpInitializeRequestResponse = {
	jwtSignedTotpUri: string;
};
