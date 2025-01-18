import {Request, Response} from 'express';
import {authenticator} from 'otplib';
import jwt from 'jsonwebtoken';

import {IAccessRepository} from '../../domain/access/IAccessRepository';
import {envValues} from '../../infrastructure/utils/env-parser';

export const totpCompleteActivationRequestHandler =
	(accessRepository: IAccessRepository) =>
	async (req: Request<unknown, TotpVerifyRequestResponse, TotpVerifyRequestPayload, unknown>, res: Response<TotpVerifyRequestResponse>) => {
		const userData = res.locals.authUserData;

		if (!req.body.jwtSignedTotpUri) {
			res.status(400).send();
			return;
		}

		const user = await accessRepository.getUserById(userData.id);
		if (!user) {
			res.status(404).send();
			return;
		}

		if (user.totpSecret) {
			res.status(400).send();
			return;
		}

		const {totpUri} = jwt.verify(req.body.jwtSignedTotpUri, envValues.JWT_SECRET) as {totpUri: string};
		const isValid = authenticator.verify({token: req.body.totpCode, secret: getSecretFromUri(totpUri)});

		if (!isValid) {
			res.status(400).send();
			return;
		}

		await accessRepository.saveUser({...user, totpSecret: getSecretFromUri(totpUri)});

		res.send({type: 'success'});
	};

type TotpVerifyRequestResponse = {
	type: 'success';
};

type TotpVerifyRequestPayload = {
	jwtSignedTotpUri: string;
	totpCode: string;
};

function getSecretFromUri(uri: string) {
	const urlParts = uri.split('?');
	if (urlParts.length !== 2) {
		throw new Error('Invalid TOTP URI');
	}

	const queryParams = new URLSearchParams(urlParts[1]);
	const secret = queryParams.get('secret');

	if (!secret) {
		throw new Error('Secret not found in URI');
	}

	return secret;
}
