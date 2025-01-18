import {Request, Response} from 'express';
import {compareSync} from 'bcrypt';

import {IAccessRepository} from '../../domain/access/IAccessRepository';
import {HTTPResponses} from '../../endpoints/utils/http-responses';

export const updateAccountRequestHandler =
	(accessRepository: IAccessRepository) =>
	async (req: Request<unknown, UpdateAccountRequestResponse, UpdateAccountRequestPayload, unknown>, res: Response<UpdateAccountRequestResponse>) => {
		const userData = res.locals.authUserData;
		const {firstName, lastName, currentPassword} = req.body;

		if (!firstName || !lastName || !currentPassword) {
			res.status(HTTPResponses.BAD_REQUEST.statusCode).send();
			return;
		}

		if (firstName.length < 4 || firstName.length > 84 || lastName.length < 4 || lastName.length > 84) {
			res.status(HTTPResponses.BAD_REQUEST.statusCode).send();
			return;
		}

		const user = await accessRepository.getUserById(userData.id);

		if (!user) {
			res.status(404).send();
			return;
		}

		if (!compareSync(currentPassword, user.passwordHash)) {
			res.status(HTTPResponses.FORBIDDEN.statusCode).send();
			return;
		}

		await accessRepository.saveUser({...user, firstName, lastName});

		res.status(HTTPResponses.OK.statusCode).send({type: 'success'});
	};

type UpdateAccountRequestResponse = {
	type: 'success';
};

type UpdateAccountRequestPayload = {
	firstName: string;
	lastName: string;
	currentPassword: string;
};
