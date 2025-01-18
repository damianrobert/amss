import {Request, Response} from 'express';
import {compareSync, hashSync} from 'bcrypt';
import {IAccessRepository} from '../../domain/access/IAccessRepository';
import {HTTPResponses} from '../../endpoints/utils/http-responses';

export const passwordChangeRequestHandler =
	(accessRepository: IAccessRepository) =>
	async (req: Request<unknown, PasswordChangeRequestResponse, PasswordChangeRequestPayload, unknown>, res: Response<PasswordChangeRequestResponse>) => {
		const {currentPassword, newPassword} = req.body;

		if (!currentPassword || !newPassword || newPassword.length < 8 || newPassword.length > 84 || newPassword === currentPassword) {
			res.status(HTTPResponses.BAD_REQUEST.statusCode).send();
			return;
		}

		const userData = res.locals.authUserData;

		const user = await accessRepository.getUserById(userData.id);

		if (!user) {
			res.status(HTTPResponses.BAD_REQUEST.statusCode).send();
			return;
		}

		if (!compareSync(currentPassword, user.passwordHash)) {
			res.status(HTTPResponses.FORBIDDEN.statusCode).send();
			return;
		}

		await accessRepository.saveUser({...user, passwordHash: hashSync(newPassword, 10)});

		res.status(HTTPResponses.OK.statusCode).send({type: 'success'});
	};

type PasswordChangeRequestPayload = {
	currentPassword: string;
	newPassword: string;
};

type PasswordChangeRequestResponse = {
	type: 'success';
};
