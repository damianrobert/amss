import {Request, Response} from 'express';
import {IUsersManagementRepository} from '../../domain/users-management/IUsersManagementRepository';
import {HTTPResponses} from '../../endpoints/utils/http-responses';
import {hashSync} from 'bcrypt';

export const changeUserPasswordRequestHandler =
	(usersManagementRepository: IUsersManagementRepository) =>
	async (
		req: Request<unknown, ChangeUserPasswordRequestResponse, ChangeUserPasswordRequestPayload, unknown>,
		res: Response<ChangeUserPasswordRequestResponse>
	) => {
		const userData = res.locals.authUserData;

		if (!userData.isAdmin) {
			res.status(HTTPResponses.FORBIDDEN.statusCode).send();
			return;
		}

		const {userId} = req.params as ChangeUserPasswordRequestParams;
		const {newPassword} = req.body;

		if (!userId || isNaN(userId) || !newPassword || newPassword.length < 8 || newPassword.length > 84) {
			console.error('Invalid request');
			res.status(HTTPResponses.BAD_REQUEST.statusCode).send();
		}

		if (Number(userData.id) == Number(userId)) {
			res.status(HTTPResponses.BAD_REQUEST.statusCode).send();
			return;
		}

		const user = await usersManagementRepository.getUserById(userId);
		if (!user) {
			res.status(404).send();
			return;
		}

		await usersManagementRepository.updateUser({
			...user,
			passwordHash: hashSync(newPassword, 10),
		});
		res.send({type: 'success'});
	};

type ChangeUserPasswordRequestResponse = {
	type: 'success';
};

type ChangeUserPasswordRequestPayload = {
	newPassword: string;
};

type ChangeUserPasswordRequestParams = {
	userId: number;
};
