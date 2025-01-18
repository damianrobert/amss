import {Request, Response} from 'express';
import {IUsersManagementRepository} from '../../domain/users-management/IUsersManagementRepository';
import {HTTPResponses} from '../../endpoints/utils/http-responses';

export const updateUserRequestHandler =
	(usersManagementRepository: IUsersManagementRepository) =>
	async (req: Request<unknown, UpdateUserRequestResponse, UpdateUserRequestPayload, unknown>, res: Response<UpdateUserRequestResponse>) => {
		const userData = res.locals.authUserData;

		if (!userData.isAdmin) {
			res.status(HTTPResponses.FORBIDDEN.statusCode).send();
			return;
		}

		const {userId: id} = req.params as UserUpdateRequestParams;

		const {email, firstName, lastName, isAdmin, isActive} = req.body;

		if (Number(userData.id) == Number(id)) {
			res.status(HTTPResponses.BAD_REQUEST.statusCode).send();
			return;
		}

		if (!id || isNaN(Number(id)) || !email || !firstName || !lastName || isAdmin == undefined || isActive == undefined) {
			res.status(HTTPResponses.BAD_REQUEST.statusCode).send();
			console.log(req.body);
			return;
		}

		if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email) || firstName.length < 4 || lastName.length < 4) {
			res.status(HTTPResponses.BAD_REQUEST.statusCode).send();
			return;
		}

		const user = await usersManagementRepository.getUserById(Number(id));
		if (!user) {
			res.status(404).send();
			return;
		}

		await usersManagementRepository.updateUser({
			...user,
			email,
			firstName,
			lastName,
			isAdmin: Boolean(isAdmin),
			isActive: Boolean(isActive),
		});

		res.send({type: 'success'});
	};

type UpdateUserRequestResponse = {
	type: 'success';
};

type UserUpdateRequestParams = {
	userId: string;
};

type UpdateUserRequestPayload = {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	isAdmin: boolean;
	isActive: boolean;
};
