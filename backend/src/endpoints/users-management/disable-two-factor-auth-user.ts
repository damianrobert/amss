import {Request, Response} from 'express';
import {IUsersManagementRepository} from '../../domain/users-management/IUsersManagementRepository';
import {HTTPResponses} from '../../endpoints/utils/http-responses';

export const disableTwoFactorAuthUserRequestHandler =
	(usersManagementRepository: IUsersManagementRepository) =>
	async (req: Request<unknown, DisableTwoFactorAuthUserRequestResponse, unknown, unknown>, res: Response<DisableTwoFactorAuthUserRequestResponse>) => {
		const userData = res.locals.authUserData;

		if (!userData.isAdmin) {
			res.status(HTTPResponses.FORBIDDEN.statusCode).send();
			return;
		}

		const {userId} = req.params as DisableTwoFactorAuthUserRequestParams;

		if (!userId || isNaN(Number(userId))) {
			res.status(HTTPResponses.BAD_REQUEST.statusCode).send();
		}

		const user = await usersManagementRepository.getUserById(Number(userId));
		if (!user) {
			res.status(HTTPResponses.NOT_FOUND.statusCode).send();
			return;
		}

		await usersManagementRepository.disableUserTotp(Number(userId));

		res.send({type: 'success'});
	};

type DisableTwoFactorAuthUserRequestParams = {
	userId: string;
};

type DisableTwoFactorAuthUserRequestResponse = {
	type: 'success';
};
