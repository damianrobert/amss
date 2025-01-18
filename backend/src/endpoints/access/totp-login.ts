import {Request, Response} from 'express';
import * as jwt from 'jsonwebtoken';
import {authenticator} from 'otplib';

import {IAccessRepository} from '../../domain/access/IAccessRepository';
import {HTTPResponses} from '../../endpoints/utils/http-responses';
import {envValues} from '../../infrastructure/utils/env-parser';

export const totpLoginRequestHandler =
	(accessRepository: IAccessRepository) =>
	async (
		req: Request<TotpLoginRequestEndpointParams, TotpLoginRequestResponse, TotpLoginRequestPayload, TotpLoginRequestQuery>,
		res: Response<TotpLoginRequestResponse>
	) => {
		const {contiunationToken, totpCode} = req.body;

		if (!contiunationToken || !totpCode) {
			res.status(HTTPResponses.BAD_REQUEST.statusCode).send({type: 'error', message: 'Invalid request'});
			return;
		}

		jwt.verify(String(contiunationToken), envValues.JWT_SECRET, async (err, value) => {
			if (err) {
				res.status(HTTPResponses.BAD_REQUEST.statusCode).json({type: 'error', message: 'Invalid continuation token, could be expired'});
			} else {
				if (typeof value === 'object' && value !== null && 'email' in value) {
					const contiunationData = value as {email: string};

					const user = await accessRepository.getUserByEmail(contiunationData.email);
					if (!user) {
						res.status(HTTPResponses.CONFLICT.statusCode).send();
						return;
					}

					if (!user.totpSecret) {
						res.status(HTTPResponses.CONFLICT.statusCode).send();
						return;
					}

					if (!authenticator.verify({token: totpCode, secret: user.totpSecret})) {
						res.status(HTTPResponses.FORBIDDEN.statusCode).send({type: 'error', message: 'Invalid TOTP code'});
						return;
					}

					const accessToken = jwt.sign(
						{id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, isAdmin: user.isAdmin},
						envValues.JWT_SECRET,
						{expiresIn: '24h'}
					);
					res.status(HTTPResponses.OK.statusCode).send({type: 'logged-in', accessToken});
				} else {
					res.status(HTTPResponses.SERVER_ERROR.statusCode).json();
				}
			}
		});
	};

type TotpLoginRequestEndpointParams = unknown;

type TotpLoginRequestResponse =
	| {
			type: 'logged-in';
			accessToken: string;
	  }
	| {
			type: 'error';
			message: string;
	  };

type TotpLoginRequestPayload = {
	contiunationToken: string;
	totpCode: string;
};

type TotpLoginRequestQuery = unknown;
