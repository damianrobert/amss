import {Request, Response} from 'express';
import {IUsersManagementRepository} from '../../domain/users-management/IUsersManagementRepository';
import {HTTPResponses} from '../../endpoints/utils/http-responses';

export const deleteUserRequestHandler =
	(usersManagementRepository: IUsersManagementRepository) =>
	async (req: Request<unknown, DeleteUserRequestResponse, unknown, unknown>, res: Response<DeleteUserRequestResponse>) => {
		const userData = res.locals.authUserData;

		if (!userData.isAdmin) {
			res.status(HTTPResponses.FORBIDDEN.statusCode).send();
			return;
		}

		const {userId} = req.params as DeleteUserRequestParams;

		if (!userId || isNaN(userId)) {
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

		await usersManagementRepository.deleteUser(userId);

		res.send({type: 'success'});
	};

type DeleteUserRequestResponse = {
	type: 'success';
};

type DeleteUserRequestParams = {
	userId: number;
};
