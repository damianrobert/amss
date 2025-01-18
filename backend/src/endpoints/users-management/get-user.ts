import {Request, Response} from 'express';
import {IUsersManagementRepository} from '../../domain/users-management/IUsersManagementRepository';
import {HTTPResponses} from '../../endpoints/utils/http-responses';

export const getUserManageRequestHandler =
	(usersManagementRepository: IUsersManagementRepository) =>
	async (req: Request<unknown, GetUserRequestResponse, unknown, unknown>, res: Response<GetUserRequestResponse>) => {
		const userData = res.locals.authUserData;

		if (!userData.isAdmin) {
			res.status(HTTPResponses.FORBIDDEN.statusCode).send();
			return;
		}

		const {userId} = req.params as GetUserRequestParams;

		if (!userId || isNaN(Number(userId))) {
			res.status(HTTPResponses.BAD_REQUEST.statusCode).send();
			return;
		}

		const user = await usersManagementRepository.getUserById(Number(userId));
		if (!user) {
			res.status(HTTPResponses.NOT_FOUND.statusCode).send();
			return;
		}

		res.send({
			id: user.id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			isActive: user.isActive,
			isAdmin: user.isAdmin,
			hasTotp: user.hasTotp,
		});
	};

type GetUserRequestResponse = {
	id: number;
	email: string;
	firstName: string;
	lastName: string;
	isActive: boolean;
	isAdmin: boolean;
	hasTotp: boolean;
};

type GetUserRequestParams = {
	userId: string;
};
