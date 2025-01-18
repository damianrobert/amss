import {Request, Response} from 'express';
import * as jwt from 'jsonwebtoken';
import {compareSync} from 'bcrypt';

import {IAccessRepository} from '../../domain/access/IAccessRepository';
import {HTTPResponses} from '../../endpoints/utils/http-responses';
import {envValues} from '../../infrastructure/utils/env-parser';

export const passwordLoginRequestHandler =
	(accessRepository: IAccessRepository) =>
	async (
		req: Request<PasswordLoginRequestEndpointParams, PasswordLoginRequestResponse, PasswordLoginRequestPayload, PasswordLoginRequestQuery>,
		res: Response<PasswordLoginRequestResponse>
	) => {
		const {email, password} = req.body;

		if (!email || !password || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email) || password.length < 8) {
			res.status(HTTPResponses.BAD_REQUEST.statusCode).send();
			return;
		}

		const user = await accessRepository.getUserByEmail(email);

		if (!user) {
			res.status(HTTPResponses.NOT_FOUND.statusCode).send();
			return;
		}
		if (!compareSync(password, user.passwordHash)) {
			res.status(HTTPResponses.FORBIDDEN.statusCode).send();
			return;
		}

		if (!user.isActive) {
			res.status(HTTPResponses.CONFLICT.statusCode).send();
			return;
		}

		if (user.totpSecret) {
			const contiunationToken = jwt.sign({email}, envValues.JWT_SECRET, {expiresIn: '5m'});

			res.status(HTTPResponses.ACCEPTED.statusCode).send({type: 'totp-required', contiunationToken});
			return;
		}

		const accessToken = jwt.sign(
			{id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, isAdmin: user.isAdmin},
			envValues.JWT_SECRET,
			{expiresIn: '24h'}
		);
		res.status(HTTPResponses.OK.statusCode).send({type: 'logged-in', accessToken});
	};

type PasswordLoginRequestEndpointParams = unknown;

type PasswordLoginRequestResponse =
	| {
			type: 'logged-in';
			accessToken: string;
	  }
	| {
			type: 'totp-required';
			contiunationToken: string;
	  };

type PasswordLoginRequestPayload = {
	email: string;
	password: string;
};

type PasswordLoginRequestQuery = unknown;
