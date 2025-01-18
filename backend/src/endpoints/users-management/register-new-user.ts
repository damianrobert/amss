import {Request, Response} from 'express';
import {hashSync} from 'bcrypt';

import {IAccessRepository} from '../../domain/access/IAccessRepository';
import {IUsersManagementRepository} from '../../domain/users-management/IUsersManagementRepository';

import {HTTPResponses} from '../../endpoints/utils/http-responses';

export const registerNewUserRequestHandler =
	(usersManagementRepository: IUsersManagementRepository, accessRepository: IAccessRepository) =>
	async (req: Request<unknown, RegisterNewUserRequestResponse, RegisterNewUserRequestPayload, unknown>, res: Response<RegisterNewUserRequestResponse>) => {
		const userData = res.locals.authUserData;

		if (!userData.isAdmin) {
			res.status(HTTPResponses.FORBIDDEN.statusCode).send();
			return;
		}

		const {email, firstName, lastName, isAdmin, isActive, password} = req.body;

		if (!email || !firstName || !lastName || isAdmin == undefined || isActive == undefined || !password) {
			res.status(HTTPResponses.BAD_REQUEST.statusCode).send();
			return;
		}

		if (isActive == false && isAdmin == true) {
			res.status(HTTPResponses.BAD_REQUEST.statusCode).send();
			return;
		}

		if (password.length < 8 || password.length > 64 || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email) || firstName.length < 4 || lastName.length < 4) {
			res.status(HTTPResponses.BAD_REQUEST.statusCode).send();
			return;
		}

		if (await accessRepository.getUserByEmail(email)) {
			res.status(HTTPResponses.CONFLICT.statusCode).send({type: 'error', message: 'User with this email already exists'});
			return;
		}

		const newUserId = await usersManagementRepository.registerUser({
			email,
			firstName,
			lastName,
			isAdmin,
			isActive,
			passwordHash: hashSync(password, 10),
		});

		res.send({
			type: 'success',
			newUserId: Number(newUserId),
		});
	};

type RegisterNewUserRequestResponse =
	| {
			type: 'success';
			newUserId: number;
	  }
	| {
			type: 'error';
			message: string;
	  };

type RegisterNewUserRequestPayload = {
	email: string;
	firstName: string;
	lastName: string;
	isAdmin: boolean;
	isActive: boolean;
	password: string;
};
