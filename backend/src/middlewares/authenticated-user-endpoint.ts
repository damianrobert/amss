import {Request, Response, NextFunction} from 'express';
import * as jwt from 'jsonwebtoken';

import {HTTPResponses} from '../endpoints/utils/http-responses';
import {envValues} from '../infrastructure/utils/env-parser';

export const authenticatedUserEndpoint = (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization;
	if (!token) res.status(401).json({error: 'Token is required'});
	else {
		const tokenPart = token.split(' ')[1];
		if (!tokenPart) {
			res.status(401).json({error: 'Token is required'});
			return;
		}
		jwt.verify(tokenPart, envValues.JWT_SECRET, (err, value) => {
			if (err) {
				res.status(HTTPResponses.SERVER_ERROR.statusCode).json({error: 'Invalid or expired token'});
			} else {
				if (
					typeof value === 'object' &&
					value !== null &&
					'id' in value &&
					'email' in value &&
					'firstName' in value &&
					'lastName' in value &&
					'isAdmin' in value
				) {
					res.locals.authUserData = value as {id: number; email: string; firstName: string; lastName: string; isAdmin: boolean};
					next();
				} else {
					res.status(HTTPResponses.SERVER_ERROR.statusCode).json({error: 'Invalid token payload'});
				}
			}
		});
	}
};
